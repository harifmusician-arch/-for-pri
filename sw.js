const CACHE_NAME = "for-pri-v2";

const FILES_TO_CACHE = [

  "/",
  "/index.html",
  "/intro.html",
  "/home.html",
  "/login.html",
  "/chat.html",
  "/cinema.html",
  "/pet.html",
  "/pricoin.html",

  "/pages/timeline.html",
  "/pages/game.html",
  "/pages/final-question.html",
  "/pages/vault.html",
  "/pages/vm.html",
  "/pages/vm-login.html",
  "/pages/secret.html",
  "/pages/why-you-matter.html",
  "/pages/songs.html",

  "/pages/letters/letter1.html",
  "/pages/letters/letter2.html",
  "/pages/letters/letter3.html",
  "/pages/letters/letter4.html",
  "/pages/letters/letter5.html",
  "/pages/letters/login.html",

  "/pages/memories/chaos.html",
  "/pages/memories/confessions.html",
  "/pages/memories/cute.html",
  "/pages/memories/drunk.html",
  "/pages/memories/serious.html",
  "/pages/memories/bucketlist.html",

  "/style.css",
  "/chat.css",
  "/movie/movie.css",
  "/pet.css",

  "/login.js",
  "/music.js",
  "/missme.js",
  "/chat.js",
  "/pet.js",
  "/movie/movie.js",

  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"

];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )

  );

  self.clients.claim();

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(response => {

      if (response) return response;

      return fetch(event.request).then(networkResponse => {

        if (
          event.request.method === "GET" &&
          networkResponse.status === 200
        ) {

          const copy = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

        }

        return networkResponse;

      });

    })

  );

});