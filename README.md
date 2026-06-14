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
| 🔍 Advanced Search | Filter harga (slider), bulan, kota/area, dan status konser |
| 💰 Harga Alert | Set budget maksimal — notifikasi saat ada konser yang sesuai |
| ❤️ Wishlist | Simpan konser favorit ke localStorage tanpa perlu akun |
| ⏱️ Countdown | Timer hitung mundur untuk setiap konser mendatang |
| 📤 Share | Share konser via WhatsApp, Telegram, Instagram, atau copy link |
| 🗓️ Google Calendar | Tambah konser langsung ke Google Calendar |
| 🗺️ Venue Maps | Embed Google Maps untuk setiap venue |
| 🎵 Spotify Preview | Preview musik artis langsung di modal detail |
| 🎟️ Going / Interested | Vote kehadiran & ketertarikan per konser — **sync via Supabase** |
| ⭐ Review & Rating | Sistem ulasan & rating — **sync via Supabase** |
| 💬 Diskusi | Komentar publik per konser — **sync via Supabase** |
| 🛒 Forum Jual Beli Tiket | Listing jual/cari tiket antar fans — **sync via Supabase** |
| 🤝 Cari Teman Nonton | Posting cari teman nonton — **sync via Supabase** |
| 📸 Foto dari Fans | Upload foto setelah konser ke Supabase Storage — **sync via Supabase** |
| 📋 Setlist.fm | Lihat setlist konser sebelumnya via Setlist.fm API |
| 📰 Newsletter | Daftar email untuk update konser terbaru (via Mailchimp) |
| 📬 Kritik & Saran | Form feedback dengan lampiran foto (via EmailJS) |
| 📊 Analytics Dashboard | Dashboard admin untuk melihat engagement |
| 🔄 Auto-monitor Harian | Scraper otomatis via GitHub Actions setiap hari pukul 01:00 WIB |

---

## 🏗️ Struktur Proyek

```
list-concert-tour-claude/
├── index.html              # Halaman utama
├── app.js                  # Data konser & logika utama
├── style.css               # Styling (dark/light mode, responsive)
├── supabase.js             # Supabase client (DB helper + Storage + getDeviceUID)
├── reviews.js              # Review & Rating — Supabase primary
├── features.js             # Going/Interested, Diskusi, Foto Fans — Supabase primary
├── features2.js            # Calendar View, Advanced Search, Harga Alert, Spotify
├── features3.js            # GroupBuying, TicketMarket, FeedbackForm — Supabase primary
├── features4.js            # Setlist.fm, NewConcertNotif, Tips & Artikel, Bahasa
├── supabase_schema.sql     # Schema SQL — jalankan di Supabase SQL Editor
├── api/
│   └── subscribe.js        # Vercel Serverless — proxy Mailchimp Newsletter
├── analytics.html          # Dashboard analytics (admin only)
├── scraper.py              # Scraper Python untuk monitoring data konser
├── email_reporter.py       # Kirim laporan scraper via Gmail SMTP
├── requirements.txt        # Dependensi Python scraper
├── vercel.json             # Konfigurasi Vercel + CSP headers
├── images/                 # Foto artis/konser
└── .github/
    └── workflows/
        └── scrape.yml      # GitHub Actions: monitor harian
```

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
git clone https://github.com/ganoolmovie5th-cell/list-concert-tour-claude.git
cd list-concert-tour-claude
python3 -m http.server 8080
```

Buka `http://localhost:8080`.

---

## 🗄️ Supabase Setup

**Project:** list-concert-tour-web-n-mobile-claude  
**URL:** `https://crtqxgsruywurdlcsjfp.supabase.co`

### 1. Jalankan SQL Schema
Buka **[SQL Editor](https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/sql)** → paste isi `supabase_schema.sql` → **Run**

### 2. Buat Storage Bucket
**[Storage](https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/storage)** → New bucket → nama: `fan-photos` → centang **Public** → Create

### Tabel yang dibuat

| Tabel | Fungsi |
|---|---|
| `concert_votes` | Going / Interested per konser |
| `discussions` | Komentar diskusi per konser |
| `reviews` | Review & rating per konser |
| `ticket_market` | Forum jual beli tiket |
| `group_buying` | Cari teman nonton |
| `fan_photos` | Foto dari fans (URL Supabase Storage) |

### Strategi Data
- **Supabase = primary** → data sync antar semua device & platform
- **localStorage = fallback** → tetap berfungsi jika koneksi gagal

---

## ⚙️ Environment Variables (Vercel Dashboard)

| Variable | Keterangan |
|---|---|
| `MAILCHIMP_API_KEY` | API key dari Mailchimp → Account → Extras → API keys |
| `MAILCHIMP_LIST_ID` | Audience ID dari Mailchimp → Audience → Settings |
| `MAILCHIMP_SERVER` | Prefix server saja, contoh `us20` (**bukan** URL lengkap) |

---

## 📧 GitHub Secrets (untuk Scraper Email)

| Secret | Keterangan |
|---|---|
| `GMAIL_APP_PASSWORD` | Gmail App Password 16 karakter |
| `ADMIN_EMAIL` | Email tujuan laporan |

---

## 📬 Setup EmailJS (Kritik & Saran)

- Service ID: `service_lq3pvsq`
- Template ID: `template_w8grsoa`
- Foto dikirim sebagai `photo_data` (base64 murni)

Template EmailJS bagian foto:
```html
{{#if has_photo}}
<img src="data:image/jpeg;base64,{{photo_data}}"
     style="max-width:500px;width:100%;border-radius:8px;" />
{{/if}}
```

---

## 🎫 Forum Jual Beli Tiket & Cari Teman Nonton

- Data tersimpan di **Supabase** — sync antar semua device
- Kontak ditampilkan sebagai emoji saja (💬 WA, 📷 IG) — nomor tidak diekspos
- Pemilik post bisa edit ✏️ dan hapus 🗑️ per posting individual
- `post_uid` unik per posting, `owner_uid` = device UID untuk cek kepemilikan

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Font | Inter + Syne via Google Fonts |
| Analytics | Google Analytics 4 (GA4) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (foto fans) |
| Local Cache | `localStorage` (wishlist, harga alert, preferensi) |
| Newsletter | Mailchimp API v3 via Vercel Serverless |
| Email | EmailJS (kritik & saran + foto) |
| Maps | Google Maps Embed |
| Music | Spotify Embed, Setlist.fm API |
| Scraper | Python 3.12 + requests + BeautifulSoup4 |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## 📋 Konvensi Data Konser (`app.js`)

```javascript
{
  id: 'unique-concert-id',
  artist: 'Nama Artis',
  tour: 'Nama Tur',
  genre: 'kpop|pop|rock|jazz|indie',
  dates: ['DD Bulan YYYY'],
  rawDate: new Date('YYYY-MM-DD'),
  venue: 'Nama Venue',
  city: 'Kota, Provinsi',
  promotor: 'Nama Promotor',
  ticketUrl: 'https://...',
  priceRange: 'Rp X – Rp Y',
  priceMin: 0, priceMax: 0,
  ticketCategories: [{ name, price }],
  confirmStatus: 'confirmed|rumor',
  hot: true|false,
  description: '...',
  sources: ['domain.com'],
}
```

---

## ⚠️ Disclaimer

- Selalu verifikasi ke platform resmi sebelum membeli tiket.
- Konser berlabel **🔮 Rumor** belum dikonfirmasi — jangan beli dari calo!
- Data di Forum & Cari Teman tidak diverifikasi admin — selalu hati-hati.

---

© 2026 ConcertID. Dibuat dengan ❤️ untuk komunitas fans musik Indonesia.
