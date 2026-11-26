import { useEffect, useState, useSyncExternalStore } from "react";
import type { Area } from "./data";
import { getEdition, resolveExam, targetEdition, yearOf, type DateMode } from "./editions";
import { stagesByArea } from "./mastery";
import {
  addDays,
  buildPlan,
  diffDays,
  dueReviews,
  HORIZON_DAYS,
  redistribute,
  todayISO,
  weakSubjects,
  type Block,
  DIFFICULTY_MAX,
  type Config,
  type Goals,
  type PerfEntry,
  type Shift,
  type TopicStatus,
} from "./planner";
import {
  DAILY_COUNT,
  EXTRA_COUNT,
  pickQuestions,
  withQuizResult,
  type LevelChoice,
  type QuizAnswer,
} from "./quiz";
import { QUESTION_BY_ID, questionSubject } from "./questions";
import { COURSE_BY_ID } from "./course-weights";
import { TERMS_VERSION, type TermsAcceptance } from "./legal";
import { adaptiveReviews } from "./review";
import { leagueOf } from "./league";
import { attemptsFromQuiz, topicLevels, type Attempt } from "./topic-mastery";

export type CustomLink = { id: string; title: string; url: string; area: Area };
export type State = {
  config: Config | null;
  plan: Record<string, Block[]>;
  /** Manual marks from older versions. Kept so nothing is lost, but no longer read (mastery is
   * computed from `attempts`). */
  status: Record<string, TopicStatus>;
  perf: PerfEntry[];
  links: CustomLink[];
  checklist: Record<string, boolean>;
  studied: string[];
  skipped: string[];
  theme: "light" | "dark" | null;
  /** "Economia de dados": no heavy animations or confetti (also follows "reduce motion"). */
  dataSaver: boolean;
  /** Acceptance of the Terms and Privacy Policy (version and day), or null if not accepted yet. */
  termsAccepted: TermsAcceptance | null;
  /** Answers given in the questions section, by question id (first answer of each question). */
  quiz: Record<string, QuizAnswer>;
  /** Every answer, oldest first: the history used for computed mastery (version 3). */
  attempts: Attempt[];
  /** Question ids shown on each day (saved so the day's set does not change after answering). */
  quizDaily: Record<string, string[]>;
  /** ENEM edition the checklist marks belong to; the checklist starts over in a new edition. */
  checklistYear: number | null;
  /** Format of the saved state. 1 (implicit) = before editions; 2 = editions and rolling plan;
   * 3 = personalized plan (shifts list, hours as a number, difficulty 1–10, goals by area, no
   * manual date) and the attempts history for computed mastery. */
  version: number;
};

/** The key keeps its old name: the format is versioned inside the saved object (see migrate). */
const KEY = "reta-final-enem-v1";
export const STATE_VERSION = 3;
const EMPTY: State = {
  config: null,
  plan: {},
  status: {},
  perf: [],
  links: [],
  checklist: {},
  studied: [],
  skipped: [],
  theme: null,
  dataSaver: false,
  termsAccepted: null,
  quiz: {},
  attempts: [],
  quizDaily: {},
  checklistYear: null,
  version: STATE_VERSION,
};

/**
 * Upgrades a saved state to the current format without losing data. Version 1 stored a fixed exam
 * date (the onboarding default was "2026-11-08"). A date already in the past becomes automatic (it
 * follows the target edition); a future date that matches an edition keeps that edition; any other
 * future date was typed by the student and stays manual.
 */
export function migrate(raw: unknown, today: string): State {
  const saved = raw && typeof raw === "object" ? (raw as Partial<State>) : {};
  let s: State = { ...EMPTY, ...saved, version: STATE_VERSION };
  if ((saved.version ?? 1) < 2 && s.config) {
    const exam = s.config.examDate;
    let dateMode: DateMode = "manual";
    let edition: number | undefined;
    if (!exam || exam < today) dateMode = "auto";
    else {
      const ed = getEdition(yearOf(exam));
      if (ed.days[0] === exam) {
        if (ed.year === targetEdition(today).year) dateMode = "auto";
        else {
          dateMode = "edicao";
          edition = ed.year;
        }
      }
    }
    s = { ...s, config: { ...s.config, dateMode, ...(edition ? { edition } : {}) } };
  }
  if ((saved.version ?? 1) < 3 && s.config) s = { ...s, config: migrateConfigV3(s.config, today) };
  // Data saver came after version 3 as an optional setting: states saved without it start off.
  if (typeof saved.dataSaver !== "boolean") s = { ...s, dataSaver: false };
  // Terms acceptance came with the privacy phase: states saved before it have not accepted yet.
  if (!saved.termsAccepted || typeof saved.termsAccepted !== "object")
    s = { ...s, termsAccepted: null };
  // The attempts history is part of version 3. It is filled from `quiz` whenever it is missing,
  // which also covers states saved by an early build of version 3 without it.
  if (!Array.isArray(saved.attempts)) s = { ...s, attempts: attemptsFromQuiz(s.quiz ?? {}) };
  // Checklist marks saved before editions existed belong to the edition of the date saved back then.
  if (s.checklistYear == null && s.config?.examDate)
    s = { ...s, checklistYear: yearOf(s.config.examDate) };
  return s;
}

