# ConcertID — Project Context & Conventions

## Overview
Website jadwal konser internasional di Indonesia 2025–2027. Single-page app (SPA).
- **Live:** https://www.list-concert-tour.web.id
- **Repo:** ganoolmovie5th-cell/list-concert-tour-claude
- **Mobile Repo:** ganoolmovie5th-cell/list-concert-tour-mobile-claude
- **Hosting:** Vercel (static + serverless)
- **Database:** Supabase (project: list-concert-tour-web-n-mobile-claude)

---

## Aturan Penting

- **Selalu push langsung ke `main`** — tidak perlu buat PR
- **Website tetap 1 page (SPA)** — jangan buat halaman/URL baru
- Gunakan `kiro_powers github push_to_remote` dengan `remote_branch_name: "main"`
- Baca file seminimal mungkin — hanya yang relevan dengan task
- Setelah edit CSS/JS, regenerate `.min` files via: `python3 /projects/sandbox/minify.py`

---

## Commit Convention (WAJIB setiap commit)

**Setiap commit di repo ini HARUS menyertakan update:**

1. **`README.md`** — update bagian yang relevan (fitur baru, perubahan konfigurasi, dll)
2. **`.kiro/steering/project-context.md`** — update catatan teknis, keputusan desain, atau hal penting

**Format commit message:**
```
<type>: <deskripsi singkat>

Files: <file yang diubah selain README & steering>
```

**Type:**
- `feat` — fitur baru
- `fix` — bug fix
- `remove` — hapus fitur/kode
- `perf` — performance
- `a11y` — accessibility
- `seo` — SEO
- `sync` — sync data mobile
- `chore` — maintenance
- `docs` — hanya dokumentasi
- `ci` — perubahan GitHub Actions / workflow

---

## Auto-Sync ke Mobile (WAJIB saat ada perubahan di web)

**Setiap kali ada perubahan berikut di web, langsung sync ke mobile dalam commit yang sama atau commit berikutnya:**

| Perubahan di Web | Yang Harus Disync ke Mobile | File Mobile |
|---|---|---|
| Tambah/edit/hapus konser di `app.js` | CONCERTS array | `src/data/concerts.ts` |
| Tambah/edit gambar di `ARTIST_IMAGES` | ARTIST_IMAGES | `src/data/concerts.ts` |
| Edit social media handles | ARTIST_SOCIALS | `src/data/concerts.ts` |
| Edit/tambah setlist | SETLISTS | `src/data/concerts.ts` |
| Edit Spotify artist IDs | SPOTIFY_ARTISTS | `src/data/concerts.ts` |
| Tambah/edit venue di `index.html` | Venue list | `src/screens/MoreScreen.tsx` |
| Update Supabase URL/key | Supabase config | `src/lib/supabase.ts` |
| Update fallback localStorage keys | AsyncStorage keys | `src/hooks/useSocialFeatures.ts` |
| Update copyright year | Footer text | `src/constants/strings.ts` |
| Fix bug di Supabase query | Query identik | hook yang relevan di `src/hooks/` |

---

## Source of Truth

- **`app.js`** = source of truth data konser (CONCERTS array, 43+ entries per Juni 2026)
- **Mobile `concerts.ts`** selalu sync dari `app.js` — jangan edit data konser di mobile secara manual
- **Images** tersimpan di `/images/[id].jpeg` — dipakai langsung oleh web, mobile pakai URL `https://www.list-concert-tour.web.id/images/[id].jpeg`

---

## Struktur File Penting

