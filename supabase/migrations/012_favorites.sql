CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  saas_id uuid not null references public.saas_entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  UNIQUE(user_id, saas_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);
