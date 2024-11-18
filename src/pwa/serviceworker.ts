const CACHE_NAME = 'blockit-pwa-cache-v1';
const baseurl = '/blockit'; // Assume GH pages
const urlsToCache = [
  `${baseurl}/`,
  `${baseurl}/index.html`,
  `${baseurl}/style.css`,
  `${baseurl}/game.js`,
  `${baseurl}/favicon.png`,
  `${baseurl}/manifest.json`,
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent)  => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached resource if found
        if (response) {
          return response;
        }
        // If not found, fetch the resource from the network
        return fetch(event.request);
      })
  );
});

// Activate event - remove old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
