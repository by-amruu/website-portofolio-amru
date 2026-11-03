# Reset & Setup Ulang RLS Supabase (100% Bebas Error Duplicate)

Salin seluruh kode SQL di bawah ini, tempel ke **SQL Editor** Supabase, lalu klik tombol **Run**. 

Script ini secara otomatis membersihkan (*drop*) semua policy lama jika sudah ada, sehingga **tidak akan pernah muncul error `policy already exists` lagi**.

```sql
-- ==========================================
-- 1. PASTIKAN ROW LEVEL SECURITY AKTIF
-- ==========================================
alter table public.projects enable row level security;
alter table public.social_feeds enable row level security;

-- ==========================================
-- 2. BERSIHKAN SEMUA POLICY LAMA (DROP IF EXISTS)
-- ==========================================
drop policy if exists "Allow public read access on projects" on public.projects;
drop policy if exists "Allow insert on projects" on public.projects;
drop policy if exists "Allow update on projects" on public.projects;
drop policy if exists "Allow delete on projects" on public.projects;
drop policy if exists "Allow all access on projects" on public.projects;

drop policy if exists "Allow public read access on featured social feeds" on public.social_feeds;
drop policy if exists "Allow insert on social_feeds" on public.social_feeds;
drop policy if exists "Allow update on social_feeds" on public.social_feeds;
drop policy if exists "Allow delete on social_feeds" on public.social_feeds;
drop policy if exists "Allow all access on social_feeds" on public.social_feeds;

-- ==========================================
-- 3. BUAT POLICY FULL AKSES BARU (CRUD LENGKAP)
-- ==========================================

-- Izin Lengkap untuk Tabel 'projects' (Read, Insert, Update, Delete)
create policy "Allow all access on projects"
  on public.projects
  for all
  using (true)
  with check (true);

-- Izin Lengkap untuk Tabel 'social_feeds' (Read, Insert, Update, Delete)
create policy "Allow all access on social_feeds"
  on public.social_feeds
  for all
  using (true)
  with check (true);
```
