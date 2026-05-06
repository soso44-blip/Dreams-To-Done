const CACHE = 'adhd-student-dark-v2';
const ASSETS = [
  './student-dark.html',
  'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(r => {
      if (!r || r.status !== 200 || r.type === 'opaque') return r;
      const cl = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cl));
      return r;
    }).catch(() => caches.match('./student-dark.html'));
  }));
});
