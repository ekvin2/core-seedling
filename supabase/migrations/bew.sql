
-- Migration: 20251024050941
-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- 1) Roles enum
do $$ begin
  create type public.app_role as enum ('admin', 'moderator', 'user');
exception
  when duplicate_object then null;
end $$;

-- 2) user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- helper function to check user role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 3) profiles table (separate from auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- trigger to auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at_column();

-- create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) Content tables
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  heading text not null,
  sub_heading text,
  content text not null,
  slug text not null unique,
  is_active boolean not null default true,
  display_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  featured_image_url text,
  service_image_url text,
  youtube_video_url text
);

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
before update on public.services
for each row execute procedure public.update_updated_at_column();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  service_id uuid references public.services(id) on delete set null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  question text not null,
  answer text not null,
  display_order int,
  is_general boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  image_url text not null,
  title text,
  taken_at date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service_id uuid references public.services(id) on delete set null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5) RLS policies
-- Enable RLS on all tables
alter table public.services enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;
alter table public.portfolio enable row level security;
alter table public.quotes enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Profiles: users can view own" on public.profiles;
drop policy if exists "Profiles: users can update own" on public.profiles;
drop policy if exists "User roles: users can read own" on public.user_roles;
drop policy if exists "User roles: only admins modify" on public.user_roles;
drop policy if exists "Services: public read" on public.services;
drop policy if exists "Reviews: public read" on public.reviews;
drop policy if exists "FAQs: public read" on public.faqs;
drop policy if exists "Portfolio: public read" on public.portfolio;
drop policy if exists "Services: admin write" on public.services;
drop policy if exists "Reviews: admin write" on public.reviews;
drop policy if exists "FAQs: admin write" on public.faqs;
drop policy if exists "Portfolio: admin write" on public.portfolio;
drop policy if exists "Quotes: public insert" on public.quotes;
drop policy if exists "Quotes: admin read" on public.quotes;
drop policy if exists "Quotes: admin write" on public.quotes;

-- Create policies
create policy "Profiles: users can view own"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Profiles: users can update own"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "User roles: users can read own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "User roles: only admins modify"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Services: public read"
  on public.services for select using (true);

create policy "Reviews: public read"
  on public.reviews for select using (true);

create policy "FAQs: public read"
  on public.faqs for select using (true);

create policy "Portfolio: public read"
  on public.portfolio for select using (true);

create policy "Services: admin write"
  on public.services for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Reviews: admin write"
  on public.reviews for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "FAQs: admin write"
  on public.faqs for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Portfolio: admin write"
  on public.portfolio for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Quotes: public insert"
  on public.quotes for insert
  with check (true);

create policy "Quotes: admin read"
  on public.quotes for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Quotes: admin write"
  on public.quotes for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 6) Storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Images public read" on storage.objects;
drop policy if exists "Images authenticated write" on storage.objects;
drop policy if exists "Images authenticated update" on storage.objects;
drop policy if exists "Images authenticated delete" on storage.objects;

create policy "Images public read"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Images authenticated write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images');

create policy "Images authenticated update"
  on storage.objects for update to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

create policy "Images authenticated delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images');

-- Migration: 20251024051053
-- Enable required extension for UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 1) Roles enum
do $$ begin
  create type public.app_role as enum ('admin', 'moderator', 'user');
exception
  when duplicate_object then null;
end $$;

-- 2) user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- helper function to check user role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 3) profiles table (separate from auth.users)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- trigger to auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at_column();

-- create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) Content tables
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  heading text not null,
  sub_heading text,
  content text not null,
  slug text not null unique,
  is_active boolean not null default true,
  display_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  featured_image_url text,
  service_image_url text,
  youtube_video_url text
);

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
before update on public.services
for each row execute procedure public.update_updated_at_column();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  service_id uuid references public.services(id) on delete set null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  question text not null,
  answer text not null,
  display_order int,
  is_general boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  image_url text not null,
  title text,
  taken_at date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service_id uuid references public.services(id) on delete set null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5) RLS policies
-- Enable RLS on tables
alter table public.services enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;
alter table public.portfolio enable row level security;
alter table public.quotes enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Profiles: users can view own" on public.profiles;
drop policy if exists "Profiles: users can update own" on public.profiles;
drop policy if exists "User roles: users can read own" on public.user_roles;
drop policy if exists "User roles: only admins modify" on public.user_roles;
drop policy if exists "Services: public read" on public.services;
drop policy if exists "Reviews: public read" on public.reviews;
drop policy if exists "FAQs: public read" on public.faqs;
drop policy if exists "Portfolio: public read" on public.portfolio;
drop policy if exists "Services: admin write" on public.services;
drop policy if exists "Reviews: admin write" on public.reviews;
drop policy if exists "FAQs: admin write" on public.faqs;
drop policy if exists "Portfolio: admin write" on public.portfolio;
drop policy if exists "Quotes: public insert" on public.quotes;
drop policy if exists "Quotes: admin read" on public.quotes;
drop policy if exists "Quotes: admin write" on public.quotes;

