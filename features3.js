/* ================================================================
   ConcertID — features3.js
   1. Multi-bahasa (ID / EN)
   2. Notifikasi Tiket On-Sale
   3. "Sudah Nonton" Badge
   4. Setlist Prediction
   5. Konverter Harga Real-time
   6. Group Buying / Cari Teman Nonton
   ================================================================ */

'use strict';

/* ================================================================
   1. MULTI-BAHASA (ID / EN)
   ================================================================ */
const I18n = (() => {
  const KEY = 'cid_lang';
  let current = (() => { try { return localStorage.getItem(KEY) || 'id'; } catch { return 'id'; } })();

  const T = {
    // Navbar
    nav_concerts:      { id: 'Konser',           en: 'Concerts' },
    nav_upcoming:      { id: 'Mendatang',         en: 'Upcoming' },
    nav_venues:        { id: 'Venue',             en: 'Venues' },
    nav_about:         { id: 'Tentang',           en: 'About' },
    // Hero
    hero_badge:        { id: '🇮🇩 Indonesia 2025 – 2027', en: '🇮🇩 Indonesia 2025 – 2027' },
    hero_title_l1:     { id: 'Semua Konser',      en: 'All Concerts' },
    hero_title_l2:     { id: 'Internasional',     en: 'International' },
    hero_title_l3:     { id: 'di Satu Tempat',    en: 'in One Place' },
    hero_sub:          { id: 'Info lengkap venue, tanggal, jam, dan harga tiket — lengkap dengan label <strong>Confirmed ✅</strong> vs <strong>Rumor 🔮</strong> agar kamu tidak tertipu.', en: 'Full info on venue, date, time, and ticket prices — complete with <strong>Confirmed ✅</strong> vs <strong>Rumor 🔮</strong> labels so you don\'t get scammed.' },
    hero_search:       { id: 'Cari artis, venue, kota...', en: 'Search artist, venue, city...' },
    hero_scroll:       { id: 'Scroll untuk lihat konser', en: 'Scroll to see concerts' },
    hero_stat1:        { id: 'Total Konser',      en: 'Total Concerts' },
    hero_stat2:        { id: '✅ Confirmed',       en: '✅ Confirmed' },
    hero_stat3:        { id: '🔮 Rumor',           en: '🔮 Rumor' },
    // Filter
    filter_all:        { id: 'Semua',             en: 'All' },
    filter_confirmed:  { id: '✅ Confirmed',       en: '✅ Confirmed' },
    filter_rumor:      { id: '🔮 Rumor',           en: '🔮 Rumor' },
    filter_kpop:       { id: 'K-Pop',             en: 'K-Pop' },
    filter_pop:        { id: 'Pop / R&B',          en: 'Pop / R&B' },
    filter_rock:       { id: 'Rock / Metal',       en: 'Rock / Metal' },
    filter_jazz:       { id: 'Jazz',               en: 'Jazz' },
    filter_indie:      { id: 'Indie / Festival',   en: 'Indie / Festival' },
    filter_upcoming:   { id: 'Mendatang',          en: 'Upcoming' },
    filter_past:       { id: 'Sudah Lewat',        en: 'Past' },
    sort_label:        { id: 'Urutkan:',           en: 'Sort:' },
    sort_date_asc:     { id: '📅 Tanggal (Terdekat)', en: '📅 Date (Nearest)' },
    sort_date_desc:    { id: '📅 Tanggal (Terjauh)',  en: '📅 Date (Farthest)' },
    sort_price_asc:    { id: '💰 Harga (Termurah)',   en: '💰 Price (Cheapest)' },
    sort_price_desc:   { id: '💰 Harga (Termahal)',   en: '💰 Price (Most Expensive)' },
    sort_name_asc:     { id: '🔤 Nama Artis (A–Z)',   en: '🔤 Artist Name (A–Z)' },
    // Concerts section
    section_concerts:  { id: 'Jadwal Konser',     en: 'Concert Schedule' },
    section_subtitle:  { id: 'Data dari sumber resmi. ✅ = Confirmed resmi &nbsp;|&nbsp; 🔮 = Rumor / belum dikonfirmasi', en: 'Data from official sources. ✅ = Officially confirmed &nbsp;|&nbsp; 🔮 = Rumor / unconfirmed' },
    section_hot:       { id: '🔥 Paling Ditunggu-tunggu', en: '🔥 Most Anticipated' },
    section_hot_sub:   { id: 'Konser mendatang yang jangan sampai kamu lewatkan', en: "Upcoming concerts you don't want to miss" },
    // Cards
    card_buy:          { id: '🎫 Beli Tiket',      en: '🎫 Buy Ticket' },
    card_buy_now:      { id: '🎫 Beli Tiket Sekarang', en: '🎫 Buy Ticket Now' },
    card_ended:        { id: 'Konser Selesai',     en: 'Concert Ended' },
    card_ended2:       { id: 'Konser Telah Selesai', en: 'Concert Has Ended' },
    card_detail:       { id: 'Detail ›',           en: 'Details ›' },
    card_unconfirmed:  { id: '🔮 Belum Dikonfirmasi', en: '🔮 Unconfirmed' },
    card_monitor:      { id: '🔔 Pantau Info Resmi', en: '🔔 Monitor Official Info' },
    card_rumor_banner: { id: '⚠️ Belum ada pengumuman resmi', en: '⚠️ No official announcement yet' },
    card_price_label:  { id: 'Harga Tiket',        en: 'Ticket Price' },
    card_price_rumor:  { id: '⚠️ Status Harga',    en: '⚠️ Price Status' },
    card_unannounced:  { id: '⚠️ Belum diumumkan', en: '⚠️ Not yet announced' },
    // Legend
    legend_title:      { id: '📖 Panduan Status Konser', en: '📖 Concert Status Guide' },
    legend_confirmed_title: { id: '✅ Confirmed', en: '✅ Confirmed' },
    legend_confirmed_desc:  { id: 'Diumumkan resmi oleh artis, manajemen, atau promotor. Tiket sudah/sedang dijual di platform resmi.', en: 'Officially announced by the artist, management, or promoter. Tickets are already/being sold on official platforms.' },
    legend_rumor_title:     { id: '🔮 Rumor', en: '🔮 Rumor' },
    legend_rumor_desc:      { id: 'Beredar di media sosial atau media hiburan, namun BELUM ada pernyataan resmi. Jangan beli tiket dari calo!', en: 'Circulating on social media or entertainment media, but NO official statement yet. Don\'t buy tickets from scalpers!' },
    legend_past_desc:       { id: 'Konser telah selesai digelar. Data disimpan sebagai referensi historis.', en: 'Concert has been held. Data is stored as historical reference.' },
    // Newsletter
    nl_title:          { id: 'Jangan Ketinggalan Konser!', en: "Don't Miss a Concert!" },
    nl_sub:            { id: 'Daftar gratis dan dapatkan update konser terbaru langsung di inbox kamu.', en: 'Sign up free and get the latest concert updates straight to your inbox.' },
    nl_placeholder:    { id: 'email@kamu.com',     en: 'your@email.com' },
    nl_btn:            { id: 'Daftar Gratis',      en: 'Sign Up Free' },
    // Footer
    footer_tagline:    { id: 'Jadwal konser internasional terlengkap di Indonesia', en: 'The most complete international concert schedule in Indonesia' },
    footer_nav:        { id: 'Navigasi',           en: 'Navigation' },
    footer_all:        { id: 'Semua Konser',       en: 'All Concerts' },
    footer_upcoming:   { id: 'Mendatang',          en: 'Upcoming' },
    footer_about:      { id: 'Tentang Kami',       en: 'About Us' },
    footer_tickets:    { id: 'Tiket Resmi',        en: 'Official Tickets' },
    footer_copy:       { id: '© 2026 ConcertID — Data diupdate berkala. Disclaimer: Selalu verifikasi ke platform resmi. Harga tiket dapat berubah sewaktu-waktu.', en: '© 2026 ConcertID — Data updated regularly. Disclaimer: Always verify with official platforms. Ticket prices may change at any time.' },
    // Venue section
    venues_title:      { id: '📍 Venue Populer',  en: '📍 Popular Venues' },
    venues_sub:        { id: 'Lokasi konser internasional favorit di Indonesia', en: 'Favorite international concert venues in Indonesia' },
    // Upcoming section
    upcoming_scroll:   { id: 'Scroll untuk lihat konser', en: 'Scroll to see concerts' },
    // No result
    no_result:         { id: '😔 Tidak ada konser yang cocok dengan pencarian kamu.', en: '😔 No concerts match your search.' },
  };

  function t(key) {
    const entry = T[key];
    if (!entry) return key;
    return entry[current] || entry['id'];
  }

  function getLang() { return current; }

  function setLang(lang) {
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch {}
    applyAll();
    if (typeof showToast === 'function') {
      showToast(lang === 'en' ? '🌐 Language: English' : '🌐 Bahasa: Indonesia', 'info', 2000);
    }
  }

  function toggle() { setLang(current === 'id' ? 'en' : 'id'); }

  function applyAll() {
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.textContent = current === 'id' ? '🌐 EN' : '🌐 ID';

    // ── Navbar ──
    const navLinks = document.querySelectorAll('.nav-links a');
    ['nav_concerts','nav_upcoming','nav_venues','nav_about'].forEach((k, i) => {
      if (navLinks[i]) navLinks[i].textContent = t(k);
    });

    // ── Hero ──
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) heroBadge.textContent = t('hero_badge');

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML =
      `${t('hero_title_l1')}<br /><span class="gradient-text">${t('hero_title_l2')}</span><br />${t('hero_title_l3')}`;

    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) heroSub.innerHTML = t('hero_sub');

    const heroScroll = document.querySelector('.hero-scroll span');
    if (heroScroll) heroScroll.textContent = t('hero_scroll');

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('hero_search');

    const statLabels = document.querySelectorAll('.stat-label');
    ['hero_stat1','hero_stat2','hero_stat3'].forEach((k, i) => {
      if (statLabels[i]) statLabels[i].textContent = t(k);
    });

    // ── Filter ──
    const filterMap = {
      all:'filter_all', confirmed:'filter_confirmed', rumor:'filter_rumor',
      kpop:'filter_kpop', pop:'filter_pop', rock:'filter_rock',
      jazz:'filter_jazz', indie:'filter_indie', upcoming:'filter_upcoming', past:'filter_past',
    };
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
      const key = filterMap[b.dataset.filter];
      if (!key || b.dataset.filter === 'wishlist') return;
      // Preserve wishlist count badge
      const badge = b.querySelector('.wishlist-count');
      b.textContent = t(key);
      if (badge) b.appendChild(badge);
    });

    const sortLabel = document.querySelector('.sort-label');
    if (sortLabel) sortLabel.textContent = t('sort_label');

    // Sort options
    const sortOpts = document.querySelectorAll('#sortSelect option');
    const sortKeys = ['sort_date_asc','sort_date_desc','sort_price_asc','sort_price_desc','sort_name_asc'];
    sortOpts.forEach((opt, i) => { if (sortKeys[i]) opt.textContent = t(sortKeys[i]); });

    // ── Concert section headers ──
    const concSecH2 = document.querySelector('.concerts-section .section-header h2');
    const concSecP  = document.querySelector('.concerts-section .section-header p');
    if (concSecH2) concSecH2.innerHTML = t('section_concerts') + ' <span class="gradient-text">2025–2027</span>';
    if (concSecP)  concSecP.innerHTML  = t('section_subtitle');

    const hlH2 = document.querySelector('.highlight-section .section-header h2');
    const hlP  = document.querySelector('.highlight-section .section-header p');
    if (hlH2) hlH2.textContent = t('section_hot');
    if (hlP)  hlP.textContent  = t('section_hot_sub');

    // ── Legend ──
    const legendH3 = document.querySelector('.legend-box h3');
    if (legendH3) legendH3.textContent = t('legend_title');
    const legendItems = document.querySelectorAll('.legend-item p');
    if (legendItems[0]) legendItems[0].textContent = t('legend_confirmed_desc');
    if (legendItems[1]) legendItems[1].textContent = t('legend_rumor_desc');
    if (legendItems[2]) legendItems[2].textContent = t('legend_past_desc');

    // ── Venues section ──
    const venuesH2 = document.querySelector('.venues-section .section-header h2');
    const venuesP  = document.querySelector('.venues-section .section-header p');
    if (venuesH2) venuesH2.textContent = t('venues_title');
    if (venuesP)  venuesP.textContent  = t('venues_sub');

    // ── No result ──
    const noRes = document.querySelector('#noResult p');
    if (noRes) noRes.textContent = t('no_result');

    // ── Newsletter ──
    const nlTitle = document.querySelector('.nl-text h3');
    const nlSub   = document.querySelector('.nl-text p');
    const nlBtn   = document.getElementById('nlMcBtn');
    const nlEmail = document.getElementById('nlMcEmail');
    if (nlTitle) nlTitle.textContent = t('nl_title');
    if (nlSub)   nlSub.textContent   = t('nl_sub');
    if (nlBtn && !nlBtn.disabled) nlBtn.textContent = t('nl_btn');
    if (nlEmail) nlEmail.placeholder = t('nl_placeholder');

    // ── Footer ──
    const footerTagline = document.querySelector('.footer-logo p');
    if (footerTagline) footerTagline.textContent = t('footer_tagline');

    const footerNavH4 = document.querySelector('.footer-links h4');
    if (footerNavH4) footerNavH4.textContent = t('footer_nav');

    const footerLinks = document.querySelectorAll('.footer-links a');
    const footerLinkKeys = ['footer_all','footer_upcoming','footer_about'];
    footerLinks.forEach((a, i) => { if (footerLinkKeys[i]) a.textContent = t(footerLinkKeys[i]); });

    const footerCopy = document.querySelector('.footer-bottom p');
    if (footerCopy) footerCopy.textContent = t('footer_copy');

    // ── Re-render cards agar tombol Beli Tiket, Detail, dll ikut berubah ──
    if (typeof applyFilters === 'function') applyFilters();
  }

  return { t, getLang, setLang, toggle, applyAll };
})();
window.I18n = I18n;


