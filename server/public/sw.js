self.__WB_DISABLE_DEV_LOGS = true;

// Workbox from CDN for runtime caching and background sync
self.importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js"
);

if (self.workbox) {
  self.workbox.setConfig({ debug: false });

  const { routing, strategies, backgroundSync } = self.workbox;

  const shouldCacheStaticAsset = ({ request, url }) => {
    if (url.origin !== self.location.origin) {
      return false;
    }

    if (!["script", "style", "font", "image"].includes(request.destination)) {
      return false;
    }

    // Never cache Vite development modules or API calls.
    return ![
      "/@",
      "/src/",
      "/node_modules/",
      "/api/",
    ].some((prefix) => url.pathname.startsWith(prefix));
  };

  // Runtime cache: static assets (scripts, styles, fonts, images)
  routing.registerRoute(
    shouldCacheStaticAsset,
    new strategies.StaleWhileRevalidate({ cacheName: "static-v2" })
  );

  // Runtime cache: API content packs
  routing.registerRoute(
    ({ url }) =>
      url.origin === self.location.origin &&
      url.pathname.startsWith("/api/content/packs/"),
    new strategies.StaleWhileRevalidate({ cacheName: "content-packs-v1" })
  );

  // Background sync for POSTs
  const bgSyncPlugin = new backgroundSync.BackgroundSyncPlugin(
    "offline-queue",
    {
      maxRetentionTime: 24 * 60, // minutes
    }
  );

  routing.registerRoute(
    ({ request }) =>
      request.method === "POST" &&
      /\/api\/progress\/sync|\/api\/analytics\/batch/.test(request.url),
    new strategies.NetworkOnly({ plugins: [bgSyncPlugin] }),
    "POST"
  );
}
