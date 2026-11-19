import { CONTENT_HUM } from "./hum";
import { CONTENT_LING } from "./ling";
import { CONTENT_MAT } from "./mat";
import { CONTENT_NAT } from "./nat";
import { CONTENT_RED } from "./red";
import type { TopicContent } from "./types";

export type { Exercise, Layer, TopicContent, Trap, WorkedExample } from "./types";

/** Aprofundamento por tópico (um arquivo por área em src/lib/content). */
export const CONTENT: Record<string, TopicContent> = Object.fromEntries(
  [...CONTENT_MAT, ...CONTENT_NAT, ...CONTENT_HUM, ...CONTENT_LING, ...CONTENT_RED].map((c) => [
    c.topicId,
    c,
  ]),
);

export const LAYER_LABEL = {
  base: "Base",
  intermediario: "Intermediário",
  avancado: "Avançado",
} as const;
export const LAYER_HINT = {
  base: "O conceito e o porquê. Suficiente para as questões fáceis.",
  intermediario: "Aplicações, fórmulas e exemplos resolvidos no estilo ENEM.",
  avancado: "O nível das questões difíceis: várias etapas, casos limite e conexões.",
} as const;
