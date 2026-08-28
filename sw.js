// Service Worker for Bristol Hearing Loss Initiative
// Offline-first caching for emergency pathways and core UI assets
const CACHE_NAME = 'hli-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './path-yes.html',
  './path-support.html',
  './path-about.html',
  './path-emergency.html',
  './path-hearing-aids-access.html',
  './path-hearing-tests.html',
  './path-tinnitus.html',
  './styles.css?v=9.0',
  './script.js',
  './manifest.json',
  './Contents/Pictures/Favicon.png',
  './Contents/Branding%20Images/HLI%20logo%20Black.png',
  './Contents/Branding%20Images/HLI%20Logo%20White.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Update cache copy dynamically
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline or network fails, return cached response
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If HTML navigation fails offline, fallback to index
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./path-yes.html') || caches.match('./index.html');
          }
        });
      })
  );
});
