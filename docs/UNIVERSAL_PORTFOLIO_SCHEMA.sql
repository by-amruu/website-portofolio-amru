-- ==========================================================
-- UNIVERSAL PORTFOLIO TABLE (WEBSITE, TIKTOK, IG, PINTEREST)
-- ==========================================================

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  platform text not null default 'website', -- 'website', 'instagram', 'tiktok', 'pinterest'
  category text default 'Creative Work',
  preview_url text not null, -- link gambar thumbnail/preview beresolusi tinggi
  live_url text, -- link menuju website / postingan IG / video TikTok / pin Pinterest
  github_url text, -- opsional khusus coding project
  aspect_ratio text default '3:4', -- '3:4' (IG/Pinterest), '9:16' (TikTok/Reels), '16:9' (Web)
  tech_stack text[] default '{}',
  order_priority integer default 0
);

-- Buka Full Akses RLS
alter table public.portfolio_items enable row level security;

drop policy if exists "Allow all on portfolio_items" on public.portfolio_items;
create policy "Allow all on portfolio_items"
  on public.portfolio_items
  for all
  using (true)
  with check (true);

