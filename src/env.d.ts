/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (public). Set on Render; without it, accounts stay off. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable/anon key (public by design). Never put the secret key here. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}
