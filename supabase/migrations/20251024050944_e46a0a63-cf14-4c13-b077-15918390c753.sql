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