const CACHE_NAME = 'fbx-app-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './texturas/fondo.jpg',
  './modelos/rumba.fbx',
  './modelos/dancing.fbx',
  './sonidos/rumba.mp3',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/fflate/umd/index.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128/examples/js/loaders/FBXLoader.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          urlsToCache.map((url) =>
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Error al cargar ${url}: ${response.statusText}`);
                }
                return cache.put(url, response);
              })
              .catch((error) => {
                console.error(`No se pudo cachear ${url}:`, error);
              })
          )
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
