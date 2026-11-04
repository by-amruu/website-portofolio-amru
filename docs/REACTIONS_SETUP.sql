-- ==========================================================
-- REAKSI PENGUNJUNG (suka / keren / rapi) PER KARYA
-- Jalankan sekali di Supabase > SQL Editor.
-- ==========================================================

create table if not exists public.portfolio_reactions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.portfolio_items(id) on delete cascade,
  reaction text not null check (reaction in ('suka', 'keren', 'rapi')),
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  created_at timestamptz not null default now(),
  unique (item_id, reaction, visitor_id)
);

create index if not exists portfolio_reactions_item_idx
  on public.portfolio_reactions (item_id);

alter table public.portfolio_reactions enable row level security;

drop policy if exists "reactions_select" on public.portfolio_reactions;
create policy "reactions_select"
  on public.portfolio_reactions for select
  using (true);

drop policy if exists "reactions_insert" on public.portfolio_reactions;
create policy "reactions_insert"
  on public.portfolio_reactions for insert
  with check (true);

-- Pengunjung boleh menarik reaksinya sendiri (toggle).
drop policy if exists "reactions_delete" on public.portfolio_reactions;
create policy "reactions_delete"
  on public.portfolio_reactions for delete
  using (true);

-- Agregat yang dibaca situs: hanya jumlah, tanpa visitor_id.
create or replace view public.portfolio_reaction_counts as
  select item_id, reaction, count(*)::int as total
  from public.portfolio_reactions
  group by item_id, reaction;

grant select on public.portfolio_reaction_counts to anon, authenticated;

