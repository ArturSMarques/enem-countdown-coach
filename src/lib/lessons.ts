import { normalizeYouTubeURL } from "./youtube";

/**
 * Aulas específicas escolhidas pelo professor, por tópico e por nível (seção 10.2). Elas se somam
 * aos links de busca e de canal, que continuam.
 *
 * REGRA DE OURO: nunca invente um ID de vídeo. Um ID só entra aqui quando vier de uma busca real na
 * YouTube Data API (`bun run aulas:candidatas`, docs/aulas-candidatas.md) ou de um link colado pelo
 * professor. Título e canal são os do próprio YouTube (crédito obrigatório). A escolha final é do
 * professor; confira de tempos em tempos com `bun run check:lessons`.
 *
 * Como acrescentar: copie o modelo abaixo no fim de LESSONS e preencha.
 *   {
 *     topicId: "mat-porc",
 *     nivel: "base",
 *     videoId: "<11 caracteres do link youtube.com/watch?v=...>",
 *     titulo: "<título exatamente como no YouTube>",
 *     canal: "<nome do canal>",
 *     duracao: "<ex.: 18 min>",
 *     selecionadaPor: "<como deve aparecer no site, com o título: Prof. Nome ou Profa. Nome>",
 *     selecionadaEm: "<aaaa-mm-dd>",
 *     recomendada: true, // no máximo uma por tópico
 *   },
 */
export type LessonLevel = "base" | "intermediario" | "aprofundamento" | "resolucao";

export const LESSON_LEVELS: LessonLevel[] = [
  "base",
  "intermediario",
  "aprofundamento",
  "resolucao",
];
export const LESSON_LEVEL_LABEL: Record<LessonLevel, string> = {
  base: "Base",
  intermediario: "Intermediário",
  aprofundamento: "Aprofundamento",
  resolucao: "Resolução de questões",
};

export type Lesson = {
  topicId: string;
  nivel: LessonLevel;
  /** ID do vídeo (11 caracteres), vindo da API do YouTube ou de um link colado pelo professor. */
  videoId: string;
  titulo: string;
  canal: string;
  /** Duração como texto curto, ex.: "18 min". */
  duracao?: string;
  /** Quem escolheu a aula, como deve aparecer no site, com o título (ex.: "Prof. Alexandre"). */
  selecionadaPor: string;
  /** Data da escolha, aaaa-mm-dd. */
  selecionadaEm: string;
  /** A aula recomendada do tópico (no máximo uma por tópico). */
  recomendada?: boolean;
};

export const LESSONS: Lesson[] = [];

/** Meta: 2 a 4 aulas por tópico. */
export const LESSONS_PER_TOPIC = { min: 2, max: 4 };

export const lessonURL = (l: Pick<Lesson, "videoId">) =>
  `https://www.youtube.com/watch?v=${l.videoId}`;

/** A video id as YouTube issues them: 11 characters of letters, digits, "-" and "_". */
export const isVideoId = (id: string) =>
  /^[A-Za-z0-9_-]{11}$/.test(id) && normalizeYouTubeURL(lessonURL({ videoId: id }))?.videoId === id;

/** Lessons of a topic, recommended first, then by level. */
export function lessonsOf(topicId: string, list: Lesson[] = LESSONS): Lesson[] {
  return list
    .filter((l) => l.topicId === topicId)
    .sort(
      (a, b) =>
        Number(Boolean(b.recomendada)) - Number(Boolean(a.recomendada)) ||
        LESSON_LEVELS.indexOf(a.nivel) - LESSON_LEVELS.indexOf(b.nivel),
    );
}

/** The lesson to suggest for a topic: the recommended one, otherwise the first "base" lesson. */
export function suggestedLesson(topicId: string, list: Lesson[] = LESSONS): Lesson | undefined {
  const all = lessonsOf(topicId, list);
  return all.find((l) => l.recomendada) ?? all.find((l) => l.nivel === "base") ?? all[0];
}

/**
 * Credit line, e.g. "Selecionada por Prof. Alexandre" (never "a melhor aula"). The name is written
 * as the teacher wants it shown, with the title, so the app never guesses professor/professora.
 */
export const curatedBy = (l: Pick<Lesson, "selecionadaPor">) =>
  `Selecionada por ${l.selecionadaPor}`;
