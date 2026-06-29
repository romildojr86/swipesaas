CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  hotmart_transaction text,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.purchases USING (false);
