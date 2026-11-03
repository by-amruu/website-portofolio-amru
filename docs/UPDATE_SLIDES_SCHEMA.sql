-- ==========================================================
-- UPDATE SCHEMA: Dukungan Multi-Slide & Audio Musik Latar
-- ==========================================================

-- Tambahkan kolom array media_slides (untuk menyimpan url slide 1, 2, 3...)
alter table public.social_feeds 
add column if not exists media_slides text[] default '{}';

-- Tambahkan kolom audio_url (untuk musik latar MP3)
alter table public.social_feeds 
add column if not exists audio_url text;

-- Tambahkan kolom aspect_ratio ('3:4' atau '9:16')
alter table public.social_feeds 
add column if not exists aspect_ratio text default '3:4';