/** Config as saved by version 2 (or earlier), before the personalized plan. */
type ConfigV2 = Omit<Config, "shifts"> & {
  shifts?: Shift[] | undefined;
  shift?: "manha" | "noite" | "ambos" | undefined;
  goal?: number | undefined;
};
const AREA_KEYS = ["ling", "hum", "nat", "mat", "red"] as const;

/**
 * Version 3: "manual" date becomes the edition of the saved date's year (when that edition is not
 * over yet) or "auto"; "shift" becomes a list of shifts; difficulty 1–5 is doubled to the 1–10
 * scale (the planner formula was adjusted so the plan stays the same); the overall goal is copied
 * to the five areas as an editable starting point. Hours stay as they were (1,5 h stays valid).
 */
export function migrateConfigV3(raw: Config, today: string): Config {
  const old = raw as ConfigV2;
  const { shift, goal, ...rest } = old;
  let { dateMode, edition } = old;
  if (dateMode === "manual") {
    const date = old.examDate;
    const ed = date && date >= today ? getEdition(yearOf(date)) : null;
    if (ed && ed.days[1] >= today) {
      dateMode = "edicao";
      edition = ed.year;
    } else {
      dateMode = "auto";
      edition = undefined;
    }
  }
  const shifts: Shift[] =
    old.shifts && old.shifts.length
      ? old.shifts
      : shift === "ambos"
        ? ["manha", "noite"]
        : shift === "manha" || shift === "noite"
          ? [shift]
          : ["manha", "noite"];
  const double = (v: number | undefined) =>
    Math.min(DIFFICULTY_MAX, Math.max(1, Math.round((Number(v) || 3) * 2)));
  const d = old.difficulty ?? { mat: 3, nat: 3, ling: 3, hum: 3 };
  const goals: Goals | undefined =
    rest.goals ??
    (typeof goal === "number" && goal > 0
      ? (Object.fromEntries(AREA_KEYS.map((a) => [a, goal])) as Goals)
      : undefined);
  const next: Config = {
    ...rest,
    dateMode,
    hours: typeof old.hours === "number" && old.hours > 0 ? old.hours : 1.5,
    shifts,
    difficulty: {
      mat: double(d.mat),
      nat: double(d.nat),
      ling: double(d.ling),
      hum: double(d.hum),
    },
  };
  if (edition) next.edition = edition;
  else delete next.edition;
  if (goals) next.goals = goals;
  return next;
}

/** Weight of each area in the course the student chose, if any. */
export const courseWeights = (cfg: Config | null | undefined) =>
  cfg?.course ? COURSE_BY_ID[cfg.course]?.weights : undefined;

/**
 * Keeps a loaded state current: follows the target edition when the date is automatic (the plan is
 * rebuilt from today when the exam date changes), starts the checklist over in a new edition and
 * extends the rolling plan so there are always at least four weeks ahead.
 */
export function refresh(s: State, today: string): State {
  if (!s.config) return s;
  const exam = resolveExam(s.config, today);
  let cfg = s.config;
  // A chosen edition that is over: from now on the app follows the next editions by itself.
  if (cfg.dateMode === "edicao" && exam.edition && exam.edition.year !== cfg.edition) {
    const { edition: _old, ...rest } = cfg;
    cfg = { ...rest, dateMode: "auto" };
  }
  let next = cfg === s.config ? s : { ...s, config: cfg };
  if (exam.day1 !== cfg.examDate) next = regenerate(next, { ...cfg, examDate: exam.day1 }, today);
  const year = exam.edition?.year ?? yearOf(exam.day1);
  if (next.checklistYear !== year) next = { ...next, checklist: {}, checklistYear: year };
  return extendPlan(next, today);
}

