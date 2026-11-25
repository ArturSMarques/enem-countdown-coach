import { INEP_PROVAS } from "./data";
import type { Banca, Question } from "./question-types";

/**
 * Exam boards and their official links, shown on the "Créditos e fontes" page and used to check
 * the link of every real question. A board only gets a link after it is confirmed on its official
 * site; until then it has none, and the bank test refuses real questions from it.
 */
export const BANCAS: Record<
  Banca,
  { nome: string; site?: string; hosts: string[]; pendente?: string }
> = {
  Enem: {
    nome: "Enem — Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep)",
    site: INEP_PROVAS,
    hosts: ["www.gov.br", "download.inep.gov.br"],
  },
  ITA: {
    nome: "Vestibular do Instituto Tecnológico de Aeronáutica (ITA)",
    hosts: [],
    pendente: "Link oficial a confirmar antes da primeira questão do ITA entrar no banco.",
  },
  Fuvest: {
    nome: "Fuvest (vestibular da USP)",
    hosts: [],
    pendente: "Link oficial a confirmar antes da primeira questão da Fuvest entrar no banco.",
  },
};

/** The link of a real question points to an official host of its board. */
export function hasOfficialLink(q: Pick<Question, "source">) {
  if (!q.source) return false;
  try {
    const url = new URL(q.source.url);
    return url.protocol === "https:" && BANCAS[q.source.banca].hosts.includes(url.host);
  } catch {
    return false;
  }
}
