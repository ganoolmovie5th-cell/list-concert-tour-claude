# 🎵 ConcertID — Jadwal Konser Internasional di Indonesia

> Sumber informasi terpercaya untuk jadwal konser musisi internasional di Indonesia 2025–2027.  
> Lengkap dengan label **Confirmed ✅** vs **Rumor 🔮** agar kamu tidak tertipu.

🌐 **Live:** [list-concert-tour.web.id](https://www.list-concert-tour.web.id)  
📱 **Mobile:** [list-concert-tour-mobile-claude](https://github.com/ganoolmovie5th-cell/list-concert-tour-mobile-claude)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🗓️ Jadwal Lengkap | 43+ konser 2025–2027: artis, tanggal, venue, jam, dan harga tiket |
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
| 🎟️ Going / Interested | Vote kehadiran & ketertarikan — **sync Supabase real-time** |
| ⭐ Review & Rating | Sistem ulasan & rating — **sync Supabase** |
| 💬 Diskusi | Komentar publik per konser — **sync Supabase** |
| 🛒 Forum Jual Beli Tiket | Listing jual/cari tiket antar fans — **sync Supabase** |
| 🤝 Cari Teman Nonton | Posting cari teman nonton — **sync Supabase** |
| 📸 Foto dari Fans | Upload foto ke Supabase Storage — **sync Supabase** |
| 📋 Setlist.fm | Lihat setlist konser sebelumnya via Setlist.fm API |
| 📰 Newsletter | Daftar email untuk update konser terbaru (via Mailchimp) |
| 📬 Kritik & Saran | Form feedback dengan lampiran foto (via EmailJS) |
| 📊 Analytics Dashboard | Dashboard admin untuk melihat engagement |
| 🤖 Auto-Update PR | Scraper HIGH confidence → update `app.js` → PR otomatis ke main |
| 🔄 Monitor Harian | Scraper via GitHub Actions tiap hari 01:00 WIB + email laporan |
| 🏷️ JSON-LD Schema | Structured data Event schema untuk semua konser (SEO Google Events) |
| 📲 PWA | Progressive Web App — install di homescreen, offline support, auto-reload saat ada update |
| 🔗 Internal Links | Tambahan internal links untuk SEO (paths: `/jadwal`, `/artis`, `/venue`, `/kategori`) |
| 🤖 Robots.txt | Disallow `manifest.json` + `/*.json$` dan set sitemap homepage |
| 🏷️ Headings | Tambah H5/H6 minor headings untuk audit (Detail Informasi / Fasilitas Venue) |

---

## 🏗️ Struktur Proyek

```
list-concert-tour-claude/
├── index.html              # Single-page app utama
├── app.js                  # Data konser (43+ entries) & logika utama + JSON-LD schema
├── app.min.js              # Minified version (auto-generated)
├── style.css               # Styling (dark/light mode, responsive)
├── style.min.css           # Minified CSS (auto-generated)
├── supabase.js             # Supabase REST client (DB + Storage + getDeviceUID)
├── reviews.js              # Review & Rating — Supabase primary
├── features.js             # Going/Interested, Diskusi, Foto Fans — Supabase primary
├── features2.js            # Calendar View, Advanced Search, Harga Alert, Spotify
├── features3.js            # I18n, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm
├── features4.js            # Setlist.fm, NewConcertNotif, Tips & Artikel
├── *.min.js                # Minified JS files (auto-generated)
├── sw.js                   # Service Worker — Stale-While-Revalidate, auto-reload saat ada update
├── supabase_schema.sql     # Schema SQL — jalankan di Supabase SQL Editor
├── api/
│   └── subscribe.js        # Vercel Serverless — proxy Mailchimp Newsletter
├── analytics.html          # Dashboard analytics (admin only)
├── scraper.py              # Scraper Python — monitoring 7 sumber konser
├── auto_updater.py         # Filter HIGH confidence → inject ke app.js → output summary
├── email_reporter.py       # Kirim laporan scraper via Gmail SMTP
├── requirements.txt        # Dependensi Python scraper
├── sitemap.xml             # Sitemap (1 URL homepage)
├── robots.txt              # Robots directives
├── vercel.json             # Konfigurasi Vercel + Security/CSP headers + Cache
├── images/                 # Foto artis/konser (dipakai juga oleh mobile app)
└── .github/
    └── workflows/
        └── scrape.yml      # GitHub Actions: monitor harian + auto-update PR 01:00 WIB
```

---

## 🤖 Semi-Auto Scraper (Opsi A)

Sistem scraping otomatis yang berjalan tiap hari jam **01:00 WIB** via GitHub Actions.

### Flow
```
01:00 WIB
├── Job 1: Scrape 7 sumber → klasifikasi → kirim email laporan ke admin
└── Job 2: Filter HIGH confidence → update app.js → buat PR otomatis ke main
                                                          ↓
                                          Admin review PR → merge → Vercel deploy
```

### Sumber HIGH Confidence
`tiket.com` · `loket.com` · `songkick.com` · `bandwagon.asia`

### File Terlibat
| File | Fungsi |
|---|---|
| `scraper.py` | Scrape 7 sumber, deduplicate, klasifikasi |
| `auto_updater.py` | Filter HIGH confidence, inject ke `app.js`, output summary |
| `email_reporter.py` | Kirim laporan HTML ke admin via Gmail SMTP |
| `.github/workflows/scrape.yml` | Orchestration: 2 jobs + buat PR otomatis |

### Manual Trigger
**Actions → 🎵 Daily Concert Monitor & Auto-PR → Run workflow**

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
**[SQL Editor](https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/sql)** → paste isi `supabase_schema.sql` → **Run**

### 2. Buat Storage Bucket
**[Storage](https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/storage)** → New bucket → nama: `fan-photos` → centang **Public** → Create

### Tabel

| Tabel | Fungsi |
|---|---|
| `concert_votes` | Going / Interested per konser |
| `discussions` | Komentar diskusi per konser |
| `reviews` | Review & rating per konser |
| `ticket_market` | Forum jual beli tiket |
| `group_buying` | Cari teman nonton |
| `fan_photos` | Foto dari fans (URL Supabase Storage) |

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
| `GMAIL_APP_PASSWORD` | App Password 16 karakter dari `ganoolmovie5th@gmail.com` |
| `ADMIN_EMAIL` | Email tujuan laporan (default: `ganoolmovie5th@gmail.com`) |

---

## 📧 Email Systems

| Feature | Service | Email | Status |
|---|---|---|---|
| Newsletter | Mailchimp API | Mailchimp managed | ✅ Active |
| Scraper Report | Gmail SMTP | `ganoolmovie5th@gmail.com` | ✅ Active |
| Kritik & Saran | EmailJS | `listconcerttour@gmail.com` | ✅ Active |

---

## 📬 Setup EmailJS (Kritik & Saran)

- Service ID: `service_lq3pvsq` | Template ID: `template_w8grsoa`
- Foto dikirim sebagai field **`photo_data`** (base64 murni, tanpa prefix `data:image/...`)
- Field **`has_photo`**: `'ya'` atau `'tidak'`

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (Single Page App) |
| Font | Inter + Syne via Google Fonts (non-blocking load) |
| Analytics | Google Analytics 4 (GA4) + Cloudflare Insights |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (foto fans) |
| Local Cache | `localStorage` (wishlist, harga alert, preferensi) |
| Newsletter | Mailchimp API v3 via Vercel Serverless |
| Email | EmailJS (kritik & saran) · Gmail SMTP (scraper report) |
| Maps | Google Maps Embed |
| Music | Spotify Embed, Setlist.fm API |
| SEO | JSON-LD Event Schema (auto-inject via JS), sitemap.xml |
| Scraper | Python 3.12 + requests + BeautifulSoup4 |
| Service Worker | Stale-While-Revalidate + auto-reload on update |
| CI/CD | GitHub Actions (scrape + auto-PR) |
| Hosting | Vercel (static + serverless) |
| Security | CSP, HSTS, COOP, X-Frame-Options, Referrer-Policy |

---

## 📊 PageSpeed / Lighthouse (Juni 2026)

| Kategori | Score |
|---|---|
| Performance | ~70–75 |
| Accessibility | 96+ |
| Best Practices | 92+ |
| SEO | 92+ |

---

## 📋 Konvensi Data Konser (`app.js`)

```javascript
{
  id: 'unique-concert-id',          // kebab-case, unik
  artist: 'Nama Artis',
  tour: 'Nama Tur',
  genre: 'kpop|pop|rock|jazz|indie',
  emoji: '🎵',
  dates: ['DD Bulan YYYY'],
  rawDate: new Date('YYYY-MM-DD'),
  time: '19:00 WIB',
  venue: 'Nama Venue',
  city: 'Kota, Provinsi',
  promotor: 'Nama Promotor',
  ticketPlatform: 'tiket.com',
  ticketUrl: 'https://...',
  priceRange: 'Rp X – Rp Y',
  priceMin: 0, priceMax: 0,
  ticketCategories: [{ name, price }],
  confirmStatus: 'confirmed|rumor',
  hot: true|false,
  description: '...',
  sources: ['domain.com'],
  lineup: ['Artis 1'],              // opsional
  rumorDetail: '...',               // opsional, hanya untuk rumor
}
```

> **Source of truth:** `app.js` di repo ini. Mobile app (`concerts.ts`) selalu mengikuti data di sini.

---

## 🖼️ Images

Foto artis tersimpan di `/images/[concert-id].jpeg`.  
Mobile app mengambil gambar langsung dari URL web:  
`https://www.list-concert-tour.web.id/images/[id].jpeg`

---

## ⚠️ Disclaimer

- Selalu verifikasi ke platform resmi sebelum membeli tiket.
- Konser berlabel **🔮 Rumor** belum dikonfirmasi — jangan beli dari calo!
- Data di Forum & Cari Teman tidak diverifikasi admin — selalu hati-hati.
- Data yang di-auto-inject dari scraper menunggu review sebelum live.

---

© 2026 ConcertID. Dibuat dengan ❤️ untuk komunitas fans musik Indonesia.
