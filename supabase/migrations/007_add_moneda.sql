ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS moneda text not null default 'USD';
