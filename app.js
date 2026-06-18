// Last auto-updated: 15 Jun 2026 09:00 WIB
/* ============================================
   KonserIndo — Concert Data & App Logic
   Data: Tempo.co, Billboard, NME, Bandwagon Asia,
   JamBase, tiket.com, loket.com, Weverse, Soompi,
   RRI.co.id, CNBCIndonesia, KapanLagi
   Last updated: June 15, 2026
   ============================================ */

const TODAY = new Date(); // selalu tanggal hari ini

/* ============================================
   ARTIST IMAGES — URL absolut ke domain sendiri
   Naming convention: https://www.list-concert-tour.web.id/images/[id].jpeg
   ============================================ */
const WEB_BASE = 'https://www.list-concert-tour.web.id';
const ARTIST_IMAGES = {
  // ── PAST ──
  'blackpink-deadline-2025':        WEB_BASE + '/images/blackpink-deadline-2025.jpeg?v=2',
  'green-day-jakarta-2025':         WEB_BASE + '/images/green-day-jakarta-2025.jpeg?v=2',
  'ateez-2026':                     WEB_BASE + '/images/ateez-2026.jpeg?v=2',
  'dream-theater-2026':             WEB_BASE + '/images/dream-theater-2026.jpeg?v=2',
  'mcr-hammersonic-2026':           WEB_BASE + '/images/mcr-hammersonic-2026.jpeg?v=2',
  'laufey-jakarta-2026':            WEB_BASE + '/images/laufey-jakarta-2026.jpeg?v=2',
  'exo-exhorizon-jakarta-2026':     WEB_BASE + '/images/exo-exhorizon-jakarta-2026.jpeg?v=2',
  'fforever-jakarta-2026':          WEB_BASE + '/images/fforever-jakarta-2026.jpeg?v=2',
  // ── UPCOMING CONFIRMED ──
  'bts-jakarta-2026':               WEB_BASE + '/images/bts-jakarta-2026.jpeg?v=2',
  'avenged-sevenfold-jakarta-2026': WEB_BASE + '/images/avenged-sevenfold-jakarta-2026.jpeg?v=2',
  'the-weeknd-jakarta-2026':        WEB_BASE + '/images/the-weeknd-jakarta-2026.jpeg?v=2',
  'mcr-jis-2026':                   WEB_BASE + '/images/mcr-jis-2026.jpeg?v=2',
  'the-neighbourhood-jakarta-2026': WEB_BASE + '/images/the-neighbourhood-jakarta-2026.jpeg?v=2',
  'lalala-fest-2026':               WEB_BASE + '/images/lalala-fest-2026.jpeg?v=2',
  'five-sos-jakarta-2026':          WEB_BASE + '/images/five-sos-jakarta-2026.jpeg?v=2',
  'java-jazz-2026':                 WEB_BASE + '/images/java-jazz-2026.jpeg?v=2',
  'bryan-adams-jakarta-2026':       WEB_BASE + '/images/bryan-adams-jakarta-2026.jpeg?v=2',
  'westlife-jakarta-2027':          WEB_BASE + '/images/westlife-jakarta-2027.jpeg?v=2',
  'jaehyun-jakarta-2026':           WEB_BASE + '/images/jaehyun-jakarta-2026.jpeg?v=2',
  // ── NEW CONCERTS ──
  'aespa-jakarta-2026':             WEB_BASE + '/images/aespa-jakarta-2026.jpeg?v=2',
  'nct-wish-jakarta-2026':          WEB_BASE + '/images/nct-wish-jakarta-2026.jpeg?v=2',
  'deep-purple-jakarta-2026':       WEB_BASE + '/images/deep-purple-jakarta-2026.jpeg?v=2',
  'monsta-x-jakarta-2026':          WEB_BASE + '/images/monsta-x-jakarta-2026.jpeg?v=2',
  'treasure-jakarta-2026':          WEB_BASE + '/images/treasure-jakarta-2026.jpeg?v=2',
  'hammersonic-2026':               WEB_BASE + '/images/hammersonic-2026.jpeg?v=2',
  'one-ok-rock-jakarta-2026':       WEB_BASE + '/images/one-ok-rock-jakarta-2026.jpeg?v=2',
  'perses-jakarta-2026':            WEB_BASE + '/images/perses-jakarta-2026.jpeg?v=2',
  'kard-jakarta-2026':              WEB_BASE + '/images/kard-jakarta-2026.jpeg?v=2',
  'the-sounds-project-2026':        WEB_BASE + '/images/the-sounds-project-2026.jpeg?v=2',
  'babymonster-jakarta-2026':       WEB_BASE + '/images/babymonster-jakarta-2026.jpeg?v=2',
  'nancy-ajram-jakarta-2027':       WEB_BASE + '/images/nancy-ajram-jakarta-2027.jpeg?v=2',
  'metallica-jakarta-rumor':        WEB_BASE + '/images/metallica-jakarta-rumor.jpeg?v=2',
  'gnr-jakarta-rumor':              WEB_BASE + '/images/gnr-jakarta-rumor.jpeg?v=2',
  // ── RUMOR ──
  'ariana-grande-jakarta-rumor':    WEB_BASE + '/images/ariana-grande-jakarta-rumor.jpeg?v=2',
  'olivia-rodrigo-jakarta-rumor':   WEB_BASE + '/images/olivia-rodrigo-jakarta-rumor.jpeg?v=2',
  'charlie-puth-jakarta-rumor':     WEB_BASE + '/images/charlie-puth-jakarta-rumor.jpeg?v=2',
  'post-malone-jakarta-rumor':      WEB_BASE + '/images/post-malone-jakarta-rumor.jpeg?v=2',
  'bad-bunny-jakarta-rumor':        WEB_BASE + '/images/bad-bunny-jakarta-rumor.jpeg?v=2',
  'taylor-swift-jakarta-rumor':     WEB_BASE + '/images/taylor-swift-jakarta-rumor.jpeg?v=2',
  'coldplay-jakarta-rumor':         WEB_BASE + '/images/coldplay-jakarta-rumor.jpeg?v=2',
  'ed-sheeran-jakarta-rumor':       WEB_BASE + '/images/ed-sheeran-jakarta-rumor.jpeg?v=2',
  'dua-lipa-jakarta-rumor':         WEB_BASE + '/images/dua-lipa-jakarta-rumor.jpeg?v=2',
  'enhypen-jakarta-2027':           WEB_BASE + '/images/enhypen-jakarta-2027.jpeg?v=2',
  'byeon-woo-seok-jakarta-2026':    WEB_BASE + '/images/byeon-woo-seok-jakarta-2026.jpeg?v=2',
};

