import { TOPIC_BY_ID, type Area } from "./data";
import type { LeagueId } from "./league-config";
import { canShowContent } from "./question-types";
import { QUESTION_BY_ID, QUESTIONS } from "./questions";
import { pickQuestions } from "./quiz";

/**
 * Mini-simulados by area, with a timer (section 11). A full ENEM mock (two days, 90 questions
 * each) is not possible with the current bank; it waits for the bank to grow.
 */
export const SIMULADO_CONFIG = {
  sizes: [10, 20] as const,
  /** Close to the ENEM pace: day 2 has 5 hours for 90 questions (about 3 min 20 s each). */
  secondsPerQuestion: 180,
};
/** Areas with multiple-choice questions (Redação is written). */
export const SIMULADO_AREAS: Area[] = ["ling", "hum", "nat", "mat"];

export const timeLimitSeconds = (count: number) => count * SIMULADO_CONFIG.secondsPerQuestion;

/** "29:05" */
export const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * Questions of one area for a mini-simulado: new ones first, mixing levels within the league's
 * ceiling. `seed` varies the set when the student starts another one the same day.
 */
export function pickSimulado(opts: {
  area: Area;
  count: number;
  day: string;
  seed: string;
  answered: ReadonlySet<string>;
  league?: LeagueId;
}): string[] {
  const bank = QUESTIONS.filter(
    (q) => TOPIC_BY_ID[q.topicId]?.area === opts.area && canShowContent(q),
  );
  return pickQuestions({
    day: `${opts.day}:simulado:${opts.area}:${opts.seed}`,
    count: opts.count,
    answered: opts.answered,
    bank,
    ...(opts.league ? { league: opts.league } : {}),
  });
}

export type SimuladoAnswer = { choice: number; ms: number };

export type SimuladoResult = {
  total: number;
  answered: number;
  hits: number;
  /** Hits over the total (blank counts as a miss, as in the exam). */
  rate: number;
  usedSeconds: number;
  byTopic: { topicId: string; total: number; hits: number }[];
};

export function simuladoResult(
  ids: string[],
  answers: Record<string, SimuladoAnswer>,
  usedSeconds: number,
): SimuladoResult {
  const byTopic = new Map<string, { total: number; hits: number }>();
  let hits = 0;
  let answered = 0;
  for (const id of ids) {
    const q = QUESTION_BY_ID[id];
    if (!q) continue;
    const a = answers[id];
    const hit = a !== undefined && a.choice === q.answer;
    if (a !== undefined) answered++;
    if (hit) hits++;
    const t = byTopic.get(q.topicId) ?? { total: 0, hits: 0 };
    t.total++;
    if (hit) t.hits++;
    byTopic.set(q.topicId, t);
  }
  return {
    total: ids.length,
    answered,
    hits,
    rate: ids.length ? hits / ids.length : 0,
    usedSeconds,
    byTopic: [...byTopic]
      .map(([topicId, v]) => ({ topicId, ...v }))
      .sort((a, b) => a.hits / a.total - b.hits / b.total),
  };
}
