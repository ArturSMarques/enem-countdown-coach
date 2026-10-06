import { useEffect, useState, useSyncExternalStore } from "react";
import type { Area } from "./data";
import {
  addDays,
  buildPlan,
  redistribute,
  todayISO,
  type Block,
  type Config,
  type PerfEntry,
  type TopicStatus,
} from "./planner";

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
};

const KEY = "reta-final-enem-v1";
const EMPTY: State = { config: null, plan: {}, status: {}, perf: [], links: [], checklist: {}, studied: [], skipped: [], theme: null };

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
        [fromDay]: s.plan[fromDay].filter((x) => x.id !== id),
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
