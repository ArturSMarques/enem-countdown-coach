import { useEffect, useState, useSyncExternalStore } from "react";
import type { Area } from "./data";
import {
  addDays,
  buildPlan,
  redistribute,
  todayISO,
  weakSubjects,
  type Block,
  type Config,
  type PerfEntry,
  type TopicStatus,
} from "./planner";
import { DAILY_COUNT, EXTRA_COUNT, pickQuestions, withQuizResult, type QuizAnswer } from "./quiz";
import { QUESTION_BY_ID, questionSubject } from "./questions";

export type CustomLink = { id: string; title: string; url: string; area: Area };
export type State = {
  config: Config | null;
  plan: Record<string, Block[]>;
  status: Record<string, TopicStatus>;
  perf: PerfEntry[];
  links: CustomLink[];
  checklist: Record<string, boolean>;
  studied: string[];
  skipped: string[];
  theme: "light" | "dark" | null;
  /** Answers given in the questions section, by question id. */
  quiz: Record<string, QuizAnswer>;
  /** Question ids shown on each day (saved so the day's set does not change after answering). */
  quizDaily: Record<string, string[]>;
};

const KEY = "reta-final-enem-v1";
const EMPTY: State = { config: null, plan: {}, status: {}, perf: [], links: [], checklist: {}, studied: [], skipped: [], theme: null, quiz: {}, quizDaily: {} };

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAppState() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    load();
    setReady(true);
  }, []);
  const s = useSyncExternalStore(subscribe, () => (load(), state), () => EMPTY);
  return { state: ready ? s : EMPTY, ready };
}

// ---------- actions ----------
function doneCounts(plan: Record<string, Block[]>, before: string) {
  const c: Record<string, number> = {};
  for (const [day, blocks] of Object.entries(plan))
    if (day < before) for (const b of blocks) c[b.topicId] = (c[b.topicId] ?? 0) + 1;
  return c;
}

/** Rebuilds the plan from today on (keeps the past; keeps today if something was already done). */
export function regenerate(s: State, cfg = s.config): State {
  if (!cfg) return s;
  const today = todayISO();
  const keepToday = (s.plan[today] ?? []).some((b) => b.done);
  const from = keepToday ? addDays(today, 1) : today;
  const past = Object.fromEntries(Object.entries(s.plan).filter(([d]) => d < from));
  const fresh = buildPlan({ cfg, status: s.status, perf: s.perf, from, counts: doneCounts(s.plan, from) });
  return { ...s, config: cfg, plan: { ...past, ...fresh } };
}

export const saveConfig = (cfg: Config) => setState((s) => regenerate(s, cfg));
export const recalc = () => setState((s) => regenerate(s));

export function toggleBlock(day: string, id: string) {
  setState((s) => {
    const blocks = (s.plan[day] ?? []).map((b) => (b.id === id ? { ...b, done: !b.done } : b));
    const any = blocks.some((b) => b.done);
    const studied = any ? Array.from(new Set([...s.studied, day])) : s.studied.filter((d) => d !== day);
    return { ...s, plan: { ...s.plan, [day]: blocks }, studied };
  });
}

export function skipToday() {
  const today = todayISO();
  setState((s) => {
    if (!s.config) return s;
    return { ...s, plan: redistribute(s.plan, today, s.config.examDate), skipped: Array.from(new Set([...s.skipped, today])) };
  });
}

export function moveBlock(fromDay: string, id: string, toDay: string) {
  if (fromDay === toDay) return;
  setState((s) => {
    const b = (s.plan[fromDay] ?? []).find((x) => x.id === id);
    if (!b) return s;
    return {
      ...s,
      plan: {
        ...s.plan,
        [fromDay]: (s.plan[fromDay] ?? []).filter((x) => x.id !== id),
        [toDay]: [...(s.plan[toDay] ?? []), b],
      },
    };
  });
}

export const setTopicStatus = (id: string, st: TopicStatus) => setState((s) => ({ ...s, status: { ...s.status, [id]: st } }));
export const addPerf = (p: Omit<PerfEntry, "id" | "date">) =>
  setState((s) => ({ ...s, perf: [...s.perf, { ...p, id: crypto.randomUUID(), date: todayISO() }] }));
export const removePerf = (id: string) => setState((s) => ({ ...s, perf: s.perf.filter((p) => p.id !== id) }));
export const addLink = (l: Omit<CustomLink, "id">) => setState((s) => ({ ...s, links: [...s.links, { ...l, id: crypto.randomUUID() }] }));
export const removeLink = (id: string) => setState((s) => ({ ...s, links: s.links.filter((l) => l.id !== id) }));
export const toggleCheck = (id: string) => setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: !s.checklist[id] } }));
export const setTheme = (theme: "light" | "dark") => setState((s) => ({ ...s, theme }));

// ---------- questions ----------
function planTopicsOf(s: State, day: string) {
  return new Set((s.plan[day] ?? []).map((b) => b.topicId));
}
function weakSubjectsOf(s: State) {
  return new Set(weakSubjects(s.perf).map((w) => w.subject));
}

/** Creates the day's set of questions the first time the day is opened. */
export function ensureDailyQuiz(day: string) {
  setState((s) => {
    if (s.quizDaily[day]) return s;
    const ids = pickQuestions({
      day,
      count: DAILY_COUNT,
      answered: new Set(Object.keys(s.quiz)),
      planTopics: planTopicsOf(s, day),
      weakSubjects: weakSubjectsOf(s),
    });
    return { ...s, quizDaily: { ...s.quizDaily, [day]: ids } };
  });
}

/** Adds more new questions to the day's set. */
export function moreQuestions(day: string) {
  setState((s) => {
    const current = s.quizDaily[day] ?? [];
    const ids = pickQuestions({
      day,
      count: EXTRA_COUNT,
      answered: new Set(Object.keys(s.quiz)),
      exclude: new Set(current),
      planTopics: planTopicsOf(s, day),
      weakSubjects: weakSubjectsOf(s),
    });
    return { ...s, quizDaily: { ...s.quizDaily, [day]: [...current, ...ids] } };
  });
}

export function answerQuestion(id: string, choice: number) {
  const question = QUESTION_BY_ID[id];
  if (!question || choice < 0 || choice >= question.options.length) return;
  const day = todayISO();
  setState((s) => {
    if (s.quiz[id]) return s;
    const perf = withQuizResult(s.perf, questionSubject(question), choice === question.answer, day, crypto.randomUUID());
    return { ...s, quiz: { ...s.quiz, [id]: { choice, day } }, perf };
  });
}

export function streakOf(studied: string[]) {
  const set = new Set(studied);
  let day = todayISO();
  if (!set.has(day)) day = addDays(day, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}
