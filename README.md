# ConcertID

Jadwal konser internasional di Indonesia 2025-2027. Lengkap dengan label Confirmed vs Rumor, social features, dan auto-update harian via scraper.

**Tech Stack:** HTML · CSS · JavaScript (vanilla) · Supabase · Vercel · Python (scraper)

**Live:** [list-concert-tour.web.id](https://www.list-concert-tour.web.id)

## Features

- 44 konser (artis, tanggal, venue, jam, harga tiket)
- Status Confirmed / Rumor / Past
- Search & filter (artis, genre, status, harga, bulan, kota)
- Dark/Light mode (localStorage)
- Wishlist (simpan favorit tanpa akun)
- Countdown timer per konser
- Share (WhatsApp, Telegram, Instagram, copy link)
- Google Calendar integration
- Venue Maps (embed Google Maps)
- Spotify Preview (musik artis di modal)
- Going / Interested (sync Supabase real-time)
- Review & Rating (sync Supabase)
- Diskusi / komentar per konser (sync Supabase)
- Forum Jual Beli Tiket (sync Supabase)
- Cari Teman Nonton + In-App Chat (sync Supabase)
- Foto dari Fans (upload ke Supabase Storage)
- Setlist.fm integration
- Weather Forecast (Open-Meteo API)
- Parking info per venue
- Story Card Generator (download PNG untuk IG)
- Fan Meetup Map (crowdsourced meetup points)
- Newsletter (Mailchimp via Vercel Serverless)
- PWA (install di homescreen, offline support)
- SEO (JSON-LD Event schema, sitemap, robots.txt)
- E2E testing (Playwright, 12 assertions)
- Scraper harian (GitHub Actions, 10 sumber) + auto-update PR

## Getting Started

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

Deploy otomatis ke Vercel.

## Project Structure

```
index.html          → Single-page app utama
app.js              → Data konser (44 entries) + logika utama + JSON-LD
style.css           → Styling (dark/light, responsive)
supabase.js         → Supabase REST client
reviews.js          → Review & Rating
features.js         → Going, Diskusi, Foto Fans
features2.js        → Calendar View, Advanced Search, Harga Alert, Spotify
features3.js        → GroupBuying, TicketMarket, Feedback
features4.js        → Setlist.fm, Tips & Artikel
features5.js        → Weather, Parking, Story Card, Fan Meetup
sw.js               → Service Worker (PWA)
supabase_schema.sql → Database schema
scraper.py          → Monitoring 10 sumber konser
auto_updater.py     → Filter HIGH confidence, inject ke app.js
api/subscribe.js    → Vercel Serverless (Mailchimp)
tests/              → Playwright E2E tests
.github/workflows/  → Scraper harian + E2E CI
```

## License

MIT
