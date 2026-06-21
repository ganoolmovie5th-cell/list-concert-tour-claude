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
- Setelah edit JS: `npx terser <file>.js --compress --output <file>.min.js` (**TANPA --mangle**)
- Setelah edit CSS: `npx clean-css-cli -o style.min.css style.css`
- **JANGAN** pakai Python minifier atau terser dengan `--mangle` — akan break global function names

---

## Commit Convention (WAJIB setiap commit)

Setiap commit HARUS update `README.md` + `.kiro/steering/project-context.md`.

```
<type>: <deskripsi singkat>

Files: <file yang diubah selain README & steering>
```

**Type:** `feat` `fix` `remove` `perf` `a11y` `seo` `sync` `chore` `docs` `ci`

---

## Catatan Perubahan Penting (ringkas)

- **Juni 2026 (perf):** PageSpeed — hapus double Google Analytics. `gtag.js` GA4 (`G-8NNHBT6N8Q`) + `gtag('config')` dihapus dari `index.html`; GA4 dimuat via GTM container (`GTM-NG5XKT8T`) saja → hemat ~375 KiB unused JS. **Consent Mode v2 default dipindah ke ATAS sebelum GTM** (wajib agar consent dihormati). ⚠️ Pastikan tag GA4 Configuration aktif di GTM, kalau tidak GA4 berhenti terkumpul.
- **Juni 2026 (perf):** 7 script `*.min.js` (`supabase→app→reviews→features→features2→features3→features4`) diberi `defer` — `defer` mempertahankan urutan eksekusi jadi script loading order tetap aman.
- **Juni 2026 (perf):** `style.min.css` jadi non-blocking via `media="print" onload="this.media='all'"` + `<noscript>` fallback (critical CSS tetap inline) → hilangkan render-block ~320ms.
- **Juni 2026 (perf):** `images/hammersonic-2026.jpeg` recompress q72 progressive 24.7→17.3 KiB. Nama file & format SAMA (.jpeg) → tidak perlu sync URL ke mobile.
- **Juni 2026 (a11y):** Kontras light-mode — badge pakai warna pastel (didesain dark bg) jatuh ~1.0-1.8:1 di light mode. Tambah blok override `html.light .badge-*` (genre/status/premium/luxury/hot/affordable/new-concert/going-count/dl-av/setlist/btn-rumor) → fill pale (alpha .12) + teks 700/800-shade, semua ≥4.5:1. **Dark mode tidak diubah.**
- **Juni 2026 (a11y/perf):** Web Interface Guidelines audit (Vercel) — (a11y) hapus 15× `outline:none` tanpa pengganti fokus + tambah ring `:focus-visible` global di awal `style.css` (`:focus-visible{outline:2px solid rgba(168,85,247,.9);outline-offset:2px}` + `:focus:not(:focus-visible){outline:none}`) agar fokus keyboard terlihat tapi mouse-click tetap bersih; (perf) ganti 29× `transition:all` → properti eksplisit (color/background-color/border-color/box-shadow/transform/opacity, durasi & easing asli dipertahankan, compositor-friendly); (typo) `...`→`…` pada teks tampilan `index/about/contact/jadwal/konser/rumor/analytics.html` — **spread operator JS (`...`) di dalam `<script>` dilindungi & tidak diubah**. `style.min.css` di-regenerate via `npx clean-css-cli` (BUKAN hand-edit).

