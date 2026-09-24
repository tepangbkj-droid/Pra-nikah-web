// Service Worker - WeddingPro App
// Membuat aplikasi bisa dibuka walau koneksi lemah/offline (untuk shell tampilan).
// Data tetap butuh internet karena tersimpan di Firebase.

const CACHE_NAME = 'weddingpro-cache-v1';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Jangan cache request ke Firebase / API eksternal, biarkan selalu ke jaringan
  if (req.url.includes('firestore') || req.url.includes('googleapis') || req.url.includes('firebase')) {
    return;
  }

  // Strategi: network first, fallback ke cache (biar konten selalu terbaru saat online)
  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
