// Service Worker v2 - cache bust HTML only
const VERSION = '20260607133201';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // Only intercept HTML pages - pass through API calls unchanged
  if (url.includes('supabase.co') || url.includes('api.') || !url.includes('matavillas.github.io')) {
    return; // Let browser handle normally
  }
  // For HTML files: always fetch fresh from network
  if (url.endsWith('.html') || url.includes('.html?')) {
    e.respondWith(
      fetch(e.request, {cache: 'no-store'})
        .catch(function() { return caches.match(e.request); })
    );
  }
});
