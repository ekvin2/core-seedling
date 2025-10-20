-- Ensure portfolio table exists and RLS policies + trigger are present
-- Idempotent migration: safe to run even if portfolio table/policies already exist

CREATE TABLE IF NOT EXISTS public.portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  title text,
  taken_at date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (will succeed if already enabled)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any) then recreate to ensure expected behavior
DROP POLICY IF EXISTS "Anyone can view active portfolio" ON public.portfolio;
CREATE POLICY "Anyone can view active portfolio"
  ON public.portfolio
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio;
CREATE POLICY "Admins can manage portfolio"
  ON public.portfolio
  FOR ALL
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

-- Recreate trigger safely
DROP TRIGGER IF EXISTS update_portfolio_updated_at ON public.portfolio;
CREATE TRIGGER update_portfolio_updated_at
BEFORE UPDATE ON public.portfolio
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
