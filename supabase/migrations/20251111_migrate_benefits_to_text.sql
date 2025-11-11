-- Migration: Convert services.benefits from text[] (array) to text (HTML string)
-- WARNING: Run on staging first and create a database backup before running in production.
-- This migration creates a new text column, migrates existing data (handling
-- both single-element HTML arrays and legacy plain string arrays), then
-- drops the old column and renames the new one.

BEGIN;

-- 1) Add new temporary text column
ALTER TABLE public.services ADD COLUMN benefits_text text;

-- 2) Migrate data:
--  - If benefits is NULL -> keep NULL
--  - If benefits is an array with a single element that looks like HTML -> unwrap it
--  - Otherwise, convert the array of plain strings into an HTML <ul> list
UPDATE public.services
SET benefits_text = CASE
  WHEN benefits IS NULL THEN NULL
  WHEN array_length(benefits,1) = 1 AND benefits[1] ~ '<[^>]+>' THEN benefits[1]
  ELSE '<ul>' || array_to_string(ARRAY(SELECT '<li>' || replace(b, E'\n', ' ') || '</li>' FROM unnest(benefits) AS b), '') || '</ul>'
END
WHERE (benefits IS NOT NULL);

-- 3) Verify results (optional):
-- SELECT id, benefits, benefits_text FROM public.services LIMIT 50;

-- 4) If everything looks good, drop the old column and rename the new one
ALTER TABLE public.services DROP COLUMN benefits;
ALTER TABLE public.services RENAME COLUMN benefits_text TO benefits;

COMMIT;

-- NOTES:
-- * This migration assumes the existing column is named `benefits` in schema `public`.
-- * It converts legacy arrays into HTML lists; single-element arrays that already contain
--   HTML (e.g. created by Quill shim) are preserved intact.
-- * Keep a DB backup and run the SELECT verification step before dropping the old column.
-- * After applying this migration, update any client code that still sends arrays to the DB
--   so it sends a plain text HTML string instead.
