ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS is_featured boolean not null default false;
