-- Migration: Add address field to business_info table
-- Description: Add optional address column to store business address

BEGIN;

-- Add address column to business_info table
ALTER TABLE public.business_info ADD COLUMN address text;

-- Add comment to the column for documentation
COMMENT ON COLUMN public.business_info.address IS 'Business physical address (street, city, state, zip)';

COMMIT;
