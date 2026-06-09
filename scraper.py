#!/usr/bin/env python3
"""
KonserIndo Auto-Scraper
Runs daily at 01:00 WIB (18:00 UTC) via GitHub Actions.
Scrapes concert data from multiple sources and updates app.js.

Sources:
- Bandwagon Asia
- Tempo.co
- The Jakarta Post
- tiket.com / loket.com (search pages)
- Jambase.com (Indonesia concerts)
- Songkick (Indonesia events)
"""

import json
import re
import sys
import time
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
WIB = timezone(timedelta(hours=7))
NOW_WIB = datetime.now(WIB)
TODAY_STR = NOW_WIB.strftime("%Y-%m-%d")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

APP_JS_PATH = Path(__file__).parent / "app.js"

# ── Known / Seed concerts (manually curated, always included) ─────────────────
# These are verified concerts we always keep. The scraper adds NEW ones on top.
SEED_CONCERTS = [
    # ── PAST ──
    {
        "id": "blackpink-deadline-2025",
        "artist": "BLACKPINK",
        "tour": "WORLD TOUR <DEADLINE>",
        "genre": "kpop", "emoji": "🌸",
        "dates": ["1 November 2025", "2 November 2025"],
        "rawDateStr": "2025-11-01",
        "time": "18:00 WIB",
        "venue": "Gelora Bung Karno (GBK) Utama",
        "city": "Senayan, Jakarta Pusat",
        "promotor": "Live Nation Asia",
        "ticketPlatform": "tiket.com",
        "ticketUrl": "https://tiket.com",
        "priceRange": "Rp 1.000.000 – Rp 5.000.000",
        "priceMin": 1000000, "priceMax": 5000000,
        "ticketCategories": [
            {"name": "CAT 4", "price": "Rp 1.000.000"},
            {"name": "CAT 3", "price": "Rp 1.800.000"},
            {"name": "CAT 2", "price": "Rp 2.800.000"},
            {"name": "CAT 1", "price": "Rp 3.800.000"},
            {"name": "VIP",   "price": "Rp 5.000.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "BLACKPINK sukses menggelar konser DEADLINE di GBK selama 2 malam. Lebih dari 100.000 penonton hadir dan mengubah stadion menjadi pink dome. Salah satu konser K-Pop terbaik dalam sejarah Indonesia.",
        "sources": ["weverse.io", "tempo.co", "thejakartapost.com"],
    },
    {
        "id": "fforever-jakarta-2026",
        "artist": "F✦FOREVER (F4 + Ashin)",
        "tour": "F✦FOREVER 1st World Tour",
        "genre": "pop", "emoji": "⭐",
        "dates": ["29 Mei 2026", "30 Mei 2026"],
        "rawDateStr": "2026-05-29",
        "time": "19:30 WIB",
        "venue": "Indonesia Arena, GBK",
        "city": "Senayan, Jakarta Pusat",
        "promotor": "Color Asia Live",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://fforeverindonesia.com",
        "priceRange": "Cek Loket.com",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Various Categories", "price": "Cek loket.com"}],
        "confirmStatus": "confirmed", "hot": False,
        "description": "F4 (Jerry Yan, Van Ness Wu, Vic Chou) bersama Ashin (vokalis Mayday) tampil 2 malam di Indonesia Arena dengan stage eksklusif Four-Point Star. Nostalgia era Meteor Garden untuk jutaan fans Indonesia.",
        "sources": ["fforeverindonesia.com", "cnbcindonesia.com"],
    },
    {
        "id": "ateez-2026",
        "artist": "ATEEZ",
        "tour": "ATEEZ 2026 World Tour In Your Fantasy",
        "genre": "kpop", "emoji": "🌀",
        "dates": ["31 Januari 2026"],
        "rawDateStr": "2026-01-31",
        "time": "19:00 WIB",
        "venue": "ICE BSD City Hall 5 & 6",
        "city": "Tangerang Selatan, Banten",
        "promotor": "AEG Presents Asia",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 750.000 – Rp 3.500.000",
        "priceMin": 750000, "priceMax": 3500000,
        "ticketCategories": [
            {"name": "Festival", "price": "Rp 750.000"},
            {"name": "Standing", "price": "Rp 1.200.000"},
            {"name": "CAT 3",    "price": "Rp 1.800.000"},
            {"name": "CAT 2",    "price": "Rp 2.500.000"},
            {"name": "VIP",      "price": "Rp 3.500.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "ATEEZ menggebrak ICE BSD dalam tur dunia In Your Fantasy. Penampilan perdana mereka di Jakarta disambut antusias oleh ribuan ATINY Indonesia.",
        "sources": ["bandwagon.asia", "chosun.com"],
    },
    {
        "id": "dream-theater-2026",
        "artist": "Dream Theater",
        "tour": "40th Anniversary World Tour",
        "genre": "rock", "emoji": "🎸",
        "dates": ["7 Februari 2026"],
        "rawDateStr": "2026-02-07",
        "time": "20:00 WIB",
        "venue": "Beach City International Stadium",
        "city": "Ancol, Jakarta Utara",
        "promotor": "Mainstager Indonesia",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://dreamtheaterjakarta2026.com",
        "priceRange": "Rp 900.000 – Rp 4.500.000",
        "priceMin": 900000, "priceMax": 4500000,
        "ticketCategories": [
            {"name": "Festival B", "price": "Rp 900.000"},
            {"name": "Festival A", "price": "Rp 1.500.000"},
            {"name": "Tribun C",   "price": "Rp 2.000.000"},
            {"name": "Tribun B",   "price": "Rp 3.000.000"},
            {"name": "VIP",        "price": "Rp 4.500.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "Dream Theater merayakan 40 tahun berkarya bersama formasi lengkap termasuk Mike Portnoy yang comeback setelah 14 tahun absen.",
        "sources": ["dreamtheaterjakarta2026.com", "metaltalk.net"],
    },
    {
        "id": "mcr-hammersonic-2026",
        "artist": "My Chemical Romance",
        "tour": "Hammersonic Festival 2026",
        "genre": "rock", "emoji": "🖤",
        "dates": ["3 Mei 2026"],
        "rawDateStr": "2026-05-03",
        "time": "20:30 WIB",
        "venue": "Pantai Carnaval Ancol",
        "city": "Jakarta Utara",
        "promotor": "Hammersonic",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 950.000 – Rp 2.800.000",
        "priceMin": 950000, "priceMax": 2800000,
        "ticketCategories": [
            {"name": "1-Day Pass", "price": "Rp 950.000"},
            {"name": "2-Day Pass", "price": "Rp 1.700.000"},
            {"name": "VIP 1-Day",  "price": "Rp 1.800.000"},
            {"name": "VIP 2-Day",  "price": "Rp 2.800.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "MCR headliner Hammersonic 2026. Membawakan hits legendaris Welcome to the Black Parade dan Helena di hadapan ribuan fans.",
        "sources": ["tempo.co", "nme.com", "kerrang.com"],
    },
    {
        "id": "laufey-jakarta-2026",
        "artist": "Laufey",
        "tour": "A Matter of Time Tour",
        "genre": "jazz", "emoji": "🌸",
        "dates": ["23 Mei 2026"],
        "rawDateStr": "2026-05-23",
        "time": "20:00 WIB",
        "venue": "NICE PIK2",
        "city": "Pantai Indah Kapuk 2, Tangerang",
        "promotor": "Ismaya Live",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://laufeyjakarta.com",
        "priceRange": "Rp 850.000 – Rp 3.200.000",
        "priceMin": 850000, "priceMax": 3200000,
        "ticketCategories": [
            {"name": "GA",      "price": "Rp 850.000"},
            {"name": "Tribune", "price": "Rp 1.400.000"},
            {"name": "CAT 2",   "price": "Rp 2.000.000"},
            {"name": "CAT 1",   "price": "Rp 2.600.000"},
            {"name": "VIP",     "price": "Rp 3.200.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "Grammy Award-winning Laufey membawa A Matter of Time Tour ke Jakarta setelah sold out di Singapore. Memukau fans dengan nuansa jazz dan orkestra live.",
        "sources": ["tempo.co", "laufeyjakarta.com"],
    },
    {
        "id": "java-jazz-2026",
        "artist": "Java Jazz Festival 2026",
        "tour": "myBCA International Java Jazz Festival",
        "genre": "jazz", "emoji": "🎷",
        "dates": ["29 Mei 2026", "30 Mei 2026", "31 Mei 2026"],
        "rawDateStr": "2026-05-29",
        "time": "15:00 – 01:00 WIB",
        "venue": "NICE PIK2",
        "city": "Pantai Indah Kapuk 2, Tangerang",
        "promotor": "Java Festival Production",
        "ticketPlatform": "jfp.events",
        "ticketUrl": "https://jfp.events",
        "priceRange": "Cek jfp.events",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [
            {"name": "Daily Pass",   "price": "Cek jfp.events"},
            {"name": "3 Days Pass",  "price": "Cek jfp.events"},
            {"name": "VIP Package",  "price": "Cek jfp.events"},
        ],
        "lineup": ["Jon Batiste", "Wave to Earth", "Ella Mai", "Daniel Caesar",
                   "Dave Koz & Summer Horns", "Lisa Simone", "Thee Sacred Souls",
                   "Earth Wind & Fire by Al McKay"],
        "confirmStatus": "confirmed", "hot": False,
        "description": "Festival jazz terbesar Asia. Lineup 2026: Jon Batiste (Grammy x8), Wave to Earth, Ella Mai, Daniel Caesar, Dave Koz & Summer Horns, Lisa Simone, Earth Wind & Fire by Al McKay.",
        "sources": ["thejakartapost.com", "indiplomacy.com", "javajazzfestival.com"],
    },
    # ── PAST (tambahan) ──
    {
        "id": "green-day-jakarta-2025",
        "artist": "Green Day",
        "tour": "The Saviors Tour (Hammersonic 10th Anniversary)",
        "genre": "rock", "emoji": "🟢",
        "dates": ["15 Februari 2025"],
        "rawDateStr": "2025-02-15",
        "time": "21:00 WIB",
        "venue": "Pantai Carnaval Ancol",
        "city": "Jakarta Utara",
        "promotor": "Hammersonic / Rajawali Indonesia",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 850.000 – Rp 2.500.000",
        "priceMin": 850000, "priceMax": 2500000,
        "ticketCategories": [
            {"name": "1-Day Pass", "price": "Rp 850.000"},
            {"name": "VIP 1-Day",  "price": "Rp 1.800.000"},
            {"name": "VIP 2-Day",  "price": "Rp 2.500.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "Green Day kembali ke Jakarta setelah 29 tahun absen! Headliner Hammersonic ke-10 di Carnaval Ancol. Billie Joe Armstrong cs membawakan Basket Case, American Idiot, dan Boulevard of Broken Dreams.",
        "sources": ["greendayauthority.com", "tempo.co"],
    },
    {
        "id": "exo-exhorizon-jakarta-2026",
        "artist": "EXO",
        "tour": "EXO PLANET #6 EXhOrizon",
        "genre": "kpop", "emoji": "🌌",
        "dates": ["6 Juni 2026", "7 Juni 2026"],
        "rawDateStr": "2026-06-06",
        "time": "19:00 WIB",
        "venue": "Indonesia Arena, GBK",
        "city": "Senayan, Jakarta Pusat",
        "promotor": "Dyandra Global Edutainment",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 1.550.000 – Rp 5.000.000",
        "priceMin": 1550000, "priceMax": 5000000,
        "ticketCategories": [
            {"name": "CAT 4", "price": "Rp 1.550.000"},
            {"name": "CAT 3", "price": "Rp 2.200.000"},
            {"name": "CAT 2", "price": "Rp 3.000.000"},
            {"name": "CAT 1", "price": "Rp 3.800.000"},
            {"name": "VIP",   "price": "Rp 5.000.000"},
        ],
        "confirmStatus": "confirmed", "hot": False,
        "description": "EXO kembali ke Jakarta dalam tur EXhOrizon selama 2 malam di Indonesia Arena. Lima member tampil memukau di hadapan ribuan EXO-L Indonesia.",
        "sources": ["cnbcindonesia.com", "kapanlagi.com"],
    },
    # ── UPCOMING CONFIRMED ──
    {
        "id": "avenged-sevenfold-jakarta-2026",
        "artist": "Avenged Sevenfold (A7X)",
        "tour": "Asia Tour 2026",
        "genre": "rock", "emoji": "💀",
        "dates": ["10 Oktober 2026"],
        "rawDateStr": "2026-10-10",
        "time": "19:00 WIB",
        "venue": "Jakarta International Stadium (JIS)",
        "city": "Tanjung Priok, Jakarta Utara",
        "promotor": "Mainstager Indonesia",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 665.000 – Rp 2.550.000",
        "priceMin": 665000, "priceMax": 2550000,
        "ticketCategories": [
            {"name": "Festival",  "price": "Rp 665.000"},
            {"name": "Tribune D", "price": "Rp 800.000"},
            {"name": "Tribune C", "price": "Rp 1.000.000"},
            {"name": "Tribune B", "price": "Rp 1.350.000"},
            {"name": "Tribune A", "price": "Rp 1.750.000"},
            {"name": "Pit",       "price": "Rp 2.000.000"},
            {"name": "VIP",       "price": "Rp 2.550.000"},
        ],
        "confirmStatus": "confirmed", "hot": True,
        "description": "Avenged Sevenfold kembali ke Indonesia setelah lebih dari satu dekade! M. Shadows, Synyster Gates, Zacky Vengeance, Johnny Christ & Brooks Wackerman tampil di JIS.",
        "sources": ["rri.co.id", "bandwagon.asia", "avengedsevenfold.com"],
    },
    {
        "id": "bryan-adams-jakarta-2026",
        "artist": "Bryan Adams & Ari Lasso",
        "tour": "Live in Jakarta",
        "genre": "rock", "emoji": "🎸",
        "dates": ["3 Oktober 2026"],
        "rawDateStr": "2026-10-03",
        "time": "19:30 WIB",
        "venue": "Beach City International Stadium",
        "city": "Ancol, Jakarta Utara",
        "promotor": "Produksi Lokal",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://bryanadamsjakarta.com",
        "priceRange": "Cek bryanadamsjakarta.com",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Various", "price": "Cek website resmi"}],
        "confirmStatus": "confirmed", "hot": False,
        "description": "Kolaborasi Bryan Adams dan Ari Lasso di Ancol Beach City Stadium. Bryan Adams terkenal dengan Summer of 69, Run to You, dan Everything I Do.",
        "sources": ["bryanadamsjakarta.com", "shopee.co.id"],
    },
    {
        "id": "the-neighbourhood-jakarta-2026",
        "artist": "The Neighbourhood",
        "tour": "THE WOURLD TOUR",
        "genre": "pop", "emoji": "🖤",
        "dates": ["18 Juli 2026"],
        "rawDateStr": "2026-07-18",
        "time": "20:00 WIB",
        "venue": "Istora Senayan",
        "city": "Senayan, Jakarta Selatan",
        "promotor": "iMe Indonesia",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://loket.com",
        "priceRange": "Rp 750.000 – Rp 2.800.000",
        "priceMin": 750000, "priceMax": 2800000,
        "ticketCategories": [
            {"name": "Tribune",   "price": "Rp 750.000"},
            {"name": "CAT 2",     "price": "Rp 1.200.000"},
            {"name": "CAT 1",     "price": "Rp 1.800.000"},
            {"name": "Pit / GA",  "price": "Rp 2.200.000"},
            {"name": "VIP",       "price": "Rp 2.800.000"},
        ],
        "confirmStatus": "confirmed", "hot": True,
        "description": "The Neighbourhood (The NBHD) membawa THE WOURLD TOUR ke Jakarta, stop final Asia Tenggara mereka. Terkenal dengan Sweater Weather, Stargazing, dan Afraid.",
        "sources": ["songkick.com", "everythingindo.com"],
    },
    {
        "id": "lalala-fest-2026",
        "artist": "LaLaLa Festival 2026",
        "tour": "LaLaLa Fest 10th Anniversary",
        "genre": "indie", "emoji": "🌈",
        "dates": ["22 Agustus 2026", "23 Agustus 2026"],
        "rawDateStr": "2026-08-22",
        "time": "12:00 – 23:00 WIB",
        "venue": "JIEXPO Kemayoran",
        "city": "Kemayoran, Jakarta Pusat",
        "promotor": "LaLaLa Entertainment",
        "ticketPlatform": "Loket.com",
        "ticketUrl": "https://lalalafest.com",
        "priceRange": "Rp 600.000 – Rp 2.500.000",
        "priceMin": 600000, "priceMax": 2500000,
        "ticketCategories": [
            {"name": "1-Day Pass", "price": "Rp 600.000"},
            {"name": "2-Day Pass", "price": "Rp 1.100.000"},
            {"name": "VIP 1-Day",  "price": "Rp 1.400.000"},
            {"name": "VIP 2-Day",  "price": "Rp 2.500.000"},
        ],
        "lineup": ["Steve Lacy", "Rex Orange County", "The Flaming Lips", "Two Door Cinema Club",
                   "Kodaline", "HONNE", "BE:FIRST", "Astrid S", "Jordan Rakei", "Matt Maltese", "Flo"],
        "confirmStatus": "confirmed", "hot": True,
        "description": "Festival indie-pop terbesar Indonesia! Headliners: Steve Lacy, Rex Orange County, The Flaming Lips, Two Door Cinema Club, Kodaline, HONNE, BE:FIRST.",
        "sources": ["lalalafest.com", "tokyohive.com", "billboardphilippines.com"],
    },
    {
        "id": "five-sos-jakarta-2026",
        "artist": "5 Seconds of Summer (5SOS)",
        "tour": "EVERYONE'S A STAR! World Tour",
        "genre": "pop", "emoji": "⭐",
        "dates": ["TBA – November 2026"],
        "rawDateStr": "2026-11-13",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta / Tangerang",
        "promotor": "Live Nation Asia",
        "ticketPlatform": "5sosjakarta.com",
        "ticketUrl": "https://5sosjakarta.com",
        "priceRange": "Cek 5sosjakarta.com",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Tickets on sale 12.00 PM WIB", "price": "Cek 5sosjakarta.com"}],
        "confirmStatus": "confirmed", "hot": True,
        "description": "5 Seconds of Summer kembali ke Indonesia dalam EVERYONE'S A STAR! World Tour. Website resmi 5sosjakarta.com sudah aktif. Asia tour: Bangkok (9 Nov), Jakarta (TBA), KL (17 Nov).",
        "sources": ["5sosjakarta.com", "thesmartlocal.my", "livenation.sg"],
    },
    # ── RUMOR (tambahan) ──
    {
        "id": "enhypen-jakarta-2027",
        "artist": "ENHYPEN",
        "tour": "BLOOD SAGA World Tour",
        "genre": "kpop", "emoji": "🩸",
        "dates": ["TBA – Early 2027"],
        "rawDateStr": "2027-02-01",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta / Tangerang",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://enhypenbloodsagatour.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "Belum diumumkan"}],
        "confirmStatus": "rumor", "hot": True,
        "rumorDetail": "Chosun.com (Mar 2026) menyebut ENHYPEN akan tour ke Jakarta sebagai bagian BLOOD SAGA World Tour by March 2027. Tanggal dan venue spesifik BELUM diumumkan resmi.",
        "description": "ENHYPEN mengumumkan tur dunia BLOOD SAGA (2026-2027). Indonesia disebut sebagai salah satu stop Asia awal 2027.",
        "sources": ["chosun.com", "kpopnewswire.com"],
    },
    {
        "id": "byeon-woo-seok-jakarta-2026",
        "artist": "Byeon Woo-seok",
        "tour": "2026 Fan Meeting Tour The Secret Library",
        "genre": "kpop", "emoji": "📚",
        "dates": ["TBA – Late 2026 / Early 2027"],
        "rawDateStr": "2026-11-01",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://instagram.com/varoentertainment",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "Belum diumumkan"}],
        "confirmStatus": "rumor", "hot": True,
        "rumorDetail": "VARO Entertainment mengumumkan tur Asia The Secret Library per 9 Juni 2026 dengan Jakarta sebagai salah satu stop. Tanggal & venue spesifik BELUM diumumkan.",
        "description": "Aktor Korea Byeon Woo-seok (Lovely Runner) fan meeting tur Asia 2026. Jakarta masuk daftar kota bersama Seoul, Bangkok, Yokohama, Taipei, Singapore, Manila, Hong Kong.",
        "sources": ["chosun.com", "gmanetwork.com"],
    },
    {
        "id": "dua-lipa-jakarta-rumor",
        "artist": "Dua Lipa",
        "tour": "Reschedule Radical Optimism / New Tour",
        "genre": "pop", "emoji": "💃",
        "dates": ["TBA – 2026/2027"],
        "rawDateStr": "2027-01-01",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://dualipa.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "TBA"}],
        "confirmStatus": "rumor", "hot": False,
        "rumorDetail": "Dua Lipa cancel konser Jakarta (9 Nov 2024) menit terakhir karena unsafe staging. Belum ada pengumuman resmi reschedule atau konser baru.",
        "description": "Dua Lipa cancel saat hendak tampil di Indonesia Arena (Nov 2024). Fans Indonesia berharap ia kembali. Hingga kini belum ada konfirmasi.",
        "sources": ["bandwagon.asia", "deadline.com"],
    },
    {
        "id": "the-weeknd-jakarta-2026",
        "artist": "The Weeknd",
        "tour": "After Hours Til Dawn Stadium Tour Asia",
        "genre": "pop", "emoji": "🌙",
        "dates": ["26 September 2026", "27 September 2026"],
        "rawDateStr": "2026-09-26",
        "time": "19:00 WIB",
        "venue": "Jakarta International Stadium (JIS)",
        "city": "Tanjung Priok, Jakarta Utara",
        "promotor": "Live Nation Asia",
        "ticketPlatform": "Live Nation",
        "ticketUrl": "https://www.livenation.com",
        "priceRange": "Rp 1.000.000 – Rp 5.500.000",
        "priceMin": 1000000, "priceMax": 5500000,
        "ticketCategories": [
            {"name": "Tribune D",    "price": "Rp 1.000.000"},
            {"name": "Tribune C",    "price": "Rp 1.600.000"},
            {"name": "Tribune B",    "price": "Rp 2.200.000"},
            {"name": "Tribune A",    "price": "Rp 3.000.000"},
            {"name": "Pit Standing", "price": "Rp 3.800.000"},
            {"name": "VIP Package",  "price": "Rp 5.500.000"},
        ],
        "confirmStatus": "confirmed", "hot": True,
        "description": "The Weeknd membawa tur stadion After Hours Til Dawn ke Jakarta 2 malam di JIS. Leg final dari salah satu tur paling sukses dalam sejarah musik dunia.",
        "sources": ["karlobag.eu", "billboard.com", "afterhourstildawntour2026.com"],
    },
    {
        "id": "mcr-jis-2026",
        "artist": "My Chemical Romance",
        "tour": "Long Live the Black Parade Asia Tour",
        "genre": "rock", "emoji": "🖤",
        "dates": ["22 November 2026"],
        "rawDateStr": "2026-11-22",
        "time": "19:00 WIB",
        "venue": "Jakarta International Stadium (JIS)",
        "city": "Tanjung Priok, Jakarta Utara",
        "promotor": "iMe Indonesia",
        "ticketPlatform": "tiket.com",
        "ticketUrl": "https://www.tiket.com/en-us/to-do/my-chemical-romance-live-in-jakarta-2026",
        "priceRange": "Rp 850.000 – Rp 4.000.000",
        "priceMin": 850000, "priceMax": 4000000,
        "ticketCategories": [
            {"name": "Tribune D",    "price": "Rp 850.000"},
            {"name": "Tribune C",    "price": "Rp 1.200.000"},
            {"name": "Tribune B",    "price": "Rp 1.800.000"},
            {"name": "Tribune A",    "price": "Rp 2.500.000"},
            {"name": "Pit Standing", "price": "Rp 3.000.000"},
            {"name": "VIP",          "price": "Rp 4.000.000"},
        ],
        "confirmStatus": "confirmed", "hot": True,
        "description": "MCR kembali ke Jakarta untuk konser standalone penuh di JIS! Bagian dari tur Long Live the Black Parade. Konser penuh 2+ jam dengan seluruh katalog hits.",
        "sources": ["tiket.com", "mcrjakarta.com", "thebeat.asia"],
    },
    {
        "id": "bts-jakarta-2026",
        "artist": "BTS",
        "tour": "BTS World Tour ARIRANG",
        "genre": "kpop", "emoji": "💜",
        "dates": ["26 Desember 2026", "27 Desember 2026"],
        "rawDateStr": "2026-12-26",
        "time": "18:00 WIB",
        "venue": "Gelora Bung Karno (GBK) Utama",
        "city": "Senayan, Jakarta Pusat",
        "promotor": "iMe Indonesia",
        "ticketPlatform": "btsworldtourofficial.com",
        "ticketUrl": "https://btsworldtourofficial.com",
        "priceRange": "Rp 1.800.000 – Rp 4.500.000",
        "priceMin": 1800000, "priceMax": 4500000,
        "ticketCategories": [
            {"name": "CAT 4 (Tribune)",  "price": "Rp 1.800.000"},
            {"name": "CAT 3 (Tribune)",  "price": "Rp 2.500.000"},
            {"name": "CAT 2 (Pit)",      "price": "Rp 3.200.000"},
            {"name": "CAT 1 (Floor)",    "price": "Rp 3.800.000"},
            {"name": "Soundcheck VIP",   "price": "Rp 4.500.000"},
        ],
        "confirmStatus": "confirmed", "hot": True,
        "description": "BTS kembali ke Jakarta setelah 4 tahun! Tur ARIRANG hadir dengan stage 360 derajat revolusioner di GBK Utama selama 2 malam. General on-sale via btsworldtourofficial.com.",
        "sources": ["tempo.co", "billboard.com", "ndtvprofit.com"],
    },
    # ── RUMOR ──
    {
        "id": "aespa-jakarta-rumor",
        "artist": "aespa",
        "tour": "SYNK : COMPLæXITY World Tour",
        "genre": "kpop", "emoji": "🤖",
        "dates": ["TBA – Late 2026 / Early 2027"],
        "rawDateStr": "2026-12-01",
        "time": "TBA",
        "venue": "TBA (kemungkinan ICE BSD atau NICE PIK2)",
        "city": "Jakarta / Tangerang",
        "promotor": "Belum diumumkan",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://aespaworldtour.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "Belum diumumkan"}],
        "confirmStatus": "rumor", "hot": True,
        "rumorDetail": "Tour SYNK : COMPLæXITY resmi diumumkan Live Nation (Apr 2026) dengan stop Asia, namun tanggal & venue Indonesia BELUM dikonfirmasi. Ticketing Asia diumumkan at a later date.",
        "description": "aespa mengumumkan tur dunia SYNK : COMPLæXITY (Agu 2026 – Feb 2027). Negara Asia belum dirinci lengkap. Indonesia kandidat kuat karena basis fan besar.",
        "sources": ["livenation.com", "justjared.com", "aespaworldtour.com"],
    },
    {
        "id": "ed-sheeran-jakarta-rumor",
        "artist": "Ed Sheeran",
        "tour": "LOOP Tour",
        "genre": "pop", "emoji": "🎶",
        "dates": ["TBA – 2026 (pernah dibatalkan, janji kembali)"],
        "rawDateStr": "2026-10-01",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://edsheeran.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "TBA"}],
        "confirmStatus": "rumor", "hot": False,
        "rumorDetail": "Ed Sheeran pernah cancel konser Jakarta dan berjanji kembali. LOOP Tour 2026 fokus ke Australia, NZ, dan Amerika. Indonesia belum masuk jadwal resmi.",
        "description": "Ed Sheeran dalam LOOP Tour 2026. Belum ada tanggal resmi untuk Indonesia namun rumor kuat berdasarkan janji untuk kembali.",
        "sources": ["coconuts.co", "wikipedia.org"],
    },
    {
        "id": "coldplay-jakarta-rumor",
        "artist": "Coldplay",
        "tour": "Music of the Spheres World Tour (Potential Return)",
        "genre": "pop", "emoji": "🪐",
        "dates": ["TBA – 2027 (kemungkinan)"],
        "rawDateStr": "2027-01-01",
        "time": "TBA",
        "venue": "TBA (kemungkinan GBK)",
        "city": "Jakarta",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://coldplay.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "TBA"}],
        "confirmStatus": "rumor", "hot": True,
        "rumorDetail": "Coldplay pause tur setelah Wembley Sep 2025, restart 2027. Konser Jakarta 2023 sangat sukses. Spekulasi return 2027 sangat kuat. BELUM ada konfirmasi resmi.",
        "description": "Setelah konser fenomenal di GBK (2023), Coldplay dirumorkan kembali untuk leg 2027. Indonesia jadi kandidat terkuat karena antusiasme fans yang luar biasa.",
        "sources": ["wikipedia.org", "coldplaytour.org"],
    },
    {
        "id": "taylor-swift-jakarta-rumor",
        "artist": "Taylor Swift",
        "tour": "New Tour (TBA)",
        "genre": "pop", "emoji": "✨",
        "dates": ["TBA – Belum ada indikasi jelas"],
        "rawDateStr": "2027-06-01",
        "time": "TBA",
        "venue": "TBA",
        "city": "Jakarta",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": "https://taylorswift.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0, "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "TBA"}],
        "confirmStatus": "rumor", "hot": True,
        "rumorDetail": "Eras Tour tidak mampir ke Indonesia. Taylor Swift belum umumkan tur baru 2026/2027. Rumor murni harapan fans, belum ada konfirmasi resmi apapun.",
        "description": "Rumor Taylor Swift ke Jakarta selalu muncul tiap tahun. Pemerintah Indonesia bahkan pernah aktif mengupayakannya. Sampai kini tidak ada konfirmasi resmi.",
        "sources": ["stylecaster.com", "jakartaglobe.id"],
    },
]


# ── Scrapers ──────────────────────────────────────────────────────────────────

def fetch(url: str, timeout: int = 15) -> BeautifulSoup | None:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as exc:
        log.warning(f"fetch failed: {url} → {exc}")
        return None


def scrape_bandwagon() -> list[dict]:
    """Scrape Bandwagon Asia for Indonesia concert news."""
    found = []
    url = "https://www.bandwagon.asia/articles?tag=indonesia"
    soup = fetch(url)
    if not soup:
        return found

    articles = soup.select("article, .article-card, .post-card, [class*='article']")
    for art in articles[:20]:
        title_el = art.select_one("h1, h2, h3, h4, .title, [class*='title']")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        # Only care about concert announcements
        keywords = ["concert", "tour", "jakarta", "indonesia", "live", "konser"]
        if not any(k in title.lower() for k in keywords):
            continue
        link_el = art.select_one("a[href]")
        link = link_el["href"] if link_el else ""
        if link and not link.startswith("http"):
            link = "https://www.bandwagon.asia" + link
        found.append({"title": title, "url": link, "source": "bandwagon.asia"})

    log.info(f"bandwagon: {len(found)} articles found")
    return found


def scrape_jambase() -> list[dict]:
    """Scrape JamBase Indonesia concerts page."""
    found = []
    url = "https://www.jambase.com/concerts/id"
    soup = fetch(url)
    if not soup:
        return found

    rows = soup.select(".event-listing, .concert-row, [class*='event'], [class*='show']")
    for row in rows[:30]:
        artist_el = row.select_one(".artist, .headliner, h3, h4, strong, [class*='artist']")
        date_el   = row.select_one(".date, time, [class*='date']")
        venue_el  = row.select_one(".venue, [class*='venue']")

        artist = artist_el.get_text(strip=True) if artist_el else ""
        date   = date_el.get_text(strip=True)   if date_el   else ""
        venue  = venue_el.get_text(strip=True)  if venue_el  else ""

        if artist:
            found.append({"artist": artist, "date": date, "venue": venue, "source": "jambase.com"})

    log.info(f"jambase: {len(found)} shows found")
    return found


def scrape_tempo() -> list[dict]:
    """Scrape Tempo.co entertainment for Indonesia concert news."""
    found = []
    url = "https://en.tempo.co/topic/concert"
    soup = fetch(url)
    if not soup:
        return found

    articles = soup.select("article, .card, [class*='article'], [class*='news']")
    for art in articles[:20]:
        title_el = art.select_one("h1, h2, h3, h4, a")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        keywords = ["concert", "jakarta", "indonesia", "tour", "live", "konser"]
        if not any(k in title.lower() for k in keywords):
            continue
        link_el = art.select_one("a[href]")
        link = link_el["href"] if link_el else ""
        found.append({"title": title, "url": link, "source": "tempo.co"})

    log.info(f"tempo: {len(found)} articles found")
    return found


def scrape_thejakartapost() -> list[dict]:
    """Scrape The Jakarta Post for concert/music news."""
    found = []
    url = "https://www.thejakartapost.com/culture"
    soup = fetch(url)
    if not soup:
        return found

    articles = soup.select("article, .article, [class*='article'], [class*='story']")
    for art in articles[:20]:
        title_el = art.select_one("h1, h2, h3, h4")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        keywords = ["concert", "tour", "live", "music", "perform", "konser"]
        if not any(k in title.lower() for k in keywords):
            continue
        link_el = art.select_one("a[href]")
        link = link_el["href"] if link_el else ""
        found.append({"title": title, "url": link, "source": "thejakartapost.com"})

    log.info(f"jakartapost: {len(found)} articles found")
    return found


def scrape_songkick() -> list[dict]:
    """Scrape Songkick Indonesia upcoming concerts."""
    found = []
    url = "https://www.songkick.com/countries/105-indonesia/calendar"
    soup = fetch(url)
    if not soup:
        return found

    events = soup.select("li.event, [class*='event-listing'], [class*='concert']")
    for ev in events[:30]:
        artist_el = ev.select_one(".artists, .summary, h3, strong")
        date_el   = ev.select_one("time, .date, [class*='date']")
        venue_el  = ev.select_one(".venue, [class*='venue']")

        artist = artist_el.get_text(strip=True) if artist_el else ""
        date   = date_el.get_text(strip=True)   if date_el   else ""
        venue  = venue_el.get_text(strip=True)  if venue_el  else ""

        if artist:
            found.append({"artist": artist, "date": date, "venue": venue, "source": "songkick.com"})

    log.info(f"songkick: {len(found)} events found")
    return found


# ── Merge & Deduplicate ───────────────────────────────────────────────────────

def normalize_artist(name: str) -> str:
    """Lowercase, strip punctuation for fuzzy matching."""
    return re.sub(r"[^a-z0-9 ]", "", name.lower()).strip()


def concerts_already_exist(scraped_artist: str, existing_ids: set[str]) -> bool:
    """Check if we already have this artist in our seed data."""
    norm = normalize_artist(scraped_artist)
    for cid in existing_ids:
        if norm and norm in cid.replace("-", " "):
            return True
    return False


def build_new_concert_from_scraped(item: dict, idx: int) -> dict | None:
    """
    Try to build a minimal concert dict from scraped raw data.
    Returns None if not enough info.
    """
    artist = item.get("artist", item.get("title", "")).strip()
    if not artist or len(artist) < 3:
        return None

    date_raw  = item.get("date", "TBA")
    venue_raw = item.get("venue", "TBA")
    source    = item.get("source", "scraped")
    url_ref   = item.get("url", "")

    slug = re.sub(r"[^a-z0-9]+", "-", artist.lower()).strip("-")
    concert_id = f"scraped-{slug}-{idx}"

    return {
        "id": concert_id,
        "artist": artist,
        "tour": f"{artist} Live in Indonesia",
        "genre": "pop",
        "emoji": "🎵",
        "dates": [date_raw if date_raw else "TBA"],
        "rawDateStr": "2026-12-31",  # default far future for unknowns
        "time": "TBA",
        "venue": venue_raw if venue_raw else "TBA",
        "city": "Jakarta, Indonesia",
        "promotor": "TBA",
        "ticketPlatform": "TBA",
        "ticketUrl": url_ref or "https://loket.com",
        "priceRange": "Belum diumumkan",
        "priceMin": 0,
        "priceMax": 0,
        "ticketCategories": [{"name": "Semua kategori", "price": "TBA"}],
        "confirmStatus": "rumor",
        "hot": False,
        "rumorDetail": f"Ditemukan dari {source} pada {TODAY_STR}. Belum ada konfirmasi resmi dari promotor.",
        "description": f"{artist} terdeteksi akan tampil di Indonesia berdasarkan data dari {source}. Info ini akan diupdate saat ada konfirmasi resmi.",
        "sources": [source],
        "_scraped": True,
        "_scrapedAt": TODAY_STR,
    }


# ── app.js writer ─────────────────────────────────────────────────────────────

JS_CONCERT_TEMPLATE = """\
  {{
    id: '{id}',
    artist: '{artist}',
    tour: '{tour}',
    genre: '{genre}', emoji: '{emoji}',
    dates: {dates_js},
    rawDate: new Date('{rawDateStr}'),
    time: '{time}',
    venue: '{venue}',
    city: '{city}',
    promotor: '{promotor}',
    ticketPlatform: '{ticketPlatform}',
    ticketUrl: '{ticketUrl}',
    priceRange: '{priceRange}',
    priceMin: {priceMin}, priceMax: {priceMax},
    ticketCategories: {ticket_cats_js},{lineup_js}
    confirmStatus: '{confirmStatus}', hot: {hot_js},{rumor_detail_js}
    description: '{description}',
    sources: {sources_js},
  }}"""


def escape_js(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")


def concert_to_js(c: dict) -> str:
    dates_js = json.dumps(c.get("dates", ["TBA"]), ensure_ascii=False)
    ticket_cats = c.get("ticketCategories", [])
    ticket_cats_js = "[\n" + "".join(
        f"      {{ name: '{escape_js(t['name'])}', price: '{escape_js(t['price'])}' }},\n"
        for t in ticket_cats
    ) + "    ]"
    lineup = c.get("lineup")
    lineup_js = "\n    lineup: " + json.dumps(lineup, ensure_ascii=False) + "," if lineup else ""
    rumor_detail = c.get("rumorDetail", "")
    rumor_detail_js = f"\n    rumorDetail: '{escape_js(rumor_detail)}'," if rumor_detail else ""
    sources_js = json.dumps(c.get("sources", []), ensure_ascii=False)

    return JS_CONCERT_TEMPLATE.format(
        id=escape_js(c["id"]),
        artist=escape_js(c["artist"]),
        tour=escape_js(c["tour"]),
        genre=c.get("genre", "pop"),
        emoji=c.get("emoji", "🎵"),
        dates_js=dates_js,
        rawDateStr=c.get("rawDateStr", "2026-12-31"),
        time=escape_js(c.get("time", "TBA")),
        venue=escape_js(c.get("venue", "TBA")),
        city=escape_js(c.get("city", "Indonesia")),
        promotor=escape_js(c.get("promotor", "TBA")),
        ticketPlatform=escape_js(c.get("ticketPlatform", "TBA")),
        ticketUrl=escape_js(c.get("ticketUrl", "#")),
        priceRange=escape_js(c.get("priceRange", "TBA")),
        priceMin=c.get("priceMin", 0),
        priceMax=c.get("priceMax", 0),
        ticket_cats_js=ticket_cats_js,
        lineup_js=lineup_js,
        confirmStatus=c.get("confirmStatus", "rumor"),
        hot_js="true" if c.get("hot") else "false",
        rumor_detail_js=rumor_detail_js,
        description=escape_js(c.get("description", "")),
        sources_js=sources_js,
    )


def read_existing_app_js() -> str:
    if APP_JS_PATH.exists():
        return APP_JS_PATH.read_text(encoding="utf-8")
    return ""


def write_app_js(concerts: list[dict], last_updated: str):
    """Overwrite the CONCERTS array inside app.js with fresh data."""
    concerts_js_parts = [concert_to_js(c) for c in concerts]
    concerts_js = "[\n\n" + ",\n\n".join(concerts_js_parts) + "\n\n]"

    existing = read_existing_app_js()

    # Replace the CONCERTS array block
    pattern = r"const CONCERTS\s*=\s*\[[\s\S]*?\n\];"
    new_block = f"const CONCERTS = {concerts_js};"

    if re.search(pattern, existing):
        new_content = re.sub(pattern, new_block, existing, count=1)
    else:
        # Prepend if not found (shouldn't happen)
        new_content = new_block + "\n\n" + existing

    # Update or insert last-updated comment
    ts_line = f"// Last auto-updated: {last_updated} WIB\n"
    if "// Last auto-updated:" in new_content:
        new_content = re.sub(r"// Last auto-updated:.*\n", ts_line, new_content)
    else:
        new_content = ts_line + new_content

    APP_JS_PATH.write_text(new_content, encoding="utf-8")
    log.info(f"app.js updated with {len(concerts)} concerts")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info(f"=== KonserIndo Scraper — {TODAY_STR} {NOW_WIB.strftime('%H:%M')} WIB ===")

    # 1. Start with seed concerts
    concerts = list(SEED_CONCERTS)
    existing_ids = {c["id"] for c in concerts}

    # 2. Run scrapers
    raw_items: list[dict] = []
    scrapers = [
        ("Bandwagon", scrape_bandwagon),
        ("JamBase",   scrape_jambase),
        ("Tempo",     scrape_tempo),
        ("JakartaPost", scrape_thejakartapost),
        ("Songkick",  scrape_songkick),
    ]

    for name, fn in scrapers:
        log.info(f"Running scraper: {name}")
        try:
            items = fn()
            raw_items.extend(items)
        except Exception as exc:
            log.warning(f"{name} scraper error: {exc}")
        time.sleep(2)  # polite delay

    # 3. Filter & merge new concerts
    new_count = 0
    for i, item in enumerate(raw_items):
        artist = item.get("artist", item.get("title", ""))
        if not artist:
            continue
        if concerts_already_exist(artist, existing_ids):
            continue
        new_concert = build_new_concert_from_scraped(item, i)
        if new_concert and new_concert["id"] not in existing_ids:
            concerts.append(new_concert)
            existing_ids.add(new_concert["id"])
            new_count += 1
            log.info(f"  + NEW: {new_concert['artist']} ({new_concert['id']})")

    log.info(f"Total concerts: {len(concerts)} ({new_count} new from scraping)")

    # 4. Write updated app.js
    last_updated = NOW_WIB.strftime("%d %b %Y %H:%M")
    write_app_js(concerts, last_updated)

    log.info("Done!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
