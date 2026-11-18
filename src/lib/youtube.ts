/** Browser-safe parsing: importing this module during SSR does not launch links. */
export type YouTubeLink = { url: string; videoId?: string; startSeconds?: number | undefined };

export const isYouTubeCandidate = (value: string) => /(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(value);

function parseURL(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function seconds(value: string | null): number | undefined {
  if (value === null) return undefined;
  if (/^\d+$/.test(value)) {
    const n = Number(value);
    return Number.isSafeInteger(n) ? n : undefined;
  }
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);
  if (!match || !value) return undefined;
  const n = Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return Number.isSafeInteger(n) ? n : undefined;
}

export function normalizeYouTubeURL(value: string): YouTubeLink | null {
  const parsed = parseURL(value);
  if (!parsed || parsed.port) return null;
  const host = parsed.hostname.toLowerCase();
  if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) return null;
  const parts = parsed.pathname.split('/').filter(Boolean);
  let videoId: string | undefined;
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    if (parts.length !== 1) return null;
    videoId = parts[0];
  } else if (parsed.pathname === '/watch') {
    videoId = parsed.searchParams.get('v') ?? undefined;
    if (!videoId) return null;
  } else if (['embed', 'shorts', 'live', 'v'].includes(parts[0] ?? '')) {
    if (parts.length !== 2) return null;
    videoId = parts[1];
  } else {
    // Recommendations remain searches/channels; never invent a video ID.
    const channel = parts.length >= 1 && (parts[0]?.startsWith('@') || ['channel', 'c', 'user'].includes(parts[0] ?? '') && Boolean(parts[1]));
    const search = parsed.pathname === '/results' && Boolean(parsed.searchParams.get('search_query')?.trim());
    const playlist = parsed.pathname === '/playlist' && Boolean(parsed.searchParams.get('list')?.trim());
    if (!channel && !search && !playlist) return null;
    parsed.protocol = 'https:';
    parsed.hostname = 'www.youtube.com';
    parsed.hash = '';
    return { url: parsed.href };
  }
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;
  const hashParams = new URLSearchParams(parsed.hash.slice(1));
  const startSeconds = seconds(parsed.searchParams.get('t')) ?? seconds(parsed.searchParams.get('start')) ?? seconds(hashParams.get('t'));
  const normalized = new URL('https://www.youtube.com/watch');
  normalized.searchParams.set('v', videoId);
  if (startSeconds !== undefined) normalized.searchParams.set('t', `${startSeconds}s`);
  return { url: normalized.href, videoId, startSeconds };
}

/** Validates custom resources too, without accepting executable URL schemes. */
export function normalizeResourceURL(value: string): string | null {
  if (isYouTubeCandidate(value)) return normalizeYouTubeURL(value)?.url ?? null;
  return parseURL(value)?.href ?? null;
}
