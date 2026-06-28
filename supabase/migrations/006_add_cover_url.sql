ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS cover_url text not null default '';
