-- ==========================================================
-- SETUP SUPABASE STORAGE BUCKET: portfolio-media
-- ==========================================================

-- 1. Buat bucket penyimpanan publik jika belum ada
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

-- 2. Beri izin publik untuk membaca (view) gambar
create policy "Public can view portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

-- 3. Beri izin upload & update gambar
create policy "Allow insert on portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media');

create policy "Allow update on portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media');

create policy "Allow delete on portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media');

