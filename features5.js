/* ================================================================
   ConcertID — features5.js
   1. Weather Forecast  — Open-Meteo API (gratis, no key)
   2. Parking Nearby    — data statis venue + link Google Maps
   3. Story Card Generator — Canvas 9:16 → download / share
   ================================================================ */
'use strict';

/* ── Styles ──────────────────────────────────────────────────── */
(function injectF5Styles() {
  if (document.getElementById('f5-styles')) return;
  const s = document.createElement('style');
  s.id = 'f5-styles';
  s.textContent = `
.f5-section{margin:14px 0;border-radius:14px;border:1px solid rgba(168,85,247,.18);background:rgba(168,85,247,.06);padding:14px 16px;font-family:inherit}
.f5-section h4{margin:0 0 10px;font-size:.92rem;font-weight:700;color:var(--text,#f4f4f5);display:flex;align-items:center;gap:6px}
.f5-wx-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.f5-wx-header h4{margin:0;flex:1}
.f5-badge{font-size:.7rem;font-weight:700;border-radius:99px;padding:3px 9px;white-space:nowrap}
.f5-badge-live{background:rgba(34,197,94,.15);color:#22c55e}
.f5-badge-est{background:rgba(251,191,36,.15);color:#f59e0b}
.f5-wx-body{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.f5-wx-icon{font-size:2.4rem;line-height:1}
.f5-wx-label{font-size:1.05rem;font-weight:700;color:var(--text,#f4f4f5);margin-bottom:4px}
.f5-chips{display:flex;flex-wrap:wrap;gap:6px}
.f5-chip{font-size:.78rem;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:99px;padding:3px 10px;color:var(--text-muted,#a1a1aa)}
.f5-wx-note{font-size:.76rem;color:var(--text-muted,#71717a);margin:6px 0 0}
.f5-wx-warn{margin-top:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:8px 12px;font-size:.8rem;color:#f87171}
.f5-wx-loading{display:flex;align-items:center;gap:12px;padding:16px}
.f5-spin{width:20px;height:20px;border:2px solid rgba(168,85,247,.3);border-top-color:#a855f7;border-radius:50%;animation:f5spin .7s linear infinite;flex-shrink:0}
@keyframes f5spin{to{transform:rotate(360deg)}}
.f5-pk-spots{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
.f5-pk-spot{display:flex;align-items:flex-start;gap:10px}
.f5-pk-tag{font-size:.7rem;font-weight:700;background:rgba(168,85,247,.15);color:#c084fc;border-radius:6px;padding:2px 7px;white-space:nowrap;margin-top:2px}
.f5-pk-spot>div{display:flex;flex-direction:column;gap:2px}
.f5-pk-spot strong{font-size:.84rem;color:var(--text,#f4f4f5)}
.f5-pk-note{font-size:.76rem;color:var(--text-muted,#71717a)}
.f5-pk-tips{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.15);border-radius:8px;padding:8px 12px}
.f5-pk-tip{font-size:.79rem;color:var(--text-muted,#a1a1aa)}
.f5-pk-maps{display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:10px;font-size:.84rem;font-weight:600;color:#c084fc;text-decoration:none;margin-bottom:8px}
.f5-pk-maps:hover{background:rgba(168,85,247,.22)}
.f5-pk-dis{font-size:.75rem;color:var(--text-muted,#71717a);margin:0}
.f5-story-wrap{margin:0 0 8px;display:flex;justify-content:center}
.f5-story-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#a855f7,#ec4899);border:none;border-radius:12px;padding:13px 22px;font-size:.9rem;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;width:100%;transition:opacity .2s,transform .15s}
.f5-story-btn:hover{opacity:.86;transform:translateY(-1px)}
#sgOv{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(6px)}
.sg-panel{background:#18181c;border:1px solid rgba(168,85,247,.25);border-radius:20px;padding:20px;width:min(540px,calc(100vw - 24px));max-height:90dvh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.65)}
.sg-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.sg-title{font-size:1rem;font-weight:800;color:#f4f4f5}
.sg-close{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#a1a1aa;font-size:.9rem;font-family:inherit}
.sg-sub{font-size:.82rem;color:#71717a;margin:0 0 14px}
.sg-canvas-wrap{display:flex;justify-content:center;margin-bottom:12px}
.sg-canvas-wrap canvas{width:100%;max-width:270px;border-radius:12px;display:block}
.sg-tpl-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.sg-tpl{flex:1;min-width:70px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 4px;font-size:.78rem;font-weight:600;color:#a1a1aa;cursor:pointer;font-family:inherit;transition:all .2s}
.sg-tpl.active,.sg-tpl:hover{background:rgba(168,85,247,.15);border-color:#a855f7;color:#c084fc}
.sg-actions{display:flex;gap:10px;margin-bottom:10px}
.sg-dl{flex:1;background:rgba(168,85,247,.15);border:1.5px solid rgba(168,85,247,.3);border-radius:10px;padding:12px;font-size:.87rem;font-weight:700;color:#c084fc;cursor:pointer;font-family:inherit}
.sg-sh{flex:1;background:linear-gradient(135deg,#a855f7,#ec4899);border:none;border-radius:10px;padding:12px;font-size:.87rem;font-weight:700;color:#fff;cursor:pointer;font-family:inherit}
.sg-hint{font-size:.75rem;color:#52525b;text-align:center;margin:0}
  `;
  document.head.appendChild(s);
}());


