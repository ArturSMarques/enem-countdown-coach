import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for accounts (phase 11). It exists only in the browser and only when both public
 * settings are present (VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, set on Render). Without
 * them the app keeps working as before, with everything on the device.
 *
 * "implicit" flow: links in e-mails (confirm account, guardian authorization, new password) work
 * even when opened on another device.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const accountsEnabled = Boolean(url && key);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!accountsEnabled || typeof window === "undefined") return null;
  client ??= createClient(url!, key!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
    },
  });
  return client;
}

/** Where e-mail links bring the person back (this same site). */
export const siteURL = (path: string) =>
  typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
