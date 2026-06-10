# 🎵 ConcertID — Jadwal Konser Internasional di Indonesia

> Sumber informasi terpercaya untuk jadwal konser musisi internasional di Indonesia 2025–2027.  
> Lengkap dengan label **Confirmed ✅** vs **Rumor 🔮** agar kamu tidak tertipu.

🌐 **Live:** [list-concert-tour.web.id](https://www.list-concert-tour.web.id)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🗓️ Jadwal Lengkap | Data konser 2025–2027: artis, tanggal, venue, jam, dan harga tiket |
| ✅ / 🔮 Status | Label jelas **Confirmed** (resmi) vs **Rumor** (belum dikonfirmasi) |
| 🔍 Search & Filter | Cari berdasarkan artis/venue/kota; filter genre, status, dan wishlist |
| ❤️ Wishlist | Simpan konser favorit ke localStorage tanpa perlu akun |
| ⏱️ Countdown | Timer hitung mundur untuk setiap konser mendatang |
| 📤 Share | Share konser via WhatsApp, Twitter/X, atau copy link |
| 🗺️ Venue Info | Peta & info kapasitas venue-venue utama di Indonesia |
| ⭐ Review & Rating | Sistem ulasan berbasis localStorage tanpa backend |
| 💬 Chatbot | ConcertBot — Q&A soal jadwal, harga, dan venue (pure JS) |
| 📊 Analytics Dashboard | Dashboard admin dengan proteksi password untuk melihat engagement |
| 🔄 Auto-update Harian | Scraper otomatis via GitHub Actions setiap hari pukul 01:00 WIB |

---

## 🏗️ Struktur Proyek

```
list-concert-tour-claude/
├── index.html          # Halaman utama
├── app.js              # Data konser & logika aplikasi utama
├── style.css           # Styling (dark mode, responsive)
├── reviews.js          # Sistem review & rating
├── chatbot.js          # Widget chatbot (dinonaktifkan sementara)
├── analytics.html      # Dashboard analytics (admin only)
├── scraper.py          # Scraper Python untuk update data harian
├── requirements.txt    # Dependensi Python scraper
├── vercel.json         # Konfigurasi deployment Vercel
├── robots.txt          # Instruksi untuk search engine
├── sitemap.xml         # Sitemap untuk SEO
├── logo.svg            # Logo ConcertID
├── og-image.png        # Open Graph image untuk social share
├── favicon.*           # Favicon dalam berbagai format
└── .github/
    └── workflows/
        └── scrape.yml  # GitHub Actions: scraper harian
```

---

## 🚀 Cara Menjalankan Secara Lokal

Proyek ini adalah **static website** murni — tidak butuh build step atau server khusus.

```bash
# Clone repo
git clone https://github.com/ganoolmovie5th-cell/list-concert-tour-claude.git
cd list-concert-tour-claude

# Jalankan dengan server lokal sederhana (pilih salah satu)
python3 -m http.server 8080
# atau
npx serve .
# atau
php -S localhost:8080
```

Buka browser dan akses `http://localhost:8080`.

---

## 🤖 Auto-Scraper (GitHub Actions)

Scraper berjalan otomatis setiap hari pukul **01:00 WIB** (18:00 UTC) via GitHub Actions.

### Cara Kerja
1. Script `scraper.py` dijalankan oleh workflow `.github/workflows/scrape.yml`
2. Scraper mengumpulkan data dari sumber seperti Bandwagon Asia, Tempo.co, The Jakarta Post, tiket.com, Loket.com, Jambase, dan Songkick
3. Jika ada perubahan data, `app.js` diperbarui dan di-commit otomatis ke branch `main`
4. Commit dilakukan oleh **ConcertID Bot** dengan pesan format: `🎵 auto-update: concert data refreshed — DD MMM YYYY HH:MM WIB`

### Jalankan Scraper Secara Manual

```bash
# Install dependensi Python
pip install -r requirements.txt

# Jalankan scraper
python scraper.py
```

Bisa juga trigger manual dari tab **Actions** di GitHub.

---

## 📊 Analytics Dashboard

Akses di `/analytics.html` (atau `analytics.html` secara lokal).

- **Dilindungi password** — default: `ConcertID2026!`
- Menampilkan: klik per konser, wishlist, review stats, distribusi genre/status
- Fitur export: **CSV** dan **JSON**
- Data disimpan di `localStorage` browser pengunjung

> ⚠️ Ganti password default sebelum deploy ke production! Edit nilai `PASS_HASH` di `analytics.html`.

---

## 🌐 Deployment

Proyek ini di-deploy di **Vercel** sebagai static site.

```json
// vercel.json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Atau hubungkan repo GitHub ke [vercel.com](https://vercel.com) untuk deploy otomatis setiap push ke `main`.

---

## 📋 Sumber Data

Data konser dikurasi dari sumber-sumber terpercaya:

- [iMe Indonesia](https://www.imelive.com)
- [Live Nation Asia](https://www.livenation.com)
- [Loket.com](https://loket.com)
- [tiket.com](https://tiket.com)
- [Tempo.co](https://tempo.co)
- [Weverse](https://weverse.io)
- [Billboard](https://www.billboard.com)
- [Bandwagon Asia](https://bandwagon.asia)
- [The Jakarta Post](https://www.thejakartapost.com)

---

## 🎭 Data Konser

Saat ini mencakup konser dari:

**Confirmed ✅**
- BLACKPINK (Nov 2025 – sudah selesai)
- Green Day (Feb 2025 – sudah selesai)
- Dream Theater, ATEEZ, MCR (Hammersonic), Laufey, Java Jazz, F✦FOREVER, EXO (2026)
- The Neighbourhood, LaLaLa Festival, The Weeknd, Bryan Adams (2026)
- Avenged Sevenfold, MCR (JIS), 5 Seconds of Summer, BTS (2026)

**Rumor 🔮**
- ENHYPEN, Byeon Woo-seok, Dua Lipa, aespa
- Ed Sheeran, Coldplay, Taylor Swift

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | HTML5, CSS3 (custom dark theme), Vanilla JavaScript |
| Font | [Inter](https://fonts.google.com/specimen/Inter) + [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts |
| Analytics | Google Analytics 4 (GA4) |
| Storage | `localStorage` (wishlist, reviews, chatbot history) |
| Scraper | Python 3.12 + `requests` + `BeautifulSoup4` |
| CI/CD | GitHub Actions |
| Hosting | Vercel |
| Images | Wikimedia Commons (CC-licensed) |

---

## 📁 Konvensi Data Konser (`app.js`)

Setiap konser didefinisikan sebagai objek dengan struktur berikut:

```javascript
{
  id: 'unique-concert-id',        // Digunakan sebagai URL hash & localStorage key
  artist: 'Nama Artis',
  tour: 'Nama Tur',
  genre: 'kpop|pop|rock|jazz|indie',
  emoji: '🎵',
  dates: ['DD Bulan YYYY'],       // Array — bisa multi-hari
  rawDate: new Date('YYYY-MM-DD'), // Untuk sorting & status past/upcoming
  time: 'HH:MM WIB',
  venue: 'Nama Venue',
  city: 'Kota, Provinsi',
  promotor: 'Nama Promotor',
  ticketUrl: 'https://...',
  priceRange: 'Rp X – Rp Y',
  priceMin: 0,                    // Angka untuk filter & visualisasi
  priceMax: 0,
  ticketCategories: [{ name, price }],
  confirmStatus: 'confirmed|rumor',
  hot: true|false,                // Ditampilkan di seksi "Paling Ditunggu"
  rumorDetail: '...',             // Opsional, hanya untuk status rumor
  description: '...',
  sources: ['domain1.com', 'domain2.com'],
  lineup: ['Artis 1', 'Artis 2'], // Opsional, untuk festival
}
```

---

## 🤝 Kontribusi

Ada konser yang belum masuk atau informasi yang perlu diperbarui?

1. Fork repo ini
2. Edit data di `app.js` atau `scraper.py`
3. Buat Pull Request dengan deskripsi sumber informasi yang valid
4. Pastikan menyertakan link sumber resmi (promotor / platform tiket)

---

## ⚠️ Disclaimer

- Data diupdate berkala namun **selalu verifikasi ke platform resmi** sebelum membeli tiket.
- Harga tiket dapat berubah sewaktu-waktu.
- Konser berlabel **🔮 Rumor** belum dikonfirmasi resmi — **jangan beli tiket dari calo!**
- Gambar artis menggunakan foto dari Wikimedia Commons dengan lisensi CC.

---

## 📜 Lisensi

© 2026 ConcertID. Dibuat dengan ❤️ untuk komunitas fans musik Indonesia.
