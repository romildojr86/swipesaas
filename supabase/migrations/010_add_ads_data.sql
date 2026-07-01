ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS ads_data jsonb default '[]';
ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS ads_count integer default 0;
ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS ads_last_sync timestamptz;
