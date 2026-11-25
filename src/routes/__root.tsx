import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BottomNav } from "@/components/BottomNav";
import { useAppState } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Voltar para Hoje
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Algo deu errado</h1>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Reta Final ENEM — cronograma de estudos" },
      { name: "description", content: "Cronograma dinâmico para os últimos dias antes do ENEM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#007565" },
      { name: "apple-mobile-web-app-title", content: "Reta Enem" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Favicon "RE" (Reta Enem): SVG for modern browsers, .ico (16–256 px) as fallback, and the
      // 180 px icon iOS uses when the site is added to the home screen.
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      // Installable app (PWA): manifest with icons; the service worker is registered below.
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const OFFLINE_TABS = [
  "/",
  "/cronograma",
  "/conteudos",
  "/questoes",
  "/desempenho",
  "/aulas",
  "/simulado",
];

/**
 * Registers the service worker (public/sw.js) in production builds, so pages already opened work
 * without internet. Not in development, where caching would hide code changes.
 */
function ServiceWorker() {
  useEffect(() => {
    if (import.meta.env.DEV || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        // Save the main tabs in the background, so they open offline even before being visited.
        if (navigator.onLine) reg.active?.postMessage({ type: "warm", paths: OFFLINE_TABS });
      })
      .catch(() => {
        /* offline support is optional: the app works without it */
      });
  }, []);
  return null;
}

function ThemeSync() {
  const { state, ready } = useAppState();
  useEffect(() => {
    if (!ready) return;
    const dark = state.theme
      ? state.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, [state.theme, ready]);
  useEffect(() => {
    if (ready) document.documentElement.classList.toggle("data-saver", state.dataSaver);
  }, [state.dataSaver, ready]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <ServiceWorker />
      <div className="mx-auto min-h-screen max-w-2xl pb-28">
        <Outlet />
      </div>
      <BottomNav />
    </QueryClientProvider>
  );
}
