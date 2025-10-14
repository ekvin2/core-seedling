-- Create services table for dynamic service pages
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  heading TEXT NOT NULL,
  sub_heading TEXT,
  content TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for displaying services)
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create admin policies for services (only admin role can manage)
CREATE POLICY "Admins can manage all services" 
ON public.services 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample services
INSERT INTO public.services (title, heading, sub_heading, content, slug) VALUES
('Deep Cleaning', 'Professional Deep Cleaning Services', 'Thorough cleaning for your entire space', '<p>Our deep cleaning service provides comprehensive cleaning that goes beyond regular maintenance. We clean every corner, surface, and hidden area to ensure your space is spotless and sanitized.</p><h3>What''s Included:</h3><ul><li>Complete dusting of all surfaces</li><li>Kitchen deep clean including appliances</li><li>Bathroom sanitization</li><li>Floor cleaning and mopping</li><li>Window cleaning (interior)</li></ul>', 'deep-cleaning'),
('Office Cleaning', 'Commercial Office Cleaning', 'Professional workspace maintenance', '<p>Keep your office environment clean and professional with our commercial cleaning services. We work around your schedule to ensure minimal disruption to your business operations.</p><h3>Services Include:</h3><ul><li>Daily office maintenance</li><li>Restroom sanitization</li><li>Trash removal and recycling</li><li>Floor care and carpet cleaning</li><li>Break room cleaning</li></ul>', 'office-cleaning'),
('Move-in/Move-out Cleaning', 'Moving Cleaning Services', 'Fresh start for your new space', '<p>Whether you''re moving in or moving out, our specialized cleaning service ensures your space is ready. We provide thorough cleaning to help you get your deposit back or start fresh in your new home.</p><h3>Complete Service:</h3><ul><li>All rooms thoroughly cleaned</li><li>Appliance cleaning inside and out</li><li>Cabinet and drawer cleaning</li><li>Light fixture cleaning</li><li>Final inspection included</li></ul>', 'move-in-out-cleaning');