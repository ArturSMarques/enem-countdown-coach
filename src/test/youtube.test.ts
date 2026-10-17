import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeResourceURL, normalizeYouTubeURL, openYouTubeVideo, youtubeLaunchURL } from '@/lib/youtube';
import { ytChannel, ytSearch } from '@/lib/data';

const id = 'dQw4w9WgXcQ';
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('YouTube URL rules', () => {
  it.each([
    [`https://www.youtube.com/watch?v=${id}`, `https://www.youtube.com/watch?v=${id}`],
    [`youtu.be/${id}?t=1m30s`, `https://www.youtube.com/watch?v=${id}&t=90s`],
    [`https://www.youtube.com/embed/${id}?start=45`, `https://www.youtube.com/watch?v=${id}&t=45s`],
    [`https://www.youtube.com/shorts/${id}?t=12`, `https://www.youtube.com/watch?v=${id}&t=12s`],
    [`https://m.youtube.com/watch?v=${id}&t=2h3m4s`, `https://www.youtube.com/watch?v=${id}&t=7384s`],
    [`https://youtu.be/${id}#t=20s`, `https://www.youtube.com/watch?v=${id}&t=20s`],
  ])('normalizes %s and preserves its start time', (input, expected) => {
    expect(normalizeYouTubeURL(input)?.url).toBe(expected);
  });
  it('keeps recommended searches and channel searches instead of inventing videos', () => {
    expect(normalizeYouTubeURL(ytSearch('Ferretto Cinemática ENEM'))?.url).toBe(ytSearch('Ferretto Cinemática ENEM'));
    expect(normalizeYouTubeURL(ytChannel('Professor Ferretto'))?.url).toBe(ytChannel('Professor Ferretto'));
    expect(normalizeYouTubeURL('https://youtube.com/@ferretto')?.url).toBe('https://www.youtube.com/@ferretto');
  });
  it.each(['javascript:alert(1)', 'https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ', 'https://youtube.com/watch?v=', 'https://youtube.com/embed/no', 'https://youtube.com/watch?v=dQw4w9WgXcQ bad', 'https://evil.test/?youtube.com', 'https://youtu.be/'])('rejects invalid or unsafe links: %s', (input) => {
    expect(normalizeYouTubeURL(input)).toBeNull();
  });
  it('validates custom resources without executable schemes', () => {
    expect(normalizeResourceURL('javascript:alert(1)')).toBeNull();
    expect(normalizeResourceURL('https://www.todamateria.com.br/?s=ondas')).toBe('https://www.todamateria.com.br/?s=ondas');
  });
  it('includes an Android HTTPS fallback and preserves the time', () => {
    const url = `https://www.youtube.com/watch?v=${id}&t=30s`;
    expect(youtubeLaunchURL(url, 'android')).toBe(`intent://www.youtube.com/watch?v=${id}&t=30s#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodeURIComponent(url)};end`);
    expect(youtubeLaunchURL(url, 'ios')).toBe(`youtube://watch?v=${id}&t=30s`);
    expect(youtubeLaunchURL(url, 'desktop')).toBe(url);
  });
  it('opens desktop links directly with a protected new tab', () => {
    const clicks: string[][] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { clicks.push([this.href, this.target, this.rel]); });
    expect(openYouTubeVideo(`https://youtu.be/${id}`).ok).toBe(true);
    expect(clicks).toEqual([[`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener noreferrer']]);
  });
  it('attempts iOS and falls back to HTTPS when the page stays visible', () => {
    vi.useFakeTimers();
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    const clicks: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { clicks.push(this.getAttribute('href') ?? ''); });
    openYouTubeVideo(`https://youtu.be/${id}`);
    expect(clicks).toEqual([`youtube://watch?v=${id}`]);
    vi.advanceTimersByTime(1800);
    expect(clicks).toEqual([`youtube://watch?v=${id}`, `https://www.youtube.com/watch?v=${id}`]);
  });
  it('returns a safe manual fallback if browser launching throws', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { throw new Error('blocked'); });
    expect(openYouTubeVideo(`https://youtu.be/${id}`)).toEqual({ ok: true, url: `https://www.youtube.com/watch?v=${id}` });
    expect(openYouTubeVideo('invalid').ok).toBe(false);
  });
});