- **Juni 2026 (fix):** Countdown timer bug — semua konser menunjukkan jam:menit:detik yang sama karena `getCountdown()` hanya pakai `rawDate` (midnight UTC). Fix: tambah `getConcertDateTime(c)` yang parse `c.time` (e.g. "19:30 WIB") dan combine dengan `rawDate` untuk target waktu konser sebenarnya.
- **Juni 2026 (fix):** Stats counter mismatch — `confirmedCount` filter `!isPast(c)` menyebabkan 18 konser confirmed yang sudah lewat tidak terhitung (13+13≠44). Fix: hapus filter `!isPast`, hitung semua confirmed.
- **Juni 2026 (seo):** Canonical tags — `about.html`, `contact.html`, `konser.html`, `jadwal.html`, `rumor.html` canonical diubah dari `/#about`, `/#concerts` → `https://www.list-concert-tour.web.id/` (homepage tanpa hash) untuk hindari duplicate content di Google.
- **Juni 2026 (seo):** Sitemap cleanup — hapus 5 duplicate redirect URLs dari `sitemap.xml` (about.html, contact.html, konser.html, jadwal.html, rumor.html) → hanya 1 URL homepage tersisa.
- **Juni 2026 (seo/fix):** JSON-LD `eventStatus` invalid — `injectEventSchemas()`→`eventStatusUrl()` memakai `https://schema.org/EventEnded` untuk konser lewat. `EventEnded` BUKAN nilai valid di enum `eventStatus` schema.org/Google (valid: EventScheduled, EventCancelled, EventMovedOnline, EventPostponed, EventRescheduled) → Google abaikan field. Fix: return `EventScheduled` untuk semua (Google deteksi event lewat via startDate/endDate), tambah mapping `confirmStatus==='cancelled'→EventCancelled`, `'postponed'→EventPostponed`. Diverifikasi via Playwright: 44/44 event punya eventStatus valid. **44 Event di-nest dalam `CollectionPage.hasPart`** (catatan struktur untuk dev mobile/SEO).
- **Juni 2026:** Tambah Playwright E2E smoke tests + GitHub Actions workflow.
- **Juni 2026 (feat):** Social Proof Going Count on Cards — `app.js` (`initGoingCountOnCards`): fetch semua `concert_votes` dalam 1 call, inject `.going-count-badge` ke setiap card.
- **Juni 2026 (feat):** Venue Seat Map — `app.js` (`VENUE_SEAT_MAPS`, `renderSeatMapHtml`): denah + tips kategori kursi di modal, 7 venue utama.
- **Juni 2026 (feat):** Concert Playlist — `app.js` (`renderPlaylistHtml`): tombol Buka Playlist Spotify di modal.
- **Juni 2026 (feat):** In-App Chat — `features3.js` (`InAppChat`): chat per Group Buying post, polling 10s.
- **Juni 2026 (fix):** `normalize()` function hilang dari source → `injectEventSchemas()` throw → `renderCards()` tidak pernah dipanggil → website blank. Fix: tambah `normalize()` di `buildPerformers()` + try-catch `injectEventSchemas`.
- **Juni 2026 (fix):** `patchGroupBuyingWithChat` tidak `return` HTML → `GroupBuying.render()` return `undefined` → `innerHTML = undefined` → text "undefined" muncul di halaman. Root cause sebenarnya dari bug "undefined" berbulan-bulan.
- **Juni 2026 (fix):** `GroupBuying.fetchPosts` & `TicketMarket.fetchPosts`: tambah fallback `r.name||'Anonim'`, `r.contact||''`, `r.type||'jual'` di mapRow.
- **Juni 2026 (fix):** DOMContentLoaded: `renderCards(CONCERTS)` → `applyFilters()` agar konser muncul tersortir sejak load pertama.
- **Juni 2026 (fix):** `renderCards` noResult: pesan kontekstual — wishlist kosong tampilkan "❤️ Wishlist kamu masih kosong..." bukan pesan generic.
- **Juni 2026 (fix):** `renderHighlights`: prioritaskan `hot:true` dulu, tambah null guard, show 6 items.
- **Juni 2026 (fix):** ServiceWorker `v17→v18`: HTML pages (`/`, `/*.html`) → Network First strategy. Hapus `/` dan `/index.html` dari STATIC_ASSETS. Fix: user tidak perlu buka browser baru untuk lihat perubahan.
- **Juni 2026 (fix):** `vercel.json`: tambah `Cache-Control: no-store` untuk `/` dan `/*.html` (Cloudflare tidak cache HTML). Tambah 6 route redirect files (`artis.html`, `venue.html`, `kategori.html`, `tentang.html`, `sumber-data.html`, `kontak.html`).
- **Juni 2026 (remove):** Hapus `<nav class="quick-nav">` (5 anchor links) dari `index.html`.
- **Juni 2026 (remove):** Hapus `nav-links` tambahan dari navbar: Jadwal Lengkap, Daftar Artis, Venue Populer, Kategori Konser.
- **Juni 2026 (remove):** Hapus `footer-mini-links` (Tentang/Sumber Data/Kontak) dan kolom "Internal" di footer.
- **Juni 2026 (fix):** Minifikasi: selalu pakai `terser --compress` (tanpa `--mangle`) + `clean-css`. Pernah break website karena mangle.

