# 🎵 ConcertID — Jadwal Konser Internasional di Indonesia

> Sumber informasi terpercaya untuk jadwal konser musisi internasional di Indonesia 2025–2027.  
> Lengkap dengan label **Confirmed ✅** vs **Rumor 🔮** agar kamu tidak tertipu.

🌐 **Live:** [list-concert-tour.web.id](https://www.list-concert-tour.web.id)  
📱 **Mobile:** [list-concert-tour-mobile-claude](https://github.com/ganoolmovie5th-cell/list-concert-tour-mobile-claude)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🗓️ Jadwal Lengkap | 37 konser 2025–2027: artis, tanggal, venue, jam, dan harga tiket |
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
| 🔄 Auto-monitor Harian | Scraper otomatis via GitHub Actions setiap hari pukul 01:00 WIB |
| 🏷️ JSON-LD Schema | Structured data Event schema untuk semua konser (SEO Google Events) |

---

## 🏗️ Struktur Proyek

```
list-concert-tour-claude/
├── index.html              # Single-page app utama
├── app.js                  # Data konser (37 entries) & logika utama + JSON-LD schema
├── app.min.js              # Minified version (auto-generated)
├── style.css               # Styling (dark/light mode, responsive)
├── style.min.css           # Minified CSS (auto-generated)
├── supabase.js             # Supabase REST client (DB + Storage + getDeviceUID)
├── reviews.js              # Review & Rating — Supabase primary
├── features.js             # Going/Interested, Diskusi, Foto Fans — Supabase primary
├── features2.js            # Calendar View, Advanced Search, Harga Alert, Spotify
├── features3.js            # GroupBuying, TicketMarket, FeedbackForm — Supabase primary
├── features4.js            # Setlist.fm, NewConcertNotif, Tips & Artikel, Bahasa
├── *.min.js                # Minified JS files (auto-generated)
├── supabase_schema.sql     # Schema SQL — jalankan di Supabase SQL Editor
├── api/
│   └── subscribe.js        # Vercel Serverless — proxy Mailchimp Newsletter
├── analytics.html          # Dashboard analytics (admin only)
├── scraper.py              # Scraper Python untuk monitoring data konser
├── email_reporter.py       # Kirim laporan scraper via Gmail SMTP
├── requirements.txt        # Dependensi Python scraper
├── sitemap.xml             # Sitemap (1 URL homepage)
├── robots.txt              # Robots directives
├── vercel.json             # Konfigurasi Vercel + Security/CSP headers + Cache
├── images/                 # Foto artis/konser (juga digunakan oleh mobile app)
└── .github/
    └── workflows/
        └── scrape.yml      # GitHub Actions: monitor harian 01:00 WIB
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

### Strategi Data
- **Supabase = primary** — sync antar semua device & platform (web & mobile)
- **localStorage = fallback** — tetap berfungsi jika offline/koneksi gagal
- **Fallback keys:** `cid_going`, `cid_interest`, `cid_myvote` (identik dengan mobile)

### Catatan Teknis
- Upload foto wajib set `Content-Type` header (`image/jpeg` dst) — sudah dihandle di `supabase.js`
- Going/Interested: query pakai `select=type,device_uid` agar `myVote` terbaca dengan benar
- Past konser: tampil angka real dari Supabase, fallback ke angka dummy jika belum ada vote

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
| Email | EmailJS (kritik & saran + foto) |
| Maps | Google Maps Embed |
| Music | Spotify Embed, Setlist.fm API |
| SEO | JSON-LD Event Schema (auto-inject via JS), sitemap.xml |
| Scraper | Python 3.12 + requests + BeautifulSoup4 |
| CI/CD | GitHub Actions |
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

> **Note:** Performance score dipengaruhi banyaknya data konser (37 cards). CLS = 0.002, TBT = 70ms.

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

---

© 2026 ConcertID. Dibuat dengan ❤️ untuk komunitas fans musik Indonesia.
