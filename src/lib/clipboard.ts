/**
 * Copies text to the clipboard. Tries the async Clipboard API first and falls back to a
 * hidden textarea with document.execCommand("copy") (older Android browsers and pages
 * inside iframes often block the async API). Resolves to false when neither works, so the
 * caller can show the text for the student to copy by hand.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or not available here: try the fallback below.
  }
  if (typeof document === "undefined") return false;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  try {
    area.select();
    return typeof document.execCommand === "function" && document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
}

/** True when the app runs inside another page (an iframe), where YouTube refuses to load. */
export function isFramed(
  win: Window | undefined = typeof window === "undefined" ? undefined : window,
) {
  if (!win) return false;
  try {
    return win.self !== win.top;
  } catch {
    // Reading window.top across origins can throw; that itself means we are framed.
    return true;
  }
}
