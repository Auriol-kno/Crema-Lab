// Crema Lab offline cache. The page is network-first (updates arrive when online);
// hashed assets and icons are cache-first. Bump VERSION to drop old caches.
const VERSION = 'crema-lab-v1';
const CORE = ['./', './manifest.webmanifest', './icon.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if (e.data?.type !== 'cache' || !Array.isArray(e.data.urls)) return;
  const same = e.data.urls.filter(u => typeof u === 'string' && u.startsWith(self.location.origin));
  e.waitUntil?.(caches.open(VERSION).then(c => Promise.all(same.map(u => c.add(u).catch(() => {})))));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./', copy)); return res; })
      .catch(() => caches.match('./').then(r => r || caches.match(req))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