-- profiles: users can view/update their own profile
create policy "Profiles: users can view own"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Profiles: users can update own"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- user_roles: users can read their own role; only admins can modify
create policy "User roles: users can read own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "User roles: only admins modify"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Public content tables: anyone can select
create policy "Services: public read"
  on public.services for select using (true);

create policy "Reviews: public read"
  on public.reviews for select using (true);

create policy "FAQs: public read"
  on public.faqs for select using (true);

create policy "Portfolio: public read"
  on public.portfolio for select using (true);

-- Admin-only writes for content tables
create policy "Services: admin write"
  on public.services for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Reviews: admin write"
  on public.reviews for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "FAQs: admin write"
  on public.faqs for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Portfolio: admin write"
  on public.portfolio for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Quotes: allow anyone to insert; only admins can read/manage
create policy "Quotes: public insert"
  on public.quotes for insert
  with check (true);

create policy "Quotes: admin read"
  on public.quotes for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Quotes: admin write"
  on public.quotes for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 6) Storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Drop existing storage policies
drop policy if exists "Images public read" on storage.objects;
drop policy if exists "Images authenticated write" on storage.objects;
drop policy if exists "Images authenticated update" on storage.objects;
drop policy if exists "Images authenticated delete" on storage.objects;

-- Storage policies
create policy "Images public read"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Images authenticated write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images');

create policy "Images authenticated update"
  on storage.objects for update to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

create policy "Images authenticated delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images');

-- Migration: 20251025011455
-- Create business_info table for contact details management
CREATE TABLE public.business_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  business_hours jsonb NOT NULL DEFAULT '{
    "monday": {"open": "09:00", "close": "17:00"},
    "tuesday": {"open": "09:00", "close": "17:00"},
    "wednesday": {"open": "09:00", "close": "17:00"},
    "thursday": {"open": "09:00", "close": "17:00"},
    "friday": {"open": "09:00", "close": "17:00"},
    "saturday": {"open": "09:00", "close": "17:00"},
    "sunday": {"closed": true}
  }'::jsonb,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;

-- Public can read business info
CREATE POLICY "Business info: public read"
  ON public.business_info
  FOR SELECT
  USING (true);

-- Only admins can modify business info
CREATE POLICY "Business info: admin write"
  ON public.business_info
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_business_info_updated_at
  BEFORE UPDATE ON public.business_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default business info
INSERT INTO public.business_info (phone, facebook_url, instagram_url, tiktok_url)
VALUES (
  '+1 (555) 123-4567',
  'https://facebook.com/cleaningservices',
  'https://instagram.com/cleaningservices',
  'https://tiktok.com/@cleaningservices'
);

-- Add city field to quotes table for leads management
ALTER TABLE public.quotes
ADD COLUMN city text;

-- Create cities table for autocomplete functionality
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  state text,
  country text NOT NULL DEFAULT 'USA',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Public can read active cities
CREATE POLICY "Cities: public read"
  ON public.cities
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify cities
CREATE POLICY "Cities: admin write"
  ON public.cities
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample cities for autocomplete
INSERT INTO public.cities (name, state, country) VALUES
  ('New York', 'NY', 'USA'),
  ('Los Angeles', 'CA', 'USA'),
  ('Chicago', 'IL', 'USA'),
  ('Houston', 'TX', 'USA'),
  ('Phoenix', 'AZ', 'USA'),
  ('Philadelphia', 'PA', 'USA'),
  ('San Antonio', 'TX', 'USA'),
  ('San Diego', 'CA', 'USA'),
  ('Dallas', 'TX', 'USA'),
  ('San Jose', 'CA', 'USA'),
  ('Austin', 'TX', 'USA'),
  ('Jacksonville', 'FL', 'USA'),
  ('Fort Worth', 'TX', 'USA'),
  ('Columbus', 'OH', 'USA'),
  ('Charlotte', 'NC', 'USA'),
  ('San Francisco', 'CA', 'USA'),
  ('Indianapolis', 'IN', 'USA'),
  ('Seattle', 'WA', 'USA'),
  ('Denver', 'CO', 'USA'),
  ('Boston', 'MA', 'USA');

-- Migration: 20251105050951
-- Add benefits column to services table
ALTER TABLE public.services ADD COLUMN benefits TEXT[];

-- Migration: 20251106025735
-- Add address and business_hours columns to business_info table
ALTER TABLE business_info 
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Auckland Central
Auckland, New Zealand',
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday": "7:00 AM - 7:00 PM", "tuesday": "7:00 AM - 7:00 PM", "wednesday": "7:00 AM - 7:00 PM", "thursday": "7:00 AM - 7:00 PM", "friday": "7:00 AM - 7:00 PM", "saturday": "8:00 AM - 5:00 PM", "sunday": "9:00 AM - 3:00 PM"}'::jsonb;
