import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { authErrorText, canSync, type Profile } from "./account";
import { TERMS_VERSION } from "./legal";
import { mergeStates } from "./merge-state";
import { todayISO } from "./planner";
import { currentState, migrate, onStateChange, replaceState, type State } from "./store";
import { accountsEnabled, siteURL, supabase } from "./supabase";

/**
 * Account state in the browser: session, profile and saving the progress to the account.
 * "student": a student account (has a profile). "guardian": someone who came through the guardian
 * link (no profile). Saving runs only for adults or authorized minors (also enforced by the
 * database rules in supabase/migrations/0001_contas.sql).
 */
export type AccountStatus = "off" | "loading" | "signed-out" | "student" | "guardian";
export type SyncStatus = "idle" | "saving" | "saved" | "blocked" | "error";
export type AccountState = {
  status: AccountStatus;
  session: Session | null;
  profile: Profile | null;
  sync: SyncStatus;
  lastSync: number | null;
};

const INITIAL: AccountState = {
  status: accountsEnabled ? "loading" : "off",
  session: null,
  profile: null,
  sync: "idle",
  lastSync: null,
};
const SERVER: AccountState = { ...INITIAL, status: "off" };
let acc = INITIAL;
const listeners = new Set<() => void>();
const set = (patch: Partial<AccountState>) => {
  acc = { ...acc, ...patch };
  listeners.forEach((l) => l());
};

export function useAccount(): AccountState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => acc,
    () => SERVER,
  );
}

const PROFILE_FIELDS = "id, apelido, avatar, adulto, responsavel_email, consentimento_em";
const SAVE_DELAY_MS = 4000;
let started = false;
let stopSaving: (() => void) | null = null;
let applying = false;

/** Starts listening to the login state (called once, in the root of the app). */
export function startAccount() {
  const sb = supabase();
  if (!sb || started) return;
  started = true;
  void sb.auth.getSession().then(({ data }) => handleSession(sb, data.session));
  // Supabase recommends not awaiting its own calls inside this callback.
  sb.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => void handleSession(sb, session), 0);
  });
}

async function handleSession(sb: SupabaseClient, session: Session | null) {
  if (!session) {
    stopSaving?.();
    stopSaving = null;
    set({ status: "signed-out", session: null, profile: null, sync: "idle" });
    return;
  }
  set({ session });
  const { data } = await sb
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", session.user.id)
    .maybeSingle();
  if (!data) {
    set({ status: "guardian", profile: null, sync: "idle" });
    return;
  }
  set({ status: "student", profile: data as Profile });
  await syncNow();
}

/** Joins this device's progress with the account's and saves the result in both places. */
export async function syncNow(): Promise<void> {
  const sb = supabase();
  const { session, profile } = acc;
  if (!sb || !session || !profile) return;
  if (!canSync(profile)) {
    set({ sync: "blocked" });
    return;
  }
  set({ sync: "saving" });
  const { data, error } = await sb
    .from("progress")
    .select("state")
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (error) {
    set({ sync: "error" });
    return;
  }
  let merged: State = currentState();
  if (data?.state) merged = mergeStates(merged, migrate(data.state, todayISO()));
  applying = true;
  replaceState(merged);
  applying = false;
  await upload(merged);
  if (!stopSaving) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = onStateChange(() => {
      if (applying) return;
      clearTimeout(timer);
      timer = setTimeout(() => void upload(currentState()), SAVE_DELAY_MS);
    });
    stopSaving = () => {
      clearTimeout(timer);
      stop();
    };
  }
}

async function upload(state: State) {
  const sb = supabase();
  const { session, profile } = acc;
  if (!sb || !session || !canSync(profile)) return;
  set({ sync: "saving" });
  const { error } = await sb.from("progress").upsert({
    user_id: session.user.id,
    state,
    atualizado_em: new Date().toISOString(),
  });
  set(error ? { sync: "error" } : { sync: "saved", lastSync: Date.now() });
}

export async function refreshProfile() {
  const sb = supabase();
  if (!sb || !acc.session) return;
  const { data } = await sb
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", acc.session.user.id)
    .maybeSingle();
  if (data) set({ profile: data as Profile });
}

