-- Create quotes table for incoming lead requests
-- Fields: name, email, phone, service_id (FK to services), note, is_active, created_at, updated_at
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  note text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Policy: allow anyone (including anonymous) to insert quotes (lead capture)
DROP POLICY IF EXISTS "Anyone can insert quotes" ON public.quotes;
CREATE POLICY "Anyone can insert quotes"
  ON public.quotes
  FOR INSERT
  WITH CHECK (true);

-- Policy: admins can manage all quotes
DROP POLICY IF EXISTS "Admins can manage quotes" ON public.quotes;
CREATE POLICY "Admins can manage quotes"
  ON public.quotes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Policy: allow admins to select. If you want non-admins to view their own quotes,
-- you could add a policy matching by email, but that requires including email in auth.
-- For now, restrict SELECT to admins only to keep leads private.
DROP POLICY IF EXISTS "Admins can select quotes" ON public.quotes;
CREATE POLICY "Admins can select quotes"
  ON public.quotes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create or replace helper function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for quotes
DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
