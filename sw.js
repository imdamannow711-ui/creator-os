/* DONE RITE Creator OS — offline service worker
   ------------------------------------------------------------------
   Network first, cache second. The phone always tries GitHub for the
   newest file, and only falls back to its saved copy when there is no
   connection. That means a bad upload can never get stuck on the phone
   the way it did before. */

const CACHE_NAME = "done-rite-v5-clean";

const FILES = ["./", "./index.html", "./app.js", "./content-gap-import.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // One file at a time, so a single miss cannot fail the whole install.
      .then((cache) => Promise.all(FILES.map((file) => cache.add(file).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match("./index.html"))
      )
  );
});
