import type { Level } from "./question-types";

/**
 * XP and league rules (initial values chosen by the team: "moderado"). Everything here can be
 * adjusted; the tests in src/test/league.test.ts show the effect. Leagues work on the device; the
 * shared ranking (phase 12) uses the same points per answer, computed by the server.
 */
export const XP_RULES = {
  /** Every answered question. */
  answer: 2,
  /** Extra for a hit, by question level. */
  hit: { facil: 5, media: 10, dificil: 20 } satisfies Record<Level, number>,
  /** Every study block marked as done. */
  block: 10,
  /** Day n of a streak gives n × streakStep, up to streakMax. */
  streakStep: 5,
  streakMax: 35,
};

export type LeagueId = "fundamentos" | "basico" | "intermediario" | "avancado" | "elite";

export const LEAGUES: { id: LeagueId; name: string; minXp: number; levels: Level[] }[] = [
  // Low league: only easy questions, to build the basics.
  { id: "fundamentos", name: "Fundamentos", minXp: 0, levels: ["facil"] },
  // Middle: easy and medium.
  { id: "basico", name: "Básico", minXp: 400, levels: ["facil", "media"] },
  // From here on, hard questions come in, with the time spent shown after each answer.
  {
    id: "intermediario",
    name: "Intermediário",
    minXp: 1500,
    levels: ["facil", "media", "dificil"],
  },
  // High leagues: released real exam questions come first.
  { id: "avancado", name: "Avançado", minXp: 4000, levels: ["facil", "media", "dificil"] },
  { id: "elite", name: "Elite", minXp: 8000, levels: ["facil", "media", "dificil"] },
];

/** Going down is gentle: one league after this many days without studying, back when you return. */
export const INACTIVITY_DAYS = 21;

/** Leagues from which the time spent on each question is shown (informative, never a penalty). */
export const SHOW_TIME_FROM: LeagueId = "intermediario";
/** Leagues from which released real exam questions get priority in the daily set. */
export const REAL_FIRST_FROM: LeagueId = "avancado";

/** What each league means for the student's questions, in one sentence. */
export const LEAGUE_HINT: Record<LeagueId, string> = {
  fundamentos: "Questões fáceis, para firmar a base.",
  basico: "Questões fáceis e médias.",
  intermediario: "Entram as difíceis, e o app mostra quanto tempo você levou em cada questão.",
  avancado: "Todas as dificuldades; questões reais liberadas aparecem primeiro.",
  elite: "Todas as dificuldades, com prioridade para questões reais liberadas.",
};
