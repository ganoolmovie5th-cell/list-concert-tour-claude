#!/usr/bin/env python3
"""
ConcertID — Auto Updater (Opsi A: Semi-Auto)
============================================
Dibaca setelah scraper.py selesai jalan.

Cara kerja:
  1. Baca scraper_report.json (output scraper.py)
  2. Filter hanya item HIGH confidence dari sumber terpercaya
  3. Untuk setiap item baru yang lolos filter:
     - Generate entry CONCERTS[] yang valid untuk app.js
     - Inject ke app.js sebelum penutup ]; array CONCERTS
     - Tambahkan placeholder image ke ARTIST_IMAGES
  4. Tulis ringkasan perubahan ke auto_update_summary.json
     (dibaca oleh workflow untuk isi PR description)

Catatan penting:
  - Script ini TIDAK push ke main langsung
  - Semua perubahan dikumpulkan dulu, lalu workflow buat PR
  - Kamu tinggal review PR → merge jika valid → selesai
"""

import json
import re
import sys
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR       = Path(__file__).parent
APP_JS         = BASE_DIR / "app.js"
REPORT_JSON    = BASE_DIR / "scraper_report.json"
SUMMARY_JSON   = BASE_DIR / "auto_update_summary.json"

WIB            = timezone(timedelta(hours=7))
NOW_WIB        = datetime.now(WIB)
TODAY_LABEL    = NOW_WIB.strftime("%d %b %Y %H:%M WIB")
TODAY_DATE_STR = NOW_WIB.strftime("%Y-%m-%d")

# ── Sumber yang dianggap HIGH confidence ─────────────────────────────────────
HIGH_CONFIDENCE_SOURCES = {
    "tiket.com",
    "loket.com",
    "songkick.com",
    "bandwagon.asia",
    "livenation.asia",
}

# ── Genre mapping berdasarkan kata kunci nama artis / judul ──────────────────
GENRE_KEYWORDS = {
    "kpop":       ["kpop","k-pop","bts","exo","blackpink","twice","aespa","ateez","nct","enhypen",
                   "stray kids","txt","itzy","ive","le sserafim","newjeans","treasure","monsta x",
                   "kard","jaehyun","babymonster","nct wish","byeon woo seok"],
    "rock":       ["rock","metal","punk","hardcore","metallica","linkin park","dream theater",
                   "my chemical romance","mcr","avenged sevenfold","a7x","deep purple","gnr",
                   "guns n roses","five finger","slipknot","one ok rock","hammersonic","green day"],
    "pop":        ["pop","taylor swift","ariana grande","dua lipa","ed sheeran","charlie puth",
                   "olivia rodrigo","the weeknd","post malone","bad bunny","laufey","westlife",
                   "bryan adams","5sos","five seconds of summer"],
    "jazz":       ["jazz","java jazz","blues"],
    "electronic": ["edm","electronic","dj","festival","dj snake","martin garrix"],
}

GENRE_EMOJIS = {
    "kpop": "✨", "rock": "🎸", "pop": "🎵", "jazz": "🎷", "electronic": "🎧",
}

def detect_genre(text: str) -> tuple[str, str]:
    t = text.lower()
    for genre, keywords in GENRE_KEYWORDS.items():
        if any(k in t for k in keywords):
            return genre, GENRE_EMOJIS.get(genre, "🎵")
    return "pop", "🎵"