const CONCERTS = [

  {
    id: 'blackpink-deadline-2025',
    artist: 'BLACKPINK',
    tour: 'WORLD TOUR <DEADLINE>',
    genre: 'kpop', emoji: '🌸',
    dates: ["1 November 2025", "2 November 2025"],
    rawDate: new Date('2025-11-01'),
    time: '18:00 WIB',
    venue: 'Gelora Bung Karno (GBK) Utama',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'Live Nation Asia',
    ticketPlatform: 'tiket.com',
    ticketUrl: 'https://tiket.com',
    priceRange: 'Rp 1.000.000 – Rp 5.000.000',
    priceMin: 1000000, priceMax: 5000000,
    ticketCategories: [
      { name: 'CAT 4', price: 'Rp 1.000.000' },
      { name: 'CAT 3', price: 'Rp 1.800.000' },
      { name: 'CAT 2', price: 'Rp 2.800.000' },
      { name: 'CAT 1', price: 'Rp 3.800.000' },
      { name: 'VIP', price: 'Rp 5.000.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'BLACKPINK sukses menggelar konser DEADLINE di GBK selama 2 malam. Lebih dari 100.000 penonton hadir dan mengubah stadion menjadi pink dome. Salah satu konser K-Pop terbaik dalam sejarah Indonesia.',
    sources: ["weverse.io", "tempo.co", "thejakartapost.com"],
  },

  {
    id: 'fforever-jakarta-2026',
    artist: 'F✦FOREVER (F4 + Ashin)',
    tour: 'F✦FOREVER 1st World Tour',
    genre: 'pop', emoji: '⭐',
    dates: ["29 Mei 2026", "30 Mei 2026"],
    rawDate: new Date('2026-05-29'),
    time: '19:30 WIB',
    venue: 'Indonesia Arena, GBK',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'Color Asia Live',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://fforeverindonesia.com',
    priceRange: 'Cek Loket.com',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Various Categories', price: 'Cek loket.com' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'F4 (Jerry Yan, Van Ness Wu, Vic Chou) bersama Ashin (vokalis Mayday) tampil 2 malam di Indonesia Arena dengan stage eksklusif Four-Point Star. Nostalgia era Meteor Garden untuk jutaan fans Indonesia.',
    sources: ["fforeverindonesia.com", "cnbcindonesia.com"],
  },

  {
    id: 'ateez-2026',
    artist: 'ATEEZ',
    tour: 'ATEEZ 2026 World Tour In Your Fantasy',
    genre: 'kpop', emoji: '🌀',
    dates: ["31 Januari 2026"],
    rawDate: new Date('2026-01-31'),
    time: '19:00 WIB',
    venue: 'ICE BSD City Hall 5 & 6',
    city: 'Tangerang Selatan, Banten',
    promotor: 'AEG Presents Asia',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 750.000 – Rp 3.500.000',
    priceMin: 750000, priceMax: 3500000,
    ticketCategories: [
      { name: 'Festival', price: 'Rp 750.000' },
      { name: 'Standing', price: 'Rp 1.200.000' },
      { name: 'CAT 3', price: 'Rp 1.800.000' },
      { name: 'CAT 2', price: 'Rp 2.500.000' },
      { name: 'VIP', price: 'Rp 3.500.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'ATEEZ menggebrak ICE BSD dalam tur dunia In Your Fantasy. Penampilan perdana mereka di Jakarta disambut antusias oleh ribuan ATINY Indonesia.',
    sources: ["bandwagon.asia", "chosun.com"],
  },

  {
    id: 'dream-theater-2026',
    artist: 'Dream Theater',
    tour: '40th Anniversary World Tour',
    genre: 'rock', emoji: '🎸',
    dates: ["7 Februari 2026"],
    rawDate: new Date('2026-02-07'),
    time: '20:00 WIB',
    venue: 'Beach City International Stadium',
    city: 'Ancol, Jakarta Utara',
    promotor: 'Mainstager Indonesia',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://dreamtheaterjakarta2026.com',
    priceRange: 'Rp 900.000 – Rp 4.500.000',
    priceMin: 900000, priceMax: 4500000,
    ticketCategories: [
      { name: 'Festival B', price: 'Rp 900.000' },
      { name: 'Festival A', price: 'Rp 1.500.000' },
      { name: 'Tribun C', price: 'Rp 2.000.000' },
      { name: 'Tribun B', price: 'Rp 3.000.000' },
      { name: 'VIP', price: 'Rp 4.500.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'Dream Theater merayakan 40 tahun berkarya bersama formasi lengkap termasuk Mike Portnoy yang comeback setelah 14 tahun absen.',
    sources: ["dreamtheaterjakarta2026.com", "metaltalk.net"],
  },

  {
    id: 'mcr-hammersonic-2026',
    artist: 'My Chemical Romance',
    tour: 'Hammersonic Festival 2026',
    genre: 'rock', emoji: '🖤',
    dates: ["3 Mei 2026"],
    rawDate: new Date('2026-05-03'),
    time: '20:30 WIB',
    venue: 'Pantai Carnaval Ancol',
    city: 'Jakarta Utara',
    promotor: 'Hammersonic',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 950.000 – Rp 2.800.000',
    priceMin: 950000, priceMax: 2800000,
    ticketCategories: [
      { name: '1-Day Pass', price: 'Rp 950.000' },
      { name: '2-Day Pass', price: 'Rp 1.700.000' },
      { name: 'VIP 1-Day', price: 'Rp 1.800.000' },
      { name: 'VIP 2-Day', price: 'Rp 2.800.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'MCR headliner Hammersonic 2026. Membawakan hits legendaris Welcome to the Black Parade dan Helena di hadapan ribuan fans.',
    sources: ["tempo.co", "nme.com", "kerrang.com"],
  },

  {
    id: 'laufey-jakarta-2026',
    artist: 'Laufey',
    tour: 'A Matter of Time Tour',
    genre: 'jazz', emoji: '🌸',
    dates: ["23 Mei 2026"],
    rawDate: new Date('2026-05-23'),
    time: '20:00 WIB',
    venue: 'NICE PIK2',
    city: 'Pantai Indah Kapuk 2, Tangerang',
    promotor: 'Ismaya Live',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://laufeyjakarta.com',
    priceRange: 'Rp 850.000 – Rp 3.200.000',
    priceMin: 850000, priceMax: 3200000,
    ticketCategories: [
      { name: 'GA', price: 'Rp 850.000' },
      { name: 'Tribune', price: 'Rp 1.400.000' },
      { name: 'CAT 2', price: 'Rp 2.000.000' },
      { name: 'CAT 1', price: 'Rp 2.600.000' },
      { name: 'VIP', price: 'Rp 3.200.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'Grammy Award-winning Laufey membawa A Matter of Time Tour ke Jakarta setelah sold out di Singapore. Memukau fans dengan nuansa jazz dan orkestra live.',
    sources: ["tempo.co", "laufeyjakarta.com"],
  },

  {
    id: 'java-jazz-2026',
    artist: 'Java Jazz Festival 2026',
    tour: 'myBCA International Java Jazz Festival',
    genre: 'jazz', emoji: '🎷',
    dates: ["29 Mei 2026", "30 Mei 2026", "31 Mei 2026"],
    rawDate: new Date('2026-05-29'),
    time: '15:00 – 01:00 WIB',
    venue: 'NICE PIK2',
    city: 'Pantai Indah Kapuk 2, Tangerang',
    promotor: 'Java Festival Production',
    ticketPlatform: 'jfp.events',
    ticketUrl: 'https://jfp.events',
    priceRange: 'Cek jfp.events',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Daily Pass', price: 'Cek jfp.events' },
      { name: '3 Days Pass', price: 'Cek jfp.events' },
      { name: 'VIP Package', price: 'Cek jfp.events' },
    ],
    lineup: ["Jon Batiste", "Wave to Earth", "Ella Mai", "Daniel Caesar", "Dave Koz & Summer Horns", "Lisa Simone", "Thee Sacred Souls", "Earth Wind & Fire by Al McKay"],
    confirmStatus: 'confirmed', hot: false,
    description: 'Festival jazz terbesar Asia. Lineup 2026: Jon Batiste (Grammy x8), Wave to Earth, Ella Mai, Daniel Caesar, Dave Koz & Summer Horns, Lisa Simone, Earth Wind & Fire by Al McKay.',
    sources: ["thejakartapost.com", "indiplomacy.com", "javajazzfestival.com"],
  },

  {
    id: 'green-day-jakarta-2025',
    artist: 'Green Day',
    tour: 'The Saviors Tour (Hammersonic 10th Anniversary)',
    genre: 'rock', emoji: '🟢',
    dates: ["15 Februari 2025"],
    rawDate: new Date('2025-02-15'),
    time: '21:00 WIB',
    venue: 'Pantai Carnaval Ancol',
    city: 'Jakarta Utara',
    promotor: 'Hammersonic / Rajawali Indonesia',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 850.000 – Rp 2.500.000',
    priceMin: 850000, priceMax: 2500000,
    ticketCategories: [
      { name: '1-Day Pass', price: 'Rp 850.000' },
      { name: 'VIP 1-Day', price: 'Rp 1.800.000' },
      { name: 'VIP 2-Day', price: 'Rp 2.500.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'Green Day kembali ke Jakarta setelah 29 tahun absen! Headliner Hammersonic ke-10 di Carnaval Ancol. Billie Joe Armstrong cs membawakan Basket Case, American Idiot, dan Boulevard of Broken Dreams.',
    sources: ["greendayauthority.com", "tempo.co"],
  },

  {
    id: 'exo-exhorizon-jakarta-2026',
    artist: 'EXO',
    tour: 'EXO PLANET #6 EXhOrizon',
    genre: 'kpop', emoji: '🌌',
    dates: ["6 Juni 2026", "7 Juni 2026"],
    rawDate: new Date('2026-06-06'),
    time: '19:00 WIB',
    venue: 'Indonesia Arena, GBK',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'Dyandra Global Edutainment',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 1.550.000 – Rp 5.000.000',
    priceMin: 1550000, priceMax: 5000000,
    ticketCategories: [
      { name: 'CAT 4', price: 'Rp 1.550.000' },
      { name: 'CAT 3', price: 'Rp 2.200.000' },
      { name: 'CAT 2', price: 'Rp 3.000.000' },
      { name: 'CAT 1', price: 'Rp 3.800.000' },
      { name: 'VIP', price: 'Rp 5.000.000' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'EXO kembali ke Jakarta dalam tur EXhOrizon selama 2 malam di Indonesia Arena. Lima member tampil memukau di hadapan ribuan EXO-L Indonesia.',
    sources: ["cnbcindonesia.com", "kapanlagi.com"],
  },

  {
    id: 'avenged-sevenfold-jakarta-2026',
    artist: 'Avenged Sevenfold (A7X)',
    tour: 'Asia Tour 2026',
    genre: 'rock', emoji: '💀',
    dates: ["10 Oktober 2026"],
    rawDate: new Date('2026-10-10'),
    time: '19:00 WIB',
    venue: 'Jakarta International Stadium (JIS)',
    city: 'Tanjung Priok, Jakarta Utara',
    promotor: 'Mainstager Indonesia',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 665.000 – Rp 2.550.000',
    priceMin: 665000, priceMax: 2550000,
    ticketCategories: [
      { name: 'Festival', price: 'Rp 665.000' },
      { name: 'Tribune D', price: 'Rp 800.000' },
      { name: 'Tribune C', price: 'Rp 1.000.000' },
      { name: 'Tribune B', price: 'Rp 1.350.000' },
      { name: 'Tribune A', price: 'Rp 1.750.000' },
      { name: 'Pit', price: 'Rp 2.000.000' },
      { name: 'VIP', price: 'Rp 2.550.000' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'Avenged Sevenfold kembali ke Indonesia setelah lebih dari satu dekade! M. Shadows, Synyster Gates, Zacky Vengeance, Johnny Christ & Brooks Wackerman tampil di JIS.',
    sources: ["rri.co.id", "bandwagon.asia", "avengedsevenfold.com"],
  },

  {
    id: 'bryan-adams-jakarta-2026',
    artist: 'Bryan Adams & Ari Lasso',
    tour: 'Live in Jakarta',
    genre: 'rock', emoji: '🎸',
    dates: ["3 Oktober 2026"],
    rawDate: new Date('2026-10-03'),
    time: '19:30 WIB',
    venue: 'Beach City International Stadium',
    city: 'Ancol, Jakarta Utara',
    promotor: 'Produksi Lokal',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://bryanadamsjakarta.com',
    priceRange: 'Cek bryanadamsjakarta.com',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Various', price: 'Cek website resmi' },
    ],
    confirmStatus: 'confirmed', hot: false,
    description: 'Kolaborasi Bryan Adams dan Ari Lasso di Ancol Beach City Stadium. Bryan Adams terkenal dengan Summer of 69, Run to You, dan Everything I Do.',
    sources: ["bryanadamsjakarta.com", "shopee.co.id"],
  },

  {
    id: 'the-neighbourhood-jakarta-2026',
    artist: 'The Neighbourhood',
    tour: 'THE WOURLD TOUR',
    genre: 'pop', emoji: '🖤',
    dates: ["18 Juli 2026"],
    rawDate: new Date('2026-07-18'),
    time: '20:00 WIB',
    venue: 'Istora Senayan',
    city: 'Senayan, Jakarta Selatan',
    promotor: 'iMe Indonesia',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Rp 750.000 – Rp 2.800.000',
    priceMin: 750000, priceMax: 2800000,
    ticketCategories: [
      { name: 'Tribune', price: 'Rp 750.000' },
      { name: 'CAT 2', price: 'Rp 1.200.000' },
      { name: 'CAT 1', price: 'Rp 1.800.000' },
      { name: 'Pit / GA', price: 'Rp 2.200.000' },
      { name: 'VIP', price: 'Rp 2.800.000' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'The Neighbourhood (The NBHD) membawa THE WOURLD TOUR ke Jakarta, stop final Asia Tenggara mereka. Terkenal dengan Sweater Weather, Stargazing, dan Afraid.',
    sources: ["songkick.com", "everythingindo.com"],
  },

  {
    id: 'lalala-fest-2026',
    artist: 'LaLaLa Festival 2026',
    tour: 'LaLaLa Fest 10th Anniversary',
    genre: 'indie', emoji: '🌈',
    dates: ["22 Agustus 2026", "23 Agustus 2026"],
    rawDate: new Date('2026-08-22'),
    time: '12:00 – 23:00 WIB',
    venue: 'JIEXPO Kemayoran',
    city: 'Kemayoran, Jakarta Pusat',
    promotor: 'LaLaLa Entertainment',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://lalalafest.com',
    priceRange: 'Rp 600.000 – Rp 2.500.000',
    priceMin: 600000, priceMax: 2500000,
    ticketCategories: [
      { name: '1-Day Pass', price: 'Rp 600.000' },
      { name: '2-Day Pass', price: 'Rp 1.100.000' },
      { name: 'VIP 1-Day', price: 'Rp 1.400.000' },
      { name: 'VIP 2-Day', price: 'Rp 2.500.000' },
    ],
    lineup: ["Steve Lacy", "Rex Orange County", "The Flaming Lips", "Two Door Cinema Club", "Kodaline", "HONNE", "BE:FIRST", "Astrid S", "Jordan Rakei", "Matt Maltese", "Flo"],
    confirmStatus: 'confirmed', hot: true,
    description: 'Festival indie-pop terbesar Indonesia! Headliners: Steve Lacy, Rex Orange County, The Flaming Lips, Two Door Cinema Club, Kodaline, HONNE, BE:FIRST.',
    sources: ["lalalafest.com", "tokyohive.com", "billboardphilippines.com"],
  },

  {
    id: 'five-sos-jakarta-2026',
    artist: '5 Seconds of Summer (5SOS)',
    tour: 'EVERYONE\'S A STAR! World Tour',
    genre: 'pop', emoji: '⭐',
    dates: ["14 November 2026"],
    rawDate: new Date('2026-11-14'),
    time: 'TBA',
    venue: 'Indonesia Arena, GBK',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'Live Nation Asia',
    ticketPlatform: '5sosjakarta.com',
    ticketUrl: 'https://5sosjakarta.com',
    priceRange: 'Cek 5sosjakarta.com',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Tickets on sale', price: 'Cek 5sosjakarta.com' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: '5 Seconds of Summer kembali ke Indonesia dalam EVERYONE\'S A STAR! World Tour di Indonesia Arena GBK, 14 November 2026. Website resmi 5sosjakarta.com sudah aktif.',
    sources: ["5sosjakarta.com", "livenation.sg"],
  },

  {
    id: 'enhypen-jakarta-2027',
    artist: 'ENHYPEN',
    tour: 'BLOOD SAGA World Tour',
    genre: 'kpop', emoji: '🩸',
    dates: ["TBA – Early 2027"],
    rawDate: new Date('2027-02-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta / Tangerang',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://enhypenbloodsagatour.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'Belum diumumkan' },
    ],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Chosun.com (Mar 2026) menyebut ENHYPEN akan tour ke Jakarta sebagai bagian BLOOD SAGA World Tour by March 2027. Tanggal dan venue spesifik BELUM diumumkan resmi.',
    description: 'ENHYPEN mengumumkan tur dunia BLOOD SAGA (2026-2027). Indonesia disebut sebagai salah satu stop Asia awal 2027.',
    sources: ["chosun.com", "kpopnewswire.com"],
  },

  {
    id: 'byeon-woo-seok-jakarta-2026',
    artist: 'Byeon Woo-seok',
    tour: '2026 Fan Meeting Tour The Secret Library',
    genre: 'kpop', emoji: '📚',
    dates: ["TBA – Late 2026 / Early 2027"],
    rawDate: new Date('2026-11-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://instagram.com/varoentertainment',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'Belum diumumkan' },
    ],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'VARO Entertainment mengumumkan tur Asia The Secret Library per 9 Juni 2026 dengan Jakarta sebagai salah satu stop. Tanggal & venue spesifik BELUM diumumkan.',
    description: 'Aktor Korea Byeon Woo-seok (Lovely Runner) fan meeting tur Asia 2026. Jakarta masuk daftar kota bersama Seoul, Bangkok, Yokohama, Taipei, Singapore, Manila, Hong Kong.',
    sources: ["chosun.com", "gmanetwork.com"],
  },

  {
    id: 'dua-lipa-jakarta-rumor',
    artist: 'Dua Lipa',
    tour: 'Reschedule Radical Optimism / New Tour',
    genre: 'pop', emoji: '💃',
    dates: ["TBA – 2026/2027"],
    rawDate: new Date('2027-01-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://dualipa.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'TBA' },
    ],
    confirmStatus: 'rumor', hot: false,
    rumorDetail: 'Dua Lipa cancel konser Jakarta (9 Nov 2024) menit terakhir karena unsafe staging. Belum ada pengumuman resmi reschedule atau konser baru.',
    description: 'Dua Lipa cancel saat hendak tampil di Indonesia Arena (Nov 2024). Fans Indonesia berharap ia kembali. Hingga kini belum ada konfirmasi.',
    sources: ["bandwagon.asia", "deadline.com"],
  },

  {
    id: 'the-weeknd-jakarta-2026',
    artist: 'The Weeknd',
    tour: 'After Hours Til Dawn Stadium Tour Asia',
    genre: 'pop', emoji: '🌙',
    dates: ["26 September 2026", "27 September 2026"],
    rawDate: new Date('2026-09-26'),
    time: '19:00 WIB',
    venue: 'Jakarta International Stadium (JIS)',
    city: 'Tanjung Priok, Jakarta Utara',
    promotor: 'Live Nation Asia',
    ticketPlatform: 'Live Nation',
    ticketUrl: 'https://www.livenation.com',
    priceRange: 'Rp 1.000.000 – Rp 5.500.000',
    priceMin: 1000000, priceMax: 5500000,
    ticketCategories: [
      { name: 'Tribune D', price: 'Rp 1.000.000' },
      { name: 'Tribune C', price: 'Rp 1.600.000' },
      { name: 'Tribune B', price: 'Rp 2.200.000' },
      { name: 'Tribune A', price: 'Rp 3.000.000' },
      { name: 'Pit Standing', price: 'Rp 3.800.000' },
      { name: 'VIP Package', price: 'Rp 5.500.000' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'The Weeknd membawa tur stadion After Hours Til Dawn ke Jakarta 2 malam di JIS. Leg final dari salah satu tur paling sukses dalam sejarah musik dunia.',
    sources: ["karlobag.eu", "billboard.com", "afterhourstildawntour2026.com"],
  },

  {
    id: 'mcr-jis-2026',
    artist: 'My Chemical Romance',
    tour: 'Long Live the Black Parade Asia Tour',
    genre: 'rock', emoji: '🖤',
    dates: ["22 November 2026"],
    rawDate: new Date('2026-11-22'),
    time: '19:00 WIB',
    venue: 'Indonesia Arena, GBK',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'iMe Indonesia',
    ticketPlatform: 'tiket.com',
    ticketUrl: 'https://www.tiket.com/en-us/to-do/my-chemical-romance-live-in-jakarta-2026',
    priceRange: 'Rp 850.000 – Rp 4.000.000',
    priceMin: 850000, priceMax: 4000000,
    ticketCategories: [
      { name: 'Tribune D', price: 'Rp 850.000' },
      { name: 'Tribune C', price: 'Rp 1.200.000' },
      { name: 'Tribune B', price: 'Rp 1.800.000' },
      { name: 'Tribune A', price: 'Rp 2.500.000' },
      { name: 'Pit Standing', price: 'Rp 3.000.000' },
      { name: 'VIP', price: 'Rp 4.000.000' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'MCR kembali ke Jakarta untuk konser standalone penuh di Indonesia Arena GBK! Bagian dari tur Long Live the Black Parade. Konser penuh 2+ jam dengan seluruh katalog hits.',
    sources: ["tiket.com", "mcrjakarta.com", "thebeat.asia"],
  },

  {
    id: 'bts-jakarta-2026',
    artist: 'BTS',
    tour: 'BTS World Tour ARIRANG',
    genre: 'kpop', emoji: '💜',
    dates: ["26 Desember 2026", "27 Desember 2026"],
    rawDate: new Date('2026-12-26'),
    time: '18:00 WIB',
    venue: 'Gelora Bung Karno (GBK) Utama',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'iMe Indonesia',
    ticketPlatform: 'btsworldtourofficial.com',
    ticketUrl: 'https://btsworldtourofficial.com',
    priceRange: 'Rp 1.800.000 – Rp 4.500.000',
    priceMin: 1800000, priceMax: 4500000,
    ticketCategories: [
      { name: 'CAT 4 (Tribune)', price: 'Rp 1.800.000' },
      { name: 'CAT 3 (Tribune)', price: 'Rp 2.500.000' },
      { name: 'CAT 2 (Pit)', price: 'Rp 3.200.000' },
      { name: 'CAT 1 (Floor)', price: 'Rp 3.800.000' },
      { name: 'Soundcheck VIP', price: 'Rp 4.500.000' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'BTS kembali ke Jakarta setelah 4 tahun! Tur ARIRANG hadir dengan stage 360 derajat revolusioner di GBK Utama selama 2 malam. General on-sale via btsworldtourofficial.com.',
    sources: ["tempo.co", "billboard.com", "ndtvprofit.com"],
  },

  {
    id: 'aespa-jakarta-2026',
    artist: 'aespa',
    tour: 'Live Tour: SYNK: aeXIS LINE',
    genre: 'kpop', emoji: '🤖',
    dates: ["4 April 2026"],
    rawDate: new Date('2026-04-04'),
    time: 'TBA',
    venue: 'ICE BSD City',
    city: 'BSD City, Tangerang Selatan',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=aespa+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'Belum diumumkan' },
    ],
    confirmStatus: 'confirmed', hot: true,
    description: 'aespa menggelar Live Tour: SYNK: aeXIS LINE di ICE BSD City, Tangerang Selatan pada 4 April 2026. Konser perdana aespa di Indonesia yang telah lama ditunggu-tunggu oleh MY (fandom aespa).',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'ed-sheeran-jakarta-rumor',
    artist: 'Ed Sheeran',
    tour: 'LOOP Tour',
    genre: 'pop', emoji: '🎶',
    dates: ["TBA – 2026 (pernah dibatalkan, janji kembali)"],
    rawDate: new Date('2026-10-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://edsheeran.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'TBA' },
    ],
    confirmStatus: 'rumor', hot: false,
    rumorDetail: 'Ed Sheeran pernah cancel konser Jakarta dan berjanji kembali. LOOP Tour 2026 fokus ke Australia, NZ, dan Amerika. Indonesia belum masuk jadwal resmi.',
    description: 'Ed Sheeran dalam LOOP Tour 2026. Belum ada tanggal resmi untuk Indonesia namun rumor kuat berdasarkan janji untuk kembali.',
    sources: ["coconuts.co", "wikipedia.org"],
  },

  {
    id: 'coldplay-jakarta-rumor',
    artist: 'Coldplay',
    tour: 'Music of the Spheres World Tour (Potential Return)',
    genre: 'pop', emoji: '🪐',
    dates: ["TBA – 2027 (kemungkinan)"],
    rawDate: new Date('2027-01-01'),
    time: 'TBA',
    venue: 'TBA (kemungkinan GBK)',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://coldplay.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'TBA' },
    ],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Coldplay pause tur setelah Wembley Sep 2025, restart 2027. Konser Jakarta 2023 sangat sukses. Spekulasi return 2027 sangat kuat. BELUM ada konfirmasi resmi.',
    description: 'Setelah konser fenomenal di GBK (2023), Coldplay dirumorkan kembali untuk leg 2027. Indonesia jadi kandidat terkuat karena antusiasme fans yang luar biasa.',
    sources: ["wikipedia.org", "coldplaytour.org"],
  },

  // ── RUMOR BARU ──

  {
    id: 'ariana-grande-jakarta-rumor',
    artist: 'Ariana Grande',
    tour: 'TBA',
    genre: 'pop', emoji: '🌙',
    dates: ["TBA"],
    rawDate: new Date('2027-06-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://arianagrande.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Ariana Grande masuk radar tur Asia namun belum ada konfirmasi resmi dari promotor lokal untuk tanggal di Indonesia.',
    description: 'Ariana Grande dirumorkan akan mampir ke Indonesia sebagai bagian dari tur Asia mendatang. Belum ada konfirmasi resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'olivia-rodrigo-jakarta-rumor',
    artist: 'Olivia Rodrigo',
    tour: 'TBA',
    genre: 'pop', emoji: '💔',
    dates: ["TBA"],
    rawDate: new Date('2027-03-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://oliviarodrigo.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Olivia Rodrigo masuk daftar radar tur Asia namun belum dikonfirmasi resmi oleh promotor lokal untuk Indonesia.',
    description: 'Olivia Rodrigo dirumorkan akan tur ke Asia termasuk Indonesia. Belum ada tanggal atau venue resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'charlie-puth-jakarta-rumor',
    artist: 'Charlie Puth',
    tour: 'TBA',
    genre: 'pop', emoji: '🎹',
    dates: ["TBA"],
    rawDate: new Date('2027-02-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://charlieputh.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: false,
    rumorDetail: 'Charlie Puth masuk radar tur Asia namun belum dikonfirmasi resmi untuk Indonesia.',
    description: 'Charlie Puth dirumorkan akan menggelar konser di Indonesia. Belum ada konfirmasi resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'post-malone-jakarta-rumor',
    artist: 'Post Malone',
    tour: 'TBA',
    genre: 'pop', emoji: '🤠',
    dates: ["TBA"],
    rawDate: new Date('2027-04-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://postmalone.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: false,
    rumorDetail: 'Post Malone masuk radar tur Asia namun belum dikonfirmasi resmi untuk Indonesia.',
    description: 'Post Malone dirumorkan akan tur ke Asia termasuk Indonesia. Belum ada tanggal atau venue resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'kard-jakarta-2026',
    artist: 'KARD',
    tour: 'KARD 2026 WORLD TOUR "DRIFT"',
    genre: 'kpop', emoji: '🃏',
    dates: ["27 Juni 2026"],
    rawDate: new Date('2026-06-27'),
    time: '19:30 WIB',
    venue: 'Basket Hall GBK Senayan',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'DSP Media',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=KARD+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'KARD (BM, J.Seph, Jeon Somin, Jeon Jiwoo) membawa DRIFT World Tour ke Jakarta pada 27 Juni 2026 di Basket Hall GBK Senayan. Co-ed K-Pop group yang dikenal dengan perpaduan K-Pop, R&B, dan Hip-Hop fusion.',
    sources: ["chosun.com", "indonesiaexpat.id", "koreajoongangdaily.joins.com"],
    lineup: ['BM', 'J.Seph', 'Jeon Somin', 'Jeon Jiwoo'],
  },

  {
    id: 'the-sounds-project-2026',
    artist: 'The Sounds Project Vol. 9',
    tour: 'The Sounds Project 2026',
    genre: 'indie', emoji: '🎪',
    dates: ["TBA – Agustus 2026"],
    rawDate: new Date('2026-08-01'),
    time: 'TBA',
    venue: 'TBA (Ancol / JIEXPO)',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=The+Sounds+Project+2026',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    lineup: ['Neck Deep', 'JET', 'Nusantara Beat', 'Pamungkas', 'Rizky Febian', 'JUICY LUICY', 'For Revenge', 'Barasuara', 'Lomba Sihir', 'Adrian Khalif', 'Perunggu', 'The Panturas'],
    confirmStatus: 'confirmed', hot: true,
    description: 'The Sounds Project Vol. 9 hadir dengan lineup internasional — Neck Deep (Inggris), JET (Australia), dan Nusantara Beat (Belanda) bersama deretan artis lokal terbaik Indonesia.',
    sources: ["songkick.com", "frontstagefestivals.com"],
  },

  {
    id: 'babymonster-jakarta-2026',
    artist: 'BABYMONSTER',
    tour: '2026-27 BABYMONSTER WORLD TOUR [춤 (CHOOM)]',
    genre: 'kpop', emoji: '👾',
    dates: ["17 Oktober 2026"],
    rawDate: new Date('2026-10-17'),
    time: 'TBA',
    venue: 'Indonesia Arena, GBK',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'YG Entertainment',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://weverse.io/babymonster',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'BABYMONSTER (YG Entertainment) menggelar 2026-27 WORLD TOUR [춤 (CHOOM)] di Indonesia Arena GBK pada 17 Oktober 2026. Girl group 7 member yang debutnya fenomenal dengan lagu BATTER UP dan SHEESH.',
    sources: ["weverse.io", "ygfamily.com", "kpopnewswire.com"],
    lineup: ['Rami', 'Pharita', 'Asa', 'Rora', 'Chiquita', 'Ruka', 'Ahyeon'],
  },

  {
    id: 'nancy-ajram-jakarta-2027',
    artist: 'Nancy Ajram',
    tour: 'Nancy Ajram Live in Jakarta 2027',
    genre: 'pop', emoji: '🌟',
    dates: ["30 Januari 2027"],
    rawDate: new Date('2027-01-30'),
    time: 'TBA',
    venue: 'Istora Senayan',
    city: 'Senayan, Jakarta Selatan',
    promotor: 'Rajawali Indonesia Concert',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Nancy+Ajram+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'Nancy Ajram, superstar pop Arab terbesar, tampil di Istora Senayan Jakarta pada 30 Januari 2027. Diumumkan oleh Rajawali Indonesia Concert via Instagram.',
    sources: ["instagram.com/rajawaliindonesia"],
    lineup: ['Nancy Ajram'],
  },

  {
    id: 'metallica-jakarta-rumor',
    artist: 'Metallica',
    tour: 'TBA',
    genre: 'rock', emoji: '🤘',
    dates: ["TBA"],
    rawDate: new Date('2027-06-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://metallica.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Rumor Metallica ke Jakarta beredar di komunitas metal Indonesia. Belum ada konfirmasi resmi dari manajemen atau promotor lokal.',
    description: 'Metallica dirumorkan akan mampir ke Indonesia dalam tur Asia mendatang. Belum ada konfirmasi resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'gnr-jakarta-rumor',
    artist: "Guns N' Roses",
    tour: 'TBA',
    genre: 'rock', emoji: '🌹',
    dates: ["TBA"],
    rawDate: new Date('2027-07-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://gunsnroses.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: "Rumor Guns N' Roses ke Jakarta beredar di komunitas rock Indonesia. Belum ada konfirmasi resmi dari manajemen atau promotor lokal.",
    description: "Guns N' Roses dirumorkan akan menggelar konser di Indonesia. Belum ada tanggal atau venue resmi.",
    sources: ["kapanlagi.com"],
  },

  {
    id: 'bad-bunny-jakarta-rumor',
    artist: 'Bad Bunny',
    tour: 'TBA',
    genre: 'pop', emoji: '🐰',
    dates: ["TBA"],
    rawDate: new Date('2027-05-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://badbunnypr.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'TBA' }],
    confirmStatus: 'rumor', hot: false,
    rumorDetail: 'Bad Bunny masuk radar tur Asia namun belum dikonfirmasi resmi untuk Indonesia.',
    description: 'Bad Bunny dirumorkan akan memperluas tur globalnya ke Asia termasuk Indonesia. Belum ada konfirmasi resmi.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'westlife-jakarta-2027',
    artist: 'Westlife',
    tour: 'Westlife Live in Jakarta 2027',
    genre: 'pop', emoji: '🎤',
    dates: ["23 Januari 2027"],
    rawDate: new Date('2027-01-23'),
    time: 'TBA',
    venue: 'Stadion Utama Gelora Bung Karno (GBK)',
    city: 'Senayan, Jakarta Pusat',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Westlife+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'Westlife (Shane Filan, Mark Feehily, Kian Egan, Nicky Byrne) tampil di GBK Jakarta pada 23 Januari 2027. Boyband legendaris asal Irlandia terkenal dengan Swear It Again, Flying Without Wings, dan You Raise Me Up.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'perses-jakarta-2026',
    artist: 'Perses (Thailand)',
    tour: 'Perses Live in Jakarta 2026',
    genre: 'pop', emoji: '🇹🇭',
    dates: ["13 Juni 2026"],
    rawDate: new Date('2026-06-13'),
    time: 'TBA',
    venue: 'Balai Sarbini',
    city: 'Semanggi, Jakarta Selatan',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Perses+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: false,
    description: 'Perses, band rock asal Thailand, tampil di Balai Sarbini Jakarta pada 13 Juni 2026.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'jaehyun-jakarta-2026',
    artist: 'Jaehyun (NCT)',
    tour: 'Jaehyun Fan Concert in Jakarta 2026',
    genre: 'kpop', emoji: '💙',
    dates: ["20 Juni 2026"],
    rawDate: new Date('2026-06-20'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Jaehyun+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: false,
    description: 'Jaehyun (NCT) menggelar fan concert di Jakarta pada 20 Juni 2026. Detail venue dan tiket akan diumumkan segera.',
    sources: ["kapanlagi.com"],
  },

  // ── KONSER BARU — crawling Juni 2026 ──

  {
    id: 'nct-wish-jakarta-2026',
    artist: 'NCT WISH',
    tour: 'NCT WISH Solo Concert in Jakarta 2026',
    genre: 'kpop', emoji: '🌟',
    dates: ["11 April 2026"],
    rawDate: new Date('2026-04-11'),
    time: 'TBA',
    venue: 'ICE BSD City',
    city: 'BSD City, Tangerang Selatan',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=NCT+WISH+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'NCT WISH menggelar konser solo perdana mereka di Jakarta pada 11 April 2026 di ICE BSD City. NCT WISH adalah sub-unit terbaru dari NCT yang debut pada 2024.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'deep-purple-jakarta-2026',
    artist: 'Deep Purple & Slank',
    tour: 'Deep Purple Live in Jakarta 2026',
    genre: 'rock', emoji: '🎸',
    dates: ["18 April 2026"],
    rawDate: new Date('2026-04-18'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Deep+Purple+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'Legenda rock Deep Purple tampil di Jakarta bersama Slank pada 18 April 2026. Kolaborasi epik antara band rock ikonik dari Inggris dengan band rock legendaris Indonesia.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'monsta-x-jakarta-2026',
    artist: 'MONSTA X',
    tour: 'MONSTA X Asia Tour 2026',
    genre: 'kpop', emoji: '👊',
    dates: ["18 April 2026"],
    rawDate: new Date('2026-04-18'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=Monsta+X+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: false,
    description: 'MONSTA X menggelar konser Asia Tour 2026 di Jakarta pada 18 April 2026. Boy group K-Pop asal Korea Selatan yang terkenal dengan energi perform yang luar biasa.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'treasure-jakarta-2026',
    artist: 'TREASURE',
    tour: 'TREASURE Asia Tour 2026',
    genre: 'kpop', emoji: '💎',
    dates: ["25 April 2026", "26 April 2026"],
    rawDate: new Date('2026-04-25'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=TREASURE+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: false,
    description: 'TREASURE tampil 2 malam berturut-turut di Jakarta pada 25–26 April 2026 sebagai bagian dari Asia Tour mereka. Boy group YG Entertainment yang dikenal dengan lagu Boy dan Bona Bona.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'hammersonic-2026',
    artist: 'Hammersonic Festival 2026',
    tour: 'Hammersonic Metal & Rock Festival',
    genre: 'rock', emoji: '🤘',
    dates: ["2 Mei 2026", "3 Mei 2026"],
    rawDate: new Date('2026-05-02'),
    time: 'TBA',
    venue: 'Pantai Carnaval Ancol',
    city: 'Ancol, Jakarta Utara',
    promotor: 'Hammersonic',
    ticketPlatform: 'Loket.com',
    ticketUrl: 'https://loket.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: '1-Day Pass', price: 'Belum diumumkan' }, { name: '2-Day Pass', price: 'Belum diumumkan' }],
    lineup: ['My Chemical Romance', 'dan artis lainnya'],
    confirmStatus: 'confirmed', hot: true,
    description: 'Festival metal dan rock terbesar di Asia Tenggara — Hammersonic 2026 hadir selama 2 hari di Pantai Carnaval Ancol dengan My Chemical Romance sebagai headliner.',
    sources: ["kapanlagi.com", "hammersonic.com"],
  },

  {
    id: 'one-ok-rock-jakarta-2026',
    artist: 'ONE OK ROCK',
    tour: 'ONE OK ROCK Asia Tour 2026',
    genre: 'rock', emoji: '🎵',
    dates: ["16 Mei 2026"],
    rawDate: new Date('2026-05-16'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'Belum diumumkan',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://www.loket.com/event?keyword=ONE+OK+ROCK+Jakarta',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [{ name: 'Semua kategori', price: 'Belum diumumkan' }],
    confirmStatus: 'confirmed', hot: true,
    description: 'ONE OK ROCK kembali ke Jakarta dalam Asia Tour 2026 pada 16 Mei 2026. Band rock Jepang yang terkenal dengan lagu Wherever You Are, Taking Off, dan Never Let Me Go.',
    sources: ["kapanlagi.com"],
  },

  {
    id: 'taylor-swift-jakarta-rumor',
    artist: 'Taylor Swift',
    tour: 'New Tour (TBA)',
    genre: 'pop', emoji: '✨',
    dates: ["TBA – Belum ada indikasi jelas"],
    rawDate: new Date('2027-06-01'),
    time: 'TBA',
    venue: 'TBA',
    city: 'Jakarta',
    promotor: 'TBA',
    ticketPlatform: 'TBA',
    ticketUrl: 'https://taylorswift.com',
    priceRange: 'Belum diumumkan',
    priceMin: 0, priceMax: 0,
    ticketCategories: [
      { name: 'Semua kategori', price: 'TBA' },
    ],
    confirmStatus: 'rumor', hot: true,
    rumorDetail: 'Eras Tour tidak mampir ke Indonesia. Taylor Swift belum umumkan tur baru 2026/2027. Rumor murni harapan fans, belum ada konfirmasi resmi apapun.',
    description: 'Rumor Taylor Swift ke Jakarta selalu muncul tiap tahun. Pemerintah Indonesia bahkan pernah aktif mengupayakannya. Sampai kini tidak ada konfirmasi resmi.',
    sources: ["stylecaster.com", "jakartaglobe.id"],
  }

];

/* ============================================
   UTILITY
   ============================================ */
const isPast   = c => c.rawDate < TODAY;
const isRumor  = c => c.confirmStatus === 'rumor';
const genreLabel = g => ({ kpop:'K-Pop', pop:'Pop / R&B', rock:'Rock / Metal', jazz:'Jazz', indie:'Indie / Festival' }[g] || g);

// Expose globals agar features.js bisa pakai
window.isPast  = isPast;
window.isRumor = isRumor;

/* ============================================
   RENDER CARDS
   ============================================ */
function getArtistImage(id) {
  return ARTIST_IMAGES[id] || null;
}

function renderCards(list) {
  const grid     = document.getElementById('concertsGrid');
  const noResult = document.getElementById('noResult');

  if (!list.length) {
    grid.innerHTML = '';
    noResult.classList.remove('hidden');
    return;
  }
  noResult.classList.add('hidden');

  grid.innerHTML = list.map(c => {
    const past  = isPast(c);
    const rumor = isRumor(c);
    const statusLabel = past ? 'Sudah Lewat' : rumor ? 'Rumor' : 'Confirmed';
    const statusClass = past ? 'badge-status-past' : rumor ? 'badge-status-rumor' : 'badge-status-upcoming';
    const priceDisplay = c.priceMin > 0
      ? `Rp ${(c.priceMin/1e6).toFixed(1).replace('.0','')}jt – Rp ${(c.priceMax/1e6).toFixed(1).replace('.0','')}jt`
      : rumor ? '⚠️ Belum diumumkan' : c.priceRange;
    const img = getArtistImage(c.id);
    const cardBgStyle = img
      ? `style="background-image:url('${img}');background-size:cover;background-position:center top;"`
      : '';

    return `
      <div class="concert-card${past?' past':''}${rumor?' rumor-card':''}" onclick="openModal('${c.id}')">
        <div class="card-header${img?' has-photo':''}" ${cardBgStyle}>
          ${!img ? `<div class="card-bg-emoji">${c.emoji}</div>` : ''}
          ${img ? `<img src="${img}" alt="${c.artist}" loading="lazy" width="1" height="1" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;" aria-hidden="true" />` : ''}
          <div class="card-overlay"></div>
          <div class="card-badges">
            <span class="badge badge-genre-${c.genre}">${genreLabel(c.genre)}</span>
            <span class="badge ${statusClass}">${past?'':'rumor'===c.confirmStatus?'🔮 ':'✅ '}${statusLabel}</span>
            ${c.hot ? '<span class="badge badge-hot">🔥 Hot</span>' : ''}
          </div>
        </div>
        <div class="card-body">
          <div class="card-artist">${c.artist}</div>
          <div class="card-tour">${c.tour}</div>
          ${rumor ? '<div class="rumor-banner">⚠️ Belum ada pengumuman resmi</div>' : ''}
          <div class="card-meta">
            <div class="meta-row"><span class="meta-icon">📅</span><span class="meta-text"><strong>${c.dates.join(' &amp; ')}</strong></span></div>
            <div class="meta-row"><span class="meta-icon">🕐</span><span class="meta-text">${c.time}</span></div>
            <div class="meta-row"><span class="meta-icon">📍</span><span class="meta-text"><strong>${c.venue}</strong><br>${c.city}</span></div>
            <div class="meta-row"><span class="meta-icon">🎟️</span><span class="meta-text">${c.promotor}</span></div>
          </div>
          <div class="card-price${rumor?' card-price-rumor':''}">
            <div>
              <div class="price-label">${rumor ? '⚠️ Status Harga' : 'Harga Tiket'}</div>
              <div class="price-range">${priceDisplay}</div>
            </div>
            <span style="font-size:1.4rem">${rumor ? '❓' : '💳'}</span>
          </div>
          <div class="card-footer">
            ${!past && !rumor
              ? `<a class="btn btn-primary" href="${c.ticketUrl}" target="_blank" rel="noopener" aria-label="Beli Tiket ${c.artist}" onclick="event.stopPropagation()">🎫 Beli Tiket</a>`
              : rumor
                ? `<button class="btn btn-rumor-disabled" disabled aria-label="Tiket ${c.artist} belum dikonfirmasi">🔮 Belum Dikonfirmasi</button>`
                : `<button class="btn btn-disabled" disabled aria-label="Konser ${c.artist} sudah selesai">Konser Selesai</button>`
            }
            <button class="btn btn-secondary" onclick="openModal('${c.id}');event.stopPropagation()">Detail ›</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ============================================
   RENDER HIGHLIGHTS
   ============================================ */
function renderHighlights() {
  const row   = document.getElementById('highlightsRow');
  const picks = CONCERTS.filter(c => !isPast(c)).slice(0, 5);

  row.innerHTML = picks.map(c => {
    const img = getArtistImage(c.id);
    const bgStyle = img
      ? `style="background-image:url('${img}');background-size:cover;background-position:center top;"`
      : '';
    return `
    <div class="highlight-card${isRumor(c)?' highlight-rumor':''}${img?' has-photo':''}" onclick="openModal('${c.id}')" ${bgStyle}>
      <div class="hl-overlay"></div>
      <div class="hl-content">
        ${!img ? `<span class="hl-emoji">${c.emoji}</span>` : ''}
        <div class="hl-artist">${c.artist}</div>
        ${isRumor(c) ? '<div class="hl-rumor-badge">🔮 Rumor</div>' : ''}
        <div class="hl-date">📅 ${c.dates[0]}</div>
        <div class="hl-desc">${c.venue} · ${c.city.split(',')[0]}</div>
      </div>
    </div>`;
  }).join('');
}

/* ============================================
   MODAL
   ============================================ */
function openModal(id) {
  const c = CONCERTS.find(x => x.id === id);
  if (!c) return;
  const past  = isPast(c);
  const rumor = isRumor(c);

  const ticketHtml = c.ticketCategories.map(t =>
    `<div class="ticket-cat"><span class="ticket-cat-name">${t.name}</span><span class="ticket-cat-price">${t.price}</span></div>`
  ).join('');

  const lineupHtml = c.lineup
    ? `<div class="lineup-tags">${c.lineup.map(a=>`<span class="lineup-tag">${a}</span>`).join('')}</div>`
    : '';

  const rumorBoxHtml = rumor && c.rumorDetail
    ? `<div class="rumor-detail-box"><div class="rumor-detail-title">🔮 Kenapa ini masih Rumor?</div><p>${c.rumorDetail}</p></div>`
    : '';

  const img = getArtistImage(c.id);
  const heroStyle = img ? `style="background-image:url('${img}');background-size:cover;background-position:center 20%;"` : '';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-hero${img ? ' modal-hero-photo' : ''}" ${heroStyle}>
      ${img ? '<div class="modal-hero-overlay"></div>' : ''}
      <div class="modal-hero-inner">
        ${!img ? `<span class="modal-emoji">${c.emoji}</span>` : ''}
        <div class="modal-artist">${c.artist}</div>
        <div class="modal-tour">${c.tour}</div>
        <div class="modal-badges">
          <span class="badge badge-genre-${c.genre}">${genreLabel(c.genre)}</span>
          <span class="badge badge-status-${past?'past':rumor?'rumor':'upcoming'}">${past?'Sudah Lewat':rumor?'🔮 Rumor':'✅ Confirmed'}</span>
          ${c.hot ? '<span class="badge badge-hot">🔥 Hot</span>' : ''}
        </div>
      </div>
    </div>
    ${rumorBoxHtml}
    <div class="modal-details">
      <div class="detail-box"><div class="detail-label">📅 Tanggal</div><div class="detail-value">${c.dates.join('<br>')}</div></div>
      <div class="detail-box"><div class="detail-label">🕐 Jam Mulai</div><div class="detail-value">${c.time}</div></div>
      <div class="detail-box" style="grid-column:1/-1"><div class="detail-label">📍 Venue</div><div class="detail-value">${c.venue}<br><span style="font-weight:400;color:var(--text-sub);font-size:0.85rem">${c.city}</span></div></div>
      <div class="detail-box"><div class="detail-label">🎟️ Promotor</div><div class="detail-value">${c.promotor}</div></div>
      <div class="detail-box"><div class="detail-label">💳 Platform Tiket</div><div class="detail-value">${c.ticketPlatform}</div></div>
      <div class="detail-box" style="grid-column:1/-1"><div class="detail-label">💰 Range Harga</div><div class="detail-value price-color">${c.priceRange}</div></div>
    </div>
    <div class="modal-desc">${c.description}</div>
    ${lineupHtml ? `<div class="modal-ticket-area"><h4>🎤 Lineup</h4>${lineupHtml}</div>` : ''}
    <div class="modal-ticket-area"><h4>🎫 Kategori Tiket</h4><div class="ticket-categories">${ticketHtml}</div></div>
    <div class="modal-actions">
      ${!past && !rumor
        ? `<a class="btn btn-primary" href="${c.ticketUrl}" target="_blank" rel="noopener">🎫 Beli Tiket Sekarang</a>`
        : rumor
          ? `<a class="btn btn-rumor-outline" href="${c.ticketUrl && c.ticketUrl !== '#' ? c.ticketUrl : 'https://www.google.com/search?q=' + encodeURIComponent(c.artist + ' Jakarta concert 2026')}" target="_blank" rel="noopener">🔔 Pantau Info Resmi</a>`
          : `<button class="btn btn-disabled" disabled>Konser Telah Selesai</button>`
      }
    </div>
    <div class="modal-disclaimer">
      ${rumor
        ? '⚠️ <b>DISCLAIMER:</b> Konser ini BELUM dikonfirmasi secara resmi. Jangan beli tiket dari pihak tidak resmi!'
        : '⚠️ <b>Disclaimer:</b> Harga tiket dapat berubah. Selalu cek platform resmi sebelum membeli.'
      }
    </div>
    ${c.sources ? `<div class="modal-sources">Sumber: ${c.sources.join(' · ')}</div>` : ''}
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ============================================
   FILTER & SEARCH
   ============================================ */
let activeFilter = 'all';
let searchQuery  = '';

function applyFilters() {
  let result = [...CONCERTS];

  if      (activeFilter === 'kpop')      result = result.filter(c => c.genre === 'kpop');
  else if (activeFilter === 'pop')       result = result.filter(c => c.genre === 'pop');
  else if (activeFilter === 'rock')      result = result.filter(c => c.genre === 'rock');
  else if (activeFilter === 'jazz')      result = result.filter(c => c.genre === 'jazz');
  else if (activeFilter === 'indie')     result = result.filter(c => c.genre === 'indie');
  else if (activeFilter === 'confirmed') result = result.filter(c => c.confirmStatus === 'confirmed' && !isPast(c));
  else if (activeFilter === 'rumor')     result = result.filter(c => isRumor(c));
  else if (activeFilter === 'upcoming')  result = result.filter(c => !isPast(c));
  else if (activeFilter === 'past')      result = result.filter(c => isPast(c));
  else if (activeFilter === 'wishlist')  result = result.filter(c => getWishlist().includes(c.id));

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(c =>
      c.artist.toLowerCase().includes(q) ||
      c.tour.toLowerCase().includes(q) ||
      c.venue.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.lineup && c.lineup.some(a => a.toLowerCase().includes(q)))
    );
  }

  // Terapkan sort jika SortOptions sudah tersedia
  if (typeof SortOptions !== 'undefined') {
    result = SortOptions.apply(result);
  }

  renderCards(result);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    applyFilters();
    document.getElementById('concertsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.getElementById('searchInput').addEventListener('input', function () {
  searchQuery = this.value;
  const el    = this;
  const start = el.selectionStart;
  const end   = el.selectionEnd;
  applyFilters();
  // Kembalikan focus & cursor position setelah re-render cards
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(start, end);
  });
});

/* ============================================
   NAVBAR SCROLL
   ============================================ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ============================================
   STATS
   ============================================ */
function updateStats() {
  document.getElementById('totalConcerts').textContent  = CONCERTS.length;
  document.getElementById('confirmedCount').textContent = CONCERTS.filter(c => c.confirmStatus === 'confirmed' && !isPast(c)).length;
  document.getElementById('rumorCount').textContent     = CONCERTS.filter(c => isRumor(c)).length;
}

/* ============================================
   FITUR 1 — COUNTDOWN TIMER
   ============================================ */
function getCountdown(rawDate) {
  const now  = new Date();
  const diff = rawDate - now;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  return { d, h, m, s };
}

function renderCountdown(c) {
  if (isPast(c) || isRumor(c)) return '';
  const cd = getCountdown(c.rawDate);
  if (!cd) return `<div class="countdown-past">Konser sedang berlangsung / sudah selesai</div>`;
  return `
    <div class="countdown-wrap" data-id="${c.id}">
      <div class="cd-box"><span class="cd-num" data-field="d">${cd.d}</span><span class="cd-label">Hari</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-box"><span class="cd-num" data-field="h">${String(cd.h).padStart(2,'0')}</span><span class="cd-label">Jam</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-box"><span class="cd-num" data-field="m">${String(cd.m).padStart(2,'0')}</span><span class="cd-label">Menit</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-box"><span class="cd-num" data-field="s">${String(cd.s).padStart(2,'0')}</span><span class="cd-label">Detik</span></div>
    </div>`;
}

// Tick semua countdown di halaman setiap detik
setInterval(() => {
  document.querySelectorAll('.countdown-wrap[data-id]').forEach(wrap => {
    const c  = CONCERTS.find(x => x.id === wrap.dataset.id);
    if (!c) return;
    const cd = getCountdown(c.rawDate);
    if (!cd) { wrap.outerHTML = `<div class="countdown-past">Segera dimulai!</div>`; return; }
    wrap.querySelector('[data-field="d"]').textContent = cd.d;
    wrap.querySelector('[data-field="h"]').textContent = String(cd.h).padStart(2,'0');
    wrap.querySelector('[data-field="m"]').textContent = String(cd.m).padStart(2,'0');
    wrap.querySelector('[data-field="s"]').textContent = String(cd.s).padStart(2,'0');
  });
}, 1000);

/* ============================================
   FITUR 2 — TOAST NOTIFICATION
   ============================================ */
function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/* ============================================
   FITUR 3 — WISHLIST (localStorage)
   ============================================ */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('concertid_wishlist') || '[]'); }
  catch { return []; }
}
function saveWishlist(list) {
  localStorage.setItem('concertid_wishlist', JSON.stringify(list));
}
function isWishlisted(id) { return getWishlist().includes(id); }

function toggleWishlist(id) {
  const list = getWishlist();
  const idx  = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
    showToast('❤️ Ditambahkan ke Wishlist!', 'success');
  } else {
    list.splice(idx, 1);
    showToast('💔 Dihapus dari Wishlist', 'info');
  }
  saveWishlist(list);
  updateWishlistCount();
  // Re-render kartu yang bersangkutan agar ikon berubah
  applyFilters();
}

function updateWishlistCount() {
  const count = getWishlist().length;
  const badge = document.getElementById('wishlistCount');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}


/* ============================================
   FITUR 5 — SHARE PANEL (WA / IG / TG / Copy)
   ============================================ */
let _shareTarget = null;

function openSharePanel(id) {
  _shareTarget = CONCERTS.find(x => x.id === id);
  if (!_shareTarget) return;
  const c    = _shareTarget;
  const url  = `${window.location.origin}${window.location.pathname}?concert=${c.id}`;
  const text = `🎵 ${c.artist} — ${c.dates[0]} di ${c.venue.split('(')[0].trim()}, Jakarta!\nCek info lengkap & harga tiket di ConcertID 👇\n${url}`;

  document.getElementById('sharePanelSubtitle').textContent = `${c.artist} · ${c.dates[0]}`;

  // WhatsApp
  document.getElementById('shareWa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;

  // Instagram — copy caption ke clipboard lalu buka Instagram
  document.getElementById('shareIg').onclick = () => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Caption disalin! Buka Instagram dan paste di caption Story/Post kamu.', 'info', 4000);
      setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 800);
    }).catch(() => {
      showToast('Buka Instagram dan bagikan secara manual.', 'info', 3000);
      setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 600);
    });
    closeSharePanel();
  };

  // Telegram
  document.getElementById('shareTg').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`🎵 ${c.artist} — ${c.dates[0]} di ${c.venue.split('(')[0].trim()}\nCek info & harga tiket di ConcertID:`)}`;

  // Copy Link
  document.getElementById('shareCopy').onclick = () => {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Link berhasil disalin!', 'success');
      closeSharePanel();
    });
  };

  document.getElementById('sharePanel').classList.add('open');
  document.getElementById('shareBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSharePanel() {
  document.getElementById('sharePanel').classList.remove('open');
  document.getElementById('shareBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('sharePanelClose').addEventListener('click', closeSharePanel);
document.getElementById('shareBackdrop').addEventListener('click', closeSharePanel);

/* ============================================
   FITUR 6 — DEEP LINK (URL ?concert=id)
   ============================================ */
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const cid    = params.get('concert');
  if (cid && CONCERTS.find(x => x.id === cid)) {
    setTimeout(() => openModal(cid), 400);
  }
}

/* ============================================
   FITUR 7 — HARGA VISUAL (progress bars)
   ============================================ */
function getPriceBadge(min) {
  if (min === 0)          return { cls: '', label: 'TBA' };
  if (min < 1000000)      return { cls: 'badge-affordable', label: '💚 Terjangkau' };
  if (min < 2000000)      return { cls: 'badge-premium',    label: '💜 Premium' };
  return                         { cls: 'badge-luxury',     label: '⭐ Luxury' };
}

function renderPriceVisual(c) {
  if (!c.ticketCategories || c.ticketCategories.length === 0) return '';
  // Only render if we have real prices
  const hasPrices = c.ticketCategories.some(t => t.price.startsWith('Rp'));
  if (!hasPrices) return '';

  const badge    = getPriceBadge(c.priceMin);
  const maxPrice = Math.max(...c.ticketCategories
    .map(t => parseInt(t.price.replace(/\D/g, '')) || 0)
    .filter(v => v > 0));
  if (!maxPrice) return '';

  const bars = c.ticketCategories
    .filter(t => t.price.startsWith('Rp'))
    .map(t => {
      const val = parseInt(t.price.replace(/\D/g, '')) || 0;
      const pct = Math.round((val / maxPrice) * 100);
      const fmt = val >= 1000000
        ? `${(val/1000000).toFixed(1).replace('.0','')}jt`
        : `${(val/1000).toFixed(0)}rb`;
      return `
        <div class="price-bar-row">
          <span class="price-bar-name" title="${t.name}">${t.name}</span>
          <div class="price-bar-track"><div class="price-bar-fill" style="width:${pct}%"></div></div>
          <span class="price-bar-val">${fmt}</span>
        </div>`;
    }).join('');

  return `
    <div class="price-visual">
      <div class="price-visual-header">
        <span class="price-visual-label">Harga Tiket</span>
        ${badge.label !== 'TBA' ? `<span class="price-visual-badge ${badge.cls}">${badge.label}</span>` : ''}
      </div>
      <div class="price-bars">${bars}</div>
    </div>`;
}

/* ============================================
   FITUR 8 — VENUE MAPS (Google Maps embed)
   ============================================ */
const VENUE_MAPS = {
  'Gelora Bung Karno':       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.8027!3d-6.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sGelora%20Bung%20Karno!5e0!3m2!1sid!2sid',
  'Jakarta International':   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.9!2d106.8619!3d-6.1482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d39c8b1b1e1%3A0x4e1b1a1a1a1a1a1a!2sJakarta%20International%20Stadium!5e0!3m2!1sid!2sid',
  'NICE PIK':                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7305!3d-6.1023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a0000000000001%3A0x1!2sNICE%20PIK2!5e0!3m2!1sid!2sid',
  'ICE BSD':                 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8!2d106.6637!3d-6.2991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9b7c55f5555%3A0x5!2sICE%20BSD%20City!5e0!3m2!1sid!2sid',
  'Beach City':              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.8403!3d-6.1258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d5b5b5b5b5b%3A0x6!2sBeach%20City%20International%20Stadium!5e0!3m2!1sid!2sid',
  'Ancol':                   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.8362!3d-6.1267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d4c4c4c4c4c%3A0x7!2sPantai%20Carnaval%20Ancol!5e0!3m2!1sid!2sid',
  'Istora':                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.8018!3d-6.2171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f0f0f0f0f0%3A0x8!2sIstora%20Senayan!5e0!3m2!1sid!2sid',
  'JIEXPO':                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8!2d106.8558!3d-6.1656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d8a8a8a8a8a%3A0x9!2sJIEXPO%20Kemayoran!5e0!3m2!1sid!2sid',
  'Indonesia Arena':         'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.8027!3d-6.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sIndonesia%20Arena!5e0!3m2!1sid!2sid',
};

function getVenueMapEmbed(venue) {
  const key = Object.keys(VENUE_MAPS).find(k => venue.includes(k));
  return key ? VENUE_MAPS[key] : null;
}

function getGoogleMapsUrl(venue, city) {
  return `https://www.google.com/maps/search/${encodeURIComponent(venue + ', ' + city)}`;
}

/* ============================================
   UPDATED renderCards — INCLUDE NEW FEATURES
   ============================================ */
// Patch renderCards to inject countdown + action buttons + price visual
const _originalRenderCards = renderCards;
renderCards = function(list) {
  _originalRenderCards(list);
  // Apply UTM links setiap kali cards di-render ulang
  setTimeout(applyUTMToLinks, 100);
  // Add countdown, action buttons, and price visual to each card after render
  list.forEach(c => {
    const card = document.querySelector(`.concert-card[onclick*="${c.id}"]`);
    if (!card) return;
    const body = card.querySelector('.card-body');
    if (!body) return;

    // Inject countdown before card-price (for upcoming confirmed only)
    const cardPrice = body.querySelector('.card-price');
    if (cardPrice && !isPast(c) && !isRumor(c)) {
      const cdEl = document.createElement('div');
      cdEl.innerHTML = renderCountdown(c);
      body.insertBefore(cdEl.firstElementChild || cdEl, cardPrice);
    }

    // Inject price visual (replace card-price if we have detailed prices)
    if (cardPrice && c.ticketCategories && c.ticketCategories.some(t => t.price.startsWith('Rp'))) {
      const pvHtml = renderPriceVisual(c);
      if (pvHtml) {
        const pvEl = document.createElement('div');
        pvEl.innerHTML = pvHtml;
        cardPrice.replaceWith(pvEl.firstElementChild);
      }
    }

    // Inject action buttons before card-footer
    const cardFooter = body.querySelector('.card-footer');
    if (cardFooter) {
      const wishlisted = isWishlisted(c.id);
      card.classList.toggle('in-wishlist', wishlisted);
      const actionsEl = document.createElement('div');
      actionsEl.className = 'card-actions';
      if (isPast(c)) {
        // Past concert — disable kedua button
        actionsEl.innerHTML = `
          <button class="btn-action" disabled style="opacity:0.35;cursor:not-allowed;">
            🤍 Wishlist
          </button>
          <button class="btn-action" disabled style="opacity:0.35;cursor:not-allowed;">
            🔗 Share
          </button>`;
      } else {
        actionsEl.innerHTML = `
          <button class="btn-action${wishlisted ? ' wishlisted' : ''}"
            onclick="event.stopPropagation();toggleWishlist('${c.id}')">
            ${wishlisted ? '❤️' : '🤍'} ${wishlisted ? 'Wishlisted' : 'Wishlist'}
          </button>
          <button class="btn-action" onclick="event.stopPropagation();openSharePanel('${c.id}')">
            🔗 Share
          </button>`;
      }
      body.insertBefore(actionsEl, cardFooter);
    }
  });
};

/* ============================================
   UPDATED openModal — INCLUDE MAPS + SHARE + PRICE
   ============================================ */
const _originalOpenModal = openModal;
openModal = function(id) {
  _originalOpenModal(id);
  const c = CONCERTS.find(x => x.id === id);
  if (!c) return;

  const mc = document.getElementById('modalContent');
  if (!mc) return;

  // 1. Inject maps after venue detail-box
  const mapEmbed = getVenueMapEmbed(c.venue);
  const mapsUrl  = getGoogleMapsUrl(c.venue, c.city);
  const mapHtml  = `
    <div class="venue-map-wrap">
      ${mapEmbed
        ? `<iframe src="${mapEmbed}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        : `<a href="${mapsUrl}" target="_blank" rel="noopener" class="venue-map-link" style="padding:20px;display:flex;justify-content:center;background:rgba(255,255,255,0.03)">📍 Buka di Google Maps</a>`}
    </div>
    <a href="${mapsUrl}" target="_blank" rel="noopener" class="venue-map-link">
      📍 Buka di Google Maps ↗
    </a>`;

  // Insert map after modal-details
  const modalDetails = mc.querySelector('.modal-details');
  if (modalDetails) {
    const mapEl = document.createElement('div');
    mapEl.innerHTML = mapHtml;
    modalDetails.insertAdjacentElement('afterend', mapEl);
  }

  // isPast & isRumor sudah tersedia di scope ini
  const _isPast  = isPast(c);
  const _isRumor = isRumor(c);

  // 2. Inject share row before modal-actions
  const modalActions = mc.querySelector('.modal-actions');
  if (modalActions) {
    const shareRow = document.createElement('div');
    shareRow.className = 'modal-share-row';
    if (_isPast) {
      shareRow.innerHTML = `
        <button class="btn-action" disabled style="opacity:0.4;cursor:not-allowed;flex:1">❤️ Wishlist</button>
        <button class="btn-action" disabled style="opacity:0.4;cursor:not-allowed;flex:1">🔗 Share</button>`;
    } else {
      const gcUrl = getGoogleCalendarUrl(c);
      shareRow.innerHTML = `
        <button class="btn-action${isWishlisted(c.id) ? ' wishlisted' : ''}"
          onclick="toggleWishlist('${c.id}');this.classList.toggle('wishlisted');this.innerHTML=isWishlisted('${c.id}')?'❤️ Wishlisted':'🤍 Wishlist'">
          ${isWishlisted(c.id) ? '❤️ Wishlisted' : '🤍 Wishlist'}
        </button>
        ${gcUrl ? `<a class="btn-action" href="${gcUrl}" target="_blank" rel="noopener">📅 Google Calendar</a>` : ''}
        <button class="btn-action" onclick="openSharePanel('${c.id}')">
          🔗 Share
        </button>`;
    }
    modalActions.insertAdjacentElement('beforebegin', shareRow);
  }

  // 3. Update URL for deep link
  history.replaceState(null, '', `${window.location.pathname}?concert=${id}`);

  // Going/Interested di-inject oleh features.js (setelah disclaimer)

  // 5. Track concert view click
  try {
    const cl = JSON.parse(localStorage.getItem('cid_views') || '{}');
    cl[id] = (cl[id] || 0) + 1;
    localStorage.setItem('cid_views', JSON.stringify(cl));
  } catch {}
};

// Clean up URL when modal closes
const _origCloseModal = closeModal;
closeModal = function() {
  _origCloseModal();
  history.replaceState(null, '', window.location.pathname);
};

/* ============================================
   AFFILIATE UTM — wrap all ticket URLs
   ============================================ */
function addUTM(url, source = 'concertid', medium = 'referral', campaign = 'konser-indo') {
  if (!url || url === '#' || url.startsWith('https://instagram')) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source',   source);
    u.searchParams.set('utm_medium',   medium);
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch { return url; }
}

// Patch: apply UTM to all ticket links after DOM renders
function applyUTMToLinks() {
  document.querySelectorAll('a.btn-primary[href], a[href*="loket.com"], a[href*="tiket.com"], a[href*="tix.id"]').forEach(a => {
    if (a.dataset.utmApplied) return;
    a.href = addUTM(a.href);
    a.dataset.utmApplied = '1';
  });
}

/* ============================================
   SEO — JSON-LD Event Schema Injection
   ============================================ */
function injectEventSchemas() {
  const BASE_URL = 'https://list-concert-tour.web.id';

  // Helper: build ISO datetime string dari rawDate + time string "19:00 WIB"
  function toISODateTime(date, timeStr) {
    if (!date || isNaN(date.getTime())) return null;
    const d = date.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!timeStr || timeStr === 'TBA') return d;
    // Extract "HH:MM" dari "19:00 WIB" / "19.00 WIB" / "19:00"
    const m = timeStr.match(/(\d{1,2})[:.h](\d{2})/);
    if (!m) return d;
    const hh = m[1].padStart(2, '0');
    const mm = m[2];
    // WIB = UTC+7 → offset +07:00
    return `${d}T${hh}:${mm}:00+07:00`;
  }

  // Helper: endDate = startDate + (jumlah hari - 1) + end time (estimasi +3 jam)
  function endDateTime(rawDate, dates, timeStr) {
    const extraDays = Math.max(0, dates.length - 1);
    const endDate = new Date(rawDate.getTime() + extraDays * 86400000);
    const start = toISODateTime(endDate, timeStr);
    if (!start || !start.includes('T')) return endDate.toISOString().split('T')[0];
    // Tambah 3 jam untuk estimasi durasi konser
    const endDt = new Date(endDate);
    const m = timeStr && timeStr.match(/(\d{1,2})[:.h](\d{2})/);
    if (m) {
      endDt.setHours(parseInt(m[1]) + 3, parseInt(m[2]));
      const d = endDate.toISOString().split('T')[0];
      const hh = String(endDt.getHours()).padStart(2, '0');
      const mm = String(endDt.getMinutes()).padStart(2, '0');
      return `${d}T${hh}:${mm}:00+07:00`;
    }
    return endDate.toISOString().split('T')[0];
  }

  // Map eventStatus ke full schema.org URL
  function eventStatusUrl(c) {
    if (isPast(c)) return 'https://schema.org/EventEnded';
    if (c.confirmStatus === 'rumor') return 'https://schema.org/EventScheduled';
    return 'https://schema.org/EventScheduled';
  }

  // Build performer array — MusicGroup untuk artis utama, Person untuk support act
  function buildPerformers(c) {
    const performers = [];
    // Artis utama selalu MusicGroup
    performers.push({ '@type': 'MusicGroup', 'name': c.artist });
    // Lineup tambahan (support acts) jika ada
    if (c.lineup && c.lineup.length > 0) {
      c.lineup.forEach(a => {
        if (normalize(a) !== normalize(c.artist)) {
          performers.push({ '@type': 'MusicGroup', 'name': a });
        }
      });
    }
    return performers;
  }

  // Build image array
  function buildImage(c) {
    const imgPath = ARTIST_IMAGES[c.id];
    const img = imgPath
      ? BASE_URL + '/images/' + c.id + '.jpeg'
      : BASE_URL + '/og-image.png';
    return [img];
  }

  // Create schema array untuk semua concerts
  const schemas = CONCERTS.map(c => {
    const startISO = toISODateTime(c.rawDate, c.time);
    const endISO   = endDateTime(c.rawDate, c.dates, c.time);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': c.artist + (c.tour && c.tour !== c.artist ? ' — ' + c.tour : ''),
      'description': c.description || (c.artist + ' live in Indonesia'),
      'image': buildImage(c),
      'url': BASE_URL + '?concert=' + c.id,
      'startDate': startISO,
      'endDate': endISO,
      'eventStatus': eventStatusUrl(c),
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place',
        'name': c.venue,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': c.city ? c.city.split(',')[0].trim() : 'Jakarta',
          'addressRegion': c.city ? (c.city.split(',')[1] || '').trim() : 'DKI Jakarta',
          'addressCountry': 'ID'
        }
      },
      'organizer': {
        '@type': 'Organization',
        'name': c.promotor || 'TBA'
      },
      'performer': buildPerformers(c),
    };

    // Offers — hanya jika ada harga & ada ticketUrl
    if (c.priceMin > 0 && c.ticketUrl) {
      schema['offers'] = c.ticketCategories && c.ticketCategories.length > 1
        ? c.ticketCategories
            .filter(t => t.price && t.price.includes('Rp'))
            .map(t => {
              const priceNum = parseInt((t.price || '').replace(/[^0-9]/g, '')) || c.priceMin;
              return {
                '@type': 'Offer',
                'name': t.name,
                'url': c.ticketUrl,
                'price': priceNum,
                'priceCurrency': 'IDR',
                'availability': isPast(c)
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
                'validFrom': new Date().toISOString()
              };
            })
        : [{
            '@type': 'Offer',
            'url': c.ticketUrl,
            'price': c.priceMin,
            'priceCurrency': 'IDR',
            'availability': isPast(c)
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
            'validFrom': new Date().toISOString()
          }];
    }

    return schema;
  });

  // Inject sebagai CollectionPage yang wraps semua Event schemas
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'ConcertID — Jadwal Konser Internasional di Indonesia',
    'description': 'Jadwal lengkap konser musisi internasional di Indonesia 2025–2027',
    'url': BASE_URL,
    'hasPart': schemas
  });
  document.head.appendChild(script);
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectEventSchemas();
  updateStats();
  updateWishlistCount();
  renderCards(CONCERTS);
  renderHighlights();
  handleDeepLink();
  // Apply UTM after first render
  setTimeout(applyUTMToLinks, 300);
});



/* ============================================
   FITUR — LIGHT / DARK MODE TOGGLE
   Preferensi disimpan di localStorage.
   Default: dark mode.
   Key: 'concertid_theme' → 'light' | 'dark'
   ============================================ */
(function initTheme() {
  const STORAGE_KEY = 'concertid_theme';
  const html        = document.documentElement;
  const btn         = document.getElementById('themeToggle');
  const icon        = document.getElementById('themeIcon');

  /* Tentukan tema awal:
     1. Pakai preferensi tersimpan jika ada
     2. Fallback ke sistem OS (prefers-color-scheme)
     3. Default: dark */
  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }

  let currentTheme = getSavedTheme() || getSystemTheme();

  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light');
      if (icon) icon.textContent = '☀️';
      if (btn)  btn.setAttribute('title', 'Ganti ke Dark Mode');
    } else {
      html.classList.remove('light');
      if (icon) icon.textContent = '🌙';
      if (btn)  btn.setAttribute('title', 'Ganti ke Light Mode');
    }
    currentTheme = theme;
  }

  function toggleTheme() {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    showToast(
      next === 'light' ? '☀️ Light mode aktif' : '🌙 Dark mode aktif',
      'info',
      2000
    );
  }

  /* Terapkan tema sebelum render agar tidak flash */
  applyTheme(currentTheme);

  /* Pasang event listener tombol */
  if (btn) btn.addEventListener('click', toggleTheme);

  /* Ikuti perubahan preferensi sistem secara real-time
     (hanya berlaku jika user belum pernah set manual) */
  try {
    window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', e => {
        if (!getSavedTheme()) applyTheme(e.matches ? 'light' : 'dark');
      });
  } catch {}
})();



/* ============================================================
   FEATURE: SOCIAL PROOF GOING COUNT ON CARDS
   Fetch all vote counts in one call, then inject going badges
   ============================================================ */
(function initGoingCountOnCards() {
  const KEY_GOING = 'cid_going';

  async function fetchAllCounts() {
    try {
      const rows = await DB.select('concert_votes', 'select=concert_id,type');
      const agg  = {};
      for (const r of rows) {
        if (!agg[r.concert_id]) agg[r.concert_id] = { going: 0, interested: 0 };
        if (r.type === 'going')      agg[r.concert_id].going++;
        if (r.type === 'interested') agg[r.concert_id].interested++;
      }
      return agg;
    } catch {
      // fallback localStorage
      try {
        const g  = JSON.parse(localStorage.getItem(KEY_GOING) || '{}');
        const agg = {};
        for (const [id, cnt] of Object.entries(g)) {
          agg[id] = { going: cnt, interested: 0 };
        }
        return agg;
      } catch { return {}; }
    }
  }

  function fmtCount(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n); }

  function injectGoingBadges(counts) {
    CONCERTS.forEach(c => {
      const cnt = counts[c.id];
      if (!cnt || cnt.going < 1) return;
      const card = document.querySelector(`.concert-card[onclick*="${c.id}"]`);
      if (!card) return;
      // Cek apakah badge sudah ada
      if (card.querySelector('.going-count-badge')) return;
      const footer = card.querySelector('.card-footer');
      if (!footer) return;
      const badge = document.createElement('div');
      badge.className = 'going-count-badge';
      badge.innerHTML = `🎟️ <strong>${fmtCount(cnt.going)}</strong> going`;
      footer.insertBefore(badge, footer.firstChild);
    });
  }

  // Patch renderCards untuk inject setelah render
  const _orig = renderCards;
  renderCards = function(list) {
    _orig(list);
    setTimeout(async () => {
      const counts = await fetchAllCounts();
      injectGoingBadges(counts);
    }, 600);
  };

  // Inject ke cards yang sudah ada saat load
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
      const counts = await fetchAllCounts();
      injectGoingBadges(counts);
    }, 1000);
  });
})();

/* ============================================================
   FEATURE: VENUE SEAT MAP — inject ke modal
   ============================================================ */
const VENUE_SEAT_MAPS = {
  'Gelora Bung Karno (GBK) Utama': {
    desc: 'Stadion terbesar Indonesia. Kapasitas ~80.000. Panggung di area lapangan tengah.',
    categories: [
      { name: 'Pit / Floor GA', color: '#ef4444', tips: 'Area terdekat panggung, standing only. Datang 3 jam lebih awal.' },
      { name: 'CAT 1 / Tribune A', color: '#f97316', tips: 'Tribune paling depan. Sisi tengah lebih baik dari pojok.' },
      { name: 'CAT 2 / Tribune B', color: '#eab308', tips: 'Tribune tengah — balance antara jarak & view.' },
      { name: 'CAT 3 / Tribune C', color: '#22c55e', tips: 'Tribune belakang. Bawa binoculars.' },
      { name: 'CAT 4 / Tribune D', color: '#3b82f6', tips: 'Budget-friendly. Layar LED terlihat jelas.' },
      { name: 'VIP', color: '#a855f7', tips: 'Area premium. Termasuk akses soundcheck & merch.' },
    ],
    tips: ['🚍 TransJakarta halte GBK / Polda Metro', '🅿️ Parkir terbatas — sangat disarankan naik transportasi umum', '💧 Bawa minum, antrean minuman panjang', '🎒 Tas max 30x30cm'],
    mapsUrl: 'https://maps.google.com/?q=Stadion+Utama+GBK+Senayan+Jakarta',
  },
  'Indonesia Arena, GBK': {
    desc: 'Indoor arena kapasitas 16.000. Akustik excellent untuk konser indoor.',
    categories: [
      { name: 'Floor GA', color: '#ef4444', tips: 'Area depan panggung, standing. Antri dari pagi untuk posisi depan.' },
      { name: 'CAT 1', color: '#f97316', tips: 'Tribune bawah. Section C,D,E (tengah) terbaik.' },
      { name: 'CAT 2', color: '#eab308', tips: 'Tribune bawah sisi kiri-kanan. Hindari section pojok.' },
      { name: 'CAT 3', color: '#22c55e', tips: 'Tribune atas — perfect untuk lihat koreografi!' },
      { name: 'VIP', color: '#a855f7', tips: 'Kursi premium. Biasanya termasuk lounge & merch.' },
    ],
    tips: ['🚍 TransJakarta halte GBK, jalan ~5 menit', '🎒 Strict bag policy — max 30x20cm', '🍔 Food court di dalam arena'],
    mapsUrl: 'https://maps.google.com/?q=Indonesia+Arena+Senayan+Jakarta',
  },
  'Jakarta International Stadium (JIS)': {
    desc: 'Stadion modern berkapasitas 82.000. Atap retractable. Fasilitas terbaik di Indonesia.',
    categories: [
      { name: 'Festival / Pit', color: '#ef4444', tips: 'Lapangan tengah, standing. Paling depan — datang lebih awal.' },
      { name: 'Tribune A / VIP', color: '#a855f7', tips: 'Tribune depan premium. Row 1-10 optimal.' },
      { name: 'Tribune B', color: '#f97316', tips: 'Tribune tengah. Section M,N,O (tengah) terbaik.' },
      { name: 'Tribune C/D', color: '#eab308', tips: 'Tribune belakang/atas. Budget-friendly, layar HD terlihat jelas.' },
    ],
    tips: ['🚌 Bus JIS dari Kemayoran / Pulogadung', '🚫 Tidak ada MRT/LRT dekat — naik shuttle bus', '⛅ Outdoor dengan atap retractable — cek cuaca'],
    mapsUrl: 'https://maps.google.com/?q=Jakarta+International+Stadium',
  },
  'ICE BSD City': {
    desc: 'Convention center terbesar Asia Tenggara. Multi-hall, kapasitas hingga 50.000.',
    categories: [
      { name: 'Floor GA', color: '#ef4444', tips: 'Area depan panggung, standing.' },
      { name: 'VIP', color: '#a855f7', tips: 'Area premium dengan kursi.' },
      { name: 'Tribune', color: '#eab308', tips: 'Tribune samping/belakang. View panoramik.' },
    ],
    tips: ['🚗 Via Tol BSD Exit, Jl. BSD Raya Utama', '🅿️ Parkir luas tapi bisa padat — datang 2 jam lebih awal', '🌡️ Indoor dengan AC — bawa jaket tipis'],
    mapsUrl: 'https://maps.google.com/?q=ICE+BSD+City+Tangerang',
  },
  'Pantai Carnaval Ancol': {
    desc: 'Venue outdoor tepi laut. Nuansa festival unik. Kapasitas 30.000+.',
    categories: [
      { name: 'Festival GA', color: '#ef4444', tips: 'Area depan panggung. Angin laut bisa kencang.' },
      { name: 'VIP Festival', color: '#a855f7', tips: 'Elevated platform. Bar VIP.' },
    ],
    tips: ['🚌 TransJakarta halte Ancol', '🌊 Venue tepi laut — bawa jaket tipis', '🎒 Bawa jas hujan untuk outdoor festival'],
    mapsUrl: 'https://maps.google.com/?q=Pantai+Carnaval+Ancol+Jakarta',
  },
};

function getSeatMapForVenue(venueName) {
  if (VENUE_SEAT_MAPS[venueName]) return VENUE_SEAT_MAPS[venueName];
  for (const [key, val] of Object.entries(VENUE_SEAT_MAPS)) {
    if (venueName.toLowerCase().includes(key.toLowerCase().split(' ')[0])) return val;
  }
  return null;
}

function renderSeatMapHtml(concert) {
  const sm = getSeatMapForVenue(concert.venue);
  if (!sm) return `<div class="seat-map-section"><p class="seat-map-na">🗺️ Denah venue belum tersedia untuk ${concert.venue}</p></div>`;
  return `
    <div class="seat-map-section">
      <h4>🗺️ Denah & Tips Venue</h4>
      <p class="seat-map-desc">${sm.desc}</p>
      <div class="seat-categories">
        ${sm.categories.map(cat => `
          <div class="seat-cat-row">
            <span class="seat-dot" style="background:${cat.color}"></span>
            <div>
              <strong style="color:${cat.color}">${cat.name}</strong>
              <span class="seat-cat-tips">💡 ${cat.tips}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="seat-tips">
        <strong>Tips:</strong>
        ${sm.tips.map(t => `<div>${t}</div>`).join('')}
      </div>
      <a href="${sm.mapsUrl}" target="_blank" rel="noopener" class="btn-maps-sm">📍 Buka di Google Maps</a>
    </div>`;
}

/* ============================================================
   FEATURE: CONCERT PLAYLIST AUTO-GENERATE
   Add "Pre-Concert Playlist" button to modal
   ============================================================ */
function renderPlaylistHtml(concert) {
  const spotifyArtistId = typeof SpotifyIntegration !== 'undefined'
    ? SpotifyIntegration.getSpotifyId(concert.id)
    : null;
  const searchQuery = encodeURIComponent(concert.artist + ' playlist');
  const playlistUrl = spotifyArtistId
    ? `https://open.spotify.com/artist/${spotifyArtistId}/discography/album`
    : `https://open.spotify.com/search/${searchQuery}`;
  return `
    <div class="playlist-section">
      <h4>🎵 Pre-Concert Playlist</h4>
      <p>Warm-up sebelum konser dengan lagu-lagu ${concert.artist}!</p>
      <a href="${playlistUrl}" target="_blank" rel="noopener" class="btn-spotify-playlist">
        <svg viewBox="0 0 24 24" fill="#1DB954" width="18" height="18"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        Buka Playlist di Spotify
      </a>
    </div>`;
}

/* ============================================================
   FEATURE: INJECT SEAT MAP + PLAYLIST KE MODAL
   Patch openModal untuk tambah seat map & playlist section
   ============================================================ */
(function patchModalWithNewFeatures() {
  if (typeof openModal === 'undefined') return;
  const _origModal = openModal;

  window.openModal = function(id) {
    _origModal(id);
    const c = CONCERTS.find(x => x.id === id);
    if (!c) return;

    setTimeout(() => {
      const mc = document.getElementById('modalContent');
      if (!mc) return;

      // Inject Seat Map setelah maps section
      if (!mc.querySelector('.seat-map-section')) {
        const venueMapWrap = mc.querySelector('.venue-map-wrap');
        const seatEl = document.createElement('div');
        seatEl.innerHTML = renderSeatMapHtml(c);
        if (venueMapWrap && venueMapWrap.nextSibling) {
          mc.insertBefore(seatEl.firstElementChild || seatEl, venueMapWrap.nextSibling);
        } else if (venueMapWrap) {
          mc.appendChild(seatEl.firstElementChild || seatEl);
        }
      }

      // Inject Playlist setelah Spotify section
      if (!mc.querySelector('.playlist-section')) {
        const spotifySection = mc.querySelector('.spotify-section');
        const playlistEl = document.createElement('div');
        playlistEl.innerHTML = renderPlaylistHtml(c);
        if (spotifySection && spotifySection.nextSibling) {
          mc.insertBefore(playlistEl.firstElementChild || playlistEl, spotifySection.nextSibling);
        } else if (spotifySection) {
          spotifySection.after(playlistEl.firstElementChild || playlistEl);
        } else {
          mc.appendChild(playlistEl.firstElementChild || playlistEl);
        }
      }
    }, 200);
  };
  openModal = window.openModal;
})();
