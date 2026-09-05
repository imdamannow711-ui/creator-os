/* DONE RITE Creator OS — offline service worker
   ------------------------------------------------------------------
   Fresh network first, cache second. Same-origin GET requests bypass
   Safari's normal HTTP cache so newly deployed JavaScript reaches the
   phone immediately. Navigation requests may fall back to index.html;
   scripts and other assets never receive HTML as a fallback. */

const CACHE_NAME = "done-rite-v20-voiceover-trim-safe";

const FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./teleprompter.html",
  "./teleprompter-one-click.html",
  "./teleprompter-script-studio.html",
  "./one-click-ad-dev.html",
  "./video-upload.html",
  "./content-gap-import.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/sfx/manifest.json",
  "./modules/one-click-ad-editor.js",
  "./modules/one-click-media-stage.js",
  "./modules/one-click-scene-scorer.js",
  "./modules/one-click-render-stage.js",
  "./modules/one-click-browser-executor.js",
  "./modules/one-click-camera-handoff.js",
  "./modules/one-click-gap-remover.js",
  "./modules/one-click-session-state.js",
  "./modules/one-click-creative-controls.js",
  "./modules/one-click-creative-render.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(FILES.map(async (file) => {
        try {
          const response = await fetch(file, { cache: "no-store" });
          if (response && response.status === 200) await cache.put(file, response.clone());
        } catch (e) {}
      })))
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
    fetch(request, { cache: "no-store" })
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then((hit) => {
          if (hit) return hit;
          if (request.mode === "navigate") return caches.match("./index.html", { ignoreSearch: true });
          return Response.error();
        })
      )
  );
});
