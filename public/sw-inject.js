//Let's import workbox libs from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

//Force debug mode to see the console logs from any domain (Laragon's nginix fix)
//Without this setting Workbox shows debug logs only when loaded from localhost.
//Please note that this must be removed before deploying real production builds
workbox.setConfig({
  debug: true,
  //modulePathPrefix: '/libs/workbox-v4.3.1' //TEST load workbox from the local source
});

if (workbox) {
  //console.log('Workbox is loaded');

  /* 
    PRECACHING
    We delegate this to Workbox's inject mode
    Files under precaching policy will have their path injected here at build time 
  */
  workbox.precaching.precacheAndRoute([]);

  /* Delegate URL routing control to the React Router */
  workbox.routing.registerNavigationRoute(
    // Assuming '/single-page-app.html' has been precached,
    // look up its corresponding cache key.
    workbox.precaching.getCacheKeyForURL('index.html')
    //'./index.html'
  );
  
  
  /* 
    DYNAMIC CACHING STRATEGIES
    Routes associated with a caching policy will be placed here
  */
  
  //This one caches data assets (TODO)
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg)$/,
    new workbox.strategies.CacheFirst({
    cacheName: 'patients',
    plugins: [
      new workbox.expiration.Plugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
      })
  );
  
  //Patients data
  workbox.routing.registerRoute(
    /^http:\/\/localhost:[0-9]+\/fakeAPI\/.*.(?:png|jpg|jpeg|json)$/,
    new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'patients-data',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      new workbox.backgroundSync.Plugin({ //only applies to the new patient form
        //TODO
        })
      ],
    })
  );
 
}
else {
  console.log("Workbox didn't load 😢");
}

