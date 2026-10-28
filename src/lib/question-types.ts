export type Level = "facil" | "media" | "dificil";
export const LEVELS: Level[] = ["facil", "media", "dificil"];
export const LEVEL_LABEL: Record<Level, string> = { facil: "Fácil", media: "Média", dificil: "Difícil" };
export const LEVEL_PLURAL: Record<Level, string> = { facil: "fáceis", media: "médias", dificil: "difíceis" };

/** Imagem vetorial (SVG embutido) com texto alternativo para quem não enxerga a figura. */
export type Figure = { src: string; alt: string; caption?: string };
/** Texto-base de apoio (Texto I, Texto II...). */
export type Passage = { label?: string; body: string; source?: string };
export type DataTable = { caption?: string; head: string[]; rows: string[][]; note?: string };

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
  /** Material de apoio, mostrado antes do comando: textos, figura e tabela. */
  passages?: Passage[];
  figure?: Figure;
  table?: DataTable;
};
