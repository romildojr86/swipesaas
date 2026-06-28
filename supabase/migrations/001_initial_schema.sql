-- ============================================================
-- SwipeSaaS — Initial Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
-- Mirrors auth.users; created automatically via trigger on signup.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  is_premium  boolean not null default false,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but not is_admin)
create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Trigger: auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── saas_entries ─────────────────────────────────────────────

create table if not exists public.saas_entries (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  nicho         text not null,
  modelo_preco  text not null,
  pais_origen   text not null,
  print_url     text not null default '',
  link_site     text not null default '',
  link_anuncios text not null default '',
  created_at    timestamptz not null default now()
);

-- Row Level Security
alter table public.saas_entries enable row level security;

-- Anyone authenticated can read entries
create policy "saas_entries: authenticated read"
  on public.saas_entries for select
  to authenticated
  using (true);

-- Anon users can read entries (for landing page preview)
create policy "saas_entries: anon read"
  on public.saas_entries for select
  to anon
  using (true);

-- Only admins can insert / update / delete
create policy "saas_entries: admin write"
  on public.saas_entries for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── seed: initial SaaS entries ───────────────────────────────

insert into public.saas_entries (nome, nicho, modelo_preco, pais_origen, link_site)
values
  ('Notion AI Writer', 'Productividad',   'Suscripción', 'Estados Unidos', 'https://notion.so'),
  ('Lemonsqueezy',     'Pagamentos',      'Comisión',    'Estados Unidos', 'https://lemonsqueezy.com'),
  ('Pocketbase',       'Dev Tools',       'One-time',    'Bulgaria',       'https://pocketbase.io'),
  ('Tally Forms',      'Formularios',     'Freemium',    'Bélgica',        'https://tally.so'),
  ('Typefully',        'Redes Sociales',  'Suscripción', 'España',         'https://typefully.com'),
  ('Plausible',        'Analytics',       'Suscripción', 'Estonia',        'https://plausible.io')
on conflict do nothing;
