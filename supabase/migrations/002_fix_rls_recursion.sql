-- ============================================================
-- Fix: infinite recursion in RLS policies
-- The admin check subquery on profiles triggers its own policy.
-- Solution: security definer function that bypasses RLS.
-- ============================================================

-- 1. Drop the recursive policies
drop policy if exists "profiles: admin read all" on public.profiles;
drop policy if exists "saas_entries: admin write" on public.saas_entries;

-- 2. Security definer function — reads profiles WITHOUT triggering RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  )
$$;

-- 3. Recreate admin policies using the function (no recursion)
create policy "profiles: admin read all"
  on public.profiles for select
  using (public.is_admin());

-- 4. Split the saas_entries admin write policy per operation
--    (avoids applying "for all" to SELECT which caused the cycle)
create policy "saas_entries: admin insert"
  on public.saas_entries for insert
  with check (public.is_admin());

create policy "saas_entries: admin update"
  on public.saas_entries for update
  using (public.is_admin());

create policy "saas_entries: admin delete"
  on public.saas_entries for delete
  using (public.is_admin());