/* ================================================================
   1. WEATHER FORECAST
   ================================================================ */
const WeatherForecast = (() => {
  const TTL = 3_600_000;
  const COORDS = [
    { k: ['gelora bung karno','gbk','indonesia arena','senayan','jakarta pusat'], v: { lat: -6.218,  lon: 106.8024, label: 'Senayan, Jakarta' } },
    { k: ['jakarta international stadium','jis','tanjung priok'],                 v: { lat: -6.123,  lon: 106.8456, label: 'Jakarta Utara' } },
    { k: ['ice bsd','bsd','tangerang selatan'],                                   v: { lat: -6.2977, lon: 106.6532, label: 'BSD City' } },
    { k: ['pik2','pik 2','nice pik','pantai indah kapuk'],                        v: { lat: -6.1189, lon: 106.7342, label: 'PIK2, Tangerang' } },
    { k: ['ancol','carnaval','beach city'],                                       v: { lat: -6.1215, lon: 106.831,  label: 'Ancol, Jakarta Utara' } },
  ];
  const DEF = { lat: -6.2088, lon: 106.8456, label: 'Jakarta' };

  function coord(c) {
    const h = ((c.venue || '') + ' ' + (c.city || '')).toLowerCase();
    for (const e of COORDS) if (e.k.some(k => h.includes(k))) return e.v;
    return DEF;
  }

  function cache(key, data) {
    try {
      const all = JSON.parse(localStorage.getItem('cid_wx5') || '{}');
      if (data === undefined) {
        const e = all[key]; return e && Date.now() - e.t < TTL ? e.d : null;
      }
      all[key] = { t: Date.now(), d: data };
      const ks = Object.keys(all); if (ks.length > 30) delete all[ks[0]];
      localStorage.setItem('cid_wx5', JSON.stringify(all));
    } catch { return null; }
  }

  function wmo(c) {
    if (c === 0)  return ['☀️', 'Cerah'];
    if (c <= 2)   return ['⛅', 'Berawan Sebagian'];
    if (c === 3)  return ['☁️', 'Mendung'];
    if (c <= 49)  return ['🌫️', 'Berkabut'];
    if (c <= 67)  return ['🌧️', 'Hujan'];
    if (c <= 82)  return ['🌦️', 'Gerimis'];
    return ['⛈️', 'Petir / Badai'];
  }

  function climate(c) {
    const m = c.rawDate.getMonth();
    const rainy = m >= 10 || m <= 1, trans = m === 2 || m === 9 || m === 10;
    return { icon: rainy ? '🌧️' : trans ? '🌦️' : '☀️', label: rainy ? 'Musim Hujan' : trans ? 'Peralihan' : 'Kemarau', temp: '28–32°C', rain: rainy ? '60–80%' : trans ? '30–50%' : '10–25%', warn: rainy };
  }

  async function fetchWx(lat, lon, date) {
    const key = `${lat}_${lon}_${date}`;
    const hit = cache(key); if (hit) return hit;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode`
      + `&timezone=Asia%2FJakarta&start_date=${date}&end_date=${date}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json(); cache(key, d); return d;
  }

  async function get(concert) {
    if (concert.confirmStatus === 'rumor') return null;
    const co = coord(concert);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((concert.rawDate - today) / 86400000);
    if (concert.rawDate < today) return { type: 'past', coord: co };
    if (diff > 16) { const cl = climate(concert); return { type: 'estimate', coord: co, ...cl }; }
    try {
      const date = concert.rawDate.toISOString().split('T')[0];
      const data = await fetchWx(co.lat, co.lon, date);
      const d = data?.daily;
      if (!d?.temperature_2m_max?.length) return { type: 'estimate', coord: co, ...climate(concert) };
      const [icon, label] = wmo(d.weathercode[0]);
      return { type: 'live', icon, label, tmax: Math.round(d.temperature_2m_max[0]), tmin: Math.round(d.temperature_2m_min[0]), rain: d.precipitation_probability_max[0], coord: co, warn: d.precipitation_probability_max[0] > 60 };
    } catch { return { type: 'estimate', coord: co, ...climate(concert) }; }
  }

  function render(concert, w) {
    if (!w) return '';
    if (w.type === 'past') return `<div class="f5-section"><div class="f5-wx-header"><h4>🌤️ Cuaca Hari Konser</h4></div><p class="f5-wx-note" style="margin:0">Konser sudah berlangsung — semoga kenangan hari itu indah! 🎵</p></div>`;
    if (w.type === 'estimate') return `<div class="f5-section"><div class="f5-wx-header"><h4>🌤️ Estimasi Iklim Hari Konser</h4><span class="f5-badge f5-badge-est">Estimasi Iklim</span></div><div class="f5-wx-body"><div class="f5-wx-icon">${w.icon}</div><div><div class="f5-wx-label">${w.label}</div><div class="f5-chips"><span class="f5-chip">🌡️ ${w.temp}</span><span class="f5-chip">🌧️ Hujan ${w.rain}</span></div></div></div><p class="f5-wx-note">📍 ${w.coord.label} · Rata-rata iklim ${concert.dates[0].split(' ')[1] || ''}</p>${w.warn ? '<div class="f5-wx-warn">☔ Musim hujan — siapkan jas hujan / payung!</div>' : ''}</div>`;
    return `<div class="f5-section"><div class="f5-wx-header"><h4>🌤️ Prakiraan Cuaca Hari Konser</h4><span class="f5-badge f5-badge-live">Live ✅</span></div><div class="f5-wx-body"><div class="f5-wx-icon">${w.icon}</div><div><div class="f5-wx-label">${w.label}</div><div class="f5-chips"><span class="f5-chip">🌡️ ${w.tmax}°C / ${w.tmin}°C</span><span class="f5-chip">☔ Hujan ${w.rain}%</span></div></div></div><p class="f5-wx-note">📍 ${w.coord.label} · ${concert.dates[0]} · sumber: open-meteo.com</p>${w.warn ? '<div class="f5-wx-warn">☔ Kemungkinan hujan tinggi — bawa jas hujan!</div>' : ''}</div>`;
  }

  async function inject(id) {
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === id) : null;
    if (!c) return;
    const modal = document.getElementById('modalContent'); if (!modal) return;
    const ph = document.createElement('div');
    ph.id = 'f5-wx-ph'; ph.className = 'f5-section f5-wx-loading';
    ph.innerHTML = '<div class="f5-spin"></div><span style="color:var(--text-muted,#71717a);font-size:.83rem">Memuat prakiraan cuaca…</span>';
    const anchor = modal.querySelector('.modal-ticket-area');
    if (anchor) anchor.insertAdjacentElement('beforebegin', ph);
    const w = await get(c);
    const el = document.getElementById('f5-wx-ph');
    if (el) el.outerHTML = render(c, w);
  }

  return { inject };
})();


