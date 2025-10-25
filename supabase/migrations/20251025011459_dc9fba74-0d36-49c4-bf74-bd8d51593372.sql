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