/**
 * Data for the "Termos de Uso" and "Política de Privacidade" pages. When the text changes in a way
 * that matters to the student, bump TERMS_VERSION: students who accepted an older version see the
 * notice again. Contact and consent for minors are pending (docs/privacidade-pendencias.md).
 */
export const TERMS_VERSION = "4";
export const TERMS_UPDATED = "2026-11-28";
export const RESPONSIBLE = "Equipe do TCC Reta Enem";
export const CONTACT = "fale com a equipe do projeto pela escola";
export const DISCLAIMER =
  "O Reta Enem é um apoio aos estudos e não garante nota nem aprovação no ENEM ou em qualquer vestibular.";

export type TermsAcceptance = { version: string; day: string };

/** Whether the saved acceptance is for the current version of the terms. */
export const acceptedCurrentTerms = (t: TermsAcceptance | null | undefined) =>
  t?.version === TERMS_VERSION;

/** Everything saved on this device, as a readable JSON file (LGPD: the student can see the data). */
export const exportFileName = (day: string) => `reta-enem-meus-dados-${day}.json`;
export const exportJSON = (state: unknown) => JSON.stringify(state, null, 2);