/* ================================================================
   3. "SUDAH NONTON" BADGE
   ================================================================ */
const BeenThere = (() => {
  const KEY = 'cid_been_there';

  function getAll() { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } }
  function saveAll(s) { try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {} }
  function hasAttended(id) { return getAll().has(id); }

  function toggle(concertId, btnEl) {
    const all = getAll();
    if (all.has(concertId)) {
      all.delete(concertId);
      if (btnEl) { btnEl.textContent = '✅ Tandai Sudah Nonton'; btnEl.classList.remove('bt-active'); }
      showToast('Dihapus dari daftar konser yang pernah kamu tonton', 'info', 2000);
    } else {
      all.add(concertId);
      if (btnEl) { btnEl.textContent = '🎉 Sudah Nonton!'; btnEl.classList.add('bt-active'); }
      showToast('🎉 Ditandai! Kamu pernah nonton konser ini.', 'success', 2500);
    }
    saveAll(all);
    document.querySelectorAll(`.concert-card[onclick*="${concertId}"]`).forEach(card => {
      card.classList.toggle('been-there', all.has(concertId));
    });
  }

  function renderBtn(concertId) {
    const active = hasAttended(concertId);
    return `<button class="btn-been-there${active ? ' bt-active' : ''}"
      onclick="BeenThere.toggle('${concertId}', this)">
      ${active ? '🎉 Sudah Nonton!' : '✅ Tandai Sudah Nonton'}
    </button>`;
  }

  function applyBadgesToCards() {
    const all = getAll();
    all.forEach(id => {
      document.querySelectorAll(`.concert-card[onclick*="${id}"]`).forEach(card => {
        card.classList.add('been-there');
      });
    });
  }

  return { toggle, hasAttended, renderBtn, applyBadgesToCards };
})();
window.BeenThere = BeenThere;


/* ================================================================
   4. SETLIST
   - Konser mendatang: label "Prediksi Setlist"
   - Konser past: label "Setlist Aktual" (sudah pasti)
   ================================================================ */
