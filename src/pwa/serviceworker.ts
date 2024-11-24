const cacheId = 'blockit-pwa-cache-v1';
const baseurl = '/blockit'; // Assume GH pages
const urlsToCache = [
  `${baseurl}/`,
  `${baseurl}/index.html`,
  `${baseurl}/index.css`,
  `${baseurl}/index.js`,
  `${baseurl}/favicon.png`,
  `${baseurl}/manifest.json`,
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent)  => {
  event.waitUntil(
    caches.open(cacheId).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve cached content when offline
// Shamlessly copied from mozilla https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
self.addEventListener('fetch', (event: FetchEvent) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== "GET") return;

  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async () => {
      // Try to get the response from a cache.
      const cache = await caches.open(cacheId);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // If we found a match in the cache, return it, but also
        // update the entry in the cache in the background.
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }

      // If we didn't find a match in the cache, use the network.
      return fetch(event.request);
    })(),
  );
});

// Activate event - remove old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [cacheId];
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
