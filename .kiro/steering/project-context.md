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

## Source of Truth

- **`app.js`** = source of truth data konser (CONCERTS array, 37 entries)
- **Mobile `concerts.ts`** selalu sync dari `app.js` — jangan edit data konser di mobile secara manual
- **Images** tersimpan di `/images/[id].jpeg` — dipakai langsung oleh web, mobile pakai URL `https://www.list-concert-tour.web.id/images/[id].jpeg`

---

## Struktur File Penting

| File | Fungsi |
|---|---|
| `index.html` | Single-page utama — critical CSS inline, fonts non-blocking |
| `app.js` | Data konser (37 entries) + render + filter + JSON-LD schema inject |
| `app.min.js` | Minified (auto-generated via minify.py) |
| `style.css` | Semua styling — dark/light mode, responsive |
| `style.min.css` | Minified CSS (auto-generated) |
| `supabase.js` | Supabase REST client: `DB.*`, `Storage.upload`, `getDeviceUID()` |
| `reviews.js` | Review & Rating — Supabase primary, localStorage fallback |
| `features.js` | Going/Interested, Sort, Google Calendar, Diskusi, UGC/Foto Fans |
| `features2.js` | Calendar View, Advanced Search, Harga Alert, Spotify |
| `features3.js` | I18n, TicketAlert, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm |
| `features4.js` | Setlist.fm, NewConcertNotif, TipsArticle |
| `supabase_schema.sql` | Schema 6 tabel — jalankan di Supabase SQL Editor |
| `api/subscribe.js` | Vercel Serverless — proxy Mailchimp API v3 (CommonJS) |
| `vercel.json` | Security headers (CSP, COOP, HSTS) + Cache headers |
| `sitemap.xml` | Sitemap — 1 URL saja (homepage) |

### Script loading order di `index.html` (wajib urutan ini):
```
supabase.min.js → app.min.js → reviews.min.js → features.min.js → features2.min.js → features3.min.js → features4.min.js
```

---

## Performance (index.html)

- **Critical CSS** di-inline di `<style>` dalam `<head>` — above-the-fold styles
- **Full CSS** load via `<link rel="stylesheet" href="style.min.css">` — blocking tapi ok karena critical sudah inline
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
| `cid_ticket_alerts` | features3.js — TicketAlert budget |
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
| `GMAIL_APP_PASSWORD` | Gmail App Password 16 karakter |
| `ADMIN_EMAIL` | Email tujuan laporan |

---

## EmailJS — Kritik & Saran

- Service ID: `service_lq3pvsq` | Template ID: `template_w8grsoa`
- Public key: `Ph1AuCpm4gbC6zMw6`
- Foto: field `photo_data` (base64 murni, tanpa prefix `data:image/...`)
- Field `has_photo`: `'ya'` atau `'tidak'`

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
3. `features3.js` — inject setlist, price converter, ticket alert
4. `features4.js` — inject setlist.fm live

### Heading hierarchy (accessibility)
- `h1` → hero title (hanya 1 di halaman)
- `h2` → section headers (Jadwal Konser, Highlights, Panduan, Venue, Tentang, dll)
- `h3` → sub-section di dalam modal/panel (Diskusi, Review, Setlist, dll)
- Jangan skip level — `h4` sudah diganti `h3` di semua features*.js

### Contrast colors (WCAG AA)
- `--text-muted: #9ca3af` — untuk teks sekunder
- `--text-sub: #c4c4cc` — untuk teks tertier
- `#d8b4fe` — warna aksen ungu (bukan `#c084fc` yang terlalu gelap)
- `#86efac` — warna hijau affordable badge
- `#fde68a` — warna kuning rumor/luxury

---

## Hal yang TIDAK Perlu Dilakukan
- Jangan buat PR — push langsung ke main
- Jangan buat halaman/URL baru — website tetap 1 page SPA
- Jangan tambah URL ke sitemap.xml kecuali homepage
- Jangan deploy ulang tanpa test lokal dulu
- Jangan baca seluruh repo — baca file yang relevan saja