/** Adds days to the end of the rolling plan when fewer than four weeks are left in it. */
export function extendPlan(s: State, today: string): State {
  const cfg = s.config;
  if (!cfg) return s;
  const lastExamEve = addDays(cfg.examDate, -1);
  const planned = Object.keys(s.plan)
    .filter((d) => d >= today && (s.plan[d]?.length ?? 0) > 0)
    .sort();
  const last = planned.at(-1);
  if (last && (last >= lastExamEve || diffDays(today, last) >= 27)) return s;
  const from = last ? addDays(last, 1) : today;
  if (from > lastExamEve) return s;
  const until = addDays(today, HORIZON_DAYS - 1);
  const fresh = buildPlan({
    cfg,
    status: topicLevels(s.attempts, today),
    perf: s.perf,
    from,
    until,
    counts: doneCounts(s.plan, from),
    // Days already planned keep their reviews; the "Revisão de hoje" card shows overdue ones.
    ...planReviews(s, dueReviews(s.plan, from), from, until, false),
    stages: stagesByArea(s.quiz),
    weights: courseWeights(cfg),
  });
  return { ...s, plan: { ...s.plan, ...fresh } };
}

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const today = todayISO();
      state = refresh(migrate(JSON.parse(raw), today), today);
      localStorage.setItem(KEY, JSON.stringify(state));
    }
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
  const s = useSyncExternalStore(
    subscribe,
    () => (load(), state),
    () => EMPTY,
  );
  return { state: ready ? s : EMPTY, ready };
}

// ---------- actions ----------
function doneCounts(plan: Record<string, Block[]>, before: string) {
  const c: Record<string, number> = {};
  for (const [day, blocks] of Object.entries(plan))
    if (day < before) for (const b of blocks) c[b.topicId] = (c[b.topicId] ?? 0) + 1;
  return c;
}

/**
 * Reviews for a new stretch of the plan: answered topics follow the adaptive schedule (review.ts);
 * the others keep the reviews owed by the plan's fixed gaps.
 */
function planReviews(
  s: State,
  owed: Record<string, string[]>,
  from: string,
  until: string,
  includeOverdue: boolean,
) {
  const adaptive = adaptiveReviews(s.attempts, from, until, includeOverdue);
  const reviews: Record<string, string[]> = {};
  for (const [day, ids] of Object.entries(owed)) {
    const keep = ids.filter((id) => !adaptive.topics.has(id));
    if (keep.length) reviews[day] = keep;
  }
  for (const [day, ids] of Object.entries(adaptive.reviews))
    reviews[day] = [...(reviews[day] ?? []), ...ids];
  return { reviews, adaptiveTopics: adaptive.topics };
}

/** Rebuilds the plan from today on (keeps the past; keeps today if something was already done). */
export function regenerate(s: State, cfg = s.config, today = todayISO()): State {
  if (!cfg) return s;
  const keepToday = (s.plan[today] ?? []).some((b) => b.done);
  const from = keepToday ? addDays(today, 1) : today;
  const past = Object.fromEntries(Object.entries(s.plan).filter(([d]) => d < from));
  const fresh = buildPlan({
    cfg,
    status: topicLevels(s.attempts, today),
    perf: s.perf,
    from,
    counts: doneCounts(s.plan, from),
    ...planReviews(s, dueReviews(past, from), from, addDays(cfg.examDate, -1), true),
    stages: stagesByArea(s.quiz),
    weights: courseWeights(cfg),
  });
  return { ...s, config: cfg, plan: { ...past, ...fresh } };
}

export const saveConfig = (cfg: Config) =>
  setState((s) => {
    const today = todayISO();
    const examDate = resolveExam(cfg, today).day1;
    return refresh(regenerate(s, { ...cfg, examDate }, today), today);
  });
export const recalc = () => setState((s) => regenerate(s));

export function toggleBlock(day: string, id: string) {
  setState((s) => {
    const blocks = (s.plan[day] ?? []).map((b) => (b.id === id ? { ...b, done: !b.done } : b));
    const any = blocks.some((b) => b.done);
    const studied = any
      ? Array.from(new Set([...s.studied, day]))
      : s.studied.filter((d) => d !== day);
    return { ...s, plan: { ...s.plan, [day]: blocks }, studied };
  });
}

