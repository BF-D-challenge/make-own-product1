// BF.D Service Worker — minimal, required for PWA installability

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Pass-through fetch — no offline caching for now
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
