import type { Level } from "./question-types";

/**
 * Rules that turn the student's answers into a mastery level for each topic. The site evaluates;
 * the student does not mark mastery by hand. These are the initial values chosen by the team
 * (option "mais rígido"); adjust here and the tests in src/test/topic-mastery.test.ts show the
 * effect. Only answers to the app's own questions count (the "Registrar questões" form is
 * self-reported and does not).
 */
export const MASTERY_CONFIG = {
  /** Only answers from the last N days count, so mastery fades without practice. */
  recentDays: 30,
  /** Weight of each answer by question level, for the weighted hit rate. */
  levelWeight: { facil: 1, media: 2, dificil: 3 } satisfies Record<Level, number>,
  /** A topic needs at least this many questions in the bank to reach "Dominado". */
  minBankForMastered: 8,
  /** "Erro grave": a miss on a question of these levels. */
  seriousMissLevels: ["facil", "media"] as Level[],
  basico: { answers: 1 },
  desenvolvendo: { answers: 3, rate: 0.5 },
  avancado: { answers: 5, rate: 0.75, mediumHits: 1 },
  dominado: { answers: 8, rate: 0.9, hardHits: 1, lastWithoutSeriousMiss: 3 },
} as const;