/* ================================================================
   2. PARKING NEARBY
   ================================================================ */
const ParkingNearby = (() => {
  const DB = {
    gbk:   { match: ['gelora bung karno','gbk','indonesia arena','senayan'], spots: [{ n: 'Parkir GBK – Pintu Timur', t: '🏟️ Resmi', i: 'Kapasitas besar, akses Gate Timur' }, { n: 'Parkir GBK – Pintu Barat', t: '🏟️ Resmi', i: 'Dekat MRT Senayan' }, { n: 'Senayan City Mall', t: '🏢 Mall', i: '±5 menit jalan kaki' }, { n: 'Plaza Senayan', t: '🏢 Mall', i: '±8 menit jalan kaki' }, { n: 'Kantor DPR/MPR', t: '🏛️ Alt.', i: 'Dibuka saat konser besar' }], tips: ['🚇 MRT: Senayan/ICBC & Senayan', '🚌 Transjakarta: Bundaran Senayan'], q: 'parkir Gelora Bung Karno Senayan Jakarta' },
    jis:   { match: ['jakarta international stadium','jis','tanjung priok'], spots: [{ n: 'Parkir Resmi JIS Area A', t: '🏟️ Resmi', i: 'Di dalam kompleks stadion' }, { n: 'Parkir Resmi JIS Area B', t: '🏟️ Resmi', i: 'Sisi utara stadion' }, { n: 'Area Informal Sekitar JIS', t: '⚠️ Informal', i: 'Tidak resmi, tarif bisa tinggi' }], tips: ['🚌 Transjakarta Koridor 7 / feeder JIS', '🚗 Tol Ancol / Tanjung Priok'], q: 'parkir Jakarta International Stadium' },
    ancol: { match: ['ancol','carnaval','beach city'], spots: [{ n: 'Parkir Taman Impian Jaya Ancol', t: '🎡 Resmi', i: 'Dalam kawasan Ancol' }, { n: 'Parkir Beach City Stadium', t: '🏟️ Resmi', i: 'Dekat stadion' }], tips: ['🚗 Tol Ancol / Jl. RE Martadinata', '🚌 Transjakarta Terminal Ancol'], q: 'parkir Ancol Jakarta Utara' },
    ice:   { match: ['ice bsd','bsd','tangerang selatan'], spots: [{ n: 'Parkir ICE BSD Hall', t: '🏢 Resmi', i: 'Langsung di kompleks ICE BSD' }, { n: 'AEON Mall BSD City', t: '🏪 Mall', i: '±3 menit jalan kaki' }], tips: ['🚆 KRL: Stasiun BSD / Serpong', '🚗 Tol Alam Sutera / BSD'], q: 'parkir ICE BSD City Tangerang Selatan' },
    nice:  { match: ['nice pik','pik2','pik 2','pantai indah kapuk'], spots: [{ n: 'Parkir NICE Convention Center', t: '🏢 Resmi', i: 'Di kompleks NICE PIK2' }, { n: 'Area Parkir PIK2', t: '🏪 Area', i: 'Sekitar komplek PIK2' }], tips: ['🚗 Tol JORR / Jl. Kapuk Raya', '🚕 Grab/Gojek dari Penjaringan / Pluit'], q: 'parkir NICE PIK2 Tangerang' },
  };

  function find(concert) {
    const h = ((concert.venue || '') + ' ' + (concert.city || '')).toLowerCase();
    for (const v of Object.values(DB)) if (v.match.some(k => h.includes(k))) return v;
    return null;
  }

  function render(concert) {
    const d = find(concert);
    const url = d ? `https://maps.google.com/?q=${encodeURIComponent(d.q)}` : `https://maps.google.com/?q=${encodeURIComponent('parkir dekat ' + concert.venue + ' ' + concert.city)}`;
    const spots = d ? d.spots.map(s => `<div class="f5-pk-spot"><span class="f5-pk-tag">${s.t}</span><div><strong>${s.n}</strong><span class="f5-pk-note">${s.i}</span></div></div>`).join('') : '<p class="f5-pk-dis">Cari area parkir terdekat via Google Maps.</p>';
    const tips = d ? `<div class="f5-pk-tips">${d.tips.map(t => `<div class="f5-pk-tip">${t}</div>`).join('')}</div>` : '';
    return `<div class="f5-section"><h4>🅿️ Parkir & Transportasi</h4><div class="f5-pk-spots">${spots}</div>${tips}<a class="f5-pk-maps" href="${url}" target="_blank" rel="noopener">🗺️ Buka Google Maps — Parkir Sekitar Venue ↗</a><p class="f5-pk-dis">💡 Gunakan transportasi umum untuk menghindari kemacetan hari konser.</p></div>`;
  }

  function inject(id) {
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === id) : null;
    if (!c) return;
    const modal = document.getElementById('modalContent'); if (!modal) return;
    const el = document.createElement('div'); el.innerHTML = render(c);
    const anchor = modal.querySelector('.modal-ticket-area');
    if (anchor) anchor.insertAdjacentElement('beforebegin', el.firstElementChild || el);
  }

  return { inject };
})();


