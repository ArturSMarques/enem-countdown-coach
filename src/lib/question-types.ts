export type Level = "facil" | "media" | "dificil";
export const LEVELS: Level[] = ["facil", "media", "dificil"];
export const LEVEL_LABEL: Record<Level, string> = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil",
};
export const LEVEL_PLURAL: Record<Level, string> = {
  facil: "fáceis",
  media: "médias",
  dificil: "difíceis",
};

/** Imagem vetorial (SVG embutido) com texto alternativo para quem não enxerga a figura. */
export type Figure = { src: string; alt: string; caption?: string };
/** Texto-base de apoio (Texto I, Texto II...). */
export type Passage = { label?: string; body: string; source?: string };
export type DataTable = { caption?: string; head: string[]; rows: string[][]; note?: string };

/** Exam boards whose real questions may enter the bank (with source and license checked). */
export type Banca = "Enem" | "ITA" | "Fuvest";

/** Where a real exam question comes from. Required for every real question. */
export type QuestionSource = {
  banca: Banca;
  ano: number;
  /** Dia (Enem: "1º dia") ou fase (ITA, Fuvest: "1ª fase"). */
  etapa: string;
  /** Número original da questão na prova. */
  numero: number;
  /** Link oficial da prova (site da banca). */
  url: string;
};

/**
 * Use allowed for a question. Authored questions (no `source`) are always shown. A real question is
 * shown in full only when "liberada" (the team checked the institution's terms of use, including
 * third-party texts and images); "em-verificacao" and "somente-link" show only the reference and
 * the official link.
 */
export type Uso = "liberada" | "em-verificacao" | "somente-link";

export type Question = {
  id: string;
  topicId: string;
  level: Level;
  /** Comando da questão (a pergunta). */
  text: string;
  options: string[];
  /** Índice da alternativa correta em `options`. */
  answer: number;
  why: string;
  /**
   * Explicação de cada alternativa, na mesma ordem de `options`: por que a certa está certa e
   * que erro de raciocínio leva a cada uma das erradas.
   */
  porQue?: string[];
  /** Material de apoio, mostrado antes do comando: textos, figura e tabela. */
  passages?: Passage[];
  figure?: Figure;
  table?: DataTable;
  /** Origin of a real exam question. Authored questions (all of the current bank) have none. */
  source?: QuestionSource;
  /** Use allowed for a real question (see Uso). */
  uso?: Uso;
  /**
   * Questions written for the bank start as `false` in questions-novas.ts and only enter QUESTIONS
   * after review (students check, the teacher approves). Absent = reviewed (the original bank).
   */
  revisada?: boolean;
};

/** Credit line of a real question, e.g. "Enem 2023, 1º dia, questão 45". */
export const sourceLabel = (s: QuestionSource) =>
  `${s.banca} ${s.ano}, ${s.etapa}, questão ${s.numero}`;

/** Whether the app may show the full statement of a question. */
export const canShowContent = (q: Pick<Question, "source" | "uso">) =>
  !q.source || q.uso === "liberada";
