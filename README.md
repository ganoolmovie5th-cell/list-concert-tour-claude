# 🎵 ConcertID — Jadwal Konser Internasional di Indonesia

> Sumber informasi terpercaya untuk jadwal konser musisi internasional di Indonesia 2025–2027.  
> Lengkap dengan label **Confirmed ✅** vs **Rumor 🔮** agar kamu tidak tertipu.

🌐 **Live:** [list-concert-tour.web.id](https://www.list-concert-tour.web.id)  
📱 **Mobile:** [list-concert-tour-mobile-claude](https://github.com/ganoolmovie5th-cell/list-concert-tour-mobile-claude)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🗓️ Jadwal Lengkap | 44 konser 2025–2027: artis, tanggal, venue, jam, dan harga tiket |
| ✅ / 🔮 Status | Label jelas **Confirmed** (resmi) vs **Rumor** (belum dikonfirmasi) |
| 🔍 Search & Filter | Cari berdasarkan artis/venue/kota; filter genre, status, dan wishlist |
| 🔍 Advanced Search | Filter harga (slider), bulan, kota/area, dan status konser |
| 🌙 Dark Mode Toggle | Pilih tema Dark (default) atau Light — tersimpan di localStorage |
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
| 🌤️ Weather Forecast | Prakiraan cuaca hari konser via Open-Meteo API (live ≤16 hari, estimasi iklim untuk tanggal lebih jauh) |
| 🅿️ Parking Nearby | Info parkir per venue (GBK, JIS, ICE BSD, Ancol, PIK2) + link Google Maps |
| ✨ Story Card Generator | Buat Story Instagram untuk konser — Canvas 9:16, foto artis sebagai banner, 4 template (Dark/Purple/Neon/Sunset), download PNG / Web Share API. Disabled untuk konser Rumor. |
| 📍 Fan Meetup Map | Crowdsourced meetup points per konser — form (nama + lokasi + waktu), Supabase `fan_meetups` table, tampil di bawah Going/Interested |
| 🔗 Internal Links | Tambahan internal links untuk SEO (paths: `/jadwal`, `/artis`, `/venue`, `/kategori`) |
| 🤖 Robots.txt | Allow `manifest.json` (PWA), Disallow `sw.js` + `*.min.js/css`, Sitemap www |
| 🏷️ Headings | Tambah H5/H6 minor headings untuk audit (Detail Informasi / Fasilitas Venue) |
| 🧪 E2E Testing | Playwright 3 test groups, 12 assertions (H1, sitemap 6 URLs, robots.txt rules, manifest.json, concert grid) + GitHub Actions |

---

## 🧪 E2E (Playwright)

Jalankan smoke test ke production:

```bash
npm install
npm run test:e2e
```

**3 test groups, 12 assertions:**

| Grup | Test |
|---|---|
| **Concert listings** | Single H1 (`h1.hero-title`), H1 contains "Konser", concert grid render ≥1 card, navbar href exact match |
| **Sitemap** | Reachable + valid XML, exactly 6 `<loc>`, semua path ada (`/`, `/jadwal`, `/konser`, `/rumor`, `/about`, `/contact`) |
| **Robots.txt** | Reachable, Disallow `/sw.js`+`/*.min.js`+`/*.min.css` ada, `manifest.json` **tidak** diblok, Sitemap URL dideklarasikan, `manifest.json` langsung accessible |

---

## 🏗️ Struktur Proyek

```
list-concert-tour-claude/
├── index.html              # Single-page app utama
├── app.js                  # Data konser (44 entries) & logika utama + JSON-LD schema
├── app.min.js              # Minified version (auto-generated)
├── style.css               # Styling (dark/light mode, responsive)
├── style.min.css           # Minified CSS (auto-generated)
├── supabase.js             # Supabase REST client (DB + Storage + getDeviceUID)
├── reviews.js              # Review & Rating — Supabase primary
├── features.js             # Going/Interested, Diskusi, Foto Fans — Supabase primary
├── features2.js            # Calendar View, Advanced Search, Harga Alert, Spotify
├── features3.js            # I18n, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm
├── features4.js            # Setlist.fm, NewConcertNotif, Tips & Artikel
├── features5.js            # Weather Forecast, Parking Nearby, Story Card Generator, Fan Meetup Map (Juni-Juli 2026)
├── story-card-preview.html # Preview & demo story card (pilih konser + template, download PNG)
├── *.min.js                # Minified JS files (auto-generated)
├── sw.js                   # Service Worker — Stale-While-Revalidate, auto-reload saat ada update
├── supabase_schema.sql     # Schema SQL — jalankan di Supabase SQL Editor
├── api/
│   └── subscribe.js        # Vercel Serverless — proxy Mailchimp Newsletter
├── analytics.html          # Dashboard analytics (admin only)
├── scraper.py              # Scraper Python — monitoring 10 sumber konser
├── auto_updater.py         # Filter HIGH confidence → inject ke app.js → output summary
├── email_reporter.py       # Kirim laporan scraper via Gmail SMTP
├── requirements.txt        # Dependensi Python scraper
├── sitemap.xml             # Sitemap (6 URLs: /, /jadwal, /konser, /rumor, /about, /contact)
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
| 🎸 Guns N' Roses Jakarta | GNR World Tour 2026 dikonfirmasi: Sabtu 21 Nov 2026, Stadion Madya GBK, promotor Rajawali Indonesia (sumber: gnrjakarta.com). Entry GNR rumor lama diganti jadi confirmed — total tetap 44 |
| 🎟️ GNR Tiket Update (Jul 2026) | Harga tiket tersedia via TipTip: presale Nightrain mulai Rp 1.050.000 (2 Jul), BALE by BTN (16 Jul), General Sale (30 Jul). Waktu dikoreksi 17:00 WIB |
| 🕷️ +3 Sumber Scraper | `scraper.py` kini memantau **10 sumber** — tambah Live Nation Asia (HIGH), RRI (HIGH), KapanLagi (MEDIUM). `livenation.asia` masuk HIGH confidence di `auto_updater.py` |
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
| 🧱 Fix CLS 0.357 (Agentic) | Badge **going count** di-inject async ke `.card-footer` (in-flow) setelah fetch Supabase → menambah tinggi kartu & menggeser kartu lain saat scroll. Fix: badge jadi overlay `position:absolute` di `.card-header` (zero layout shift). `app.min.js` + `style.min.css` di-regenerate |
| ⚡ Hapus double analytics | `gtag.js` GA4 terpisah dihapus dari `index.html`; GA4 kini dimuat via GTM container saja (hemat ~375 KiB unused JS). Consent Mode v2 dipindah sebelum GTM |
| ⚡ Defer app scripts | 7 `*.min.js` diberi `defer` (urutan eksekusi tetap terjaga) → kurangi render-block & critical path |
| ⚡ CSS non-blocking | `style.min.css` dimuat via `media="print" onload` swap (+`<noscript>` fallback); critical CSS tetap inline |
| ⚡ Critical CSS hero-stats | Tambah `.hero-stats`, `.stat-num`, `.stat-label`, `.stat-divider`, `.hero-search` + `@media(max-width:480px)` ke inline `<style>` — fix CLS 0.306 akibat relayout saat `style.min.css` load async |
| 🖼️ Optimasi gambar | `images/hammersonic-2026.jpeg` di-recompress (q72, progressive) 24.7 KiB → 17.3 KiB, nama file sama (aman untuk mobile) |
| ♿ Kontras light-mode | Tambah override `html.light .badge-*` (genre/status/premium/luxury/hot/going-count, dll) — teks pastel → 700/800-shade, semua ≥4.5:1 WCAG AA. Dark mode tidak berubah |
| ♿ Focus visible | Web Interface Guidelines — hapus 15× `outline:none` + ring `:focus-visible` global (fokus keyboard terlihat, mouse-click bersih via `:focus:not(:focus-visible)`) |
| ⚡ Transition explicit | 29× `transition:all` → properti eksplisit (color/bg/border/box-shadow/transform/opacity) — compositor-friendly, durasi/easing asli dipertahankan |
| ✍️ Tipografi ellipsis | `...` → `…` pada teks tampilan (index/about/contact/jadwal/konser/rumor/analytics). Spread operator JS dilindungi. `style.min.css` di-regenerate via clean-css-cli |

### SEO (Juni 2026)
| Item | Keterangan |
|---|---|
| ✅ Consent Mode region-scoped | Google Tag flag "consent rate 0% di luar EEA". Fix: default `analytics_storage` jadi `granted` untuk non-EEA (mayoritas trafik = Indonesia, consent tak wajib), `denied` khusus EEA+UK+CH sampai user terima banner. ad_* tetap denied (tanpa iklan). Re-apply pilihan user kini dua arah |
| 🔗 Internal links homepage | Audit SEO homepage (`/`) hanya mendeteksi ~2 internal link. Tambah section baru **Panduan Konser** (`.guide-section`, id `panduan`) setelah ABOUT — berisi 5 link ke route nyata yang sudah ada (`/jadwal`, `/konser`, `/rumor`, `/about`, `/contact`). Tidak membuat URL baru (semua sudah di `vercel.json` + `sitemap.xml`) |
| 🏷️ Heading h5 & h6 | Homepage sebelumnya berhenti di h4 (footer). Section Panduan menambah cascade `h2→h3→h4→h5→h6` (2 kolom, tanpa skip level) sehingga semua level heading hadir natural dengan konten informatif |
| 🗺️ Sitemap 6 URLs | `sitemap.xml` diperluas dari 1 → 6 URL: `/`, `/jadwal`, `/konser`, `/rumor`, `/about`, `/contact` — semua pakai `www` (konsisten dengan canonical). `lastmod` diupdate |
| 🤖 Robots.txt fix | Hapus `Disallow: /manifest.json` (unblock PWA manifest untuk Google), hapus `Disallow: /*.json$` (sintaks regex invalid di robots.txt, silent-ignored), perbarui `Sitemap:` ke URL `www`, hapus direktif `Host:` (tidak didukung Google) |

### Testing (Juni 2026)
| Item | Keterangan |
|---|---|
| 🧪 E2E rewrite | `tests/e2e.spec.ts` ditulis ulang dari 1 grup (3 test dasar) → 3 grup, 12 assertions. Perbaiki 3 kegagalan CI: (1) H1 selector mismatch — tambah `toContainText('Konser')` + `toHaveCount(1)`; (2) Sitemap expected 6 URLs got 1 — tambah `/<loc>/g` count + check semua 6 path; (3) Robots.txt Disallow rules not found — tambah assertion per rule + verifikasi `manifest.json` tidak diblok + accessible |

> ⚠️ **Action manual di GTM:** pastikan tag **GA4 Configuration** (`G-8NNHBT6N8Q`) aktif di container `GTM-NG5XKT8T`, jika belum maka GA4 tidak akan terkumpul setelah perubahan ini.

## Pembersihan Kode / Ponytail Audit (Juni 2026)

Hapus 5 file HTML yatim (tidak dirujuk dari mana pun; tanpa perlu re-minify):
- `artis.html`, `venue.html`, `kategori.html` — route `/artis`, `/venue`, `/kategori` di `vercel.json` di-rewrite ke `/`, bukan ke file `.html`-nya.
- `story-card-preview.html` — halaman demo (steering menandai bisa dihapus).
- `analytics.html` — dashboard demo `noindex` tak terhubung.

Ditunda (butuh re-minify hati-hati): dedup helper JS (`timeAgo` 4×, `lsGetAll`, escape inline, `buildWaHref`) di `app.js`/`features*.js` dan generalisasi 10 fungsi `scrape_*` di `scraper.py`.

## Pembersihan Kode / Ponytail Audit — Dedup Helper (Juni 2026)

Dedup helper single-file (behavior-preserving), re-minify `terser --compress` tanpa `--mangle`:
- `reviews.js`: hapus `getDeviceUIDLocal` → pakai `getDeviceUID` global.
- `features3.js`: `buildWaHref` duplikat di 2 IIFE → satu fungsi top-level.

Ditunda (cross-file, risiko tinggi di SPA live): konsolidasi `timeAgo`/`lsGetAll`/`fmtCount`/escape inline + generalisasi `scraper.py`.

### Dedup timeAgo (Juni 2026, lanjutan)

Hanya dua `timeAgo` identik di `features3.js` (GroupBuying & TicketMarket) yang digabung jadi satu fungsi top-level. Versi di `reviews.js` & `features.js` dibiarkan karena perilakunya berbeda (format tanggal/tahun & penanganan input tidak sama). `features3.min.js` di-regenerate.

### Dedup localStorage store → makeLocalStore (Juni 2026, lanjutan)

5 salinan `lsGetAll`/`lsGetFor`/`lsSaveAll` digantikan satu factory global `makeLocalStore(key)` di `supabase.js`. Tiap modul (`reviews`, `features` Discussion+UGC, `features3` GroupBuying+TicketMarket) memakai destructuring bernama sama sehingga call site tak berubah. Re-minify 4 file `.min.js` (`terser --compress`, tanpa `--mangle`); verifikasi `node --check` + global utuh.

### Audit Lanjutan — Hapus Minified & Dead Code (Juli 2026)

- Hapus 8 file `.min.js` (duplikat dari `.js` yang sudah ada); tambah `*.min.js` ke `.gitignore`
- Update `index.html` dan `sw.js` agar load `.js` bukan `.min.js`
- `features3.js`: hapus fungsi duplikat `timeAgoChat()` → call site diganti `timeAgo()`
- `features4.js`: hapus 3 entry `null` di `ARTIST_MAP` (`fforever`, `lalala-fest`, `java-jazz`)
- `features.js`: hapus blok komentar dead code `BrowserNotif.checkPending()`

### Audit Lanjutan 2 (Juli 2026)

- `features2.js`: promosikan `formatRp()` ke module scope; ganti 4 format budget inline di `HargaAlert` (`checkAndNotify`, `renderPanel`, `quickAdd`) dengan `formatRp()` — `buildWaHref` & `makeLocalStore` sudah bersih dari audit sebelumnya

### Audit Lanjutan 3 (Juli 2026)

- `features.js`: single dispatcher — tambah `window._openModalHandlers?.forEach(h => h(id))` di akhir patch; hilangkan komentar patch chain
- `features4.js`: hapus wrap `window.openModal`; push handler SetlistFM ke `window._openModalHandlers`
- `features5.js`: hapus wrap `window.openModal`; push handler Weather/Parking/StoryCard ke `window._openModalHandlers`
