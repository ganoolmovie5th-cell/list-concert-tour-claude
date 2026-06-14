# ConcertID — Project Context & Conventions

## Overview
Website jadwal konser internasional di Indonesia 2025–2027.
- **Live:** https://www.list-concert-tour.web.id
- **Repo:** ganoolmovie5th-cell/list-concert-tour-claude
- **Hosting:** Vercel (static site + serverless function)

---

## Git Workflow
- **Selalu push langsung ke `main`** — tidak perlu buat PR, user tidak mau review PR
- Untuk push gunakan `push_to_remote` tool dengan `remote_branch_name: "main"` dan `force_with_lease: true`
- Sebelum push, update tracking ref: `echo "<last_remote_sha>" > .git/refs/remotes/origin/main`
- Commit message: singkat dan deskriptif dalam bahasa Indonesia atau Inggris

---

## Struktur File Penting

| File | Fungsi |
|---|---|
| `app.js` | Data konser (array CONCERTS) + render cards, modal, filter, wishlist, share |
| `style.css` | Semua styling — dark/light mode, responsive |
| `reviews.js` | Sistem review & rating (localStorage `cid_reviews`) |
| `features.js` | Going/Interested, Sort, Google Calendar, Social Media, Diskusi, UGC |
| `features2.js` | Calendar View, Advanced Search, Harga Alert, Spotify Integration |
| `features3.js` | I18n, TicketAlert, PriceConverter, BeenThere, GroupBuying, TicketMarket, FeedbackForm |
| `features4.js` | Setlist.fm, NewConcertNotif, TipsArticle |
| `api/subscribe.js` | Vercel Serverless Function — proxy Mailchimp API v3 (CommonJS) |
| `index.html` | Entry point — script loading order wajib: app.js → reviews.js → features.js → features2.js → features3.js → features4.js |
| `vercel.json` | Headers CSP + serverless function config |

---

## Environment Variables (Vercel Dashboard)

| Variable | Nilai |
|---|---|
| `MAILCHIMP_API_KEY` | API key Mailchimp |
| `MAILCHIMP_LIST_ID` | Audience ID Mailchimp |
| `MAILCHIMP_SERVER` | Prefix server saja, contoh: `us20` (BUKAN URL lengkap) |

---

## EmailJS — Kritik & Saran

- Service ID: `service_lq3pvsq`
- Template ID: `template_w8grsoa`
- Public Key: di-init di `index.html`
- Foto dikirim sebagai base64 murni di field **`photo_data`** (tanpa prefix `data:image/...`)
- Template EmailJS harus punya:
  ```html
  {{#if has_photo}}
  <img src="data:image/jpeg;base64,{{photo_data}}" style="max-width:500px;width:100%;" />
  {{/if}}
  ```
- **Template sudah di-save dan berfungsi dengan benar**

---

## LocalStorage Keys

| Key | Dipakai oleh |
|---|---|
| `cid_reviews` | reviews.js — review & rating |
| `cid_ugc` | features.js — foto dari fans |
| `cid_going` / `cid_interest` / `cid_myvote` | features.js — Going/Interested counter |
| `cid_ticket_alerts` | features3.js — TicketAlert |
| `cid_ticket_market` | features3.js — TicketMarket |
| `cid_group_buying` | features3.js — GroupBuying/Cari Teman |
| `cid_harga_alert` | features2.js — Harga Alert budget |
| `cid_uid` | Semua — UID perangkat (persistent, untuk cek kepemilikan post) |
| `cid_fb_rl` | features3.js — rate limit Kritik & Saran |
| `cid_lang` | features3.js — bahasa (id/en) |

---

## Keputusan Desain Penting

### Forum Jual Beli Tiket & Cari Teman Nonton
- Setiap post punya `uid` unik per posting (`genPostUID()` = random baru setiap post)
- Kepemilikan post dicek via `ownerUid` (`getOwnerUID()` = uid perangkat dari `cid_uid`)
- Hapus/edit hanya bisa oleh pemilik post (cek `p.ownerUid === getOwnerUID()`)
- Kontak **tidak diekspos** — hanya tampil emoji 💬 (WA) dan 📷 (IG)
- TicketMarket: tab Jual/Cari dipertahankan setelah markSold/delete

### openModal patch chain
- `app.js` patch openModal 2x (render dasar + inject maps/share)
- `features.js` patch lagi (inject going/interested, spotify, review, diskusi, dll)
- `features4.js` patch lagi (inject setlist.fm)
- Urutan ini WAJIB — jangan ubah script loading order

### Advanced Search
- `AdvancedSearch.setVisible(true)` harus dipanggil sebelum `apply()` dari luar (contoh: dari HargaAlert)
- `reset()` mempertahankan state `open/close` panel

### CSP (vercel.json)
- `frame-src`: google.com, maps.google.com, open.spotify.com
- `connect-src`: api.emailjs.com, api.setlist.fm (tidak perlu imgbb lagi)
- `form-action`: self saja (Mailchimp ditangani via serverless function)

---

## Hal yang TIDAK Perlu Dilakukan
- Jangan buat PR — push langsung ke main
- Jangan deploy ulang tanpa test perubahan terlebih dahulu
- Jangan batch banyak task dalam 1 request
- Jangan baca seluruh repo jika tidak perlu — baca file yang relevan saja