const SetlistPredict = (() => {
  // isPast (actual) vs upcoming (prediction)
  const SETLISTS = {
    // ── PAST — Setlist Aktual ──
    'blackpink-deadline-2025': {
      actual: true,
      source: 'Setlist aktual BLACKPINK DEADLINE Jakarta, Nov 2025',
      songs: ['Pink Venom','Shut Down','Typa Girl','Hard to Love','The Happiest Girl','Between Girls','Yeah Yeah Yeah','Lovesick Girls','Kill This Love','DDU-DU DDU-DU','How You Like That','Boombayah'],
    },
    'green-day-jakarta-2025': {
      actual: true,
      source: 'Setlist aktual Green Day Hammersonic, Feb 2025',
      songs: ['American Idiot','Holiday','Boulevard of Broken Dreams','Welcome to Paradise','Basket Case','Brain Stew','Minority','Wake Me Up When September Ends','Know Your Enemy','21 Guns','Good Riddance (Time of Your Life)'],
    },
    'ateez-2026': {
      actual: true,
      source: 'Setlist aktual ATEEZ In Your Fantasy Jakarta, Jan 2026',
      songs: ['FIREWORKS (I\'LL BE THE ONE)','Fireworks','WAVE','ANSWER','Wonderland','HALAZIA','Guerrilla','Inception','Say My Name','The Real','Rocky','ROCKY','Deja Vu','I\'ll Be There'],
    },
    'dream-theater-2026': {
      actual: true,
      source: 'Setlist aktual Dream Theater Jakarta, Feb 2026',
      songs: ['The Alien','Metropolis Pt. 1','Pull Me Under','The Mirror','Lie','Peruvian Skies','The Spirit Carries On','Octavarium','The Count of Tuscany','On the Backs of Angels'],
    },
    'mcr-hammersonic-2026': {
      actual: true,
      source: 'Setlist aktual MCR Hammersonic Jakarta, Mei 2026',
      songs: ['Welcome to the Black Parade','Helena',"I'm Not Okay (I Promise)",'Famous Last Words','Na Na Na','Teenagers','The Ghost of You','Cancer','Mama'],
    },
    'laufey-jakarta-2026': {
      actual: true,
      source: 'Setlist aktual Laufey Jakarta, Mei 2026',
      songs: ['Valentine','Let You Break My Heart Again','Bewitched','From the Start','Best Friend','Falling Behind',"I'd Rather Go Blind",'Lovesick','Atonement','An Evening I Will Not Forget'],
    },
    'exo-exhorizon-jakarta-2026': {
      actual: true,
      source: 'Setlist aktual EXO EXhOrizon Jakarta, Jun 2026',
      songs: ['Power','Tempo','Obsession','Ko Ko Bop','Monster','Lucky One','Love Shot','Growl','Call Me Baby','MAMA','Comeback','The Eve','Cream Soda'],
    },
    // ── UPCOMING — Prediksi Setlist ──
    'bts-jakarta-2026': {
      actual: false,
      source: 'Prediksi berdasarkan setlist BTS Permission to Dance on Stage (2022)',
      songs: ['Butter','Permission to Dance','ON','Dynamite','Boy With Luv','DNA','IDOL','Fake Love','Spring Day','Fire','Not Today','DOPE','Run BTS','Yet To Come'],
    },
    'mcr-jis-2026': {
      actual: false,
      source: 'Prediksi berdasarkan setlist MCR World Tour 2023',
      songs: ['The Ghost of You','Helena','Famous Last Words',"I'm Not Okay",'Welcome to the Black Parade','Teenagers','Na Na Na','Sing','Mama','Cancer','Planetary (GO!)','Thank You for the Venom'],
    },
    'the-weeknd-jakarta-2026': {
      actual: false,
      source: 'Prediksi berdasarkan setlist After Hours Til Dawn Tour 2023',
      songs: ['Alone Again','Gasoline','How Do I Make You Love Me?','Take My Breath','Sacrifice','Blinding Lights','Save Your Tears','Starboy','I Feel It Coming',"Can't Feel My Face",'The Hills','Often','Call Out My Name'],
    },
    'avenged-sevenfold-jakarta-2026': {
      actual: false,
      source: 'Prediksi berdasarkan setlist A7X Life Is But a Dream Tour 2023',
      songs: ['Game Over','Mattel','Nobody','We Love You','Hail to the King','God Damn','Critical Acclaim','Bat Country','Afterlife','Nightmare','So Far Away','A Little Piece of Heaven','Unholy Confessions'],
    },
    'one-ok-rock-jakarta-2026': {
      actual: false,
      source: 'Prediksi berdasarkan setlist ONE OK ROCK Luxury Disease Asia Tour 2023',
      songs: ['Wherever You Are','Taking Off','Never Let Me Go','Make It Out Alive','Vandalize','Answer is Near','Wasted Nights','(Re)make','Renegades','Stand Out Fit In','Mighty Long Fall'],
    },
    'westlife-jakarta-2027': {
      actual: false,
      source: 'Prediksi berdasarkan setlist Westlife Wild Dreams Tour 2022',
      songs: ['Swear It Again','Flying Without Wings','You Raise Me Up','My Love','Uptown Girl','World of Our Own','What Makes a Man','Unbreakable','When You\'re Looking Like That','Queen of My Heart'],
    },
    'coldplay-jakarta-rumor': {
      actual: false,
      source: 'Prediksi berdasarkan setlist Music of the Spheres World Tour 2023',
      songs: ['Music of the Spheres','My Universe','Human Heart','Yellow','The Scientist','Fix You','A Sky Full of Stars','Adventure of a Lifetime','Hymn for the Weekend','Clocks','Sparks','Higher Power'],
    },
    'taylor-swift-jakarta-rumor': {
      actual: false,
      source: 'Prediksi berdasarkan setlist The Eras Tour 2023-2024',
      songs: ['Cruel Summer','Love Story','You Belong With Me','Blank Space','Style','All Too Well (10 Min)','Shake It Off','Bad Blood','Wildest Dreams','Anti-Hero','Lavender Haze','Bejeweled','Karma'],
    },
    'ed-sheeran-jakarta-rumor': {
      actual: false,
      source: 'Prediksi berdasarkan setlist Mathematics Tour 2023',
      songs: ['Tides','Shivers','Castle on the Hill','Galway Girl','Don\'t','Shape of You','Photograph','Perfect','Thinking Out Loud','Bad Habits','Overpass Graffiti','Celestial'],
    },
  };

  function render(concertId) {
    const data = SETLISTS[concertId];
    if (!data) return '';
    const isActual = data.actual;
    return `
      <div class="setlist-section">
        <div class="setlist-header">
          <h3>${isActual ? '🎶 Setlist Aktual' : '🎶 Prediksi Setlist'}</h3>
          <span class="setlist-badge${isActual ? ' setlist-actual' : ''}">${isActual ? 'Aktual ✅' : 'Prediction'}</span>
        </div>
        <p class="setlist-source">📊 ${data.source}</p>
        <ol class="setlist-list">
          ${data.songs.map((s, i) => `
            <li class="setlist-item">
              <span class="setlist-num">${i + 1}</span>
              <span class="setlist-song">${s}</span>
            </li>`).join('')}
        </ol>
        ${!isActual ? `<p class="setlist-disclaimer">⚠️ Hanya prediksi. Setlist aktual bisa berbeda.</p>` : ''}
      </div>`;
  }

  return { render };
})();
window.SetlistPredict = SetlistPredict;


/* ================================================================
   5. KONVERTER HARGA REAL-TIME
   Hanya tampil untuk konser CONFIRMED + UPCOMING + ada harga
   ================================================================ */
const PriceConverter = (() => {
  const KEY_RATES = 'cid_fx_rates';
  const KEY_TS    = 'cid_fx_ts';
  const CACHE_TTL = 3600000;

  let rates = { USD: 0.000062, SGD: 0.000084, KRW: 0.085, MYR: 0.00029, JPY: 0.0097 };

  async function fetchRates() {
    try {
      const ts     = parseInt(localStorage.getItem(KEY_TS) || '0');
      const cached = localStorage.getItem(KEY_RATES);
      if (Date.now() - ts < CACHE_TTL && cached) { rates = JSON.parse(cached); return; }
      const res  = await fetch('https://open.er-api.com/v6/latest/IDR');
      const data = await res.json();
      if (data && data.rates) {
        rates = { USD: data.rates.USD, SGD: data.rates.SGD, KRW: data.rates.KRW, MYR: data.rates.MYR, JPY: data.rates.JPY };
        localStorage.setItem(KEY_RATES, JSON.stringify(rates));
        localStorage.setItem(KEY_TS, Date.now().toString());
      }
    } catch {}
  }

  function fmtCurrency(idr, currency) {
    const val = idr * (rates[currency] || 0);
    switch (currency) {
      case 'USD': return `$${val.toFixed(0)}`;
      case 'SGD': return `S$${val.toFixed(0)}`;
      case 'KRW': return `₩${Math.round(val).toLocaleString()}`;
      case 'MYR': return `RM ${val.toFixed(0)}`;
      case 'JPY': return `¥${Math.round(val).toLocaleString()}`;
      default:    return val.toFixed(0);
    }
  }

  function render(concert) {
    // Sembunyikan untuk konser past atau rumor atau harga belum ada
    if (!concert || concert.priceMin === 0) return '';
    if (concert.confirmStatus === 'rumor') return '';
    if (concert.rawDate < new Date()) return '';

    const currencies = [
      { code: 'USD', flag: '🇺🇸' }, { code: 'SGD', flag: '🇸🇬' },
      { code: 'KRW', flag: '🇰🇷' }, { code: 'MYR', flag: '🇲🇾' },
      { code: 'JPY', flag: '🇯🇵' },
    ];
    const rows = currencies.map(c => `
      <div class="fx-row">
        <span class="fx-flag">${c.flag}</span>
        <span class="fx-currency">${c.code}</span>
        <span class="fx-range">${fmtCurrency(concert.priceMin, c.code)} – ${fmtCurrency(concert.priceMax, c.code)}</span>
      </div>`).join('');

    return `
      <div class="fx-section">
        <div class="fx-header">
          <h3>💱 Konverter Harga</h3>
          <span class="fx-badge">Live Rate</span>
        </div>
        <div class="fx-grid">${rows}</div>
        <p class="fx-disclaimer">* Kurs real-time · 1 USD ≈ Rp ${Math.round(1 / rates.USD).toLocaleString()}</p>
      </div>`;
  }

  return { fetchRates, render };
})();
window.PriceConverter = PriceConverter;


