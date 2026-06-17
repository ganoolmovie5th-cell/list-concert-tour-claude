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

## Catatan Perubahan Penting (ringkas)

- **Juni 2026:** Tambah internal links untuk SEO di `index.html` (paths: `/jadwal`, `/artis`, `/venue`, `/kategori`, plus footer `/tentang`, `/sumber-data`, `/kontak`).
- **Juni 2026:** Update `robots.txt` untuk disallow `manifest.json` + `/*.json$` dan set sitemap ke homepage.

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
| `app.min.js` | Minified (auto-generated) |
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
