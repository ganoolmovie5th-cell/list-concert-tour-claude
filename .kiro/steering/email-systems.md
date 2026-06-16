# 📧 Email Systems — All Platforms & Features

> Dokumentasi lengkap semua fitur yang menggunakan email di website & backend

---

## 📊 Overview

| Platform | Feature | Purpose | Email Used | Status |
|----------|---------|---------|-----------|--------|
| **Web** | Newsletter Mailchimp | User subscribe untuk notif konser baru | Mailchimp (managed) | ✅ Active |
| **Backend** | Scraper Report | Admin laporan harian hasil scraping | `ganoolmovie5th@gmail.com` (Gmail) | ✅ Active |
| **Backend** | Auto-Updater PR | System notifications (future) | N/A (PR only) | 🔄 N/A |

---

## 1️⃣ Newsletter — MAILCHIMP (Web Platform)

### ▶️ Feature Purpose
- **User** input email di website
- Subscribe ke mailing list untuk notifikasi konser baru
- Backend forward email ke Mailchimp API
- Mailchimp send email ke user saat ada update

### 🔗 Flow
```
User di website
  ↓
Input email di newsletter form (footer)
  ↓
Click "Daftar Gratis"
  ↓
POST /api/subscribe.js (Vercel serverless function)
  ↓
Validasi email format
  ↓
Call Mailchimp API v3: POST /lists/{LIST_ID}/members
  ↓
Mailchimp: add_member atau update status → "subscribed"
  ↓
Response: "success" atau "already_subscribed"
  ↓
User dapat welcome email dari Mailchimp
```

### 📝 Implementation Details

**File:** `api/subscribe.js` (Vercel serverless function)

**Required Env Vars (Vercel Dashboard):**
```
MAILCHIMP_API_KEY   — dari Mailchimp Account > Extras > API keys
                      Format: xxxxxxxxxxxxxxxx-us20
MAILCHIMP_LIST_ID   — dari Mailchimp Audience > Settings > Audience ID
                      Format: xxxxxxxxxxxxxxxx
MAILCHIMP_SERVER    — server prefix (opsional)
                      Contoh: us20, us5, eu1, dll
```

**Frontend UI Elements:**
- Newsletter section di footer (`.newsletter-section`)
- Input field: `#nlMcEmail` (placeholder: email@kamu.com)
- Subscribe button: `#nlMcBtn` (text: "Daftar Gratis")
- Labels: di `features3.js` i18n strings
  - `nl_title`: "Jangan Ketinggalan Konser!"
  - `nl_sub`: "Daftar gratis dan dapatkan update konser terbaru langsung di inbox kamu."
  - `nl_placeholder`: "email@kamu.com"
  - `nl_btn`: "Daftar Gratis"

**Backend Logic:**
- Validate email format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Call Mailchimp API dengan Basic Auth
- Handle responses:
  - `200/201`: Success
  - `400 + "Member Exists"`: Already subscribed (return success)
  - Lainnya: Error message

**Email yang diterima User:**
- Welcome email dari Mailchimp (customizable di Mailchimp dashboard)
- Campaign emails saat admin send (manual dari Mailchimp)

---

## 2️⃣ Scraper Report — GMAIL SMTP (Backend)

### ▶️ Feature Purpose
- **Admin** (kamu) receive harian laporan hasil scraping
- Email berisi:
  - Summary: berapa potensi konser baru, berapa update
  - Detail table: artis, tanggal, venue, sumber, reliability
  - Links: GitHub untuk manual edit

### 🔗 Flow
```
01:00 WIB (GitHub Actions trigger)
  ↓
[JOB 1] scraper.py jalankan
  ├─ Scrape 7 sumber
  ├─ Generate scraper_report.html
  └─ Trigger email_reporter.py
  
  ↓
[email_reporter.py] jalan
  ├─ Baca env vars: GMAIL_APP_PASSWORD, ADMIN_EMAIL
  ├─ Load scraper_report.html
  ├─ Connect ke Gmail SMTP (smtp.gmail.com:465)
  ├─ Authenticate dengan App Password
  ├─ Send email via SMTP
  └─ Log success/error
  
  ↓
Admin receive email di inbox (ganoolmovie5th@gmail.com)
  ├─ Subject: [ConcertID] Laporan Scraper — {date} | X Potensi Baru · Y Update
  ├─ Body: Beautiful HTML table dengan konser baru & update
  └─ CTA: Links ke GitHub untuk review
```

### 📝 Implementation Details

**File:** `email_reporter.py`

**Required Env Vars (GitHub Secrets):**
```
GMAIL_APP_PASSWORD  — App Password dari ganoolmovie5th@gmail.com
                      Setup: Google Account > Security > App passwords
                      Format: 16-char password (tanpa spasi)
                      Example: abcdefghijklmnop

ADMIN_EMAIL         — (optional) Override recipient email
                      Default: ganoolmovie5th@gmail.com
                      Jika ingin ke email lain, set di GitHub Secrets
```

**Email Configuration:**
```python
SENDER_EMAIL = "ganoolmovie5th@gmail.com"
ADMIN_EMAIL  = os.environ.get("ADMIN_EMAIL", "ganoolmovie5th@gmail.com")
APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

# Gmail SMTP
smtp.gmail.com:465 (SSL)
```

