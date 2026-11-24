import { Check, Copy, ExternalLink } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { copyText, isFramed } from "@/lib/clipboard";
import { normalizeResourceURL } from "@/lib/youtube";

/**
 * Plain https link in a new tab. The browser (and, on phones, the OS) decides whether the
 * YouTube app takes over, so the click always lands on the lesson. Custom schemes such as
 * intent:// or youtube:// are deliberately not used: they leave a blank tab or do nothing.
 *
 * Next to it, "Copiar link" is the safe exit for when the link cannot open: YouTube refuses
 * to load inside another page (ERR_BLOCKED_BY_RESPONSE, e.g. the site shown inside an
 * editor preview or a masked domain), and some networks or in-app browsers block it.
 */
export function ExternalResourceLink({
  href,
  children,
  copyable = true,
}: {
  href: string;
  children: ReactNode;
  copyable?: boolean;
}) {
  const [error, setError] = useState("");
  const [copy, setCopy] = useState<"idle" | "ok" | "manual">("idle");
  const safeURL = normalizeResourceURL(href);
  const label = typeof children === "string" ? children : "o link";

  useEffect(() => {
    if (copy !== "ok") return;
    const timer = setTimeout(() => setCopy("idle"), 4000);
    return () => clearTimeout(timer);
  }, [copy]);

  return (
    <span className="inline-flex min-w-0 max-w-full flex-col items-start gap-1">
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
        <a
          href={safeURL ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          onClick={(event) => {
            if (safeURL) return;
            event.preventDefault();
            setError("Este link não é válido. Confira o endereço e tente novamente.");
          }}
        >
          {children} <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
        {copyable && safeURL && (
          <button
            type="button"
            aria-label={`Copiar link: ${label}`}
            onClick={async () => setCopy((await copyText(safeURL)) ? "ok" : "manual")}
            className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copy === "ok" ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <Copy className="h-3 w-3 shrink-0" />
            )}
            {copy === "ok" ? "Copiado" : "Copiar link"}
          </button>
        )}
      </span>
      {copy === "ok" && (
        <span role="status" className="text-xs text-muted-foreground">
          Link copiado. Cole na barra de endereço do navegador.
        </span>
      )}
      {copy === "manual" && safeURL && (
        <span role="status" className="flex w-full max-w-xs flex-col gap-1 text-xs">
          <span className="text-muted-foreground">
            Não foi possível copiar sozinho. Toque no endereço, copie e cole no navegador:
          </span>
          <input
            readOnly
            value={safeURL}
            aria-label="Endereço do link"
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-md border bg-background px-2 py-1 text-xs"
          />
        </span>
      )}
      {error && (
        <span role="alert" className="text-xs text-destructive">
          {error}
        </span>
      )}
    </span>
  );
}

/**
 * One clear sentence on what to do when a lesson does not open, plus an extra warning when
 * the site itself runs inside another page — the case that produces "www.youtube.com está
 * bloqueado / ERR_BLOCKED_BY_RESPONSE".
 */
export function ExternalLinkHelp() {
  const [framed, setFramed] = useState(false);
  useEffect(() => setFramed(isFramed()), []);
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      {framed && (
        <p
          role="note"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-foreground"
        >
          Você está vendo o Reta Enem dentro de outra página (por exemplo, a pré-visualização de um
          editor). O YouTube não abre dentro de outras páginas e mostra “www.youtube.com está
          bloqueado”. Abra o site direto no navegador ou use “Copiar link”.
        </p>
      )}
      <p>
        Se a aula não abrir ou aparecer “www.youtube.com está bloqueado”, toque em “Copiar link” e
        cole o endereço no navegador. Se nem assim abrir, a rede em que você está pode bloquear o
        YouTube: tente em outra rede, como os dados do celular.
      </p>
    </div>
  );
}
