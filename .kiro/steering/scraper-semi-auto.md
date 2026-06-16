# 🕷️ Scraper Semi-Auto (Opsi A) — Setup & Operations

> Status: **READY TO MERGE** (feat/semi-auto-pr branch)
> Tapi perlu Gmail setup sebelum workflow aktif

## 📋 Quick Setup Checklist

- [ ] **Merge PR** `feat/semi-auto-pr` ke main
- [ ] **Setup Gmail App Password** di GitHub Secrets (lihat bagian bawah)
- [ ] **Test workflow** — Actions → Run workflow manual
- [ ] **Review pertama PR** saat data real mulai masuk

---

## 🔐 Setup Gmail App Password (WAJIB)

Workflow tidak bisa kirim email laporan kalau ini belum di-setup.

### Step 1: Buka Google Account Security
1. Buka https://myaccount.google.com/security
2. Login dengan akun `listconcerttour@gmail.com`
3. Scroll ke bawah → cari **"App passwords"** (jangan "Password" biasa)

### Step 2: Generate App Password
1. Pilih:
   - Device: **Windows Computer** (atau device kamu)
   - App: **Mail**
2. Google akan generate **16-character password** (contoh: `abcd efgh ijkl mnop`)
3. **COPY itu** (tanpa spasi)

### Step 3: Set di GitHub Secrets
1. Buka repo → **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Isi:
   - **Name:** `GMAIL_APP_PASSWORD`
   - **Value:** (16-char password, hapus semua spasi)
4. Click **"Add secret"**

### ✅ Done!
Sekarang email reporter bisa kirim laporan otomatis.

---

## 🚀 Workflow Otomatis

### Schedule
```
⏰ Setiap hari jam 01:00 WIB (UTC 18:00)
```

### Dua Jobs

#### **Job 1: Monitor & Report** (5-10 menit)
```bash
scraper.py
├─ Scrape 7 sumber (Bandwagon, Tempo, Jakarta Post, Songkick, JamBase, tiket.com, Loket)
├─ Deduplicate & classify
├─ Generate scraper_report.json + HTML
└─ Email report ke ADMIN_EMAIL
```

#### **Job 2: Auto Update PR** (2-3 menit)
```bash
auto_updater.py (INPUT: scraper_report.json dari Job 1)
├─ Filter HIGH confidence saja (reliability=HIGH + source terpercaya)
├─ Generate JS concert entries
├─ Inject ke app.js
├─ Commit + push ke auto-update/concerts-YYYYMMDD-HHMM
└─ Create PR otomatis → waiting kamu approve
```

---

## 📖 Alur Kerja Lengkap

```
01:00 WIB
  ↓
[JOB 1: SCRAPE]
  ├─ Bandwagon Asia, Tempo.co, Jakarta Post
  ├─ Songkick, JamBase, tiket.com, Loket.com
  ├─ Classify: new_potential, updates, irrelevant
  ├─ Email report ke kamu
  └─ Upload artifact: scraper_report.json
  
  ↓
[JOB 2: AUTO UPDATE]
  ├─ Download artifact dari Job 1
  ├─ Filter HIGH confidence (5-10 item lolos)
  ├─ Inject ke app.js
  ├─ Push ke branch baru
  └─ Create PR → assign ke kamu

  ↓
[KAMU REVIEW]
  ├─ Lihat PR, verifikasi artis
  ├─ Edit kalau perlu
  ├─ Merge → Vercel auto-deploy
  └─ ✅ Website live!
```

---

## ⚙️ Configuration

| Setting | Value |
|---------|-------|
| Schedule | `0 18 * * *` UTC (= 01:00 WIB) |
| HIGH confidence sources | tiket.com, loket.com, songkick.com, bandwagon.asia |
| Filter reliability | HIGH only |
| Branch naming | `auto-update/concerts-YYYYMMDD-HHMM` |
| PR labels | `auto-update`, `needs-review` |

---

## 📊 File-File Terlibat

| File | Role |
|------|------|
| `scraper.py` | Scrape 7 sumber, classify |
| `auto_updater.py` | Filter HIGH conf, inject ke app.js |
| `scraper_report.json` | Data untuk auto_updater (Job 2) |
| `scraper_report.html` | Email report HTML |
| `auto_update_summary.json` | PR description |
| `app.js` | Source of truth — updated otomatis |
| `.github/workflows/scrape.yml` | Orchestration |

---

## ✅ Checklist Saat Review PR

Saat PR terbuka, verifikasi:

- [ ] Nama artis benar (bukan typo/hoax)?
- [ ] Tanggal sesuai sumber?
- [ ] Venue plausible?
- [ ] Sumber reliable (tiket.com/loket/songkick)?
- [ ] Tambahkan gambar ke `/images/` kalau belum ada
- [ ] Update confirmStatus kalau perlu (rumor → confirmed)
- [ ] Edit detail lain: harga, deskripsi, promotor
- [ ] ✅ Merge

---

## 🛠️ Manual Test (di GitHub Actions)

Bisa trigger manual tanpa tunggu 01:00 WIB:

1. Buka repo → **Actions**
2. Pilih **"🎵 Daily Concert Monitor & Auto-PR"**
3. Click **"Run workflow"**
4. Input `dry_run: false` → **"Run workflow"**
5. Tunggu selesai (~10 menit)
6. Check status, artifacts, PR

---

## 🐛 Troubleshooting

### Email tidak terkirim
**Error:** `SMTPAuthenticationError`
- **Fix:** Check Gmail App Password sudah di-set di GitHub Secrets (lihat bagian Setup)

### PR tidak dibuat
**Error:** Branch push gagal atau PR creation failed
- **Check:** `git push` auth (use GITHUB_TOKEN) ✓
- **Check:** PR creation via GitHub API sudah di-approve

### app.js tidak berubah
**Reason:** Tidak ada item HIGH confidence
- **Expected:** Job 2 skip, hanya email report dikirim

### Artifact tidak ada
**Error:** `No files found matching pattern`
- **Check:** `scraper.py` harus generate `scraper_report.json` dan `scraper_report.html`

---

## 📝 Notes

- **Data auto-generated** — selalu verifikasi ke sumber asli sebelum merge
- **Filter HIGH confidence** — minimisir hoax/typo, tapi mungkin skip beberapa info valid
- **Manual review** — tetap perlu kamu cek sebelum publish
- **GitHub API** — PR otomatis via `actions/github-script@v7`

---

## 🔗 Links

- Workflow file: `.github/workflows/scrape.yml`
- Scraper: `scraper.py`
- Auto updater: `auto_updater.py`
- app.js: Source of truth semua konser
