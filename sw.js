const staticCacheName = 'Converter-static-v4';

// files to cache
const filesToCache = [
  '/',
  './index.html',
  './scripts/appcontroller.js',
  './scripts/idb.js',
  './css/styles.css',
  './manifest.json',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en'
];

self.addEventListener('install', event => {
    console.log('Installing service worker.');
    event.waitUntil(
      caches.open(staticCacheName).then( cache => {
        console.log('service worker installed successfully.');
        return cache.addAll(filesToCache);
      })
    );
  });
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  self.addEventListener('activate', event => {
    console.log('service worker activated successfully');
    event.waitUntil(
      caches.keys().then( cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
             // console.log(cacheName);
            return cacheName.startsWith('Converter-') && staticCacheName !== cacheName;
          }).map( cacheName => {
            if(staticCacheName !== cacheName){
                return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  self.addEventListener('fetch', function(event) {
    let requestUrl = new URL(event.request.url);
    
    // loading the index page from cache when wizard at on the browser.
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        caches.match(event.request).then(response => {
          if (response) {
            // respond with the index page skeleton in cache
             event.respondWith(caches.match('/index.html'));
             return;
          }
        });
      }
    }
   
    // responding to any other request on the page.
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }).catch(error => {
        return error;
      })
    );

});
