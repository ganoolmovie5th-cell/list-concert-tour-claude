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
    nav_concerts:   { id: 'Konser',        en: 'Concerts' },
    nav_upcoming:   { id: 'Mendatang',     en: 'Upcoming' },
    nav_venues:     { id: 'Venue',         en: 'Venues' },
    nav_about:      { id: 'Tentang',       en: 'About' },
    hero_search:    { id: 'Cari artis, venue, kota...', en: 'Search artist, venue, city...' },
    hero_stat1:     { id: 'Total Konser',  en: 'Total Concerts' },
    hero_stat2:     { id: '✅ Confirmed',  en: '✅ Confirmed' },
    hero_stat3:     { id: '🔮 Rumor',      en: '🔮 Rumor' },
    filter_all:     { id: 'Semua',         en: 'All' },
    filter_confirmed:{ id: '✅ Confirmed', en: '✅ Confirmed' },
    filter_rumor:   { id: '🔮 Rumor',      en: '🔮 Rumor' },
    filter_kpop:    { id: 'K-Pop',         en: 'K-Pop' },
    filter_pop:     { id: 'Pop / R&B',     en: 'Pop / R&B' },
    filter_rock:    { id: 'Rock / Metal',  en: 'Rock / Metal' },
    filter_jazz:    { id: 'Jazz',          en: 'Jazz' },
    filter_indie:   { id: 'Indie / Festival', en: 'Indie / Festival' },
    filter_upcoming:{ id: 'Mendatang',     en: 'Upcoming' },
    filter_past:    { id: 'Sudah Lewat',   en: 'Past' },
    sort_label:     { id: 'Urutkan:',      en: 'Sort:' },
    section_concerts:{ id: 'Jadwal Konser', en: 'Concert Schedule' },
    section_subtitle:{ id: 'Data dari sumber resmi. ✅ = Confirmed resmi | 🔮 = Rumor / belum dikonfirmasi', en: 'Data from official sources. ✅ = Officially confirmed | 🔮 = Rumor / unconfirmed' },
    section_hot:    { id: '🔥 Paling Ditunggu-tunggu', en: '🔥 Most Anticipated' },
    section_hot_sub:{ id: 'Konser mendatang yang jangan sampai kamu lewatkan', en: "Upcoming concerts you don't want to miss" },
    nl_title:       { id: 'Jangan Ketinggalan Konser!', en: "Don't Miss a Concert!" },
    nl_sub:         { id: 'Daftar gratis dan dapatkan update konser terbaru langsung di inbox kamu.', en: 'Sign up free and get the latest concert updates straight to your inbox.' },
    nl_btn:         { id: 'Daftar Gratis', en: 'Sign Up Free' },
    footer_tagline: { id: 'Jadwal konser internasional terlengkap di Indonesia', en: 'The most complete international concert schedule in Indonesia' },
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

    // Navbar links
    const navLinks = document.querySelectorAll('.nav-links a');
    ['nav_concerts','nav_upcoming','nav_venues','nav_about'].forEach((k, i) => {
      if (navLinks[i]) navLinks[i].textContent = t(k);
    });

    // Search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('hero_search');

    // Stat labels
    const statLabels = document.querySelectorAll('.stat-label');
    ['hero_stat1','hero_stat2','hero_stat3'].forEach((k, i) => {
      if (statLabels[i]) statLabels[i].textContent = t(k);
    });

    // Filter buttons
    const filterMap = {
      'all':'filter_all','confirmed':'filter_confirmed','rumor':'filter_rumor',
      'kpop':'filter_kpop','pop':'filter_pop','rock':'filter_rock',
      'jazz':'filter_jazz','indie':'filter_indie','upcoming':'filter_upcoming','past':'filter_past',
    };
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
      const key = filterMap[b.dataset.filter];
      if (!key) return;
      if (b.dataset.filter === 'wishlist') return;
      b.textContent = t(key);
    });

    // Sort label
    const sortLabel = document.querySelector('.sort-label');
    if (sortLabel) sortLabel.textContent = t('sort_label');

    // Section header
    document.querySelectorAll('.concerts-section .section-header').forEach(h => {
      const h2 = h.querySelector('h2');
      const p  = h.querySelector('p');
      if (h2) h2.innerHTML = t('section_concerts') + ' <span class="gradient-text">2025–2027</span>';
      if (p)  p.textContent = t('section_subtitle');
    });

    // Newsletter
    const nlTitle = document.querySelector('.nl-text h3');
    const nlSub   = document.querySelector('.nl-text p');
    const nlBtn   = document.getElementById('nlMcBtn');
    if (nlTitle) nlTitle.textContent = t('nl_title');
    if (nlSub)   nlSub.textContent   = t('nl_sub');
    if (nlBtn && !nlBtn.disabled) nlBtn.textContent = t('nl_btn');

    // Footer tagline
    const footerTagline = document.querySelector('.footer-logo p');
    if (footerTagline) footerTagline.textContent = t('footer_tagline');

    // Highlight section
    const hlHeader = document.querySelector('.highlight-section .section-header h2');
    const hlSub    = document.querySelector('.highlight-section .section-header p');
    if (hlHeader) hlHeader.textContent = t('section_hot');
    if (hlSub)    hlSub.textContent    = t('section_hot_sub');

    // Re-render cards
    if (typeof applyFilters === 'function') applyFilters();
  }

  return { t, getLang, setLang, toggle, applyAll };
})();
window.I18n = I18n;


