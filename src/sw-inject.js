/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
**/

//Let's import the Workbox libs from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

//Force debug mode to see the console logs from any domain (Laragon's nginix fix)
//Without this setting Workbox shows debug logs only when loaded from localhost.
//Please note that this must be removed before deploying real production builds
workbox.setConfig({
  debug: true,
  //modulePathPrefix: '/libs/workbox-v4.3.1' //TEST load workbox from the local source
});

//precache any used modules to avoid errors
workbox.loadModule('workbox-core'); //this one should be automatically precached anyway
workbox.loadModule('workbox-precaching');
workbox.loadModule('workbox-routing');
workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-expiration');

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
    // Assuming '/index.html' has been precached,
    // look up its corresponding cache key.
    workbox.precaching.getCacheKeyForURL('index.html')
    //'./index.html'
  );
  
  
  /* 
    DYNAMIC CACHING STRATEGIES
    Routes associated with a caching policy will be placed here
  */
  
  //Patients data
  workbox.routing.registerRoute(
    /^http:\/\/cors-anywhere.herokuapp.com\/http:\/www.open-hospital.org\/oh-api\/patients/,
    new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'patients-data',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 120,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      new workbox.backgroundSync.Plugin({ //only applies to the new patient form
        //TODO
        })
      ],
    })
  );

  //Colleagues TEST
  workbox.routing.registerRoute(
    /^https:\/\/uinames.com+\/api\//,
    new workbox.strategies.StaleWhileRevalidate({ //show cache content + background update. Updated data will be served on the next visit
    cacheName: 'colleagues-test-remote-api',
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
 

  /* 
    OTHER USEFUL CACHING RECIPES
  */
  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-external-assets',
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /.*(?:fonts.gstatic|fonts.googleapis)\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-external-assets',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );
}
else {
  console.log("Workbox didn't load 😢");
}