// ---------- actions used by the screens (each returns an error text or null) ----------

type Result = string | null;
const off = "As contas ainda não estão ativadas neste site.";

export async function signUp(input: {
  apelido: string;
  email: string;
  senha: string;
  adulto: boolean;
  responsavelEmail: string;
  avatar: string;
}): Promise<{ error: Result; needsConfirmation: boolean }> {
  const sb = supabase();
  if (!sb) return { error: off, needsConfirmation: false };
  const { data: free } = await sb.rpc("apelido_disponivel", { p_apelido: input.apelido.trim() });
  if (free === false)
    return { error: "Esse apelido já está em uso. Escolha outro.", needsConfirmation: false };
  const { data, error } = await sb.auth.signUp({
    email: input.email.trim(),
    password: input.senha,
    options: {
      emailRedirectTo: siteURL("/perfil"),
      data: {
        apelido: input.apelido.trim(),
        avatar: input.avatar,
        adulto: input.adulto,
        responsavel_email: input.adulto ? null : input.responsavelEmail.trim(),
        termos_versao: TERMS_VERSION,
      },
    },
  });
  if (error) return { error: authErrorText(error.message), needsConfirmation: false };
  if (!input.adulto) await sendGuardianLink(input.responsavelEmail.trim());
  return { error: null, needsConfirmation: !data.session };
}

/** E-mails the guardian a sign-in link that opens the authorization page. */
export async function sendGuardianLink(email: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: siteURL("/responsavel"), shouldCreateUser: true },
  });
  return error ? authErrorText(error.message) : null;
}

export async function signIn(email: string, senha: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: senha });
  return error ? authErrorText(error.message) : null;
}

export async function signOut() {
  stopSaving?.();
  stopSaving = null;
  await supabase()?.auth.signOut();
}

export async function sendPasswordReset(email: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: siteURL("/nova-senha"),
  });
  return error ? authErrorText(error.message) : null;
}

export async function updatePassword(senha: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.auth.updateUser({ password: senha });
  return error ? authErrorText(error.message) : null;
}

export async function changeEmail(email: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.auth.updateUser(
    { email: email.trim() },
    { emailRedirectTo: siteURL("/perfil") },
  );
  return error ? authErrorText(error.message) : null;
}

export async function updateProfile(patch: { apelido?: string; avatar?: string }): Promise<Result> {
  const sb = supabase();
  if (!sb || !acc.session) return off;
  const { error } = await sb.from("profiles").update(patch).eq("id", acc.session.user.id);
  if (error)
    return error.code === "23505"
      ? "Esse apelido já está em uso. Escolha outro."
      : "Não foi possível salvar. Confira e tente de novo.";
  await refreshProfile();
  return null;
}

export async function changeGuardian(email: string): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.rpc("trocar_responsavel", { p_email: email.trim() });
  if (error) return error.message.includes("diferente") ? error.message : "E-mail inválido.";
  await refreshProfile();
  return sendGuardianLink(email.trim());
}

/** Deletes the account and everything saved in it on the server. */
export async function deleteAccount(): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { error } = await sb.rpc("excluir_minha_conta");
  if (error) return "Não foi possível excluir a conta agora. Tente de novo mais tarde.";
  await signOut();
  return null;
}

// ---------- guardian ----------

export type PendingStudent = {
  id: string;
  apelido: string;
  criado_em: string;
  autorizado: boolean;
};

export async function guardianStudents(): Promise<PendingStudent[]> {
  const sb = supabase();
  if (!sb) return [];
  const { data } = await sb.rpc("consentimentos_pendentes");
  return (data as PendingStudent[] | null) ?? [];
}

export async function setAuthorization(aluno: string, autorizar: boolean): Promise<Result> {
  const sb = supabase();
  if (!sb) return off;
  const { data, error } = await sb.rpc(autorizar ? "autorizar_aluno" : "revogar_autorizacao", {
    p_aluno: aluno,
  });
  return error || data === false ? "Não foi possível registrar. Tente de novo." : null;
}
