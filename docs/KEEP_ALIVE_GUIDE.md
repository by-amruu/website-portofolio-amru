# Panduan Anti-Hibernasi Supabase (Keep-Alive Cron)

Supabase Free Tier otomatis meng-hibernasi (*pause*) database jika tidak ada aktivitas selama **7 hari**.

Solusi terbaik, paling ringan, dan 100% gratis tanpa membebani komputer Anda atau kuota Supabase adalah menggunakan **GitHub Actions Cron**.

---

## ⚙️ Cara Kerja
File workflow di [`.github/workflows/keep-alive.yml`](../.github/workflows/keep-alive.yml):
* Berjalan otomatis di server cloud GitHub **setiap 4 hari sekali** (frekuensi sangat rendah & ramah resource).
* Melakukan 1 kali panggilan `curl` (read 1 row) ke REST API Supabase.
* Karena ada aktivitas baca setiap 4 hari, Supabase **tidak akan pernah di-pause / hibernasi**.

---

## 🚀 Langkah Setup (Hanya 1 Menit di GitHub):

1. Buka repositori GitHub Anda di browser:
   `https://github.com/by-amruu/website-portofolio-amru`
2. Klik tab **Settings** (di menu atas repo).
3. Di sidebar kiri, klik **Secrets and variables** > pilih **Actions**.
4. Klik tombol hijau **New repository secret**, lalu tambahkan 2 rahasia ini:
   * **Secret 1**:
     - Name: `SUPABASE_URL`
     - Secret: `https://ieydacmqvwsrbarcvods.supabase.co`
   * **Secret 2**:
     - Name: `SUPABASE_KEY`
     - Secret: *(Masukkan anon/publishable key Supabase Anda)*
5. Push file workflow ini ke GitHub:
   ```bash
   git add .github/workflows/keep-alive.yml docs/KEEP_ALIVE_GUIDE.md
   git commit -m "ci: tambahkan keep-alive cron job untuk anti-pause Supabase"
   git push origin main
   ```

Setelah itu, sistem akan berjalan otomatis selamanya di background GitHub tanpa perlu Anda pikirkan lagi!

