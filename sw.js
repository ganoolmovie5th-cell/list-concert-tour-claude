/* ============================================
   ConcertID — Service Worker (PWA)
   Strategy: Stale-While-Revalidate untuk assets statis
              (tampil cepat dari cache, auto-update di background)
              Network First untuk data dinamis
   ============================================ */

const CACHE_VERSION = 'v16';
const CACHE_STATIC = `concertid-static-${CACHE_VERSION}`;
const CACHE_IMAGES = `concertid-images-${CACHE_VERSION}`;

// Assets yang di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.min.css',
  '/app.min.js',
  '/supabase.min.js',
  '/reviews.min.js',
  '/features.min.js',
  '/features2.min.js',
  '/features3.min.js',
  '/features4.min.js',
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

  // Static assets & HTML — Stale-While-Revalidate
  // Tampil cepat dari cache, fetch update di background, lalu reload otomatis
  if (
    url.pathname.match(/\.(css|js|svg|ico|png|webp|woff2?)$/) ||
    url.pathname === '/' ||
    url.pathname === '/index.html'
  ) {
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
