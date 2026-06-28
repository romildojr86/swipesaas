-- Add emoji column to saas_entries
alter table public.saas_entries
  add column if not exists emoji text not null default '';

-- Backfill emojis for existing seeded entries
update public.saas_entries set emoji = '✍️' where nome = 'Notion AI Writer';
update public.saas_entries set emoji = '🍋' where nome = 'Lemonsqueezy';
update public.saas_entries set emoji = '🗄️' where nome = 'Pocketbase';
update public.saas_entries set emoji = '📋' where nome = 'Tally Forms';
update public.saas_entries set emoji = '🐦' where nome = 'Typefully';
update public.saas_entries set emoji = '📈' where nome = 'Plausible';
