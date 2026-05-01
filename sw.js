const CACHE = 'dudububu-v4';
const ASSETS = [
  '/dudububu/',
  '/dudububu/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(ASSETS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Always go network-first for Google APIs (auth + sheets)
  if(e.request.url.includes('googleapis.com') ||
     e.request.url.includes('accounts.google.com') ||
     e.request.url.includes('gsi/client')){
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function(){
      return caches.match(e.request);
    })
  );
});