/* ================================================================
   3. STORY CARD GENERATOR
   ================================================================ */
const StoryCardGen = (() => {
  let _id = null;
  const TPL = {
    dark:   { bg: ['#09090b','#1a0a2e','#09090b'], orb: ['rgba(168,85,247,.45)','rgba(236,72,153,.3)'],  btn: ['#a855f7','#ec4899'], grid: 'rgba(255,255,255,.028)' },
    purple: { bg: ['#1e0a3c','#2d1454','#0f0520'], orb: ['rgba(168,85,247,.6)','rgba(99,102,241,.4)'],   btn: ['#7c3aed','#a855f7'], grid: 'rgba(255,255,255,.04)'  },
    neon:   { bg: ['#020617','#0c0a1a','#020617'], orb: ['rgba(0,255,200,.22)','rgba(168,85,247,.4)'],   btn: ['#06b6d4','#a855f7'], grid: 'rgba(0,255,200,.025)'   },
    sunset: { bg: ['#1a0505','#2d0e0e','#1a0505'], orb: ['rgba(251,146,60,.4)','rgba(239,68,68,.3)'],    btn: ['#f97316','#ef4444'], grid: 'rgba(255,200,100,.025)'  },
  };

  function openPanel(concertId) {
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === concertId) : null;
    if (!c) return;
    _id = concertId;
    const existing = document.getElementById('sgOv'); if (existing) existing.remove();
    const ov = document.createElement('div'); ov.id = 'sgOv';
    ov.addEventListener('click', e => { if (e.target === ov) closePanel(); });
    ov.innerHTML = `<div class="sg-panel" role="dialog" aria-label="Story Card Generator">
      <div class="sg-head"><span class="sg-title">✨ Story Card Generator</span><button class="sg-close" onclick="StoryCardGen.closePanel()">✕</button></div>
      <p class="sg-sub">Buat Story Instagram / WhatsApp untuk konser ini 🎵</p>
      <div class="sg-canvas-wrap"><canvas id="sgCanvas" width="540" height="960"></canvas></div>
      <div class="sg-tpl-row">
        <button class="sg-tpl active" onclick="StoryCardGen.setTpl('dark',this)">🌑 Dark</button>
        <button class="sg-tpl" onclick="StoryCardGen.setTpl('purple',this)">💜 Purple</button>
        <button class="sg-tpl" onclick="StoryCardGen.setTpl('neon',this)">✨ Neon</button>
        <button class="sg-tpl" onclick="StoryCardGen.setTpl('sunset',this)">🌅 Sunset</button>
      </div>
      <div class="sg-actions">
        <button class="sg-dl" onclick="StoryCardGen.download()">⬇️ Download PNG</button>
        <button class="sg-sh" onclick="StoryCardGen.share()">📤 Share</button>
      </div>
      <p class="sg-hint">💡 HP: tap & tahan gambar → Simpan ke Galeri</p>
    </div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    setTimeout(() => draw(c, 'dark'), 60);
  }

  function closePanel() {
    const el = document.getElementById('sgOv'); if (el) el.remove();
    document.body.style.overflow = '';
  }

  function setTpl(tpl, btn) {
    document.querySelectorAll('.sg-tpl').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === _id) : null;
    if (c) draw(c, tpl);
  }

  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }

  function wrapLine(ctx, txt, x, y, maxW, lh) {
    const words = txt.split(' '); let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; }
      else line = test;
    }
    if (line) ctx.fillText(line, x, y);
    return y + lh;
  }

  function draw(concert, tplKey) {
    const canvas = document.getElementById('sgCanvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const T = TPL[tplKey] || TPL.dark;
    const W = 540, H = 960, BH = 400; // BH = banner height

    // Full background (info section below banner)
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, T.bg[0]); bg.addColorStop(.5, T.bg[1]); bg.addColorStop(1, T.bg[2]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Orbs di bagian bawah (info section)
    [[.35, .78, 200, T.orb[0]], [.8, .92, 170, T.orb[1]]].forEach(([cx, cy, r, col]) => {
      const g = ctx.createRadialGradient(W * cx, H * cy, 0, W * cx, H * cy, r);
      g.addColorStop(0, col); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });

    // Grid subtle
    ctx.strokeStyle = T.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // ─── drawContent: overlays + text (dipanggil setelah banner siap) ───
    function drawContent() {
      // Gradient overlay pada banner: gelap atas+bawah
      const topOv = ctx.createLinearGradient(0, 0, 0, BH);
      topOv.addColorStop(0,   'rgba(0,0,0,.55)');
      topOv.addColorStop(0.4, 'rgba(0,0,0,.10)');
      topOv.addColorStop(0.7, 'rgba(0,0,0,.38)');
      topOv.addColorStop(1,   'rgba(0,0,0,.82)');
      ctx.fillStyle = topOv; ctx.fillRect(0, 0, W, BH);

      // Template color tint pada banner
      const tOrb = ctx.createRadialGradient(W * .65, BH * .3, 0, W * .65, BH * .3, 190);
      tOrb.addColorStop(0, T.btn[0] + '55'); tOrb.addColorStop(1, 'transparent');
      ctx.fillStyle = tOrb; ctx.fillRect(0, 0, W, BH);

      // ConcertID branding di atas banner
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 17px -apple-system, Inter, sans-serif';
      ctx.fillText('🎵  ConcertID', W / 2, 52);
      ctx.shadowBlur = 0;

      // Artist name — overlaid bawah banner
      ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 16;
      ctx.fillStyle = '#fff';
      const aFs = concert.artist.length > 20 ? 30 : concert.artist.length > 14 ? 38 : 46;
      ctx.font = `bold ${aFs}px -apple-system, Inter, sans-serif`;
      wrapLine(ctx, concert.artist, W / 2, BH - 104, W - 48, aFs + 8);
      ctx.shadowBlur = 0;

      // Tour name — overlaid bawah banner
      ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(240,240,255,.88)';
      ctx.font = '17px -apple-system, Inter, sans-serif';
      const tour = concert.tour.length > 52 ? concert.tour.slice(0, 50) + '…' : concert.tour;
      ctx.fillText(tour.length > 46 ? tour.slice(0, 44) + '…' : tour, W / 2, BH - 56);
      ctx.shadowBlur = 0;

      // Status badge kiri bawah banner
      ctx.textAlign = 'left';
      const sLabel = concert.confirmStatus === 'confirmed' ? '✅ Confirmed' : '🔮 Rumor';
      const sColor = concert.confirmStatus === 'confirmed' ? '#4ade80' : '#c084fc';
      ctx.fillStyle = 'rgba(0,0,0,.52)';
      rrect(ctx, 18, BH - 44, 136, 30, 8); ctx.fill();
      ctx.fillStyle = sColor; ctx.font = 'bold 12px -apple-system, Inter, sans-serif';
      ctx.fillText(sLabel, 28, BH - 24);

      // Divider
      const dg = ctx.createLinearGradient(40, 0, W - 40, 0);
      dg.addColorStop(0, 'transparent'); dg.addColorStop(.5, T.btn[0] + '99'); dg.addColorStop(1, 'transparent');
      ctx.strokeStyle = dg; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, BH + 18); ctx.lineTo(W - 40, BH + 18); ctx.stroke();

      // Info card
      const cY = BH + 28, cH = 264;
      ctx.fillStyle = 'rgba(255,255,255,.055)';
      rrect(ctx, 36, cY, W - 72, cH, 20); ctx.fill();
      ctx.strokeStyle = T.btn[0] + '44'; ctx.lineWidth = 1;
      rrect(ctx, 36, cY, W - 72, cH, 20); ctx.stroke();

      ctx.textAlign = 'left';
      [['📅', concert.dates.join(' & ')], ['⏰', concert.time],
       ['📍', concert.venue.length > 38 ? concert.venue.slice(0, 36) + '…' : concert.venue],
       ['🏙️', concert.city]].forEach(([em, val], i) => {
        const ry = cY + 34 + i * 55;
        ctx.font = 'bold 20px serif'; ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fillText(em, 56, ry);
        ctx.font = `${val.length > 32 ? 15 : 16}px -apple-system, Inter, sans-serif`;
        ctx.fillStyle = 'rgba(240,240,245,.82)';
        ctx.fillText(val.length > 42 ? val.slice(0, 40) + '…' : val, 93, ry);
      });

      // Bottom badge
      const btnGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
      btnGrad.addColorStop(0, T.btn[0]); btnGrad.addColorStop(1, T.btn[1]);
      ctx.fillStyle = btnGrad;
      rrect(ctx, 100, cY + cH + 24, W - 200, 52, 26); ctx.fill();
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
      ctx.font = 'bold 17px -apple-system, Inter, sans-serif';
      ctx.fillText('list-concert-tour.web.id', W / 2, cY + cH + 57);

      // Footer
      ctx.fillStyle = 'rgba(120,120,135,.5)'; ctx.font = '12px -apple-system, Inter, sans-serif';
      ctx.fillText('© ConcertID — Info Konser Internasional di Indonesia', W / 2, H - 30);
    }

    // Load artist banner image
    const imgUrl = `https://www.list-concert-tour.web.id/images/${concert.id}.jpeg`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, BH); ctx.clip();
      const sc = Math.max(W / img.naturalWidth, BH / img.naturalHeight);
      const dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
      ctx.drawImage(img, (W - dw) / 2, (BH - dh) / 2, dw, dh);
      ctx.restore();
      drawContent();
    };
    img.onerror = () => {
      // Fallback: gradient + emoji jika gambar gagal dimuat
      const fb = ctx.createLinearGradient(0, 0, W, BH);
      fb.addColorStop(0, T.bg[1]); fb.addColorStop(1, T.bg[2]);
      ctx.fillStyle = fb; ctx.fillRect(0, 0, W, BH);
      ctx.textAlign = 'center';
      ctx.shadowColor = T.btn[0]; ctx.shadowBlur = 40;
      ctx.font = '96px serif'; ctx.fillStyle = '#fff';
      ctx.fillText(concert.emoji, W / 2, BH / 2 + 28);
      ctx.shadowBlur = 0;
      drawContent();
    };
    img.src = imgUrl;
  }

  function download() {
    const canvas = document.getElementById('sgCanvas'); if (!canvas) return;
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === _id) : null;
    const name = c ? `concertid-${c.id}.png` : 'concertid-story.png';
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = name; a.click();
  }

  async function share() {
    const canvas = document.getElementById('sgCanvas'); if (!canvas) return;
    const c = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === _id) : null;
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const file = new File([blob], `concertid-${_id || 'story'}.png`, { type: 'image/png' });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: c ? `${c.artist} — ConcertID` : 'ConcertID', text: c ? `Konser ${c.artist} di ${c.venue}! 🎵` : '', files: [file] });
    } else {
      download();
      if (typeof showToast === 'function') showToast('📁 Web Share tidak tersedia — file berhasil di-download!', 'info');
    }
  }

  return { openPanel, closePanel, setTpl, download, share };
})();
window.StoryCardGen = StoryCardGen;


/* ================================================================
   PATCH openModal — inject semua fitur
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const _prev5 = window.openModal;
  if (typeof _prev5 !== 'function') return;

  window.openModal = function (id) {
    _prev5(id);

    // 1. Weather (async, inject placeholder dulu)
    WeatherForecast.inject(id);

    // 2. Parking
    ParkingNearby.inject(id);

    // 3. Story Card button — inject setelah .modal-actions (skip untuk rumor)
    const concert5 = typeof CONCERTS !== 'undefined' ? CONCERTS.find(x => x.id === id) : null;
    if (concert5 && concert5.confirmStatus === 'rumor') return;
    const modal = document.getElementById('modalContent');
    if (!modal) return;
    const actions = modal.querySelector('.modal-actions');
    if (actions && !modal.querySelector('.f5-story-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'f5-story-wrap';
      wrap.innerHTML = `<button class="f5-story-btn" onclick="StoryCardGen.openPanel('${id}')">✨ Buat Story Card — Instagram / WhatsApp</button>`;
      actions.insertAdjacentElement('afterend', wrap);
    }
  };
});
