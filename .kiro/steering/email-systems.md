# 📧 Email Systems — All Platforms & Features

> Dokumentasi lengkap semua fitur yang menggunakan email di website & backend

---

## 📊 Overview

| Platform | Feature | Purpose | Email Used | Status |
|----------|---------|---------|-----------|--------|
| **Web** | Newsletter Mailchimp | User subscribe untuk notif konser baru | Mailchimp (managed) | ✅ Active |
| **Web** | Feedback Form | User kirim kritik/saran/report data | EmailJS → `listconcerttour@gmail.com` | ✅ Active |
| **Backend** | Scraper Report | Admin laporan harian hasil scraping | `ganoolmovie5th@gmail.com` (Gmail) | ✅ Active |

---

## 1️⃣ Newsletter — MAILCHIMP (Web Platform)

### ▶️ Feature Purpose
- **User** input email di website
- Subscribe ke mailing list untuk notifikasi konser baru
- Backend forward email ke Mailchimp API
- Mailchimp send email ke user saat ada update

### 🔗 Flow
```
User di website → Input email → Click "Daftar Gratis"
  ↓
POST /api/subscribe.js (Vercel serverless)
  ↓
Validasi email format
  ↓
Call Mailchimp API → add_member
  ↓
Mailchimp send welcome email
```

### 📝 Implementation Details

**File:** `api/subscribe.js` (Vercel serverless function)

**Required Env Vars (Vercel Dashboard):**
```
MAILCHIMP_API_KEY   — dari Mailchimp Account > Extras > API keys
MAILCHIMP_LIST_ID   — dari Mailchimp Audience > Settings > Audience ID
MAILCHIMP_SERVER    — server prefix (opsional)
```

---

## 2️⃣ Scraper Report — GMAIL SMTP (Backend)

### ▶️ Feature Purpose
- **Admin** receive harian laporan hasil scraping
- Email berisi: summary, detail table, links ke GitHub
- Schedule: Tiap hari jam 01:00 WIB

### 🔗 Flow
```
01:00 WIB → Job 1 scraper.py jalankan
  ↓
Generate scraper_report.html
  ↓
email_reporter.py jalan
  ↓
Connect ke Gmail SMTP → send email
  ↓
Admin receive di ganoolmovie5th@gmail.com
```

### 📝 Implementation Details

**File:** `email_reporter.py`

**Required Env Vars (GitHub Secrets):**
```
GMAIL_APP_PASSWORD  — App Password dari ganoolmovie5th@gmail.com
ADMIN_EMAIL         — (optional) recipient email
```

**Email Config:**
```python
SENDER_EMAIL = "ganoolmovie5th@gmail.com"
ADMIN_EMAIL  = os.environ.get("ADMIN_EMAIL", "ganoolmovie5th@gmail.com")
# Gmail SMTP: smtp.gmail.com:465 (SSL)
```

---

## 3️⃣ Feedback Form — EMAILJS (Web Platform - OUTDATED EMAIL)

### ▶️ Feature Purpose
- User kirim kritik, saran, report data salah di halaman
- UI: "📬 Kritik & Saran" form
- Kirim via EmailJS (3rd party email service)
- Tujuan: `listconcerttour@gmail.com` (**SUSPENDED**)

### ⚠️ Current Status
- **Status:** ✅ Active, tidak perlu diubah
- Recipient `listconcerttour@gmail.com` dibiarkan (intentional)

### 🔗 Flow
```
User → Fill form (name, email, type, message, photo)
  ↓
Submit form
  ↓
JavaScript call EmailJS API
  ↓
EmailJS forward ke: listconcerttour@gmail.com (❌ SUSPENDED)
  ↓
Email bounces (account doesn't exist)
```

### 📝 Implementation Details

**File:** `features3.js` (class `FeedbackForm`)

**EmailJS Configuration (hardcoded):**
```javascript
const result = await emailjs.send(
  'service_lq3pvsq',     // Service ID
  'template_w8grsoa',    // Template ID
  payload
);
```

**Current Email Recipient:**
- Configured di EmailJS dashboard: `listconcerttour@gmail.com`
- **PROBLEM:** Account suspended by Google

### 🔧 How to Fix

1. **Access EmailJS Dashboard:**
   - Go to https://dashboard.emailjs.com
   - Find Email Template ID: `template_w8grsoa`

2. **Update Email Recipient:**
   - Change recipient from `listconcerttour@gmail.com` → `ganoolmovie5th@gmail.com`
   - Save template

3. **Test:**
   - Go to website
   - Click "📬 Kritik & Saran"
   - Submit feedback form
   - Verify email received at `ganoolmovie5th@gmail.com`

---

## 🔐 All Email Accounts Used

### ✅ Currently Active:

| Email | Service | Used For | Config | Status |
|---|---|---|---|---|
| `ganoolmovie5th@gmail.com` | Gmail SMTP | Scraper reports | GitHub Secrets | ✅ Active |
| `ganoolmovie5th@gmail.com` | Mailchimp | Newsletter | Vercel env | ✅ Active |
| Mailchimp Account | Mailchimp API | Newsletter delivery | API Key | ✅ Active |
| EmailJS Account | EmailJS API | Feedback form | Service/Template ID | ✅ Active |

### ❌ Disabled/Outdated:

| Email | Service | Reason | Fix Status |
|---|---|---|---|
| `listconcerttour@gmail.com` | Gmail SMTP (scraper) | Suspended by Google | ✅ Replaced with ganoolmovie5th |
| `listconcerttour@gmail.com` | EmailJS (feedback) | Dibiarkan intentional | ✅ No change needed |

---

## 📋 Setup Checklist

### ✅ Mailchimp (Newsletter) — LIVE
- [x] Mailchimp account created
- [x] Audience + API key + List ID
- [x] Vercel env vars set
- [x] Test: Subscribe dari website ✅

### ✅ Gmail Scraper Report — LIVE
- [x] Gmail account: ganoolmovie5th@gmail.com
- [x] App Password generated
- [x] GitHub Secrets set
- [x] Test: Trigger Actions manual ✅

### ✅ EmailJS Feedback Form — ACTIVE (no change needed)
- [x] EmailJS service ID: `service_lq3pvsq`
- [x] EmailJS template ID: `template_w8grsoa`
- [x] Recipient: `listconcerttour@gmail.com` (intentional, dibiarkan)

---

## 🧪 Testing

### Test Newsletter (Mailchimp)
```bash
fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
```

### Test Scraper Report (Gmail)
1. Go to Actions → 🎵 Daily Concert Monitor
2. Run workflow manual
3. Check email: ganoolmovie5th@gmail.com

### Test Feedback Form (EmailJS)
1. Go to website
2. Scroll ke footer → Click "📬 Kritik & Saran"
3. Fill form → Submit
4. Should receive email (after EmailJS update)

---

## ⚠️ Important Notes

- **EmailJS update:** Manual via dashboard (bukan code change)
- **No code changes needed** untuk fix EmailJS — cukup update di dashboard
- **Backup:** Both Gmail dan Mailchimp account sudah active, redundansi coverage
- **Future:** Consider centralize ke 1 email provider untuk simplicity

