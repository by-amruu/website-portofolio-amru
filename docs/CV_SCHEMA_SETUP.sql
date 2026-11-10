-- ====================================================================
-- TABEL & RLS: CV, RIWAYAT PENGALAMAN & DOKUMEN PROFIL
-- by.amruu (Desain Grafis & Web Developer)
-- ====================================================================

-- 1. Tabel Konfigurasi CV & Tautan Dokumen PDF
create table if not exists public.cv_settings (
  id text primary key default 'default',
  design_bio text,
  dev_bio text,
  design_cv_url text,
  dev_cv_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Masukkan data awal jika belum ada
insert into public.cv_settings (id, design_bio, dev_bio)
values (
  'default',
  'Fokus pada eksplorasi identitas visual, kemasan bernilai jual, dan konten edukasi grafis dengan pendekatan estetik kontemporer.',
  'Membangun antarmuka web modern yang cepat, interaktif, responsif, dan bebas dari desain generik dengan Nuxt, Vue, dan Tailwind CSS.'
)
on conflict (id) do nothing;

-- 2. Tabel Entri Pengalaman / Pendidikan
create table if not exists public.cv_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  role_type text not null check (role_type in ('design', 'dev', 'both')),
  entry_type text not null default 'experience' check (entry_type in ('experience', 'education')),
  title text not null,
  organization text not null,
  period text not null,
  description text,
  skills text[] default '{}'::text[],
  order_priority integer default 0
);

-- Contoh data pengalaman awal agar langsung tampak hidup
insert into public.cv_entries (role_type, entry_type, title, organization, period, description, skills, order_priority)
values 
  ('design', 'experience', 'Freelance Graphic Designer', 'Mandiri & Klien Agensi', '2023 — Sekarang', 'Mendesain identitas brand, visual kemasan produk, dan materi promosi acara.', array['Adobe Illustrator', 'Photoshop', 'Canva', 'Layout'], 10),
  ('dev', 'experience', 'Frontend Web Developer', 'Proyek Mandiri & Open Source', '2024 — Sekarang', 'Merancang dan mengimplementasikan aplikasi web interaktif, sistem animasi kustom, dan optimasi performa web.', array['Vue 3', 'Nuxt', 'Tailwind CSS', 'TypeScript', 'Supabase'], 10)
on conflict do nothing;

-- 3. Row Level Security (RLS)
alter table public.cv_settings enable row level security;
alter table public.cv_entries enable row level security;

-- Bersihkan policy lama
drop policy if exists "Allow public read on cv_settings" on public.cv_settings;
drop policy if exists "Allow authenticated full on cv_settings" on public.cv_settings;
drop policy if exists "Allow public read on cv_entries" on public.cv_entries;
drop policy if exists "Allow authenticated full on cv_entries" on public.cv_entries;

-- Publik bisa melihat isi CV & pengaturan
create policy "Allow public read on cv_settings"
  on public.cv_settings for select using (true);

create policy "Allow public read on cv_entries"
  on public.cv_entries for select using (true);

-- Hanya admin login yang bisa mengubah settings & entri
create policy "Allow authenticated full on cv_settings"
  on public.cv_settings for all to authenticated using (true) with check (true);

create policy "Allow authenticated full on cv_entries"
  on public.cv_entries for all to authenticated using (true) with check (true);

-- 4. Indeks Query untuk Kecepatan Fetching Instan
create index if not exists idx_cv_entries_role_order on public.cv_entries (role_type, order_priority desc);
create index if not exists idx_portfolio_items_order on public.portfolio_items (order_priority desc, created_at desc);