# ── Slug generator ────────────────────────────────────────────────────────────
def to_slug(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text

# ── Baca artist yang sudah ada ────────────────────────────────────────────────
def get_existing_ids() -> set[str]:
    if not APP_JS.exists():
        return set()
    return set(re.findall(r"id:\s*'([^']+)'", APP_JS.read_text(encoding="utf-8")))

def get_existing_artists() -> set[str]:
    if not APP_JS.exists():
        return set()
    return set(re.findall(r"artist:\s*'([^']+)'", APP_JS.read_text(encoding="utf-8")))

def normalize(name: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", name.lower()).strip()

def is_duplicate(artist: str, existing_artists: set[str]) -> bool:
    norm = normalize(artist)
    if not norm or len(norm) < 3:
        return True
    for ea in existing_artists:
        ea_norm = normalize(ea)
        if norm in ea_norm or ea_norm in norm:
            return True
    return False

# ── Parse tanggal dari string ─────────────────────────────────────────────────
MONTH_MAP = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "mei": 5,
    "jun": 6, "jul": 7, "aug": 8, "agu": 8, "sep": 9, "oct": 10,
    "okt": 10, "nov": 11, "dec": 12, "des": 12,
}

def parse_date(date_str: str) -> tuple[str, str]:
    """
    Coba parse tanggal dari string scraper.
    Return: (display_date, raw_date_iso) atau ("TBA", "")
    """
    if not date_str:
        return "TBA", ""
    s = date_str.lower().strip()
    # Format: "15 jun 2026", "jun 15 2026", "2026-06-15"
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        y, mo, d = m.group(1), m.group(2), m.group(3)
        mon_names = ["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
        display = f"{int(d)} {mon_names[int(mo)]} {y}"
        return display, f"{y}-{mo}-{d}"

    m = re.search(r"(\d{1,2})\s+([a-z]{3})\w*\s+(\d{4})", s)
    if m:
        d, mon, y = m.group(1), m.group(2)[:3], m.group(3)
        mo = MONTH_MAP.get(mon)
        if mo:
            mon_names = ["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
            display = f"{int(d)} {mon_names[mo]} {y}"
            return display, f"{y}-{mo:02d}-{int(d):02d}"

    m = re.search(r"([a-z]{3})\w*\s+(\d{1,2})[,\s]+(\d{4})", s)
    if m:
        mon, d, y = m.group(1)[:3], m.group(2), m.group(3)
        mo = MONTH_MAP.get(mon)
        if mo:
            mon_names = ["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
            display = f"{int(d)} {mon_names[mo]} {y}"
            return display, f"{y}-{mo:02d}-{int(d):02d}"

    return "TBA", ""

# ── Generate entry JS ─────────────────────────────────────────────────────────
def generate_concert_entry(item: dict, concert_id: str) -> str:
    artist      = item.get("_extracted_artist") or item.get("artist") or item.get("title", "Unknown")
    title       = item.get("title", "")
    date_str    = item.get("date", "")
    venue       = item.get("venue", "TBA")
    source      = item.get("source", "")
    source_label = item.get("source_label", source)
    url         = item.get("url", "")

    display_date, raw_date = parse_date(date_str)
    genre, emoji           = detect_genre(f"{artist} {title}")

    # Rawdate JS expression
    if raw_date:
        raw_date_js = f"new Date('{raw_date}')"
    else:
        raw_date_js = f"new Date('{NOW_WIB.year + 1}-01-01')"  # fallback tahun depan

    # Dates display
    dates_js = f'["{display_date}"]' if display_date != "TBA" else '["TBA"]'

    # Determine confirmStatus — tiket.com/loket.com/livenation/songkick = confirmed, sisanya rumor
    if source in ("tiket.com", "loket.com", "livenation.asia"):
        confirm_status = "confirmed"
    elif source in ("songkick.com", "bandwagon.asia"):
        confirm_status = "confirmed"
    else:
        confirm_status = "rumor"

    # Description auto-generated
    venue_display = venue if venue and venue != "TBA" else "Jakarta"
    description = (
        f"[AUTO-DETECTED] {artist} akan tampil di {venue_display}. "
        f"Info dari {source_label}. Harap verifikasi sebelum publish."
    )

    # Sources
    sources_list = [source] if source else ["unknown"]
    if url:
        sources_list.append(url[:60])
    sources_js = json.dumps(sources_list)

    return f"""
  {{
    id: '{concert_id}',
    artist: '{artist.replace("'", "\\'")}',
    tour: '{artist.replace("'", "\\'")} Tour',
    genre: '{genre}', emoji: '{emoji}',
    dates: {dates_js},
    rawDate: {raw_date_js},
    time: 'TBA',
    venue: '{venue.replace("'", "\\'") if venue else "TBA"}',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: '{source_label}',
    ticketUrl: '{url[:100] if url else "#"}',
    priceRange: 'Cek {source_label}',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      {{ name: 'Info', price: 'Cek {source_label}' }},
    ],
    confirmStatus: '{confirm_status}', hot: false,
    description: '{description.replace(chr(39), chr(92) + chr(39))}',
    sources: {sources_js},
  }},"""

# ── Inject ke app.js ──────────────────────────────────────────────────────────
def inject_to_app_js(new_entries: list[str], new_image_entries: list[str]) -> bool:
    """
    Inject entri baru ke dalam app.js.
    - CONCERTS entries dimasukkan sebelum baris ']; // END_CONCERTS'
      Jika marker tidak ada, cari '];' terakhir di sekitar CONCERTS
    - ARTIST_IMAGES entries dimasukkan sebelum '} // END_ARTIST_IMAGES'
      atau sebelum '};' yang menutup ARTIST_IMAGES object
    """
    if not APP_JS.exists():
        log.error("app.js tidak ditemukan!")
        return False

    content = APP_JS.read_text(encoding="utf-8")
    original = content

    # ── Inject ARTIST_IMAGES ──
    if new_image_entries:
        images_block = "\n".join(new_image_entries)
        # Cari penutup ARTIST_IMAGES object (baris "};" setelah ARTIST_IMAGES = {)
        # Cari pola: '// ── RUMOR' atau baris terakhir sebelum '};' di ARTIST_IMAGES
        marker_img = "// ── RUMOR ──"
        if marker_img in content:
            content = content.replace(
                marker_img,
                f"// ── AUTO-DETECTED ──\n{images_block}\n  {marker_img}"
            )
        else:
            # Fallback: inject sebelum '};' yang menutup ARTIST_IMAGES
            # Cari posisi ARTIST_IMAGES dan '};' berikutnya
            idx = content.find("const ARTIST_IMAGES")
            if idx >= 0:
                close_idx = content.find("};", idx)
                if close_idx >= 0:
                    content = content[:close_idx] + f"\n  {images_block}\n" + content[close_idx:]

    # ── Inject CONCERTS entries ──
    if new_entries:
        concerts_block = "".join(new_entries)
        # Cari marker 'confirmStatus: \'rumor\'' dari entri pertama yang confirmStatus=rumor
        # Lebih aman: inject sebelum baris '];' penutup CONCERTS
        # Kita cari baris '];' yang menutup const CONCERTS
        idx_concerts = content.find("const CONCERTS = [")
        if idx_concerts < 0:
            idx_concerts = content.find("const CONCERTS=[")
        if idx_concerts >= 0:
            # Cari ']; // ' atau penutup array CONCERTS
            # Cari '];\n\n' atau '];\n' setelah CONCERTS
            sub = content[idx_concerts:]
            # Cari ']' + optional whitespace + ';' yang menutup array
            close_match = re.search(r"\n\];\s*\n", sub)
            if close_match:
                close_pos = idx_concerts + close_match.start()
                content = content[:close_pos] + "\n" + concerts_block + content[close_pos:]
            else:
                log.warning("Tidak bisa menemukan penutup CONCERTS array, inject di akhir file")
                content += "\n// AUTO-DETECTED CONCERTS:\n" + concerts_block
        else:
            log.warning("Tidak bisa menemukan const CONCERTS di app.js")
            content += "\n// AUTO-DETECTED CONCERTS:\n" + concerts_block

    # ── Update timestamp ──
    content = re.sub(
        r"// Last auto-updated:.*",
        f"// Last auto-updated: {TODAY_LABEL}",
        content,
        count=1,
    )

    if content != original:
        APP_JS.write_text(content, encoding="utf-8")
        return True
    return False

# ── Main ──────────────────────────────────────────────────────────────────────
def main() -> int:
    log.info(f"=== ConcertID Auto Updater — {TODAY_LABEL} ===")

    if not REPORT_JSON.exists():
        log.error("scraper_report.json tidak ditemukan. Jalankan scraper.py dulu.")
        return 1

    report = json.loads(REPORT_JSON.read_text(encoding="utf-8"))
    new_potential: list[dict] = report.get("new_potential", [])
    log.info(f"Total potensi baru dari scraper: {len(new_potential)}")

    if not new_potential:
        log.info("Tidak ada konser baru yang perlu diproses.")
        SUMMARY_JSON.write_text(json.dumps({
            "generated_at": TODAY_LABEL,
            "added": [],
            "skipped": [],
            "message": "Tidak ada konser baru terdeteksi hari ini.",
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        return 0

    existing_ids     = get_existing_ids()
    existing_artists = get_existing_artists()

    new_entries   = []
    new_img_entries = []
    added_summary = []
    skipped       = []

    for item in new_potential:
        # Filter: hanya HIGH confidence & dari sumber terpercaya
        reliability = item.get("reliability", "")
        source      = item.get("source", "")

        if reliability != "HIGH" or source not in HIGH_CONFIDENCE_SOURCES:
            skipped.append({
                "title": item.get("title", ""),
                "reason": f"reliability={reliability}, source={source} (not in HIGH_CONFIDENCE_SOURCES)",
            })
            continue

        artist = item.get("_extracted_artist") or item.get("artist") or ""
        if not artist or len(artist) < 3:
            skipped.append({"title": item.get("title", ""), "reason": "artist name terlalu pendek"})
            continue

        if is_duplicate(artist, existing_artists):
            skipped.append({"title": item.get("title", ""), "reason": "artis sudah ada di list"})
            continue

        # Generate ID unik
        year = NOW_WIB.year
        concert_id = to_slug(f"{artist}-jakarta-{year}")
        # Handle jika ID sudah ada
        suffix = 0
        base_id = concert_id
        while concert_id in existing_ids:
            suffix += 1
            concert_id = f"{base_id}-{suffix}"

        existing_ids.add(concert_id)
        existing_artists.add(artist.lower())

        entry     = generate_concert_entry(item, concert_id)
        img_entry = f"  '{concert_id}':{'':>10}WEB_BASE + '/images/{concert_id}.jpeg?v=2',"

        new_entries.append(entry)
        new_img_entries.append(img_entry)
        added_summary.append({
            "id": concert_id,
            "artist": artist,
            "source": source,
            "url": item.get("url", ""),
            "date": item.get("date", ""),
            "venue": item.get("venue", ""),
        })
        log.info(f"  ✓ Akan ditambah: {artist} (id: {concert_id})")

    if not new_entries:
        log.info("Tidak ada entri baru yang lolos filter HIGH confidence.")
        SUMMARY_JSON.write_text(json.dumps({
            "generated_at": TODAY_LABEL,
            "added": [],
            "skipped": skipped,
            "message": "Semua item tidak lolos filter HIGH confidence atau sudah ada di list.",
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        return 0

    # Inject ke app.js
    changed = inject_to_app_js(new_entries, new_img_entries)
    if changed:
        log.info(f"✅ app.js berhasil diupdate: +{len(new_entries)} konser baru")
    else:
        log.warning("app.js tidak berubah (inject mungkin gagal, cek log)")

    # Tulis summary
    summary = {
        "generated_at": TODAY_LABEL,
        "added_count": len(added_summary),
        "skipped_count": len(skipped),
        "added": added_summary,
        "skipped": skipped,
        "message": f"Berhasil menambahkan {len(added_summary)} konser baru dari sumber HIGH confidence.",
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"Summary disimpan: {SUMMARY_JSON}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
