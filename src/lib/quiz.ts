import { TOPIC_BY_ID, type Priority } from "./data";
import type { PerfEntry } from "./planner";
import type { Level } from "./question-types";
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

export type LevelChoice = Level | "mix";

/**
 * Chooses which questions to show. Questions never answered always come first, so a question is
 * not repeated while there are fresh ones. Topics in the day's study plan and weak subjects weigh
 * more, and a seeded jitter varies the rest from day to day. No more than two questions share a
 * topic. With level "mix" (the daily set) the choice is weighted toward harder questions: 40%
 * difícil, 40% média and 20% fácil, as in the real exam. With a specific level only that level is
 * returned (possibly fewer than `count`). Once the whole bank was answered, "mix" reuses old ones.
 */
export function pickQuestions(opts: {
  day: string;
  count: number;
  answered: ReadonlySet<string>;
  level?: LevelChoice;
  exclude?: ReadonlySet<string>;
  planTopics?: ReadonlySet<string>;
  weakSubjects?: ReadonlySet<string>;
  bank?: Question[];
}): string[] {
  const { day, count, answered, level = "mix", exclude = new Set(), planTopics = new Set(), weakSubjects = new Set() } = opts;
  const rand = seededRandom(`${day}:${exclude.size}:${level}`);
  const pool = (opts.bank ?? QUESTIONS).filter((x) => !exclude.has(x.id));
  const score = (x: Question) =>
    (planTopics.has(x.topicId) ? 3 : 0) +
    (weakSubjects.has(questionSubject(x)) ? 2 : 0) +
    PRI[TOPIC_BY_ID[x.topicId]?.priority ?? "baixa"] +
    rand() * 2;
  const ranked = (list: Question[]) =>
    list.map((x) => ({ x, s: score(x) })).sort((a, b) => b.s - a.s).map((r) => r.x);
  const fresh = pool.filter((x) => !answered.has(x.id));
  const old = pool.filter((x) => answered.has(x.id));

  const perTopic: Record<string, number> = {};
  const picked: string[] = [];
  const take = (list: Question[], n: number, cap = 2) => {
    for (const x of list) {
      if (n <= 0) break;
      if (picked.includes(x.id) || (perTopic[x.topicId] ?? 0) >= cap) continue;
      perTopic[x.topicId] = (perTopic[x.topicId] ?? 0) + 1;
      picked.push(x.id);
      n--;
    }
  };

  if (level !== "mix") {
    take(ranked(fresh.filter((x) => x.level === level)), count);
    take(ranked(fresh.filter((x) => x.level === level)), count - picked.length, Infinity);
    return picked;
  }
  const hard = Math.round(count * 0.4);
  const mid = Math.round(count * 0.4);
  take(ranked(fresh.filter((x) => x.level === "dificil")), hard);
  take(ranked(fresh.filter((x) => x.level === "media")), mid);
  take(ranked(fresh.filter((x) => x.level === "facil")), count - hard - mid);
  take(ranked(fresh), count - picked.length);
  take(ranked(old), count - picked.length);
  take(ranked([...fresh, ...old]), count - picked.length, Infinity);
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
