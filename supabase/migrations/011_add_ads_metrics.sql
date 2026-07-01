ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS anuncios_ativos integer default 0;
ALTER TABLE public.saas_entries ADD COLUMN IF NOT EXISTS data_primeiro_anuncio date;