/* ================================================================
   2. NOTIFIKASI TIKET ON-SALE
   ================================================================ */
const TicketAlert = (() => {
  const KEY = 'cid_ticket_alerts';

  function getAlerts() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
  }
  function saveAlerts(s) {
    try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {}
  }

  function isSubscribed(id) { return getAlerts().has(id); }

  function toggle(concertId, btnEl) {
    const alerts = getAlerts();
    if (alerts.has(concertId)) {
      alerts.delete(concertId);
      if (btnEl) { btnEl.textContent = '🔔 Ingatkan Tiket On-Sale'; btnEl.classList.remove('ta-active'); }
      showToast('🔕 Alert tiket dibatalkan', 'info', 2000);
    } else {
      alerts.add(concertId);
      if (btnEl) { btnEl.textContent = '🔔 Alert Aktif!'; btnEl.classList.add('ta-active'); }
      showToast('✅ Kami akan ingatkan saat tiket mulai dijual!', 'success', 3000);
    }
    saveAlerts(alerts);
  }

  function renderBtn(concertId) {
    const active = isSubscribed(concertId);
    return `<button class="btn-ticket-alert${active ? ' ta-active' : ''}"
      onclick="TicketAlert.toggle('${concertId}', this)">
      ${active ? '🔔 Alert Aktif!' : '🔔 Ingatkan Tiket On-Sale'}
    </button>`;
  }

  function checkAndNotify() {
    if (typeof CONCERTS === 'undefined') return;
    const alerts = getAlerts();
    const now    = new Date();
    alerts.forEach(id => {
      const c = CONCERTS.find(x => x.id === id);
      if (!c) return;
      const days = Math.ceil((c.rawDate - now) / 86400000);
      if (days > 0 && days <= 30 && typeof showToast === 'function') {
        showToast(`🎫 ${c.artist} — ${days} hari lagi! Cek info tiket sekarang.`, 'info', 5000);
      }
    });
  }

  return { toggle, isSubscribed, renderBtn, checkAndNotify };
})();
window.TicketAlert = TicketAlert;


/* ================================================================
   3. "SUDAH NONTON" BADGE
   ================================================================ */