| File | Fungsi |
|---|---|
| `index.html` | Single-page utama — critical CSS inline, fonts non-blocking |
| `app.js` | Data konser (43+ entries) + render + filter + JSON-LD schema inject |
| `app.min.js` | Minified (auto-generated via minify.py) |
| `style.css` | Semua styling — dark/light mode, responsive |
| `style.min.css` | Minified CSS (auto-generated) |
| `sw.js` | Service Worker — Stale-While-Revalidate, auto-reload on update |
| `supabase.js` | Supabase REST client: `DB.*`, `Storage.upload`, `getDeviceUID()` |
| `reviews.js` | Review & Rating — Supabase primary, localStorage fallback |
| `features.js` | Going/Interested, Sort, Google Calendar, Diskusi, UGC/Foto Fans |
| `features2.js` | Calendar View, Advanced Search, Harga Alert, Spotify |
| `features3.js` | I18n, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm |
| `features4.js` | Setlist.fm, NewConcertNotif, TipsArticle |
| `supabase_schema.sql` | Schema 6 tabel — jalankan di Supabase SQL Editor |
| `api/subscribe.js` | Vercel Serverless — proxy Mailchimp API v3 (CommonJS) |
| `scraper.py` | Scrape 7 sumber, deduplicate, klasifikasi, generate report |
| `auto_updater.py` | Filter HIGH confidence → inject ke app.js → output summary JSON |
| `email_reporter.py` | Kirim laporan HTML ke admin via Gmail SMTP |
| `vercel.json` | Security headers (CSP, COOP, HSTS) + Cache headers |
| `sitemap.xml` | Sitemap — 1 URL saja (homepage) |
| `.github/workflows/scrape.yml` | 2 jobs: Job 1 scrape+email, Job 2 auto-update PR |

### Script loading order di `index.html` (wajib urutan ini):
```
supabase.min.js → app.min.js → reviews.min.js → features.min.js → features2.min.js → features3.min.js → features4.min.js
```

---

## Service Worker (sw.js)

Strategy per resource type:
- **HTML, CSS, JS** → Stale-While-Revalidate: sajikan cache, fetch background, auto-reload jika berubah
- **Images (`/images/`)** → Cache First: gambar jarang berubah
- **Cross-origin** → Skip (Supabase, GA, dll)

Auto-reload flow:
```
SW detect perubahan file → postMessage SW_UPDATED → index.html listener → window.location.reload()
```

SW update flow (tab lama):
```
SW baru installed → index.html kirim SKIP_WAITING → SW baru aktif → controllerchange → reload
reg.update() tiap 60 detik (agar tab lama tetap dapat update)
```

Cache names: `concertid-static-v16`, `concertid-images-v16`

---

## Semi-Auto Scraper (Opsi A)

**Schedule:** Tiap hari **01:00 WIB** (`cron: "0 18 * * *"` UTC)

### Flow
```
Job 1: scraper.py
  ├─ Scrape 7 sumber (Bandwagon, Tempo, Jakarta Post, Songkick, JamBase, tiket.com, Loket)
  ├─ Deduplicate & classify (new_potential, updates, irrelevant)
  ├─ Generate scraper_report.json + HTML
  ├─ Kirim email laporan ke admin (ganoolmovie5th@gmail.com)
  └─ Upload artifact scraper_report.json

Job 2: auto_updater.py (setelah Job 1)
  ├─ Download artifact scraper_report.json dari Job 1
  ├─ Filter: reliability=HIGH + source ∈ {tiket.com, loket.com, songkick.com, bandwagon.asia}
  ├─ Generate JS concert entries
  ├─ Inject ke app.js (sebelum penutup CONCERTS array)
  ├─ Commit ke branch auto-update/concerts-YYYYMMDD-HHMM
  └─ Create PR otomatis ke main (dengan checklist review)
```

### HIGH Confidence Sources
`tiket.com` · `loket.com` · `songkick.com` · `bandwagon.asia`

### confirmStatus Logic
- tiket.com / loket.com / songkick.com / bandwagon.asia → `"confirmed"`
- Lainnya → `"rumor"`

### Branch Naming
`auto-update/concerts-YYYYMMDD-HHMM`

### Manual Trigger
Actions → 🎵 Daily Concert Monitor & Auto-PR → Run workflow

---

## Email Systems

