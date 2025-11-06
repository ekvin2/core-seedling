-- Add address and business_hours columns to business_info table
ALTER TABLE business_info 
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Auckland Central
Auckland, New Zealand',
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday": "7:00 AM - 7:00 PM", "tuesday": "7:00 AM - 7:00 PM", "wednesday": "7:00 AM - 7:00 PM", "thursday": "7:00 AM - 7:00 PM", "friday": "7:00 AM - 7:00 PM", "saturday": "8:00 AM - 5:00 PM", "sunday": "9:00 AM - 3:00 PM"}'::jsonb;