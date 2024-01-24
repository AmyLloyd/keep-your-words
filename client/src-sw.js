const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
// OR Simply From https://developer.chrome.com/docs/workbox/caching-strategies-overview
//const { staticResourceCache } = require('workbox-recipes');

//Precache assets ready to use 
precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    //Checks if the response is cachable based on its configuration
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    //limit number of or age of cached items
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

//load provided urls into cache when service worker installs - can be used instead of precache
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

//When naviagting - hence when navigating to the page or on retrieval online i think
registerRoute(
  ({ request }) => 
  request.mode === 'navigate', pageCache);


  //used with pageCache (rather than setDefault) allows sw to serve asset if there's a routing error, for example if offline.
  offlineFallback();

  // Register route for caching dynamic images
// The cache first strategy is often the best choice for images because it saves bandwidth and improves performance.
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "my-image-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// TODO: Implement asset caching
const matchCallback = ({ request }) => 
  request.destination === 'style' ||
  request.destination === 'script' ||
  request.destination === 'worker';

registerRoute(
    matchCallback, 
    new staleWhileRevalidate({
      cacheName: 'resource-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
);

//OR simply From https://developer.chrome.com/docs/workbox/caching-strategies-overview
//staticResourceCache();

registerRoute();
