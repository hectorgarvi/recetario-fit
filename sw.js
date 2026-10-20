// Service worker del recetario: la web funciona sin conexión.
// - La página: primero la red (para tener siempre la última versión) y, sin conexión, la copia guardada.
// - Iconos y fuentes: primero la copia guardada.
// - La API de GitHub (tus datos) nunca se guarda aquí: la gestiona la propia página.
const CACHE = "recetario-v1";
const BASE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.hostname === "api.github.com") return;
  const esFuente = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  const esPagina = req.mode === "navigate" || url.pathname.endsWith("/index.html");
  if (esPagina) {
    e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copia)); return r; })
      .catch(() => caches.match("index.html").then(r => r || caches.match("./"))));
    return;
  }
  if (esFuente || url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === "opaque") { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return r;
    })));
  }
});
