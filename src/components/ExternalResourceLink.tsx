import { Copy, ExternalLink } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { isYouTubeCandidate, normalizeResourceURL, openYouTubeVideo } from '@/lib/youtube';
import { Chip } from './ui-bits';

export function ExternalResourceLink({ href, children }: { href: string; children: ReactNode }) {
  const [fallback, setFallback] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const safeURL = normalizeResourceURL(href);
  return (
    <span className="inline-flex min-w-0 max-w-full flex-col items-start gap-1">
      <a
        href={safeURL ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        onClick={(event) => {
          if (!safeURL) {
            event.preventDefault();
            setError('Este link não é válido. Confira o endereço e tente novamente.');
            return;
          }
          if (!isYouTubeCandidate(href) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const result = openYouTubeVideo(href);
          setCopied(false);
          setError(result.ok ? '' : result.error);
          setFallback(result.ok ? result.url : null);
        }}
      >
        {children} <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
      {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
      {fallback && (
        <span role="status" className="mt-1 flex w-full min-w-0 flex-col gap-2 rounded-lg border bg-background p-2 text-xs text-foreground">
          <span>Se o YouTube não abriu:</span>
          <a href={fallback} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            Abrir no YouTube <ExternalLink className="h-3 w-3" />
          </a>
          <input aria-label="Link do YouTube" readOnly value={fallback} onFocus={(e) => e.currentTarget.select()} className="min-w-0 w-full rounded-lg border bg-background p-1.5 text-xs text-foreground" />
          <Chip onClick={() => {
            if (!navigator.clipboard) return;
            void navigator.clipboard.writeText(fallback).then(() => setCopied(true)).catch(() => setCopied(false));
          }}><span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" />{copied ? 'Copiado' : 'Copiar link'}</span></Chip>
        </span>
      )}
    </span>
  );
}