import { TOPIC_BY_ID, type Priority } from "./data";
import type { PerfEntry } from "./planner";
import { QUESTIONS, questionSubject, type Question } from "./questions";

export const DAILY_COUNT = 5;
export const EXTRA_COUNT = 5;

export type QuizAnswer = { choice: number; day: string };

/** Deterministic PRNG (mulberry32) seeded from a string, so a given day always sorts the same way. */
export function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PRI: Record<Priority, number> = { alta: 1, media: 0.5, baixa: 0 };

/**
 * Chooses which questions to show on a day. Unanswered questions come first (a new question is
 * never repeated while there are fresh ones). Among them, topics in the day's study plan and
 * weak subjects weigh more; a seeded jitter varies the rest from day to day. No more than two
 * questions share a topic. When the bank is exhausted, answered questions are reused.
 */
export function pickQuestions(opts: {
  day: string;
  count: number;
  answered: ReadonlySet<string>;
  exclude?: ReadonlySet<string>;
  planTopics?: ReadonlySet<string>;
  weakSubjects?: ReadonlySet<string>;
  bank?: Question[];
}): string[] {
  const { day, count, answered, exclude = new Set(), planTopics = new Set(), weakSubjects = new Set() } = opts;
  const rand = seededRandom(`${day}:${exclude.size}`);
  const pool = (opts.bank ?? QUESTIONS).filter((x) => !exclude.has(x.id));
  const score = (x: Question) =>
    (planTopics.has(x.topicId) ? 3 : 0) +
    (weakSubjects.has(questionSubject(x)) ? 2 : 0) +
    PRI[TOPIC_BY_ID[x.topicId]?.priority ?? "baixa"] +
    rand() * 2;
  const ranked = (list: Question[]) =>
    list.map((x) => ({ x, s: score(x) })).sort((a, b) => b.s - a.s).map((r) => r.x);
  const ordered = [...ranked(pool.filter((x) => !answered.has(x.id))), ...ranked(pool.filter((x) => answered.has(x.id)))];

  const perTopic: Record<string, number> = {};
  const picked: string[] = [];
  for (const x of ordered) {
    if (picked.length >= count) break;
    if ((perTopic[x.topicId] ?? 0) >= 2) continue;
    perTopic[x.topicId] = (perTopic[x.topicId] ?? 0) + 1;
    picked.push(x.id);
  }
  for (const x of ordered) {
    if (picked.length >= count) break;
    if (!picked.includes(x.id)) picked.push(x.id);
  }
  return picked;
}

/** Stable per-question alternative order, so the right answer is not always in the same slot. */
export function optionOrder(question: Question): number[] {
  const rand = seededRandom(question.id);
  const order = question.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

/** Adds one answered question to the day's "questões do dia" line in the performance history. */
export function withQuizResult(perf: PerfEntry[], subject: string, correct: boolean, day: string, id: string): PerfEntry[] {
  const i = perf.findIndex((p) => p.source === "quiz" && p.date === day && p.subject === subject);
  if (i < 0) return [...perf, { id, date: day, subject, total: 1, correct: correct ? 1 : 0, source: "quiz" }];
  return perf.map((p, j) => (j === i ? { ...p, total: p.total + 1, correct: p.correct + (correct ? 1 : 0) } : p));
}
