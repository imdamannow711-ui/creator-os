/* DONE RITE Creator OS — cleanup service worker
   The previous service worker saved a broken copy of the site onto the phone and
   kept serving it. This replacement deletes every saved copy and removes itself. */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});

/* No fetch handler on purpose — every request goes straight to the network. */
