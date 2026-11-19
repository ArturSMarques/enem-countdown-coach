import { TOPIC_BY_ID, type Area } from "./data";
import type { Stage } from "./planner";
import { LEVELS, type Level } from "./question-types";
import { QUESTION_BY_ID } from "./questions";
import type { QuizAnswer } from "./quiz";

export type LevelStats = Record<Level, { total: number; correct: number }>;

/** Minimum answers in a level before it counts for the stage of an area. */
export const MIN_ANSWERS = 3;

export const STAGE_LABEL: Record<Stage, string> = {
  base: "Revendo a base",
  regular: "Equilibrado",
  avancado: "Pronto para o avançado",
};
export const STAGE_HINT: Record<Stage, string> = {
  base: "Erros nas questões fáceis: o plano traz mais teoria de base e questões fáceis nesta área.",
  regular: "O plano mistura teoria, questões e revisão nesta área.",
  avancado:
    "Bom desempenho nas médias e difíceis: o plano traz mais aprofundamento e questões difíceis.",
};

const empty = (): LevelStats => ({
  facil: { total: 0, correct: 0 },
  media: { total: 0, correct: 0 },
  dificil: { total: 0, correct: 0 },
});

/** Answers and hits per area and level, from the questions the student answered. */
export function levelStats(quiz: Record<string, QuizAnswer>): Partial<Record<Area, LevelStats>> {
  const out: Partial<Record<Area, LevelStats>> = {};
  for (const [id, a] of Object.entries(quiz)) {
    const q = QUESTION_BY_ID[id];
    const area = q && TOPIC_BY_ID[q.topicId]?.area;
    if (!q || !area) continue;
    const s = (out[area] ??= empty())[q.level];
    s.total++;
    if (a.choice === q.answer) s.correct++;
  }
  return out;
}

const rate = (s: LevelStats, l: Level) =>
  s[l].total >= MIN_ANSWERS ? s[l].correct / s[l].total : null;

/**
 * Who misses the easy questions goes back to the base; who masters the medium and hard ones gets
 * more advanced content. Each rule needs at least MIN_ANSWERS answers in the level it reads.
 */
export function stageOf(s: LevelStats): Stage {
  const easy = rate(s, "facil");
  const mid = rate(s, "media");
  const hard = rate(s, "dificil");
  if (easy !== null && easy < 0.6) return "base";
  if (easy === null && mid !== null && mid < 0.4) return "base";
  if (mid !== null && mid >= 0.7 && hard !== null && hard >= 0.5) return "avancado";
  return "regular";
}

export function stagesByArea(quiz: Record<string, QuizAnswer>): Partial<Record<Area, Stage>> {
  const stats = levelStats(quiz);
  const out: Partial<Record<Area, Stage>> = {};
  for (const [area, s] of Object.entries(stats) as [Area, LevelStats][]) out[area] = stageOf(s);
  return out;
}

export { LEVELS };
