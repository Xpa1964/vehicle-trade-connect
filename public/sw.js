/**
 * Service Worker for KONTACT VO
 * Prioritizes fresh published assets to avoid stale home screens after deploys.
 */

const CACHE_NAME = 'kontact-vo-v4';
const RUNTIME_CACHE = 'kontact-vo-runtime-v4';
const PRECACHE_ASSETS = ['/logo.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.origin.includes('supabase.co')) return;

  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkOnlyPage(request));
    return;
  }

  if (url.pathname.startsWith('/api/') || url.origin.includes('supabase.co')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function networkOnlyPage(request) {
  try {
    return await fetch(request, { cache: 'no-store' });
  } catch (error) {
    return new Response(
      '<html><body><h1>Sin conexión</h1><p>Por favor, verifica tu conexión a internet.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
    );
  }
});