| Feature | Service | Email | Config |
|---|---|---|---|
| Newsletter | Mailchimp API | Mailchimp managed | Vercel env vars |
| Scraper Report | Gmail SMTP | `ganoolmovie5th@gmail.com` | GitHub Secrets |
| Kritik & Saran | EmailJS | `listconcerttour@gmail.com` | Hardcoded (intentional) |

**EmailJS:** Service `service_lq3pvsq`, Template `template_w8grsoa` — recipient `listconcerttour@gmail.com` dibiarkan (intentional, tidak perlu diubah)

---

## Performance (index.html)

- **Critical CSS** di-inline di `<style>` dalam `<head>` — above-the-fold styles
- **Full CSS** load via `<link rel="stylesheet" href="style.min.css">`
- **Google Fonts** load via `media="print" onload` trick — non-blocking
- **EmailJS** load via `defer` attribute
- **Semua JS** di akhir `<body>` — tidak blocking render

---

## Supabase

**Project URL:** `https://crtqxgsruywurdlcsjfp.supabase.co`  
**Publishable Key:** `sb_publishable_G9oVhoD74guR61dZ755SYw_QwcrRKmc`  
**Auth:** Anonymous — device UID dari localStorage (`cid_uid`)

### Tabel
| Tabel | Dipakai oleh |
|---|---|
| `concert_votes` | features.js — Going/Interested |
| `discussions` | features.js — Diskusi/Komentar |
| `reviews` | reviews.js — Review & Rating |
| `ticket_market` | features3.js — Forum Jual Beli |
| `group_buying` | features3.js — Cari Teman Nonton |
| `fan_photos` | features.js — Foto dari Fans |

### Storage
- Bucket: `fan-photos` (Public)
- Upload: `Storage.upload(bucket, path, blob)` — wajib set `Content-Type` pada blob
- `Storage.upload` pakai `fetch` langsung (bukan `_fetch`) karena butuh `Content-Type` custom

### Catatan Teknis
- Going/Interested: query pakai **`select=type,device_uid`** — wajib agar `myVote` terbaca
- Fallback localStorage keys: `cid_going`, `cid_interest`, `cid_myvote` (identik dengan mobile)
- Past konser: fetch Supabase async, fallback dummy jika count = 0

---

## LocalStorage Keys

| Key | Dipakai oleh |
|---|---|
| `cid_uid` | Semua — device UID persistent |
| `cid_reviews` | reviews.js — fallback review |
| `cid_discussions` | features.js — fallback diskusi |
| `cid_ugc` | features.js — fallback foto fans |
| `cid_going` / `cid_interest` / `cid_myvote` | features.js — fallback Going/Interested |
| `cid_ticket_market` | features3.js — fallback TicketMarket |
| `cid_group_buying` | features3.js — fallback GroupBuying |
| `cid_harga_alert` | features2.js — Harga Alert budget |
| `cid_lang` | features3.js — bahasa (id/en) |
| `cid_wishlist` | app.js — wishlist konser |

---

## Security Headers (vercel.json)

- **CSP `connect-src`:** google-analytics.com, analytics.google.com, region1.google-analytics.com, stats.g.doubleclick.net, www.google.com, api.emailjs.com, api.setlist.fm, crtqxgsruywurdlcsjfp.supabase.co, cloudflareinsights.com
- **CSP `script-src`:** 'self' 'unsafe-inline' googletagmanager.com, cdn.jsdelivr.net, static.cloudflareinsights.com
- **COOP:** same-origin-allow-popups
- **HSTS:** max-age=63072000; includeSubDomains; preload
- Cache images: `public, max-age=31536000, immutable`

---

## Environment Variables (Vercel Dashboard)

| Variable | Keterangan |
|---|---|
| `MAILCHIMP_API_KEY` | API key Mailchimp |
| `MAILCHIMP_LIST_ID` | Audience ID Mailchimp |
| `MAILCHIMP_SERVER` | Prefix saja, contoh: `us20` |

---

## GitHub Secrets (Scraper)

