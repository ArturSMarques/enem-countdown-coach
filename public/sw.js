/*
 * Service worker do Reta Enem: guarda o que o aluno já abriu para o app abrir sem internet.
 * - Páginas: rede primeiro; sem rede, a última cópia guardada daquela página ou, se ela nunca foi
 *   aberta, a página offline.html. Com internet, o app pede para guardar as abas principais.
 * - Arquivos do app (/assets, ícones) e fontes: cache primeiro.
 * - Nada de outros sites (YouTube, Toda Matéria...) é guardado: esses links sempre abrem online.
 * Os dados do aluno ficam no localStorage, que funciona offline sem depender deste arquivo.
 * Ao mudar a estratégia, troque a versão do cache.
 */
const CACHE = "reta-enem-v2";
const PRECACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const put = (request, response) => {
  if (response && (response.ok || response.type === "opaque")) {
    const copy = response.clone();
    caches.open(CACHE).then((c) => c.put(request, copy));
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isFont) return;
  if (sameOrigin && url.pathname.startsWith("/__")) return; // analytics and dev tooling

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => put(request, res))
        .catch(async () => (await caches.match(request)) || (await caches.match("/offline.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res))),
  );
});

/**
 * Warm-up requested by the app when it opens online: saves the main tabs and the files they use
 * (the /assets links in each page), so they also open offline the first time.
 */
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "warm" || !Array.isArray(data.paths)) return;
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const path of data.paths) {
        try {
          const res = await fetch(path, { credentials: "same-origin" });
          if (!res.ok) continue;
          await cache.put(path, res.clone());
          const html = await res.text();
          const assets = new Set(html.match(/\/assets\/[^"'\s)<>]+/g) || []);
          for (const a of assets) if (!(await cache.match(a))) await cache.add(a).catch(() => {});
        } catch {
          /* offline or failed: try again next time */
        }
      }
    }),
  );
});
