import { ExternalLink } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { normalizeResourceURL } from '@/lib/youtube';

/**
 * Plain https link in a new tab. The browser (and, on phones, the OS) decides whether the
 * YouTube app takes over, so the click always lands on the lesson. Custom schemes such as
 * intent:// or youtube:// are deliberately not used: they leave a blank tab or do nothing.
 */
export function ExternalResourceLink({ href, children }: { href: string; children: ReactNode }) {
  const [error, setError] = useState('');
  const safeURL = normalizeResourceURL(href);
  return (
    <span className="inline-flex min-w-0 max-w-full flex-col items-start gap-1">
      <a
        href={safeURL ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        onClick={(event) => {
          if (safeURL) return;
          event.preventDefault();
          setError('Este link não é válido. Confira o endereço e tente novamente.');
        }}
      >
        {children} <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
      {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
