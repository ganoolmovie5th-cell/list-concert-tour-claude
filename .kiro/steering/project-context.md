# ConcertID — Project Context & Conventions

## Overview
Website jadwal konser internasional di Indonesia 2025–2027.
- **Live:** https://www.list-concert-tour.web.id
- **Repo:** ganoolmovie5th-cell/list-concert-tour-claude
- **Hosting:** Vercel (static site + serverless function)
- **Database:** Supabase (project: list-concert-tour-web-n-mobile-claude)

---

## Git Workflow
- **Selalu push langsung ke `main`** — tidak perlu buat PR
- Gunakan `push_to_remote` tool dengan `remote_branch_name: "main"` dan `force_with_lease: true`
- Sebelum push update tracking ref: `echo "<last_remote_sha>" > .git/refs/remotes/origin/main`

---

## Struktur File Penting

| File | Fungsi |
|---|---|
| `app.js` | Data konser (CONCERTS array) + render cards, modal, filter, wishlist, share |
| `style.css` | Semua styling — dark/light mode, responsive |
| `supabase.js` | Supabase client: `DB.select/insert/update/delete`, `Storage.upload`, `getDeviceUID()` |
| `reviews.js` | Review & Rating — Supabase primary, localStorage fallback |
| `features.js` | Going/Interested, Sort, Google Calendar, Social Media, Diskusi, UGC/Foto Fans |
| `features2.js` | Calendar View, Advanced Search, Harga Alert, Spotify Integration |
| `features3.js` | I18n, TicketAlert, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm |
| `features4.js` | Setlist.fm, NewConcertNotif, TipsArticle |
| `supabase_schema.sql` | Schema 6 tabel — jalankan di Supabase SQL Editor |
| `api/subscribe.js` | Vercel Serverless — proxy Mailchimp API v3 (CommonJS) |
| `index.html` | Script loading order wajib: **supabase.js** → app.js → reviews.js → features.js → features2.js → features3.js → features4.js |
| `vercel.json` | CSP headers — include `crtqxgsruywurdlcsjfp.supabase.co` di connect-src |

---

## Supabase

**Project URL:** `https://crtqxgsruywurdlcsjfp.supabase.co`  
**Publishable Key:** `sb_publishable_G9oVhoD74guR61dZ755SYw_QwcrRKmc`  
**Auth:** Anonymous — pakai device UID dari localStorage (`cid_uid`)

### Tabel
| Tabel | Dipakai oleh |
|---|---|
| `concert_votes` | SocialFeatures (Going/Interested) |
| `discussions` | Discussion (Diskusi/Komentar) |
| `reviews` | ConcertReviews (Review & Rating) |
| `ticket_market` | TicketMarket (Forum Jual Beli) |
| `group_buying` | GroupBuying (Cari Teman Nonton) |
| `fan_photos` | UGC (Foto dari Fans) |

### Storage
- Bucket: `fan-photos` (Public)
- Upload: `Storage.upload(bucket, path, blob)`

### Strategi
- **Supabase = primary** — sync antar semua device & platform
- **localStorage = fallback** — tetap berfungsi jika offline/error

---

## Environment Variables (Vercel Dashboard)

| Variable | Nilai |
|---|---|
| `MAILCHIMP_API_KEY` | API key Mailchimp |
| `MAILCHIMP_LIST_ID` | Audience ID Mailchimp |
| `MAILCHIMP_SERVER` | Prefix saja, contoh: `us20` (BUKAN URL lengkap) |

---

## EmailJS — Kritik & Saran
- Service ID: `service_lq3pvsq` | Template ID: `template_w8grsoa`
- Foto dikirim sebagai field **`photo_data`** (base64 murni, tanpa prefix)
- Field **`has_photo`**: `'ya'` atau `'tidak'`
- Template EmailJS (sudah di-save & berfungsi):
  ```html
  {{#if has_photo}}
  <img src="data:image/jpeg;base64,{{photo_data}}" style="max-width:500px;" />
  {{/if}}
  ```

---

## LocalStorage Keys

| Key | Dipakai oleh |
|---|---|
| `cid_uid` | Semua — device UID persistent (owner check) |
| `cid_reviews` | reviews.js — fallback review |
| `cid_discussions` | features.js — fallback diskusi |
| `cid_ugc` | features.js — fallback foto fans |
| `cid_going` / `cid_interest` / `cid_myvote` | features.js — fallback Going/Interested |
| `cid_ticket_market` | features3.js — fallback TicketMarket |
| `cid_group_buying` | features3.js — fallback GroupBuying |
| `cid_ticket_alerts` | features3.js — TicketAlert budget |
| `cid_harga_alert` | features2.js — Harga Alert budget |
| `cid_fb_rl` | features3.js — rate limit Kritik & Saran |
| `cid_lang` | features3.js — bahasa (id/en) |
| `cid_wishlist` | app.js — wishlist konser |

---

## Keputusan Desain Penting

### uid per posting (TicketMarket & GroupBuying)
- `post_uid` = `genPostUID()` — unik setiap post baru (tidak sama antar post)
- `owner_uid` = `getDeviceUID()` — device UID persistent, untuk cek kepemilikan
- Hapus/edit hanya bisa oleh pemilik: `p.ownerUid === getDeviceUID()`

### openModal patch chain (urutan wajib)
1. `app.js` — render dasar + inject maps/share/price
2. `features.js` — inject going/interested, spotify, review, diskusi, UGC
3. `features3.js` — inject setlist, price converter, ticket alert
4. `features4.js` — inject setlist.fm live

### Advanced Search
- `AdvancedSearch.setVisible(true)` wajib dipanggil sebelum `apply()` dari luar (HargaAlert)
- `reset()` mempertahankan state open/close panel

### TicketMarket tabs
- Setelah markSold/delete, tab yang aktif dipertahankan
- `switchTab()` sekarang async (fetch dari Supabase)

### CSP (vercel.json)
- `frame-src`: google.com, maps.google.com, open.spotify.com
- `connect-src`: api.emailjs.com, api.setlist.fm, crtqxgsruywurdlcsjfp.supabase.co
- `form-action`: self (Mailchimp via serverless)

---

## Hal yang TIDAK Perlu Dilakukan
- Jangan buat PR — push langsung ke main
- Jangan deploy ulang tanpa test
- Jangan baca seluruh repo — baca file yang relevan saja
- Jangan batch banyak task dalam 1 request