**Email Content:**
- Format: Multipart (plain text + HTML)
- Subject: `[ConcertID] Laporan Scraper Harian — {date} | {n_new} Potensi Baru · {n_upd} Update`
- Body HTML: Cantik dark theme, include:
  - Stats card: total, potensi baru, update
  - Alert box: "Review diperlukan — data belum diverifikasi"
  - Section 1: Potensi konser baru (highlight purple)
  - Section 2: Update konser existing (highlight yellow)
  - CTA buttons: Edit app.js, Lihat Actions Log

**Error Handling:**
- `SMTPAuthenticationError`: GMAIL_APP_PASSWORD salah/tidak di-set
- Koneksi error: Log ke stdout (visible di GitHub Actions log)

---

## 3️⃣ Ticket Alert (Future Feature)

### ▶️ Planned
- User dapat set alert untuk konser tertentu
- Saat ada update (harga turun, tiket open, dll) → send email
- **Current Status:** Feature UI ada (`TicketAlert`), tapi backend belum full implement
- Email service: TBD (bisa pakai SendGrid, Mailgun, atau Firebase)

### 📝 Current Implementation
- LocalStorage-based (client-side only, tidak ada email backend yet)
- `isSubscribed(id)` → check localStorage
- `toggle(concertId)` → add/remove dari alerts
- UI: "🔔 Set Alert" button per konser

---

## 📋 Setup Checklist

### ✅ Mailchimp (Newsletter) — LIVE
- [ ] Mailchimp account created
- [ ] Audience created
- [ ] API key generated
- [ ] List ID copied
- [ ] Env vars set di Vercel:
  - `MAILCHIMP_API_KEY` = ✅
  - `MAILCHIMP_LIST_ID` = ✅
  - `MAILCHIMP_SERVER` = ✅ (optional)
- [ ] Test: Subscribe dari website → check Mailchimp dashboard

### ✅ Gmail Scraper Report — LIVE
- [ ] Gmail account: ganoolmovie5th@gmail.com
- [ ] App Password generated (Security > App passwords)
- [ ] GitHub Secrets set:
  - `GMAIL_APP_PASSWORD` = ✅
  - `ADMIN_EMAIL` = ✅ (optional, default: ganoolmovie5th@gmail.com)
- [ ] Test: Trigger Actions manual → check email

### ⏳ Ticket Alert Email — TODO
- [ ] Decide email service (SendGrid? Mailgun? Firebase?)
- [ ] Setup backend API endpoint
- [ ] Implement email template
- [ ] Test end-to-end

---

## 🔐 Secrets Management

### GitHub Secrets (for scraper report)
```
GMAIL_APP_PASSWORD  → ganoolmovie5th@gmail.com App Password
ADMIN_EMAIL         → (optional) recipient email
```

### Vercel Env Vars (for newsletter)
```
MAILCHIMP_API_KEY   → API key dari Mailchimp
MAILCHIMP_LIST_ID   → List ID dari Mailchimp
MAILCHIMP_SERVER    → Server prefix (opsional)
```

### Best Practices
- ✅ Never commit secrets ke GitHub
- ✅ Rotate App Password setiap 3-6 bulan
- ✅ Use separate email accounts untuk berbagai service (don't use personal email)
- ✅ Log sensitive operations (tidak log password, tapi log success/failure)

---

## 🧪 Testing

### Test Mailchimp Newsletter
```bash
# Di browser console
fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### Test Scraper Report Email
```bash
# Di GitHub Actions
1. Go to Actions
2. Select "🎵 Daily Concert Monitor & Auto-PR"
3. Run workflow manual
4. Check email inbox (ganoolmovie5th@gmail.com)
```

---

## 📈 Monitoring & Logs

### Mailchimp
- Monitor di Mailchimp dashboard:
  - Audience > All contacts → lihat subscribers
  - Campaigns → lihat delivery rate
  - Reports → engagement metrics

### Gmail Scraper Report
- Check email inbox: ganoolmovie5th@gmail.com
- GitHub Actions logs:
  - Repo → Actions → 🎵 Daily Concert Monitor → Run history
  - Click run → scroll ke step "📧 Send email report"
  - Log akan show:
    - ✅ "Email laporan berhasil dikirim!" (success)
    - ❌ "Autentikasi Gmail gagal!" (auth error)

---

## 🚨 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Newsletter subscribe gagal | Mailchimp env vars tidak set di Vercel | Set di Vercel dashboard → redeploy |
| Scraper email tidak dikirim | GMAIL_APP_PASSWORD tidak di-set | Set di GitHub Secrets |
| Email auth gagal | Wrong App Password | Regenerate di Google Account Security |
| Email masuk spam | Sender reputation | Warm up: send sedikit email dulu |
| API subscribe 500 error | Missing MAILCHIMP_API_KEY atau LIST_ID | Verify di Vercel env vars |

---

## 📚 References

- Mailchimp API Docs: https://mailchimp.com/developer/marketing/api/
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## 🔄 Future Enhancements

- [ ] Ticket price drop alerts → email notification
- [ ] Concert near your city → email alert
- [ ] Friend joined your wishlist → email notification
- [ ] Unsubscribe link di semua email
- [ ] Email preference center (frequency, content type)
- [ ] Analytics: track email open rate, click rate
