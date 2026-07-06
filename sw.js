/* ============================================
   ConcertID — Service Worker (PWA)
   Strategy: Stale-While-Revalidate untuk assets statis
              (tampil cepat dari cache, auto-update di background)
              Network First untuk data dinamis
   ============================================ */

const CACHE_VERSION = 'v26';
const CACHE_STATIC = `concertid-static-${CACHE_VERSION}`;
const CACHE_IMAGES = `concertid-images-${CACHE_VERSION}`;

// Assets yang di-cache saat install (JS/CSS only — HTML pakai network-first)
const STATIC_ASSETS = [
  '/style.min.css',
  '/app.js',
  '/supabase.js',
  '/reviews.js',
  '/features.js',
  '/features2.js',
  '/features3.js',
  '/features4.js',
  '/logo.svg',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-32.png',
  '/favicon-16.png',
  '/apple-touch-icon.png',
  '/manifest.json',
];

// ── Install ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(STATIC_ASSETS))
    // Sengaja TIDAK skipWaiting di sini —
    // biar page yang request skipWaiting lewat message,
    // sehingga reload terjadi secara terkontrol
  );
});

// ── Message — terima perintah dari halaman ───
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Activate — hapus cache lama ──────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_IMAGES)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET dan cross-origin (Supabase, GA, dll)
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Images — Cache First (gambar jarang berubah)
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(cacheFirst(request, CACHE_IMAGES));
    return;
  }

  // HTML pages (/, /index.html, /about, dll) — Network First
  // Selalu ambil versi terbaru dari server. Cache hanya sebagai fallback offline.
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.match(/\.(html)$/) ||
    !url.pathname.match(/\.\w+$/)   // clean URLs tanpa ekstensi
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, SVG, fonts, dll) — Stale-While-Revalidate
  if (url.pathname.match(/\.(css|js|svg|ico|png|webp|woff2?)$/)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STATIC));
    return;
  }

  // Default — Network First
  event.respondWith(networkFirst(request));
});

// ── Stale-While-Revalidate ────────────────────
// Sajikan dari cache (cepat), update cache di background,
// lalu kirim pesan ke semua tab untuk reload jika konten berubah
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(async response => {
    if (!response.ok) return response;

    // Bandingkan apakah konten berubah
    const newClone = response.clone();
    const newText = await newClone.text();

    let hasChanged = false;
    if (cached) {
      const oldText = await cached.clone().text();
      hasChanged = oldText !== newText;
    } else {
      hasChanged = true;
    }

    // Simpan versi baru ke cache
    cache.put(request, response.clone());

    // Jika berubah, beritahu semua tab untuk reload
    if (hasChanged) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED', url: request.url });
      });
    }

    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// ── Cache First ───────────────────────────────
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503 });
  }
}

// ── Network First ─────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match('/index.html');
    return fallback || new Response('Offline', { status: 503 });
  }
}