| Secret | Keterangan |
|---|---|
| `GMAIL_APP_PASSWORD` | App Password dari `ganoolmovie5th@gmail.com` |
| `ADMIN_EMAIL` | Email tujuan laporan (default: `ganoolmovie5th@gmail.com`) |

---

## EmailJS — Kritik & Saran

- Service ID: `service_lq3pvsq` | Template ID: `template_w8grsoa`
- Public key: `Ph1AuCpm4gbC6zMw6`
- Foto: field `photo_data` (base64 murni, tanpa prefix `data:image/...`)
- Field `has_photo`: `'ya'` atau `'tidak'`
- Recipient: `listconcerttour@gmail.com` — **dibiarkan intentional, jangan diubah**

---

## SEO

- **JSON-LD Event Schema** — auto-inject via `injectEventSchemas()` di `app.js` saat DOMContentLoaded
- **Sitemap:** 1 URL saja (`https://www.list-concert-tour.web.id`) — jangan tambah URL baru
- **Google Search Console** sudah terverifikasi
- **GA4:** `G-DFKHWJ3TJZ`

---

## Keputusan Desain Penting

### openModal patch chain (urutan wajib)
1. `app.js` — render dasar + inject maps/share/price
2. `features.js` — inject going/interested, spotify, review, diskusi, UGC
3. `features3.js` — inject setlist, price converter
4. `features4.js` — inject setlist.fm live

### Heading hierarchy (accessibility)
- `h1` → hero title (hanya 1 di halaman)
- `h2` → section headers (Jadwal Konser, Highlights, Panduan, Venue, Tentang, dll)
- `h3` → sub-section di dalam modal/panel (Diskusi, Review, Setlist, dll)
- Jangan skip level

### Contrast colors (WCAG AA)
- `--text-muted: #9ca3af` — untuk teks sekunder
- `--text-sub: #c4c4cc` — untuk teks tertier
- `#d8b4fe` — warna aksen ungu
- `#86efac` — warna hijau affordable badge
- `#fde68a` — warna kuning rumor/luxury

### Fitur yang Dihapus
- **TicketAlert** (features3.js) — dihapus Juni 2026, localStorage-only, tidak ada email backend

---

## PWA & Download App

- **PWA:** `manifest.json` + `sw.js` (Stale-While-Revalidate) — install ke homescreen via browser
- **Auto-reload:** SW detect perubahan file → postMessage → reload otomatis (tidak perlu incognito)
- **Section Download:** 2 card side by side (Android | iOS) di `index.html`
  - Android: badge "✅ Available", tombol download APK aktif
  - iOS: badge "Coming Soon", tombol disabled
- **APK:** hosted di GitHub Releases `list-concert-tour-mobile-claude` → `ConcertID.apk`
- **Auto-build APK:** GitHub Actions `.github/workflows/build-apk.yml` di mobile repo

---

## Hal yang TIDAK Perlu Dilakukan
- Jangan buat PR — push langsung ke main
- Jangan buat halaman/URL baru — website tetap 1 page SPA
- Jangan tambah URL ke sitemap.xml kecuali homepage
- Jangan deploy ulang tanpa test lokal dulu
- Jangan baca seluruh repo — baca file yang relevan saja

---

## Sync dengan Mobile (saat update data konser)

Ketika CONCERTS array di `app.js` diupdate, sync ke mobile:

| Item | File Mobile | Cara |
|---|---|---|
| CONCERTS | `src/data/concerts.ts` | Copy + format TypeScript |
| ARTIST_IMAGES | `src/data/concerts.ts` | URL: `https://www.list-concert-tour.web.id/images/[id].jpeg` |
| ARTIST_SOCIALS | `src/data/concerts.ts` | Pastikan handles konsisten |
| SETLISTS | `src/data/concerts.ts` | Copy paste |
| SPOTIFY_ARTISTS | `src/data/concerts.ts` | Copy paste |
| Venue list (MoreScreen) | `src/screens/MoreScreen.tsx` | Harus identik dengan venues di `index.html` |
