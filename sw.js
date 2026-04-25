/* ============================================================
   Service Worker for Perpus Sofya - Offline Caching
   ============================================================ */

const CACHE_NAME = 'perpus-sofya-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/sheets.js',
  '/js/modal.js',
  '/js/monster-modal.js',
  '/pages/items.html',
  '/pages/monsters.html',
  '/pages/skills.html',
  '/pages/contribute.html',
  '/img/icons/brand_ico.png',
  '/img/icons/favicon.ico'
];

// 1. Install: Open cache and add app shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('[SW] Failed to cache app shell:', err);
      })
  );
});

// 2. Activate: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch: Serve from cache first, then network (Cache-First strategy)
self.addEventListener('fetch', event => {
  // For Google Sheets, always go network first, then cache, then offline.
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network succeeds, clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For app shell and other assets, use Cache-First
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Not in cache - fetch from network
          return fetch(event.request);
        })
    );
  }
});