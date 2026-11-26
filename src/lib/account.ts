/**
 * Sign-up rules shared by the screen and the tests (the database checks the same rules again).
 * Only the minimum is asked: nickname, e-mail, password and, for minors, a guardian's e-mail.
 */
export const NICKNAME_RULE = /^[A-Za-z0-9_.-]{3,20}$/;
export const PASSWORD_MIN = 8;

export type SignUpInput = {
  apelido: string;
  email: string;
  senha: string;
  adulto: boolean | null;
  responsavelEmail: string;
  aceitou: boolean;
};

const looksLikeEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

/** First problem with the sign-up form, in plain words, or null when it is fine. */
export function signUpProblem(i: SignUpInput): string | null {
  if (!NICKNAME_RULE.test(i.apelido.trim()))
    return "O apelido precisa ter de 3 a 20 caracteres: letras, números, ponto, traço ou sublinhado, sem espaço.";
  if (!looksLikeEmail(i.email)) return "Confira o seu e-mail.";
  if (i.senha.length < PASSWORD_MIN)
    return `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`;
  if (i.adulto === null) return "Responda se você tem 18 anos ou mais.";
  if (!i.adulto) {
    if (!looksLikeEmail(i.responsavelEmail)) return "Confira o e-mail do seu responsável.";
    if (i.responsavelEmail.trim().toLowerCase() === i.email.trim().toLowerCase())
      return "O e-mail do responsável precisa ser diferente do seu.";
  }
  if (!i.aceitou) return "Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.";
  return null;
}

/** Profile as stored in the account (see supabase/migrations/0001_contas.sql). */
export type Profile = {
  id: string;
  apelido: string;
  avatar: string;
  adulto: boolean;
  responsavel_email: string | null;
  consentimento_em: string | null;
};

/** Progress can go to the server: adult, or a minor with the guardian's authorization. */
export const canSync = (p: Pick<Profile, "adulto" | "consentimento_em"> | null | undefined) =>
  Boolean(p && (p.adulto || p.consentimento_em));

/** Turns Supabase error messages into plain Portuguese. */
export function authErrorText(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "Confirme o seu e-mail pelo link que enviamos antes de entrar.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Já existe uma conta com esse e-mail. Tente entrar ou recuperar a senha.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas em pouco tempo. Espere alguns minutos e tente de novo.";
  if (m.includes("password")) return "A senha não foi aceita. Use pelo menos 8 caracteres.";
  if (m.includes("database error saving new user"))
    return "Não foi possível criar a conta. O apelido pode já estar em uso.";
  return "Algo deu errado. Confira os dados e tente de novo.";
}