/* ================================================================
   6. GROUP BUYING / CARI TEMAN NONTON
   Supabase primary, localStorage fallback
   ================================================================ */
const GroupBuying = (() => {
  const LS_KEY = 'cid_group_buying';

  function lsGetAll()   { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function lsGetFor(id) { return lsGetAll()[id] || []; }

  function genPostUID() { return 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

  function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff/60000), h = Math.floor(m/60), d = Math.floor(h/24);
    if (d > 0) return `${d} hari lalu`;
    if (h > 0) return `${h} jam lalu`;
    if (m > 0) return `${m} menit lalu`;
    return 'Baru saja';
  }

  async function fetchPosts(concertId) {
    try {
      const rows = await DB.select('group_buying',
        `concert_id=eq.${encodeURIComponent(concertId)}&order=created_at.desc`);
      return rows.map(r => ({
        uid:      r.post_uid,
        ownerUid: r.owner_uid,
        name:     r.name,
        category: r.category || 'Semua kategori',
        contact:  r.contact,
        ig:       r.ig || '',
        note:     r.note || '',
        date:     r.created_at,
      }));
    } catch {
      return lsGetFor(concertId);
    }
  }

  async function add(concertId, { name, category, contact, ig, note }) {
    if (!name || !contact) return { ok: false, msg: 'Nama dan kontak WA wajib diisi.' };
    const uid      = genPostUID();
    const ownerUid = getDeviceUID();
    try {
      await DB.insert('group_buying', {
        concert_id: concertId,
        post_uid:   uid,
        owner_uid:  ownerUid,
        name:       name.trim().slice(0,30).replace(/</g,'&lt;'),
        category:   (category||'Semua kategori').trim().slice(0,30).replace(/</g,'&lt;'),
        contact:    contact.trim().slice(0,60).replace(/</g,'&lt;'),
        ig:         (ig||'').replace('@','').trim().slice(0,40).replace(/</g,'&lt;'),
        note:       (note||'').trim().slice(0,150).replace(/</g,'&lt;'),
      });
      return { ok: true };
    } catch {
      // fallback localStorage
      const all = lsGetAll();
      if (!all[concertId]) all[concertId] = [];
      all[concertId].unshift({ uid, ownerUid, name: name.trim().slice(0,30).replace(/</g,'&lt;'), category: (category||'Semua kategori').trim().slice(0,30).replace(/</g,'&lt;'), contact: contact.trim().slice(0,60).replace(/</g,'&lt;'), ig: (ig||'').replace('@','').trim().slice(0,40).replace(/</g,'&lt;'), note: (note||'').trim().slice(0,150).replace(/</g,'&lt;'), date: new Date().toISOString() });
      localStorage.setItem(LS_KEY, JSON.stringify(all));
      return { ok: true };
    }
  }

  async function updatePost(concertId, uid, fields) {
    try {
      const mapped = {};
      if (fields.name)     mapped.name     = fields.name;
      if (fields.category) mapped.category = fields.category;
      if (fields.contact)  mapped.contact  = fields.contact;
      if ('ig'   in fields) mapped.ig   = fields.ig;
      if ('note' in fields) mapped.note = fields.note;
      await DB.update('group_buying', `post_uid=eq.${uid}`, mapped);
    } catch { /* silent */ }
  }

  async function removePost(concertId, uid) {
    try {
      await DB.delete('group_buying', `post_uid=eq.${uid}`);
    } catch {
      const all = lsGetAll();
      all[concertId] = (all[concertId]||[]).filter(p => p.uid !== uid);
      localStorage.setItem(LS_KEY, JSON.stringify(all));
    }
  }

  function buildWaHref(contact) {
    const digits = contact.replace(/\D/g,'');
    if (!digits || digits.length < 8) return null;
    let num = digits;
    if (num.startsWith('0')) num = '62' + num.slice(1);
    else if (!num.startsWith('62')) num = '62' + num;
    return `https://wa.me/${num}`;
  }

  function renderCard(p, concertId) {
    const isOwner = p.ownerUid === getDeviceUID();
    const waHref  = buildWaHref(p.contact);
    const igHref  = p.ig ? `https://instagram.com/${p.ig}` : null;
    return `
      <div class="gb-item" id="gbi_${p.uid}">
        <div class="gb-item-top">
          <div class="gb-avatar">${p.name.charAt(0).toUpperCase()}</div>
          <div class="gb-info">
            <div class="gb-name">${p.name}</div>
            <div class="gb-meta">${timeAgo(p.date)} · ${p.category}</div>
          </div>
          <div class="gb-contact-emojis">
            ${waHref ? `<a class="gb-contact-emoji" href="${waHref}" target="_blank" rel="noopener" title="Chat WhatsApp">💬</a>` : ''}
            ${igHref ? `<a class="gb-contact-emoji" href="${igHref}" target="_blank" rel="noopener" title="Instagram">📷</a>` : ''}
          </div>
        </div>
        ${p.note ? `<div class="gb-note">${p.note}</div>` : ''}
        ${isOwner ? `
          <div class="post-actions" style="margin-top:8px">
            <button class="post-btn-edit" onclick="GroupBuying.startEdit('${concertId}','${p.uid}')">✏️</button>
            <button class="post-btn-del"  onclick="GroupBuying.deletePost('${concertId}','${p.uid}')">🗑️</button>
          </div>` : ''}
      </div>`;
  }

  function render(concertId) {
    const concert      = typeof CONCERTS !== 'undefined' ? CONCERTS.find(c => c.id === concertId) : null;
    const isPastC      = concert && concert.rawDate < new Date();
    const isRumorC     = concert && concert.confirmStatus === 'rumor';
    const formDisabled = isPastC || isRumorC;

    // Async load posts
    setTimeout(async () => {
      const posts  = await fetchPosts(concertId);
      const listEl = document.getElementById(`gblist_${concertId}`);
      if (!listEl) return;
      const countEl = document.querySelector(`#gb_${concertId} .gb-count`);
      if (countEl) countEl.textContent = posts.length || '';
      listEl.innerHTML = posts.length
        ? posts.map(p => renderCard(p, concertId)).join('')
        : `<div class="gb-empty">Belum ada yang cari teman nonton. Jadilah yang pertama! 🎉</div>`;
    }, 0);

    const formHtml = formDisabled
      ? `<div class="gb-ended">${isPastC ? 'Konser sudah selesai' : 'Konser belum dikonfirmasi'} — form posting ditutup.</div>`
      : `<form class="gb-form" onsubmit="GroupBuying.handleSubmit(event,'${concertId}')">
          <div class="gb-form-row">
            <input class="gb-input" name="name" type="text" placeholder="Nama kamu *" maxlength="30" required />
            <input class="gb-input" name="category" type="text" placeholder="Kategori tiket (CAT 1, VIP...)" maxlength="30" />
          </div>
          <div class="gb-form-row">
            <input class="gb-input" name="contact" type="text" placeholder="No WhatsApp * (contoh: 08123...)" maxlength="20" required />
            <input class="gb-input" name="ig" type="text" placeholder="@instagram (opsional)" maxlength="40" />
          </div>
          <div class="gb-form-row">
            <input class="gb-input" name="note" type="text" placeholder="Catatan tambahan (opsional)" maxlength="150" />
            <button class="gb-submit" type="submit">Post</button>
          </div>
        </form>`;

    return `
      <div class="gb-section" id="gb_${concertId}">
        <div class="gb-header">
          <h3>🤝 Cari Teman Nonton</h3>
          <span class="gb-count"></span>
        </div>
        <p class="gb-desc">Cari teman nonton bareng! Kontak hanya ditampilkan sebagai ikon — nomor tidak diekspos.</p>
        ${formHtml}
        <div class="gb-list" id="gblist_${concertId}">
          <div class="gb-empty" style="opacity:0.5">Memuat...</div>
        </div>
      </div>`;
  }

  async function handleSubmit(e, concertId) {
    e.preventDefault();
    const f = e.target;
    const result = await add(concertId, {
      name:     f.querySelector('[name="name"]')?.value,
      category: f.querySelector('[name="category"]')?.value,
      contact:  f.querySelector('[name="contact"]')?.value,
      ig:       f.querySelector('[name="ig"]')?.value,
      note:     f.querySelector('[name="note"]')?.value,
    });
    if (!result.ok) { showToast('⚠️ ' + result.msg, 'error'); return; }
    const section = document.getElementById(`gb_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast('🤝 Posting berhasil!', 'success', 2500);
  }

  async function deletePost(concertId, uid) {
    if (!confirm('Hapus posting ini?')) return;
    await removePost(concertId, uid);
    const section = document.getElementById(`gb_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast('🗑️ Posting dihapus.', 'info', 2000);
  }

  function startEdit(concertId, uid) {
    const card = document.getElementById(`gbi_${uid}`);
    if (!card) return;
    // Ambil nilai dari DOM
    const name     = card.querySelector('.gb-name')?.textContent || '';
    const meta     = card.querySelector('.gb-meta')?.textContent || '';
    const category = meta.split('·').slice(1).join('·').trim() || '';
    const note     = card.querySelector('.gb-note')?.textContent || '';
    card.innerHTML = `
      <form class="gb-form" style="padding:0" onsubmit="GroupBuying.saveEdit(event,'${concertId}','${uid}')">
        <div class="gb-form-row">
          <input class="gb-input" name="name" value="${name}" maxlength="30" required />
          <input class="gb-input" name="category" value="${category}" maxlength="30" />
        </div>
        <div class="gb-form-row">
          <input class="gb-input" name="contact" placeholder="No WA baru (opsional)" maxlength="20" />
          <input class="gb-input" name="ig" placeholder="@instagram (opsional)" maxlength="40" />
        </div>
        <div class="gb-form-row">
          <input class="gb-input" name="note" value="${note}" placeholder="Catatan" maxlength="150" />
        </div>
        <div class="gb-form-row">
          <button class="gb-submit" type="submit">💾 Simpan</button>
          <button class="gb-submit" type="button" style="background:rgba(255,255,255,0.06)"
            onclick="GroupBuying.cancelEdit('${concertId}','${uid}')">Batal</button>
        </div>
      </form>`;
  }

  async function saveEdit(e, concertId, uid) {
    e.preventDefault();
    const f = e.target;
    const fields = {
      name:     f.querySelector('[name="name"]')?.value.trim().slice(0,30).replace(/</g,'&lt;'),
      category: f.querySelector('[name="category"]')?.value.trim().slice(0,30).replace(/</g,'&lt;'),
      note:     f.querySelector('[name="note"]')?.value.trim().slice(0,150).replace(/</g,'&lt;'),
    };
    const contact = f.querySelector('[name="contact"]')?.value.trim();
    const ig      = f.querySelector('[name="ig"]')?.value.replace('@','').trim();
    if (contact) fields.contact = contact.slice(0,60).replace(/</g,'&lt;');
    if (ig)      fields.ig      = ig.slice(0,40).replace(/</g,'&lt;');
    await updatePost(concertId, uid, fields);
    const section = document.getElementById(`gb_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast('✅ Posting diperbarui!', 'success', 2000);
  }

  function cancelEdit(concertId) {
    const section = document.getElementById(`gb_${concertId}`);
    if (section) section.outerHTML = render(concertId);
  }

  return { render, handleSubmit, deletePost, startEdit, saveEdit, cancelEdit };
})();
window.GroupBuying = GroupBuying;


/* ================================================================
   7. FORUM JUAL BELI TIKET
   Supabase primary, localStorage fallback
   ================================================================ */
const TicketMarket = (() => {
  const LS_KEY = 'cid_ticket_market';

  function lsGetAll()   { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function lsGetFor(id) { return lsGetAll()[id] || []; }

  function genPostUID() { return 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

  function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff/60000), h = Math.floor(m/60), d = Math.floor(h/24);
    if (d > 0) return `${d} hari lalu`;
    if (h > 0) return `${h} jam lalu`;
    if (m > 0) return `${m} menit lalu`;
    return 'Baru saja';
  }

  async function fetchPosts(concertId) {
    try {
      const rows = await DB.select('ticket_market',
        `concert_id=eq.${encodeURIComponent(concertId)}&order=created_at.desc`);
      return rows.map(r => ({
        uid:      r.post_uid,
        ownerUid: r.owner_uid,
        type:     r.type     || 'jual',
        name:     r.name     || 'Anonim',
        category: r.category || 'TBA',
        qty:      r.qty      || 1,
        price:    r.price    || '',
        contact:  r.contact  || '',
        note:     r.note     || '',
        date:     r.created_at,
        sold:     r.sold     || false,
      }));
    } catch {
      return lsGetFor(concertId);
    }
  }

  async function add(concertId, { type, name, category, qty, price, contact, note }) {
    if (!name || !contact) return { ok: false, msg: 'Nama dan kontak wajib diisi.' };
    const uid      = genPostUID();
    const ownerUid = getDeviceUID();
    const priceNum = (price||'').replace(/\./g,'').trim().slice(0,20);
    try {
      await DB.insert('ticket_market', {
        concert_id: concertId,
        post_uid:   uid,
        owner_uid:  ownerUid,
        type:       type || 'jual',
        name:       name.trim().slice(0,30).replace(/</g,'&lt;'),
        category:   (category||'TBA').trim().slice(0,30).replace(/</g,'&lt;'),
        qty:        Math.min(parseInt(qty)||1, 20),
        price:      priceNum,
        contact:    contact.trim().slice(0,60).replace(/</g,'&lt;'),
        note:       (note||'').trim().slice(0,150).replace(/</g,'&lt;'),
      });
      return { ok: true };
    } catch {
      const all = lsGetAll();
      if (!all[concertId]) all[concertId] = [];
      all[concertId].unshift({ uid, ownerUid, type: type||'jual', name: name.trim().slice(0,30).replace(/</g,'&lt;'), category: (category||'TBA').trim().slice(0,30).replace(/</g,'&lt;'), qty: Math.min(parseInt(qty)||1,20), price: priceNum, contact: contact.trim().slice(0,60).replace(/</g,'&lt;'), note: (note||'').trim().slice(0,150).replace(/</g,'&lt;'), date: new Date().toISOString(), sold: false });
      localStorage.setItem(LS_KEY, JSON.stringify(all));
      return { ok: true };
    }
  }

  async function updatePost(concertId, uid, fields) {
    try {
      await DB.update('ticket_market', `post_uid=eq.${uid}`, fields);
    } catch { /* silent */ }
  }

  async function removePost(concertId, uid) {
    try {
      await DB.delete('ticket_market', `post_uid=eq.${uid}`);
    } catch {
      const all = lsGetAll();
      all[concertId] = (all[concertId]||[]).filter(p => p.uid !== uid);
      localStorage.setItem(LS_KEY, JSON.stringify(all));
    }
  }

  function buildWaHref(contact) {
    const digits = contact.replace(/\D/g,'');
    if (!digits || digits.length < 8) return null;
    let num = digits;
    if (num.startsWith('0')) num = '62' + num.slice(1);
    else if (!num.startsWith('62')) num = '62' + num;
    return `https://wa.me/${num}`;
  }

  function buildContactEmoji(contact) {
    if (!contact) return '';
    const waHref = buildWaHref(contact);
    if (waHref) return `<a class="gb-contact-emoji" href="${waHref}" target="_blank" rel="noopener" title="Chat WhatsApp">💬</a>`;
    if (contact.trim().startsWith('@') || contact.replace(/\D/g,'').length < 8)
      return `<a class="gb-contact-emoji" href="https://instagram.com/${contact.replace('@','').trim()}" target="_blank" rel="noopener" title="Instagram">📷</a>`;
    return '';
  }

  function formatRpDisplay(price) {
    if (!price) return '';
    const num = parseInt(price.replace(/\D/g,''));
    if (!num) return '';
    if (num >= 1000000) return `Rp ${(num/1000000).toFixed(1).replace('.0','')} jt`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  }

  function renderCard(p, concertId) {
    const priceDisplay = formatRpDisplay(p.price);
    const name         = p.name    || 'Anonim';
    const type         = p.type    || 'jual';
    const isOwner      = p.ownerUid === getDeviceUID();
    const soldLabel    = type === 'jual' ? 'Terjual' : 'Ditemukan';
    return `
      <div class="tm-item${p.sold ? ' tm-item-sold' : ''}" id="tmi_${p.uid}">
        <div class="tm-item-top">
          <span class="tm-type-badge tm-type-${type}">${type === 'jual' ? 'JUAL' : 'BELI'}${p.sold ? ' ✓' : ''}</span>
          <div class="tm-info">
            <span class="tm-name">${name}${p.sold ? ` <em style="color:#4ade80;font-size:0.75rem">(${soldLabel})</em>` : ''}</span>
            <span class="tm-meta">${p.category || 'TBA'} · ${p.qty || 1} tiket${priceDisplay ? ` · <strong>${priceDisplay}</strong>` : ''}</span>
          </div>
          ${buildContactEmoji(p.contact)}
        </div>
        ${p.note ? `<div class="gb-note">${p.note}</div>` : ''}
        <div class="tm-item-bottom">
          ${p.sold
            ? `<span class="tm-sold-label">✅ ${soldLabel}</span>`
            : isOwner
              ? `<button class="tm-mark-sold" onclick="TicketMarket.markSold('${concertId}','${p.uid}','${type}')">✓ Tandai ${soldLabel}</button>`
              : ''
          }
          <span class="tm-time">${timeAgo(p.date)}</span>
          ${isOwner && !p.sold ? `
            <div class="post-actions">
              <button class="post-btn-edit" onclick="TicketMarket.startEdit('${concertId}','${p.uid}')">✏️</button>
              <button class="post-btn-del"  onclick="TicketMarket.deletePost('${concertId}','${p.uid}','${type}')">🗑️</button>
            </div>` : ''}
        </div>
      </div>`;
  }

  function render(concertId) {
    const concert  = typeof CONCERTS !== 'undefined' ? CONCERTS.find(c => c.id === concertId) : null;
    const isPastC  = concert && concert.rawDate < new Date();
    const isRumorC = concert && concert.confirmStatus === 'rumor';
    const disabled = isPastC || isRumorC;

    // Async load
    setTimeout(async () => {
      const posts  = await fetchPosts(concertId);
      const jual   = posts.filter(p => p.type === 'jual');
      const beli   = posts.filter(p => p.type === 'beli');
      const countEl = document.querySelector(`#tm_${concertId} .gb-count`);
      if (countEl) countEl.textContent = posts.length || '';
      const listEl = document.getElementById(`tmlist_${concertId}`);
      if (listEl) listEl.innerHTML = jual.map(p => renderCard(p, concertId)).join('') || '<div class="tm-empty">Belum ada listing.</div>';
      const tabJual = document.querySelector(`#tm_${concertId} .tm-tab`);
      if (tabJual) { tabJual.nextElementSibling && (tabJual.nextElementSibling.querySelector('.tm-tab-count') && (tabJual.nextElementSibling.querySelector('.tm-tab-count').textContent = beli.length)); tabJual.querySelector('.tm-tab-count') && (tabJual.querySelector('.tm-tab-count').textContent = jual.length); }
    }, 0);

    const formHtml = disabled
      ? `<div class="gb-ended">${isPastC ? 'Konser sudah selesai' : 'Konser belum dikonfirmasi'} — listing ditutup.</div>`
      : `<form class="gb-form tm-form" onsubmit="TicketMarket.handleSubmit(event,'${concertId}')">
          <div class="tm-type-row">
            <label class="tm-type-opt"><input type="radio" name="type" value="jual" checked /> 🎫 Jual Tiket</label>
            <label class="tm-type-opt"><input type="radio" name="type" value="beli" /> 🔍 Cari Tiket</label>
          </div>
          <div class="gb-form-row">
            <input class="gb-input" name="name" type="text" placeholder="Nama kamu *" maxlength="30" required />
            <input class="gb-input gb-input-sm" name="qty" type="number" placeholder="Jml" min="1" max="20" />
          </div>
          <div class="gb-form-row">
            <input class="gb-input" name="category" type="text" placeholder="Kategori (CAT 1, VIP...)" maxlength="30" />
            <input class="gb-input" name="price" type="text" placeholder="Harga, contoh: 1.500.000" maxlength="15"
              oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.')" />
          </div>
          <div class="gb-form-row">
            <input class="gb-input" name="contact" type="text" placeholder="No WA atau @instagram *" maxlength="60" required />
            <input class="gb-input" name="note" type="text" placeholder="Catatan (opsional)" maxlength="150" />
          </div>
          <button class="gb-submit" type="submit" style="width:100%">+ Post Listing</button>
          <p class="tm-warn">⚠️ Selalu verifikasi tiket sebelum transfer. Waspada penipuan!</p>
        </form>`;

    return `
      <div class="tm-section" id="tm_${concertId}">
        <div class="gb-header">
          <h3>🎫 Forum Jual Beli Tiket</h3>
          <span class="gb-count"></span>
        </div>
        ${formHtml}
        <div class="tm-tabs">
          <button class="tm-tab active" onclick="TicketMarket.switchTab(this,'${concertId}','jual')">Jual <span class="tm-tab-count">-</span></button>
          <button class="tm-tab" onclick="TicketMarket.switchTab(this,'${concertId}','beli')">Cari <span class="tm-tab-count">-</span></button>
        </div>
        <div class="tm-list" id="tmlist_${concertId}">
          <div class="tm-empty" style="opacity:0.5">Memuat...</div>
        </div>
      </div>`;
  }

  async function switchTab(btnEl, concertId, type) {
    document.querySelectorAll(`#tm_${concertId} .tm-tab`).forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    const list = document.getElementById(`tmlist_${concertId}`);
    if (!list) return;
    list.innerHTML = '<div class="tm-empty" style="opacity:0.5">Memuat...</div>';
    const posts = await fetchPosts(concertId);
    const items = posts.filter(p => p.type === type);
    list.innerHTML = items.map(p => renderCard(p, concertId)).join('') || '<div class="tm-empty">Belum ada listing.</div>';
  }

  async function handleSubmit(e, concertId) {
    e.preventDefault();
    const f    = e.target;
    const type = f.querySelector('input[name="type"]:checked')?.value || 'jual';
    const result = await add(concertId, {
      type,
      name:     f.querySelector('[name="name"]')?.value,
      category: f.querySelector('[name="category"]')?.value,
      qty:      f.querySelector('[name="qty"]')?.value,
      price:    f.querySelector('[name="price"]')?.value,
      contact:  f.querySelector('[name="contact"]')?.value,
      note:     f.querySelector('[name="note"]')?.value,
    });
    if (!result.ok) { showToast('⚠️ ' + result.msg, 'error'); return; }
    const section = document.getElementById(`tm_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast(type === 'jual' ? '🎫 Listing berhasil diposting!' : '🔍 Pencarian berhasil diposting!', 'success', 2500);
  }

  async function markSold(concertId, uid, type) {
    await updatePost(concertId, uid, { sold: true });
    const section = document.getElementById(`tm_${concertId}`);
    if (section) {
      section.outerHTML = render(concertId);
      setTimeout(async () => {
        const tabs = document.querySelectorAll(`#tm_${concertId} .tm-tab`);
        for (const btn of tabs) {
          const isTarget = (type === 'jual' && btn.textContent.trim().startsWith('Jual'))
                        || (type === 'beli' && btn.textContent.trim().startsWith('Cari'));
          if (isTarget) { await switchTab(btn, concertId, type); break; }
        }
      }, 300);
    }
    showToast(type === 'jual' ? '✅ Tandai Terjual!' : '✅ Tandai Ditemukan!', 'success', 2000);
  }

  async function deletePost(concertId, uid, type) {
    if (!confirm('Hapus listing ini?')) return;
    await removePost(concertId, uid);
    const section = document.getElementById(`tm_${concertId}`);
    if (section) {
      section.outerHTML = render(concertId);
      setTimeout(async () => {
        const tabs = document.querySelectorAll(`#tm_${concertId} .tm-tab`);
        for (const btn of tabs) {
          const isTarget = (type === 'jual' && btn.textContent.trim().startsWith('Jual'))
                        || (type === 'beli' && btn.textContent.trim().startsWith('Cari'));
          if (isTarget) { await switchTab(btn, concertId, type); break; }
        }
      }, 300);
    }
    showToast('🗑️ Listing dihapus.', 'info', 2000);
  }

  function startEdit(concertId, uid) {
    const card = document.getElementById(`tmi_${uid}`);
    if (!card) return;
    const name     = card.querySelector('.tm-name')?.textContent.split('(')[0].trim() || '';
    const meta     = card.querySelector('.tm-meta')?.textContent || '';
    const parts    = meta.split('·');
    const category = parts[0]?.trim() || '';
    const qty      = parts[1]?.trim().replace(' tiket','') || '1';
    const priceRaw = parts[2]?.trim().replace('Rp ','').replace(' jt','000000').replace(/[^0-9]/g,'') || '';
    const priceFormatted = priceRaw ? parseInt(priceRaw).toLocaleString('id-ID') : '';
    const note = card.querySelector('.gb-note')?.textContent || '';
    card.innerHTML = `
      <form class="gb-form" style="padding:0" onsubmit="TicketMarket.saveEdit(event,'${concertId}','${uid}')">
        <div class="gb-form-row">
          <input class="gb-input" name="name" value="${name}" maxlength="30" required />
          <input class="gb-input gb-input-sm" name="qty" type="number" value="${qty}" min="1" max="20" />
        </div>
        <div class="gb-form-row">
          <input class="gb-input" name="category" value="${category}" maxlength="30" />
          <input class="gb-input" name="price" value="${priceFormatted}" maxlength="15"
            oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/\\B(?=(\\d{3})+(?!\\d))/g,'.')" />
        </div>
        <div class="gb-form-row">
          <input class="gb-input" name="contact" placeholder="No WA baru (opsional)" maxlength="60" />
          <input class="gb-input" name="note" value="${note}" maxlength="150" />
        </div>
        <div class="gb-form-row">
          <button class="gb-submit" type="submit">💾 Simpan</button>
          <button class="gb-submit" type="button" style="background:rgba(255,255,255,0.06)"
            onclick="TicketMarket.cancelEdit('${concertId}')">Batal</button>
        </div>
      </form>`;
  }

  async function saveEdit(e, concertId, uid) {
    e.preventDefault();
    const f = e.target;
    const fields = {
      name:     f.querySelector('[name="name"]')?.value.trim().slice(0,30).replace(/</g,'&lt;'),
      category: f.querySelector('[name="category"]')?.value.trim().slice(0,30).replace(/</g,'&lt;'),
      qty:      Math.min(parseInt(f.querySelector('[name="qty"]')?.value)||1, 20),
      price:    (f.querySelector('[name="price"]')?.value||'').replace(/\./g,'').slice(0,20),
      note:     f.querySelector('[name="note"]')?.value.trim().slice(0,150).replace(/</g,'&lt;'),
    };
    const contact = f.querySelector('[name="contact"]')?.value.trim();
    if (contact) fields.contact = contact.slice(0,60).replace(/</g,'&lt;');
    await updatePost(concertId, uid, fields);
    const section = document.getElementById(`tm_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast('✅ Listing diperbarui!', 'success', 2000);
  }

  function cancelEdit(concertId) {
    const section = document.getElementById(`tm_${concertId}`);
    if (section) section.outerHTML = render(concertId);
  }

  return { render, handleSubmit, switchTab, markSold, deletePost, startEdit, saveEdit, cancelEdit };
})();
window.TicketMarket = TicketMarket;


/* ================================================================
   8. KRITIK & SARAN — kirim ke listconcerttour@gmail.com via EmailJS
   ================================================================ */
const FeedbackForm = (() => {
  let _attachedFile = null;  // variabel lokal, bukan FeedbackForm._attachedFile

  function render() {
    return `
      <div class="fb-section" id="fbSection">
        <div class="gb-header">
          <h3>📬 Kritik &amp; Saran</h3>
        </div>
        <p class="gb-desc">Punya masukan, laporan data salah, atau saran fitur baru? Kirim ke kami!</p>
        <form class="fb-form" id="fbForm" onsubmit="FeedbackForm.handleSubmit(event)">
          <div class="gb-form-row">
            <input class="gb-input" name="from_name" type="text" placeholder="Nama kamu (opsional)" maxlength="50" />
            <input class="gb-input" name="from_email" type="email" placeholder="Email (opsional)" maxlength="100" />
          </div>
          <div class="fb-type-row">
            <label class="tm-type-opt"><input type="radio" name="type" value="kritik" checked /> 🔴 Kritik</label>
            <label class="tm-type-opt"><input type="radio" name="type" value="saran" /> 💡 Saran</label>
            <label class="tm-type-opt"><input type="radio" name="type" value="data" /> 📋 Data Salah</label>
            <label class="tm-type-opt"><input type="radio" name="type" value="lainnya" /> 💬 Lainnya</label>
          </div>
          <textarea class="fb-textarea" name="message" placeholder="Tuliskan pesan kamu di sini... (min 10 karakter)" rows="4" maxlength="1000" required></textarea>
          <label class="fb-attach-label" for="fbAttach">
            <span class="fb-attach-icon">📎</span>
            <span class="fb-attach-text" id="fbAttachText">Lampirkan foto (opsional · JPG/PNG/WebP · maks 5MB)</span>
          </label>
          <input class="fb-attach-input" id="fbAttach" type="file"
            accept="image/jpeg,image/png,image/webp"
            onchange="FeedbackForm.onAttach(this)" />
          <div class="fb-attach-preview" id="fbAttachPreview" style="display:none">
            <img id="fbAttachImg" alt="preview" />
            <button type="button" class="fb-attach-remove" onclick="FeedbackForm.removeAttach()">✕ Hapus foto</button>
          </div>
          <button class="gb-submit fb-btn" type="submit" id="fbSubmitBtn">📬 Kirim Pesan</button>
        </form>
        <div class="fb-msg" id="fbMsg"></div>
      </div>`;
  }

  // Rate limiting — max 10 submit per 10 menit
  function checkRateLimit() {
    const KEY   = 'cid_fb_rl';
    const LIMIT = 10;
    const TTL   = 10 * 60 * 1000;
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{"count":0,"ts":0}');
      const now = Date.now();
      if (now - raw.ts > TTL) {
        localStorage.setItem(KEY, JSON.stringify({ count: 1, ts: now }));
        return true;
      }
      if (raw.count >= LIMIT) return false;
      localStorage.setItem(KEY, JSON.stringify({ count: raw.count + 1, ts: raw.ts }));
      return true;
    } catch { return true; }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('fbSubmitBtn');
    const msg  = document.getElementById('fbMsg');

    const name    = form.from_name?.value?.trim()  || 'Anonim';
    const email   = form.from_email?.value?.trim() || 'Tidak dicantumkan';
    const type    = form.querySelector('input[name="type"]:checked')?.value || 'lainnya';
    const message = form.message?.value?.trim();

    if (!message || message.length < 10) {
      showToast('⚠️ Pesan minimal 10 karakter.', 'error'); return;
    }

    if (!checkRateLimit()) {
      showToast('⚠️ Terlalu banyak pengiriman. Coba lagi dalam 10 menit.', 'error', 5000);
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Mengirim...';

    // Encode foto ke base64 jika ada
    let photoData = '';
    const attachedFile = _attachedFile;
    if (attachedFile) {
      try {
        btn.textContent = 'Memproses foto...';
        photoData = await uploadPhoto(attachedFile);
      } catch (err) {
        console.error('[foto error]', err);
      }
    }

    try {
      const payload = {
        from_name:  name,
        from_email: email,
        type:       type.charAt(0).toUpperCase() + type.slice(1),
        message:    message,
        sent_at:    new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        // Kirim base64 murni — template EmailJS tulis: <img src="data:image/jpeg;base64,{{photo_data}}" />
        photo_data: photoData,
        has_photo:  photoData ? 'ya' : 'tidak',
      };

      const result = await emailjs.send('service_lq3pvsq', 'template_w8grsoa', payload);

      if (result.status === 200) {
        btn.textContent = '✅ Terkirim!';
        if (msg) {
          msg.innerHTML = '🎉 Terima kasih! Pesan kamu sudah kami terima.';
          msg.style.color = '#4ade80';
        }
        form.reset();
        FeedbackForm.removeAttach();
        showToast('📬 Pesan berhasil dikirim!', 'success', 4000);
      }
    } catch (err) {
      btn.disabled    = false;
      btn.textContent = '📬 Kirim Pesan';
      const errMsg = err?.text || err?.message || JSON.stringify(err) || 'Unknown error';
      console.error('[EmailJS Error]', err);
      if (msg) {
        msg.innerHTML = `⚠️ Error: <code style="font-size:0.75rem;background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">${errMsg}</code>`;
        msg.style.color = '#f87171';
      }
      showToast('⚠️ Gagal kirim: ' + errMsg.slice(0, 60), 'error', 6000);
    }
  }

  // Resize foto ke 600px max, quality 70%
  async function uploadPhoto(file) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('FileReader gagal'));
      reader.onload  = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onerror = () => reject(new Error('Gagal load gambar'));
      image.onload  = () => {
        const MAX = 600;
        let { width, height } = image;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        // Kembalikan base64 MURNI tanpa prefix "data:image/jpeg;base64,"
        resolve(canvas.toDataURL('image/jpeg', 0.70).split(',')[1]);
      };
      image.src = dataUrl;
    });
  }

  function onAttach(input) {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('⚠️ Hanya file gambar.', 'error'); input.value = ''; return; }
    if (file.size > 5 * 1024 * 1024) { showToast('⚠️ Ukuran maksimal 5MB.', 'error'); input.value = ''; return; }
    _attachedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('fbAttachPreview');
      const img     = document.getElementById('fbAttachImg');
      const label   = document.getElementById('fbAttachText');
      if (img)     img.src = ev.target.result;
      if (preview) preview.style.display = 'flex';
      if (label)   label.textContent = `📎 ${file.name} (${(file.size/1024).toFixed(0)}KB)`;
    };
    reader.readAsDataURL(file);
  }

  function removeAttach() {
    _attachedFile = null;
    const input   = document.getElementById('fbAttach');
    const preview = document.getElementById('fbAttachPreview');
    const label   = document.getElementById('fbAttachText');
    if (input)   input.value = '';
    if (preview) preview.style.display = 'none';
    if (label)   label.textContent = 'Lampirkan foto (opsional · JPG/PNG/WebP · maks 5MB)';
  }

  return { render, handleSubmit, uploadPhoto, onAttach, removeAttach };
})();
window.FeedbackForm = FeedbackForm;



/* ============================================================
   FEATURE: IN-APP CHAT FOR GROUP BUYING
   Real-time chat per group buying post — polling 10s
   Supabase table: gb_chat (msg_uid, post_uid, sender_uid, sender_name, message, created_at)
   ============================================================ */
const InAppChat = (() => {
  const LS_PREFIX   = 'cid_gb_chat_';
  let _activePostUid = null;
  let _pollInterval  = null;
  let _myName        = '';

  function genMsgUID() { return 'cm_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function lsKey(uid)  { return LS_PREFIX + uid; }

  function timeAgoChat(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}j lalu`;
    if (m > 0) return `${m}m lalu`;
    return 'Baru';
  }

  async function fetchMessages(postUid) {
    try {
      const rows = await DB.select('gb_chat',
        `post_uid=eq.${encodeURIComponent(postUid)}&order=created_at.asc&limit=100`);
      const msgs = rows.map(r => ({
        uid:        r.msg_uid || r.uid || genMsgUID(),
        senderUid:  r.sender_uid,
        senderName: r.sender_name || 'Anonim',
        message:    r.message,
        createdAt:  r.created_at,
      }));
      try { localStorage.setItem(lsKey(postUid), JSON.stringify(msgs)); } catch {}
      return msgs;
    } catch {
      try { return JSON.parse(localStorage.getItem(lsKey(postUid)) || '[]'); } catch { return []; }
    }
  }

  function renderMessages(messages, myUid) {
    const box = document.getElementById('iap-chat-messages');
    if (!box) return;
    if (!messages.length) {
      box.innerHTML = '<div class="iap-chat-empty">💬 Belum ada pesan. Mulai chat!</div>';
      return;
    }
    box.innerHTML = messages.map(m => {
      const isOwn = m.senderUid === myUid;
      return `
        <div class="iap-bubble ${isOwn ? 'iap-own' : 'iap-other'}">
          ${!isOwn ? `<div class="iap-sender">${m.senderName}</div>` : ''}
          <div class="iap-text">${m.message.replace(/</g,'&lt;')}</div>
          <div class="iap-time">${timeAgoChat(m.createdAt)}</div>
        </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  }

  async function openChat(postUid, postOwnerName) {
    _activePostUid = postUid;
    stopPolling();

    const mc = document.getElementById('modalContent');
    if (!mc) return;

    // Hapus chat panel lama
    const old = document.getElementById(`iap-chat-${postUid}`);
    if (old) { old.remove(); _activePostUid = null; return; }
    // Tutup semua chat panel lain
    document.querySelectorAll('.iap-chat-panel').forEach(el => el.remove());

    const myUid = getDeviceUID();
    const msgs  = await fetchMessages(postUid);

    const panel = document.createElement('div');
    panel.id        = `iap-chat-${postUid}`;
    panel.className = 'iap-chat-panel';
    panel.innerHTML = `
      <div class="iap-chat-header">
        <span>💬 Chat — ${postOwnerName}</span>
        <button class="iap-close" onclick="InAppChat.closeChat('${postUid}')">✕</button>
      </div>
      <div class="iap-chat-messages" id="iap-chat-messages"></div>
      <div class="iap-chat-footer">
        <input id="iap-name-input" class="iap-input iap-name" placeholder="Nama kamu" value="${_myName}" maxlength="20" />
        <input id="iap-msg-input" class="iap-input iap-msg" placeholder="Pesan..." maxlength="300" onkeydown="if(event.key==='Enter')InAppChat.send('${postUid}')" />
        <button class="iap-send-btn" onclick="InAppChat.send('${postUid}')">➤</button>
      </div>`;

    // Injeksi setelah post yang diklik
    const postEl = document.querySelector(`[data-gb-uid="${postUid}"]`);
    if (postEl && postEl.nextSibling) {
      postEl.parentNode.insertBefore(panel, postEl.nextSibling);
    } else if (postEl) {
      postEl.parentNode.appendChild(panel);
    } else {
      mc.appendChild(panel);
    }

    renderMessages(msgs, myUid);
    startPolling(postUid, myUid);
  }

  function closeChat(postUid) {
    stopPolling();
    const panel = document.getElementById(`iap-chat-${postUid}`);
    if (panel) panel.remove();
    _activePostUid = null;
  }

  async function send(postUid) {
    const nameInput = document.getElementById('iap-name-input');
    const msgInput  = document.getElementById('iap-msg-input');
    if (!msgInput) return;

    const name = (nameInput?.value || '').trim().slice(0, 20) || 'Anonim';
    const text = msgInput.value.trim().slice(0, 300);
    if (!text) return;

    _myName = name;
    msgInput.value = '';

    const myUid  = getDeviceUID();
    const msgUid = genMsgUID();

    // Optimistic render
    const box = document.getElementById('iap-chat-messages');
    if (box) {
      const bubble = document.createElement('div');
      bubble.className = 'iap-bubble iap-own';
      bubble.innerHTML = `<div class="iap-text">${text.replace(/</g,'&lt;')}</div><div class="iap-time">Baru</div>`;
      box.appendChild(bubble);
      box.scrollTop = box.scrollHeight;
    }

    try {
      await DB.insert('gb_chat', {
        msg_uid:     msgUid,
        post_uid:    postUid,
        sender_uid:  myUid,
        sender_name: name,
        message:     text,
      });
    } catch { /* optimistic already shown */ }
  }

  function startPolling(postUid, myUid) {
    _pollInterval = setInterval(async () => {
      const msgs = await fetchMessages(postUid);
      renderMessages(msgs, myUid);
    }, 10_000);
  }

  function stopPolling() {
    if (_pollInterval) { clearInterval(_pollInterval); _pollInterval = null; }
  }

  return { openChat, closeChat, send, stopPolling };
})();
window.InAppChat = InAppChat;

/* Patch GroupBuying render untuk tambah tombol Chat per post */
(function patchGroupBuyingWithChat() {
  if (typeof GroupBuying === 'undefined') return;
  const _origRender = GroupBuying.render;
  if (!_origRender) return;

  GroupBuying.render = function(concertId) {
    _origRender.call(GroupBuying, concertId);

    // Tambah atribut data-gb-uid & tombol Chat ke setiap post
    setTimeout(() => {
      const container = document.querySelector('.gb-posts');
      if (!container) return;
      container.querySelectorAll('.gb-post').forEach((el, i) => {
        const posts = GroupBuying._getPosts ? GroupBuying._getPosts(concertId) : [];
        const post  = posts[i];
        if (!post) return;
        el.setAttribute('data-gb-uid', post.uid);
        if (!el.querySelector('.iap-chat-btn')) {
          const btn = document.createElement('button');
          btn.className   = 'iap-chat-btn btn-action';
          btn.innerHTML   = '💬 Chat';
          btn.onclick     = (e) => { e.stopPropagation(); InAppChat.openChat(post.uid, post.name); };
          const footer = el.querySelector('.gb-post-footer') || el;
          footer.appendChild(btn);
        }
      });
    }, 300);
  };
})();
