# Penjelasan Teknis & Solusi: Native Media Player vs Embed Iframe

Dokumen ini membedakan batas teknis antara iframe bawaan TikTok/Instagram dengan Native Media Carousel (Gambar Pertama).

---

## 1. Kenapa Gambar Kedua (Embed Iframe Bawaan) Terlihat Kurang Bagus?
- **Batasan Iframe Resmi Pihak Ketiga**:
  TikTok dan Instagram menyuntikkan header banner profil, tombol "View profile", watermark, tombol like/share, dan border mereka sendiri ke dalam iframe.
- **Autoplay Audio Diblokir Browser**:
  Browser modern (Chrome, Safari, Edge) secara default memblokir suara otomatis (*autoplay with sound*) pada iframe pihak ketiga demi privasi pengguna. Pengguna wajib mengklik unmute terlebih dahulu.
- **Responsivitas Kaku**:
  Tinggi iframe terkunci dari server TikTok/Meta sehingga bagian bawah rentan terpotong (*overflow cut-off*).

---

## 2. Kenapa Gambar Pertama Jauh Lebih Bagus & Mewah?
- **Murni Konten (No Third-Party Bloatware)**:
  Fokus 100% pada visual karya Anda (1080x1440 / 1080x1920) tanpa tombol promosi atau header bawaan medsos.
- **Bisa Digeser Mulus (Interactive Carousel / Swipeable)**:
  Menggunakan native touch slider (bisa swipe kiri/kanan di layar HP atau klik panah di desktop) untuk melihat slide berikutnya.
- **Audio Background / Musik Tersinkronisasi**:
  Bisa memutar file audio/musik latar secara mulus menggunakan HTML5 Audio API dengan kontrol play/pause yang elegan.
- **Panel Detail Side-by-Side (Desktop) & Bottom Sheet (Mobile)**:
  Sisi kiri fokus pada visual karya yang bersih, sisi kanan menampilkan caption & engagement kontekstual.

