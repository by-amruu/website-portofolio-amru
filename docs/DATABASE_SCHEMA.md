# Database Schema Specification (Supabase / PostgreSQL)

File ini mendefinisikan skema tabel Supabase untuk portofolio Amru. Anda bisa menyalin query SQL di bawah ini dan menjalankannya langsung di **SQL Editor** Supabase setelah membuat proyek baru.

---

## 1. Tabel `projects` (Katalog Website & Karya Buatan Amru)

Tabel ini menyimpan daftar karya website, aplikasi, atau tool yang pernah Anda buat.

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  tagline text not null,
  description text,
  tech_stack text[] not null default '{}',
  category text not null default 'Web Development', -- e.g. 'Web App', 'Landing Page', 'Tools'
  thumbnail_url text,
  live_url text,
  github_url text,
  featured boolean default false,
  order_priority integer default 0
);
```

---

## 2. Tabel `social_feeds` (Kurasi Konten TikTok & Instagram)

Tabel ini menyimpan postingan video/gambar dari TikTok dan Instagram. Anda memiliki kontrol penuh dengan kolom `is_featured` untuk menentukan apakah konten tersebut tampil di portofolio atau tidak.

```sql
create table public.social_feeds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  platform text not null check (platform in ('tiktok', 'instagram')),
  external_id text not null, -- ID post dari TikTok / IG
  caption text,
  media_type text default 'video' check (media_type in ('video', 'image', 'carousel')),
  media_url text not null,
  permalink text not null,
  thumbnail_url text,
  posted_at timestamp with time zone not null,
  is_featured boolean default true, -- Apakah Amru memilih menampilkannya di web?
  tags text[] default '{}'
);
```

---

## 3. Row Level Security (RLS) - Keamanan Standar

Agar data publik bisa dibaca oleh siapapun tanpa bisa diubah/dihapus oleh pihak luar:

```sql
-- Aktifkan RLS
alter table public.projects enable row level security;
alter table public.social_feeds enable row level security;

-- Policy: Publik hanya bisa READ
create policy "Allow public read access on projects"
  on public.projects for select using (true);

create policy "Allow public read access on featured social feeds"
  on public.social_feeds for select using (is_featured = true);
```

