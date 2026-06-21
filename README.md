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
| 🎟️ Social Proof Going | Tampilkan jumlah "X orang going" langsung di card konser (fetch all counts 1 DB call) |
| 🗺️ Venue Seat Map | Denah & tips kategori kursi untuk 7 venue utama Jakarta (GBK, JIS, ICE BSD, dll) |
| 🎵 Pre-Concert Playlist | Tombol "Buka Playlist di Spotify" di modal konser — auto-link ke artis/search |
| 💬 In-App Chat | Real-time chat per post Cari Teman Nonton — polling 10s via Supabase (table: `gb_chat`) |
| 🏷️ JSON-LD Schema | Structured data Event schema untuk semua konser (SEO Google Events) |
| 📲 PWA | Progressive Web App — install di homescreen, offline support, auto-reload saat ada update |
| 🔗 Internal Links | Tambahan internal links untuk SEO (paths: `/jadwal`, `/artis`, `/venue`, `/kategori`) |
| 🤖 Robots.txt | Disallow `manifest.json` + `/*.json$` dan set sitemap homepage |
| 🏷️ Headings | Tambah H5/H6 minor headings untuk audit (Detail Informasi / Fasilitas Venue) |
| 🧪 E2E Testing | Playwright smoke tests + GitHub Actions (run tiap push & harian) |

---

## 🧪 E2E (Playwright)

Jalankan smoke test ke production:

```bash
npm install
npm run test:e2e
```

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
├── playwright.config.ts    # Playwright config (prod baseURL)
├── tests/                  # E2E tests
└── .github/
    └── workflows/
        ├── scrape.yml      # GitHub Actions: monitor harian + auto-update PR 01:00 WIB
        └── e2e.yml         # GitHub Actions: Playwright E2E
```

---

© 2026 ConcertID. Dibuat dengan ❤️ untuk komunitas fans musik Indonesia.

---

## 🆕 Update Juni 2026

### Fitur Baru
| Fitur | Keterangan |
|---|---|
| 🎟️ Social Proof Going | Going count di setiap card, 1 DB call untuk semua 44 konser |
| 🗺️ Venue Seat Map | Denah & tips kursi 7 venue Jakarta di modal konser |
| 🎵 Pre-Concert Playlist | Link Spotify playlist artis di modal konser |
| 💬 In-App Chat | Real-time chat per post Cari Teman Nonton (Supabase `gb_chat`, polling 10s) |

### Bug Fixes
| Fix | Keterangan |
|---|---|
| JSON-LD `eventStatus` invalid (SEO) | `injectEventSchemas()` → `eventStatusUrl()` memakai `https://schema.org/EventEnded` untuk konser yang sudah lewat. Nilai itu **tidak ada** di enum `eventStatus` schema.org/Google (hanya EventScheduled/Cancelled/MovedOnline/Postponed/Rescheduled) → Google abaikan field-nya. Fix: kembalikan `EventScheduled` (Google tahu event lewat dari `startDate`/`endDate`), tambah mapping `EventCancelled`/`EventPostponed`. Hasil: 44/44 event valid |
| Countdown timer bug | `getCountdown()` hanya pakai `rawDate` (midnight UTC) → semua konser jam:menit:detik sama. Fix: `getConcertDateTime(c)` parse `c.time` + combine dengan `rawDate` |
| Stats counter mismatch | `confirmedCount` filter `!isPast(c)` → 18 confirmed past konser tidak terhitung (13+13≠44). Fix: hitung semua confirmed |
| SEO: canonical tags | `about.html`, `contact.html`, `konser.html`, `jadwal.html`, `rumor.html` canonical dari `/#about`, `/#concerts` → `https://www.list-concert-tour.web.id/` (homepage) untuk hindari duplicate content |
| SEO: sitemap cleanup | Hapus 5 duplicate redirect URLs dari `sitemap.xml` → hanya 1 URL homepage tersisa |
| Website blank | `normalize()` undefined crash DOMContentLoaded |
| Text "undefined" di modal | `patchGroupBuyingWithChat` tidak return HTML — fixed |
| Filter awal kosong | `applyFilters()` di DOMContentLoaded — sorted dari awal |
| Caching Cloudflare | SW v18 Network First + `Cache-Control: no-store` untuk HTML |
| Navbar bersih | Hapus Jadwal Lengkap, Daftar Artis, Venue Populer, Kategori Konser |

### Performance & Accessibility (PageSpeed — Juni 2026)
| Item | Keterangan |
|---|---|
| ⚡ Hapus double analytics | `gtag.js` GA4 terpisah dihapus dari `index.html`; GA4 kini dimuat via GTM container saja (hemat ~375 KiB unused JS). Consent Mode v2 dipindah sebelum GTM |
| ⚡ Defer app scripts | 7 `*.min.js` diberi `defer` (urutan eksekusi tetap terjaga) → kurangi render-block & critical path |
| ⚡ CSS non-blocking | `style.min.css` dimuat via `media="print" onload` swap (+`<noscript>` fallback); critical CSS tetap inline |
| 🖼️ Optimasi gambar | `images/hammersonic-2026.jpeg` di-recompress (q72, progressive) 24.7 KiB → 17.3 KiB, nama file sama (aman untuk mobile) |
| ♿ Kontras light-mode | Tambah override `html.light .badge-*` (genre/status/premium/luxury/hot/going-count, dll) — teks pastel → 700/800-shade, semua ≥4.5:1 WCAG AA. Dark mode tidak berubah |
| ♿ Focus visible | Web Interface Guidelines — hapus 15× `outline:none` + ring `:focus-visible` global (fokus keyboard terlihat, mouse-click bersih via `:focus:not(:focus-visible)`) |
| ⚡ Transition explicit | 29× `transition:all` → properti eksplisit (color/bg/border/box-shadow/transform/opacity) — compositor-friendly, durasi/easing asli dipertahankan |
| ✍️ Tipografi ellipsis | `...` → `…` pada teks tampilan (index/about/contact/jadwal/konser/rumor/analytics). Spread operator JS dilindungi. `style.min.css` di-regenerate via clean-css-cli |

> ⚠️ **Action manual di GTM:** pastikan tag **GA4 Configuration** (`G-8NNHBT6N8Q`) aktif di container `GTM-NG5XKT8T`, jika belum maka GA4 tidak akan terkumpul setelah perubahan ini.