---

## Auto-Sync ke Mobile (WAJIB saat ada perubahan di web)

| Perubahan di Web | Yang Harus Disync ke Mobile | File Mobile |
|---|---|---|
| Tambah/edit/hapus konser di `app.js` | CONCERTS array | `src/data/concerts.ts` |
| Tambah/edit gambar di `ARTIST_IMAGES` | ARTIST_IMAGES | `src/data/concerts.ts` |
| Edit social media handles | ARTIST_SOCIALS | `src/data/concerts.ts` |
| Edit/tambah setlist | SETLISTS | `src/data/concerts.ts` |
| Edit Spotify artist IDs | SPOTIFY_ARTISTS | `src/data/concerts.ts` |
| Tambah/edit venue di `index.html` | Venue list | `src/screens/MoreScreen.tsx` |
| Update Supabase URL/key | Supabase config | `src/lib/supabase.ts` |
| Fix bug Supabase query | Query identik | hook relevan di `src/hooks/` |

---

## Source of Truth

- **`app.js`** = source of truth data konser (**44 entries** per Juni 2026)
- **Mobile `concerts.ts`** selalu sync dari `app.js`
- **Images** tersimpan di `/images/[id].jpeg` — mobile pakai URL `https://www.list-concert-tour.web.id/images/[id].jpeg`

---

## Minifikasi (WAJIB cara ini)

```bash
# JS — WAJIB tanpa --mangle agar global function names tidak berubah
npx terser app.js --compress --output app.min.js
npx terser features.js --compress --output features.min.js
# dst untuk features2, features3, features4

# CSS
npx clean-css-cli -o style.min.css style.css
```

---

## Supabase Tables

```sql
-- In-App Chat untuk Group Buying
CREATE TABLE IF NOT EXISTS gb_chat (
  id bigserial PRIMARY KEY, msg_uid text UNIQUE, post_uid text NOT NULL,
  sender_uid text, sender_name text, message text, created_at timestamptz DEFAULT now()
);

-- Concert Check-in (mobile only)
CREATE TABLE IF NOT EXISTS concert_checkins (
  id bigserial PRIMARY KEY, concert_id text NOT NULL, device_uid text NOT NULL,
  checked_in_at timestamptz, lat float8, lng float8, verified boolean DEFAULT false,
  UNIQUE(concert_id, device_uid)
);
```

---

## Struktur File Penting

| File | Fungsi |
|---|---|
| `index.html` | Single-page utama — critical CSS inline |
| `app.js` | Data konser (44 entries) + render + filter + Going badge + Venue SeatMap + Playlist |
| `style.css` | Semua styling termasuk `.going-count-badge`, `.seat-map-section`, `.playlist-section`, `.iap-*` |
| `sw.js` | Service Worker v18 — Network First untuk HTML, Stale-While-Revalidate untuk JS/CSS |
| `features.js` | Going/Interested, Sort, Diskusi, UGC — inject ke modal via `openModal` patch |
| `features3.js` | GroupBuying, TicketMarket, InAppChat — **mapRow WAJIB punya fallback `\|\|'Anonim'`** |
| `vercel.json` | Security headers + `no-store` untuk HTML + rewrites untuk semua routes |
| `*.html` redirect files | `artis.html`, `venue.html`, `kategori.html`, `tentang.html`, `sumber-data.html`, `kontak.html` |

### Script loading order (jangan ubah urutan):
```
supabase.min.js → app.min.js → reviews.min.js → features.min.js → features2.min.js → features3.min.js → features4.min.js
```

---

## Bug Patterns yang Pernah Terjadi (jangan diulang)

| Bug | Penyebab | Fix |
|---|---|---|
| Website blank | `normalize()` undefined → `injectEventSchemas` throw → block DOMContentLoaded | try-catch + define normalize() |
| Text "undefined" di modal | `patchGroupBuyingWithChat` tidak `return html` | `const html = _origRender(...); return html;` |
| Website tidak bisa diklik | Python minifier strip URL `//` | Pakai `npx terser --compress` |
| Perubahan tidak terlihat | SW serve cached HTML | SW v18 network-first untuk HTML |
| Global function hilang | terser `--mangle` rename global vars | Pakai `--compress` SAJA |
