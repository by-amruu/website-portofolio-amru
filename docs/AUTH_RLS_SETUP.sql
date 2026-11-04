-- ====================================================================
-- SUPABASE AUTH & SECURE ROW LEVEL SECURITY (RLS) POLICIES
-- Portofolio by.amruu
-- ====================================================================

-- 1. Pastikan RLS aktif pada tabel portfolio_items
alter table public.portfolio_items enable row level security;

-- 2. Bersihkan policy lama jika ada
drop policy if exists "Allow public read access on portfolio_items" on public.portfolio_items;
drop policy if exists "Allow all access on portfolio_items" on public.portfolio_items;
drop policy if exists "Allow authenticated full access on portfolio_items" on public.portfolio_items;
drop policy if exists "Allow authenticated insert on portfolio_items" on public.portfolio_items;
drop policy if exists "Allow authenticated update on portfolio_items" on public.portfolio_items;
drop policy if exists "Allow authenticated delete on portfolio_items" on public.portfolio_items;

-- 3. Kebijakan BACA: Publik (siapapun yang mengunjungi situs) bisa melihat karya
create policy "Allow public read access on portfolio_items"
  on public.portfolio_items
  for select
  using (true);

-- 4. Kebijakan TULIS / UBAH / HAPUS (CRUD):
-- HANYA akun yang terotentikasi lewat Supabase Auth (auth.role() = 'authenticated')
-- yang diizinkan untuk menambah, mengubah, atau menghapus item.
create policy "Allow authenticated full access on portfolio_items"
  on public.portfolio_items
  for all
  to authenticated
  using (true)
  with check (true);

-- ====================================================================
-- STORAGE BUCKET POLICIES (portfolio-media)
-- ====================================================================

-- Publik bisa melihat dan mengunduh gambar
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

-- Hanya admin login yang bisa mengunggah / menghapus gambar
drop policy if exists "Authenticated upload media" on storage.objects;
create policy "Authenticated upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated update media" on storage.objects;
create policy "Authenticated update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated delete media" on storage.objects;
create policy "Authenticated delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media');

