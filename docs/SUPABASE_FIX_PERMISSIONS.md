# Database Schema & RLS Policies (Supabase / PostgreSQL)

Jalankan query SQL berikut di **SQL Editor** Supabase Anda untuk memastikan operasi DELETE dan UPDATE diizinkan oleh sistem keamanan:

```sql
-- 1. Izin Lengkap untuk tabel social_feeds (BACA, INSERT, UPDATE, DELETE)
create policy "Allow delete on social_feeds"
  on public.social_feeds for delete using (true);

-- 2. Izin Lengkap untuk tabel projects (BACA, INSERT, UPDATE, DELETE)
create policy "Allow insert on projects"
  on public.projects for insert with check (true);

create policy "Allow update on projects"
  on public.projects for update using (true);

create policy "Allow delete on projects"
  on public.projects for delete using (true);
```