export function skipToday() {
  const today = todayISO();
  setState((s) => {
    if (!s.config) return s;
    return {
      ...s,
      plan: redistribute(s.plan, today, s.config.examDate),
      skipped: Array.from(new Set([...s.skipped, today])),
    };
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

export const addPerf = (p: Omit<PerfEntry, "id" | "date">) =>
  setState((s) => ({
    ...s,
    perf: [...s.perf, { ...p, id: crypto.randomUUID(), date: todayISO() }],
  }));
export const removePerf = (id: string) =>
  setState((s) => ({ ...s, perf: s.perf.filter((p) => p.id !== id) }));
export const addLink = (l: Omit<CustomLink, "id">) =>
  setState((s) => ({ ...s, links: [...s.links, { ...l, id: crypto.randomUUID() }] }));
export const removeLink = (id: string) =>
  setState((s) => ({ ...s, links: s.links.filter((l) => l.id !== id) }));
export const toggleCheck = (id: string) =>
  setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: !s.checklist[id] } }));
export const setTheme = (theme: "light" | "dark") => setState((s) => ({ ...s, theme }));
export const setDataSaver = (dataSaver: boolean) => setState((s) => ({ ...s, dataSaver }));
export const acceptTerms = () =>
  setState((s) => ({ ...s, termsAccepted: { version: TERMS_VERSION, day: todayISO() } }));

/** The saved data, for "Baixar meus dados". */
export const currentState = () => {
  load();
  return state;
};

/** Replaces everything saved on this device (used after joining with the account's progress). */
export function replaceState(next: State) {
  state = migrate(next, todayISO());
  loaded = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

/** Calls `listener` after every change of the saved data; returns a function that stops it. */
export function onStateChange(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** "Apagar todos os meus dados deste aparelho": removes the saved key and starts from zero. */
export function clearAllData() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  state = { ...EMPTY };
  loaded = true;
  listeners.forEach((l) => l());
}

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
      stages: stagesByArea(s.quiz),
      league: leagueOf(s, day).id,
    });
    return { ...s, quizDaily: { ...s.quizDaily, [day]: ids } };
  });
}

/** Adds more new questions to the day's set, of the chosen level (or a mix of levels). */
export function moreQuestions(day: string, level: LevelChoice = "mix") {
  setState((s) => {
    const current = s.quizDaily[day] ?? [];
    const ids = pickQuestions({
      day,
      count: EXTRA_COUNT,
      level,
      answered: new Set(Object.keys(s.quiz)),
      exclude: new Set(current),
      planTopics: planTopicsOf(s, day),
      weakSubjects: weakSubjectsOf(s),
      stages: stagesByArea(s.quiz),
      league: leagueOf(s, day).id,
    });
    if (!ids.length) return s;
    return { ...s, quizDaily: { ...s.quizDaily, [day]: [...current, ...ids] } };
  });
}

/** Adds one answer to the history (and the first answer of a question to `quiz`). */
function withAnswer(
  s: State,
  id: string,
  choice: number,
  ms: number | undefined,
  day: string,
): State {
  const question = QUESTION_BY_ID[id];
  if (!question || choice < 0 || choice >= question.options.length) return s;
  const attempt: Attempt = { questionId: id, choice, correct: choice === question.answer, day };
  if (ms !== undefined && Number.isFinite(ms) && ms >= 0) attempt.ms = Math.round(ms);
  const perf = withQuizResult(
    s.perf,
    questionSubject(question),
    choice === question.answer,
    day,
    crypto.randomUUID(),
  );
  return {
    ...s,
    quiz: s.quiz[id] ? s.quiz : { ...s.quiz, [id]: { choice, day } },
    attempts: [...(s.attempts ?? []), attempt],
    perf,
  };
}

/** Records an answer. `ms` is the time spent on the question, when the screen measured it. */
export function answerQuestion(id: string, choice: number, ms?: number) {
  const day = todayISO();
  setState((s) => (s.quiz[id] ? s : withAnswer(s, id, choice, ms, day)));
}

/**
 * Records answers even to questions answered before (reviews and mini-simulados): each one is a new
 * attempt in the history; `quiz` keeps the first answer.
 */
export function recordAnswers(list: { id: string; choice: number; ms?: number | undefined }[]) {
  const day = todayISO();
  setState((s) => list.reduce((acc, a) => withAnswer(acc, a.id, a.choice, a.ms, day), s));
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
