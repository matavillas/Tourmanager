// Service Worker - forces fresh reload every time
const CACHE_NAME = 'mata-villas-v' + Date.now();

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Always fetch from network, never from cache
  e.respondWith(
    fetch(e.request.url + (e.request.url.includes('?') ? '&' : '?') + '_sw=' + Date.now())
      .catch(function() {
        return fetch(e.request);
      })
  );
});