const BeenThere = (() => {
  const KEY = 'cid_been_there';

  function getAll() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
  }
  function saveAll(s) {
    try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {}
  }

  function hasAttended(id) { return getAll().has(id); }

  function toggle(concertId, btnEl) {
    const all = getAll();
    if (all.has(concertId)) {
      all.delete(concertId);
      if (btnEl) { btnEl.textContent = '✅ Sudah Nonton'; btnEl.classList.remove('bt-active'); }
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
   4. SETLIST PREDICTION
   ================================================================ */
const SetlistPredict = (() => {
  const SETLISTS = {
    'bts-jakarta-2026': {
      source: 'Berdasarkan setlist BTS Permission to Dance on Stage (2022)',
      songs: ['Butter','Permission to Dance','ON','Dynamite','Boy With Luv','DNA','IDOL','Fake Love','Spring Day','Fire','Not Today','DOPE','Run BTS','Yet To Come'],
    },
    'mcr-jis-2026': {
      source: 'Berdasarkan setlist MCR World Tour 2023',
      songs: ['The Ghost of You','Helena','Famous Last Words',"I'm Not Okay",'Welcome to the Black Parade','Teenagers','Na Na Na','Sing','Mama','Cancer','Planetary (GO!)','Thank You for the Venom'],
    },
    'mcr-hammersonic-2026': {
      source: 'Berdasarkan setlist festival MCR 2023',
      songs: ['Welcome to the Black Parade','Helena',"I'm Not Okay",'Famous Last Words','Na Na Na','Teenagers','Ghost of You'],
    },
    'the-weeknd-jakarta-2026': {
      source: 'Berdasarkan setlist After Hours Til Dawn Tour 2023',
      songs: ['Alone Again','Gasoline','How Do I Make You Love Me?','Take My Breath','Sacrifice','Blinding Lights','Save Your Tears','Starboy','I Feel It Coming',"Can't Feel My Face",'The Hills','Often','Call Out My Name'],
    },
    'avenged-sevenfold-jakarta-2026': {
      source: 'Berdasarkan setlist A7X Life Is But a Dream Tour 2023',
      songs: ['Game Over','Mattel','Nobody','We Love You','Hail to the King','God Damn','Critical Acclaim','Bat Country','Afterlife','Nightmare','So Far Away','A Little Piece of Heaven','Unholy Confessions'],
    },
    'coldplay-jakarta-rumor': {
      source: 'Berdasarkan setlist Music of the Spheres World Tour 2023',
      songs: ['Music of the Spheres','My Universe','Human Heart','Yellow','The Scientist','Fix You','A Sky Full of Stars','Adventure of a Lifetime','Hymn for the Weekend','Clocks','Sparks','Higher Power'],
    },
    'one-ok-rock-jakarta-2026': {
      source: 'Berdasarkan setlist ONE OK ROCK Luxury Disease Asia Tour 2023',
      songs: ['Wherever You Are','Taking Off','Never Let Me Go','Make It Out Alive','Vandalize','Answer is Near','Wasted Nights','(Re)make','Renegades','Stand Out Fit In','Mighty Long Fall'],
    },
    'laufey-jakarta-2026': {
      source: 'Berdasarkan setlist Laufey A Night at the Symphony 2023',
      songs: ['Valentine','Let You Break My Heart Again','Bewitched','From the Start','Best Friend','Falling Behind',"I'd Rather Go Blind",'Lovesick','Atonement','An Evening I Will Not Forget'],
    },
    'dream-theater-2026': {
      source: 'Berdasarkan setlist Dream Theater 40th Anniversary Tour 2023',
      songs: ['The Alien','Metropolis Pt. 1','Pull Me Under','The Mirror','Lie','Peruvian Skies','The Spirit Carries On','Octavarium','The Count of Tuscany','On the Backs of Angels'],
    },
    'westlife-jakarta-2027': {
      source: 'Berdasarkan setlist Westlife Wild Dreams Tour 2022',
      songs: ['Swear It Again','Flying Without Wings','You Raise Me Up','My Love','Uptown Girl','World of Our Own','What Makes a Man','Unbreakable','When You\'re Looking Like That','Queen of My Heart'],
    },
    'taylor-swift-jakarta-rumor': {
      source: 'Berdasarkan setlist The Eras Tour 2023-2024',
      songs: ['Cruel Summer','Love Story','You Belong With Me','Blank Space','Style','All Too Well (10 Min)','Shake It Off','Bad Blood','Wildest Dreams','Anti-Hero','Lavender Haze','Bejeweled','Karma'],
    },
    'ed-sheeran-jakarta-rumor': {
      source: 'Berdasarkan setlist Mathematics Tour 2023',
      songs: ['Tides','Shivers','Castle on the Hill','Galway Girl','Don\'t','Shape of You','Photograph','Perfect','Thinking Out Loud','Bad Habits','Overpass Graffiti','Celestial'],
    },
  };

  function render(concertId) {
    const data = SETLISTS[concertId];
    if (!data) return '';
    return `
      <div class="setlist-section">
        <div class="setlist-header">
          <h4>🎶 Prediksi Setlist</h4>
          <span class="setlist-badge">Prediction</span>
        </div>
        <p class="setlist-source">📊 ${data.source}</p>
        <ol class="setlist-list">
          ${data.songs.map((s, i) => `
            <li class="setlist-item">
              <span class="setlist-num">${i + 1}</span>
              <span class="setlist-song">${s}</span>
            </li>`).join('')}
        </ol>
        <p class="setlist-disclaimer">⚠️ Hanya prediksi berdasarkan setlist konser sebelumnya. Setlist aktual bisa berbeda.</p>
      </div>`;
  }

  return { render };
})();
window.SetlistPredict = SetlistPredict;


/* ================================================================
   5. KONVERTER HARGA REAL-TIME
   ================================================================ */
const PriceConverter = (() => {
  const KEY_RATES = 'cid_fx_rates';
  const KEY_TS    = 'cid_fx_ts';
  const CACHE_TTL = 3600000; // 1 jam

  // Fallback rates (1 IDR = ...)
  let rates = { USD: 0.000062, SGD: 0.000084, KRW: 0.085, MYR: 0.00029, JPY: 0.0097 };

  async function fetchRates() {
    try {
      const ts     = parseInt(localStorage.getItem(KEY_TS) || '0');
      const cached = localStorage.getItem(KEY_RATES);
      if (Date.now() - ts < CACHE_TTL && cached) {
        rates = JSON.parse(cached); return;
      }
      const res  = await fetch('https://open.er-api.com/v6/latest/IDR');
      const data = await res.json();
      if (data && data.rates) {
        rates = { USD: data.rates.USD, SGD: data.rates.SGD, KRW: data.rates.KRW, MYR: data.rates.MYR, JPY: data.rates.JPY };
        localStorage.setItem(KEY_RATES, JSON.stringify(rates));
        localStorage.setItem(KEY_TS, Date.now().toString());
      }
    } catch { /* pakai fallback */ }
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

  function render(priceMin, priceMax) {
    if (!priceMin || priceMin === 0) return '';
    const currencies = [
      { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
      { code: 'SGD', flag: '🇸🇬', name: 'S$ Dollar' },
      { code: 'KRW', flag: '🇰🇷', name: 'Korean Won' },
      { code: 'MYR', flag: '🇲🇾', name: 'Ringgit' },
      { code: 'JPY', flag: '🇯🇵', name: 'Yen' },
    ];
    const rows = currencies.map(c => `
      <div class="fx-row">
        <span class="fx-flag">${c.flag}</span>
        <span class="fx-currency">${c.code}</span>
        <span class="fx-range">${fmtCurrency(priceMin, c.code)} – ${fmtCurrency(priceMax, c.code)}</span>
      </div>`).join('');

    return `
      <div class="fx-section">
        <div class="fx-header">
          <h4>💱 Konverter Harga</h4>
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
   ================================================================ */
const GroupBuying = (() => {
  const KEY = 'cid_group_buying';

  function getAll()    { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function saveAll(d)  { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  function getFor(id)  { return getAll()[id] || []; }

  function getUID() {
    let uid = localStorage.getItem('cid_uid');
    if (!uid) { uid = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('cid_uid', uid); }
    return uid;
  }

  function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
    if (d > 0) return `${d} hari lalu`;
    if (h > 0) return `${h} jam lalu`;
    if (m > 0) return `${m} menit lalu`;
    return 'Baru saja';
  }

  function add(concertId, { name, seats, category, contact, note }) {
    if (!name || !seats || !contact) return { ok: false, msg: 'Nama, jumlah tiket, dan kontak wajib diisi.' };
    const all = getAll();
    if (!all[concertId]) all[concertId] = [];
    if (all[concertId].length >= 30) return { ok: false, msg: 'Maksimal 30 posting per konser.' };
    all[concertId].unshift({
      uid:      getUID(),
      name:     name.trim().slice(0,30).replace(/</g,'&lt;'),
      seats:    Math.min(parseInt(seats)||1, 10),
      category: (category||'TBA').trim().slice(0,30).replace(/</g,'&lt;'),
      contact:  contact.trim().slice(0,60).replace(/</g,'&lt;'),
      note:     (note||'').trim().slice(0,150).replace(/</g,'&lt;'),
      date:     new Date().toISOString(),
    });
    saveAll(all);
    return { ok: true };
  }

  function buildContactHref(contact) {
    const digits = contact.replace(/\D/g, '');
    if (contact.startsWith('http')) return contact;
    if (digits.length >= 8) return `https://wa.me/${digits}`;
    return `https://instagram.com/${contact.replace('@','')}`;
  }

  function render(concertId) {
    const posts   = getFor(concertId);
    const concert = typeof CONCERTS !== 'undefined' ? CONCERTS.find(c => c.id === concertId) : null;
    const isPastC = concert && concert.rawDate < new Date();

    const postItems = posts.length
      ? posts.map(p => `
          <div class="gb-item">
            <div class="gb-item-top">
              <div class="gb-avatar">${p.name.charAt(0).toUpperCase()}</div>
              <div class="gb-info">
                <div class="gb-name">${p.name}</div>
                <div class="gb-meta">${timeAgo(p.date)} · ${p.seats} tiket · ${p.category}</div>
              </div>
              <a class="gb-contact" href="${buildContactHref(p.contact)}" target="_blank" rel="noopener">Hubungi →</a>
            </div>
            ${p.note ? `<div class="gb-note">${p.note}</div>` : ''}
          </div>`).join('')
      : `<div class="gb-empty">Belum ada yang cari teman nonton. Jadilah yang pertama! 🎉</div>`;

    return `
      <div class="gb-section" id="gb_${concertId}">
        <div class="gb-header">
          <h4>🤝 Cari Teman Nonton</h4>
          ${posts.length ? `<span class="gb-count">${posts.length}</span>` : ''}
        </div>
        <p class="gb-desc">Cari teman nonton bareng atau jual tiket berlebih. Selalu verifikasi sebelum transfer!</p>
        ${!isPastC ? `
          <form class="gb-form" onsubmit="GroupBuying.handleSubmit(event,'${concertId}')">
            <div class="gb-form-row">
              <input class="gb-input" name="name" type="text" placeholder="Nama kamu *" maxlength="30" required />
              <input class="gb-input gb-input-sm" name="seats" type="number" placeholder="Jml tiket *" min="1" max="10" required />
            </div>
            <div class="gb-form-row">
              <input class="gb-input" name="category" type="text" placeholder="Kategori (CAT 1, VIP...)" maxlength="30" />
              <input class="gb-input" name="contact" type="text" placeholder="No WA / @instagram *" maxlength="60" required />
            </div>
            <div class="gb-form-row">
              <input class="gb-input" name="note" type="text" placeholder="Catatan tambahan (opsional)" maxlength="150" />
              <button class="gb-submit" type="submit">Post</button>
            </div>
          </form>` : `<div class="gb-ended">Konser sudah selesai — form ditutup.</div>`}
        <div class="gb-list">${postItems}</div>
      </div>`;
  }

  function handleSubmit(e, concertId) {
    e.preventDefault();
    const f = e.target;
    const result = add(concertId, {
      name: f.name?.value, seats: f.seats?.value,
      category: f.category?.value, contact: f.contact?.value, note: f.note?.value,
    });
    if (!result.ok) { showToast('⚠️ ' + result.msg, 'error'); return; }
    const section = document.getElementById(`gb_${concertId}`);
    if (section) section.outerHTML = render(concertId);
    showToast('🤝 Posting berhasil!', 'success', 2500);
  }

  return { render, handleSubmit };
})();
window.GroupBuying = GroupBuying;


/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // Tombol bahasa di navbar
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    const langBtn       = document.createElement('button');
    langBtn.id          = 'langToggleBtn';
    langBtn.className   = 'theme-toggle';
    langBtn.style.cssText = 'font-size:0.68rem;font-weight:700;width:auto;padding:0 10px;border-radius:99px;letter-spacing:0.5px;';
    langBtn.textContent   = I18n.getLang() === 'id' ? '🌐 EN' : '🌐 ID';
    langBtn.title         = 'Toggle Language / Bahasa';
    langBtn.onclick       = () => I18n.toggle();
    navCta.insertBefore(langBtn, navCta.firstChild);
  }

  // Fetch kurs mata uang
  PriceConverter.fetchRates();

  // Apply been-there badges ke cards
  setTimeout(() => BeenThere.applyBadgesToCards(), 600);

  // Cek ticket alerts
  setTimeout(() => TicketAlert.checkAndNotify(), 3000);

  // Patch openModal — inject fitur3 ke dalam modal
  const _prevF3 = window.openModal;
  if (typeof _prevF3 === 'function') {
    window.openModal = function(id) {
      _prevF3(id);
      const c  = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === id) : null;
      if (!c) return;

      // Double rAF: pastikan features.js & features2.js sudah selesai inject
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const modal = document.getElementById('modalContent');
        if (!modal) return;

        // A. Ticket On-Sale Alert — di atas disclaimer, hanya tiket TBA & belum selesai
        if (c.confirmStatus !== 'rumor' && c.priceMin === 0 && c.rawDate > new Date()) {
          const disclaimer = modal.querySelector('.modal-disclaimer');
          if (disclaimer) {
            const el = document.createElement('div');
            el.className = 'ta-wrap';
            el.innerHTML = TicketAlert.renderBtn(c.id);
            disclaimer.insertAdjacentElement('beforebegin', el);
          }
        }

        // B. Sudah Nonton — hanya konser past, setelah modal-actions
        if (c.rawDate < new Date()) {
          const actions = modal.querySelector('.modal-actions');
          if (actions) {
            const el = document.createElement('div');
            el.className = 'bt-wrap';
            el.innerHTML = BeenThere.renderBtn(c.id);
            actions.insertAdjacentElement('afterend', el);
          }
        }

        // C. Setlist Prediction — setelah modal-ticket-area
        const setlistHtml = SetlistPredict.render(c.id);
        if (setlistHtml) {
          const anchor = modal.querySelector('.price-history') || modal.querySelector('.modal-ticket-area');
          if (anchor) {
            const el = document.createElement('div');
            el.innerHTML = setlistHtml;
            anchor.insertAdjacentElement('afterend', el.firstElementChild || el);
          }
        }

        // D. Konverter Harga — setelah setlist / ticket area
        if (c.priceMin > 0) {
          const fxHtml = PriceConverter.render(c.priceMin, c.priceMax);
          if (fxHtml) {
            const anchor = modal.querySelector('.setlist-section') || modal.querySelector('.price-history') || modal.querySelector('.modal-ticket-area');
            if (anchor) {
              const el = document.createElement('div');
              el.innerHTML = fxHtml;
              anchor.insertAdjacentElement('afterend', el.firstElementChild || el);
            }
          }
        }

        // E. Group Buying — paling bawah (setelah ugc-section)
        const ugcSection = modal.querySelector('.ugc-section');
        const gbHtml     = GroupBuying.render(c.id);
        if (gbHtml) {
          const el = document.createElement('div');
          el.innerHTML = gbHtml;
          if (ugcSection) ugcSection.insertAdjacentElement('afterend', el.firstElementChild || el);
          else modal.appendChild(el.firstElementChild || el);
        }
      }));
    };
  }
});
