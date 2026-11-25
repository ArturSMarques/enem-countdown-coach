import { AREAS, TOPICS, SUBJECTS, type Area, type Topic } from "./data";
import { incidenceTotal } from "./incidence";

export type Shift = "manha" | "tarde" | "noite";
/** Order of the shifts in a day (and on screen). */
export const SHIFT_ORDER: Shift[] = ["manha", "tarde", "noite"];
export const SHIFT_LABEL: Record<Shift, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};
export type Activity =
  "Videoaula" | "Questões" | "Revisão" | "Redação" | "Resumo" | "Simulado" | "Aprofundamento";
export type Block = {
  id: string;
  topicId: string;
  activity: Activity;
  minutes: number;
  shift: Shift;
  done: boolean;
};
/** Manual marks of versions up to 3 ("Dominado / Revisar / Não vi"). Kept in state.status, no longer read. */
export type TopicStatus = "dominado" | "revisar" | "nao";
/** Mastery computed from the student's answers (see topic-mastery.ts and mastery-config.ts). */
export type MasteryLevel = "nao_iniciado" | "basico" | "desenvolvendo" | "avancado" | "dominado";
/** How hard each area feels to the student, 1 (easy) to 10 (very hard). Version 2 used 1–5. */
export type Difficulty = Record<"ling" | "mat" | "nat" | "hum", number>;
export const DIFFICULTY_MAX = 10;
/** Goal score (0–1000) for each of the five ENEM tests. */
export type Goals = Record<Area, number>;
export type Config = {
  /** 1º dia da prova. Com dateMode "auto" ou "edicao" é recalculado a partir de src/lib/editions.ts. */
  examDate: string;
  /** "auto": segue a edição-alvo; "edicao": edição escolhida. ("manual" existiu até a versão 2
   * do estado e é convertido por migrate().) */
  dateMode?: "auto" | "edicao" | "manual" | undefined;
  edition?: number | undefined;
  /** Hours a day: 1, 2, 3 or 4 ("4 h ou mais"). 1,5 saved by older versions stays valid. */
  hours: number;
  /** Study shifts, at least one. */
  shifts: Shift[];
  difficulty: Difficulty;
  /** Goal for each area (0–1000). Optional: without goals every area keeps its base weight. */
  goals?: Goals | undefined;
  /** Course chosen to suggest the goals (id in course-weights.ts). Optional. */
  course?: string | undefined;
};
export type PerfEntry = {
  id: string;
  date: string;
  subject: string;
  total: number;
  correct: number;
  /** "quiz" marks entries filled in automatically by the daily questions. */
  source?: "quiz" | undefined;
};

// ---------- dates (local, ISO yyyy-mm-dd) ----------
export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayISO = () => toISO(new Date());
const parse = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (iso: string, n: number) => {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
export const diffDays = (from: string, to: string) =>
  Math.round((Date.UTC(...ymd(to)) - Date.UTC(...ymd(from))) / 86400000);
const ymd = (iso: string): [number, number, number] => {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return [y, m - 1, d];
};
export const fmtDay = (
  iso: string,
  opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "2-digit" },
) => parse(iso).toLocaleDateString("pt-BR", opts);

export const FINAL_WEEK_DAYS = 7;
export const isFinalWeek = (day: string, examDate: string) =>
  diffDays(day, examDate) <= FINAL_WEEK_DAYS;

// ---------- block sizes: 25 to 50 minutes ----------
export function splitMinutes(total: number): number[] {
  const out: number[] = [];
  let r = Math.round(total);
  while (r >= 25) {
    const chunk = r <= 50 ? r : r - 50 >= 25 ? 50 : r - 25;
    out.push(chunk);
    r -= chunk;
  }
  return out;
}

/** Hours a day offered in the onboarding; 4 means "4 h ou mais" (planned with 4 h). */
export const HOURS_OPTIONS = [1, 2, 3, 4] as const;
/** Option shown as selected for a saved value (1,5 h from older versions shows as 2 h). */
export const nearestHours = (h: number) =>
  HOURS_OPTIONS.reduce((best, o) => (Math.abs(o - h) <= Math.abs(best - h) ? o : best));

/** Toggles one shift (or "todos") keeping at least one selected, in day order. */
export function toggleShift(current: Shift[], pick: Shift | "todos"): Shift[] {
  if (pick === "todos") return current.length === SHIFT_ORDER.length ? current : [...SHIFT_ORDER];
  const next = current.includes(pick) ? current.filter((s) => s !== pick) : [...current, pick];
  return next.length ? SHIFT_ORDER.filter((s) => next.includes(s)) : current;
}

/** Shortest study block. A shift that would get less than this is left out of that day. */
export const MIN_BLOCK = 25;

/**
 * Shifts used on the i-th day. The day's minutes are split evenly between shifts, and no shift
 * may get less than MIN_BLOCK minutes (it would end up with no block at all). When the time does
 * not fit every chosen shift, the day uses fewer, rotating which ones over the days.
 */
export function shiftsForDay(cfg: Pick<Config, "hours" | "shifts">, dayIndex: number): Shift[] {
  const chosen = SHIFT_ORDER.filter((s) => cfg.shifts.includes(s));
  const all = chosen.length ? chosen : (["manha"] as Shift[]);
  const total = Math.round(cfg.hours * 60);
  const fit = Math.max(1, Math.min(all.length, Math.floor(total / MIN_BLOCK)));
  if (fit === all.length) return all;
  const start = ((dayIndex % all.length) + all.length) % all.length;
  const picked = Array.from({ length: fit }, (_, k) => all[(start + k) % all.length]!);
  return SHIFT_ORDER.filter((s) => picked.includes(s));
}

// ---------- priority ----------
const PRI = { alta: 3, media: 2, baixa: 1 };
export const AREA_W: Record<Area, number> = { mat: 1.4, nat: 1.3, red: 1.3, ling: 1, hum: 0.9 };
/** Limits of the adjustment from goals and course weights, so no area disappears from the plan. */
export const AREA_FACTOR_MIN = 0.8;
export const AREA_FACTOR_MAX = 1.3;
const AREAS_ALL: Area[] = ["ling", "hum", "nat", "mat", "red"];

/**
 * Adjustment of each area's base weight (AREA_W), from 0.8 to 1.3. An area whose goal is above
 * the student's average goal, or that weighs more than average in the chosen course, gets more
 * time; one below, less. Same goals everywhere and no course: every factor is 1 (plan unchanged).
 */
export function areaFactors(
  goals: Goals | undefined,
  weights?: Partial<Record<Area, number>> | undefined,
): Record<Area, number> {
  const rel = (v: Partial<Record<Area, number>> | undefined) => {
    const vals = AREAS_ALL.map((a) => v?.[a] ?? 0);
    const mean = vals.reduce((x, y) => x + y, 0) / vals.length;
    return (a: Area) => (v && mean > 0 ? (v[a] ?? 0) / mean - 1 : 0);
  };
  const g = rel(goals);
  const w = rel(weights);
  return Object.fromEntries(
    AREAS_ALL.map((a) => {
      const f = 1 + g(a) + 0.5 * w(a);
      return [a, Math.min(AREA_FACTOR_MAX, Math.max(AREA_FACTOR_MIN, f))];
    }),
  ) as Record<Area, number>;
}
/**
 * Weight by computed mastery. The anchors are the weights of the old manual marks (não vi 1.2,
 * revisar 1, dominado 0.35); the levels in between are interpolated.
 */
export const LEVEL_W: Record<MasteryLevel, number> = {
  nao_iniciado: 1.2,
  basico: 1.1,
  desenvolvendo: 1,
  avancado: 0.675,
  dominado: 0.35,
};

export function weakSubjects(perf: PerfEntry[]) {
  const agg: Record<string, { total: number; correct: number }> = {};
  for (const p of perf) {
    const a = (agg[p.subject] ??= { total: 0, correct: 0 });
    a.total += p.total;
    a.correct += p.correct;
  }
  return Object.entries(agg)
    .filter(([, v]) => v.total >= 5 && v.correct / v.total < 0.6)
    .map(([subject, v]) => ({ subject, rate: v.correct / v.total, total: v.total }))
    .sort((a, b) => a.rate - b.rate);
}

/**
 * Weight of a topic in the plan: how often it appeared in recent exams (see incidence.ts), or the
 * priority label when there is no count (essay topics). 4 questions in three years ≈ weight 1.
 */
export function topicWeight(topic: Topic) {
  const n = incidenceTotal(topic.id);
  return topic.area === "red" || n === 0
    ? PRI[topic.priority]
    : Math.min(4.5, Math.max(0.75, n / 4));
}

/**
 * One sentence telling the student why the plan looks the way it does: the area that gained the
 * most time and why (goal above their average, weight in the chosen course).
 */
export function planReason(
  cfg: Pick<Config, "goals">,
  weights?: Partial<Record<Area, number>> | undefined,
  courseName?: string | undefined,
): string {
  const factors = areaFactors(cfg.goals, weights);
  const top = AREAS_ALL.reduce((a, b) => (factors[b] > factors[a] ? b : a));
  if (factors[top] < 1.03)
    return "Seu plano equilibra as áreas pelo peso de cada uma no ENEM, pelos tópicos que mais caem e pela dificuldade que você indicou.";
  const why: string[] = [];
  const w = weights?.[top];
  const wMean = AREAS_ALL.reduce((x, a) => x + (weights?.[a] ?? 0), 0) / AREAS_ALL.length;
  if (w != null && wMean > 0 && w > wMean)
    why.push(
      `pesa ${String(w).replace(".", ",")} no ${courseName ? `curso de ${courseName}` : "seu curso"}`,
    );
  const goal = cfg.goals?.[top];
  const gMean = AREAS_ALL.reduce((x, a) => x + (cfg.goals?.[a] ?? 0), 0) / AREAS_ALL.length;
  if (goal != null && goal > gMean) why.push(`sua meta é ${goal}, acima da sua média`);
  return `${AREAS[top].name} tem prioridade no seu plano: ${why.join(" e ")}.`;
}

export function topicScore(
  topic: Topic,
  cfg: Config,
  status: Record<string, MasteryLevel>,
  weak: Set<string>,
  factors: Record<Area, number> = areaFactors(cfg.goals),
) {
  // Scale 1–10 (version 2 used 1–5 with 0.6 + diff * 0.2; values were doubled on migration, so
  // 0.6 + diff * 0.1 gives exactly the same weight).
  const diff = topic.area === "red" ? Math.max(cfg.difficulty.ling, 6) : cfg.difficulty[topic.area];
  const st = status[topic.id] ?? "nao_iniciado";
  return (
    topicWeight(topic) *
    AREA_W[topic.area] *
    factors[topic.area] *
    (0.6 + diff * 0.1) *
    LEVEL_W[st] *
    (weak.has(topic.subject) ? 1.4 : 1)
  );
}

export function rankedTopics(
  cfg: Config,
  status: Record<string, MasteryLevel>,
  perf: PerfEntry[],
  weights?: Partial<Record<Area, number>> | undefined,
) {
  const weak = new Set(weakSubjects(perf).map((w) => w.subject));
  const factors = areaFactors(cfg.goals, weights);
  return TOPICS.map((tp) => ({
    topic: tp,
    score: topicScore(tp, cfg, status, weak, factors),
  })).sort((a, b) => b.score - a.score);
}

let uid = 0;
const newId = () =>
  `b${Date.now().toString(36)}${(uid++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

/** How the student is doing in an area, from answers by level (see mastery.ts). */
export type Stage = "base" | "regular" | "avancado";

// ---------- phases of a long preparation ----------
export type Phase = "base" | "aprofundamento" | "revisao" | "final";
export const PHASE_LABEL: Record<Phase, string> = {
  base: "Base",
  aprofundamento: "Aprofundamento",
  revisao: "Revisão intensiva",
  final: "Semana final",
};
/** Days before the exam when each phase starts. Short preparations start straight in "revisao". */
const REVIEW_PHASE_DAYS = 42;
const DEEPEN_PHASE_DAYS = 180;
export function phaseOf(day: string, examDate: string): Phase {
  const left = diffDays(day, examDate);
  if (left <= FINAL_WEEK_DAYS) return "final";
  if (left <= REVIEW_PHASE_DAYS) return "revisao";
  if (left <= DEEPEN_PHASE_DAYS) return "aprofundamento";
  return "base";
}

/** The plan is built a few weeks ahead and extended as days go by, so it adapts to performance. */
export const HORIZON_DAYS = 56;
/** Spaced review: a topic studied on day D comes back as "Revisão" on D+3, D+10 and D+30
 * (the first two times it is studied; after that the rotation brings it back on its own). */
export const REVIEW_GAPS = [3, 10, 30];
const LEARNING: Activity[] = ["Videoaula", "Aprofundamento", "Questões"];
const weekday = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

/** Reviews already owed by an existing plan, for days from `from` on. */
export function dueReviews(plan: Record<string, Block[]>, from: string): Record<string, string[]> {
  const due: Record<string, string[]> = {};
  for (const [day, blocks] of Object.entries(plan))
    for (const b of blocks)
      if (LEARNING.includes(b.activity))
        for (const gap of REVIEW_GAPS) {
          const at = addDays(day, gap);
          if (at >= from) (due[at] ??= []).push(b.topicId);
        }
  return due;
}

export function buildPlan(opts: {
  cfg: Config;
  status: Record<string, MasteryLevel>;
  perf: PerfEntry[];
  from: string;
  counts?: Record<string, number>;
  /** Last day to plan (inclusive). Defaults to HORIZON_DAYS ahead, never past the day before the exam. */
  until?: string;
  /** Reviews owed by blocks planned before `from` (see dueReviews). */
  reviews?: Record<string, string[]>;
  /** Per-area stage from the student's answers: "base" gets more theory, "avancado" more depth. */
  stages?: Partial<Record<Area, Stage>>;
  /** Weight of each area in the chosen course (course-weights.ts), if any. */
  weights?: Partial<Record<Area, number>> | undefined;
}): Record<string, Block[]> {
  const { cfg, status, perf, from } = opts;
  const counts: Record<string, number> = { ...(opts.counts ?? {}) };
  const ranked = rankedTopics(cfg, status, perf, opts.weights);
  const pool = ranked.filter((r) => r.topic.area !== "red");
  const redPool = ranked.filter((r) => r.topic.area === "red");
  const plan: Record<string, Block[]> = {};
  const lastDay = addDays(cfg.examDate, -1);
  const until = [opts.until ?? addDays(from, HORIZON_DAYS - 1), lastDay].sort()[0]!;
  const nDays = diffDays(from, until) + 1;
  // Day index counted from the exam eve, so the shift rotation of a date does not depend on the
  // day the plan was (re)built.
  const dayIndex = (day: string) => diffDays(day, lastDay);
  const reviews: Record<string, string[]> = {};
  for (const [d, ids] of Object.entries(opts.reviews ?? {})) reviews[d] = [...ids];
  let lastArea: Area | null = null;

  const pick = (list: typeof ranked) => {
    let best = list[0]!;
    let bestV = -1;
    for (const r of list) {
      let v = r.score / (1 + (counts[r.topic.id] ?? 0));
      if (r.topic.area === lastArea) v *= 0.5;
      if (v > bestV) {
        bestV = v;
        best = r;
      }
    }
    counts[best.topic.id] = (counts[best.topic.id] ?? 0) + 1;
    lastArea = best.topic.area;
    return best.topic;
  };
  const block = (
    topicId: string,
    activity: Activity,
    slot: { shift: Shift; minutes: number },
  ): Block => ({
    id: newId(),
    topicId,
    activity,
    minutes: slot.minutes,
    shift: slot.shift,
    done: false,
  });

  for (let i = 0; i < nDays; i++) {
    const day = addDays(from, i);
    const phase = phaseOf(day, cfg.examDate);
    const wd = weekday(day);
    const slots: { shift: Shift; minutes: number }[] = [];
    const shifts = shiftsForDay(cfg, dayIndex(day));
    for (const s of shifts)
      for (const m of splitMinutes((cfg.hours * 60) / shifts.length))
        slots.push({ shift: s, minutes: m });

    // Essay twice a week (Wednesday and Saturday), every day in the final week.
    const redSlot = phase === "final" || wd === 3 || wd === 6 ? slots.length - 1 : -1;
    // Mock test on Sundays (the ENEM is on Sundays); every other day in the final week.
    const simSlot =
      slots.length > 1 && ((phase === "final" && i % 2 === 1) || (phase !== "final" && wd === 0))
        ? 0
        : -1;
    // Up to a third of the day's slots go to spaced reviews; the rest is new study. Overflow moves
    // to the next day only while that day has room, so reviews never pile up indefinitely.
    const owed = phase === "final" ? [] : Array.from(new Set(reviews[day] ?? []));
    const reviewCap = Math.max(1, Math.floor(slots.length / 3));
    const next = addDays(day, 1);
    const room = reviewCap - (reviews[next]?.length ?? 0);
    if (room > 0) (reviews[next] ??= []).push(...owed.slice(reviewCap, reviewCap + room));
    const todaysReviews = owed.slice(0, reviewCap);

    plan[day] = slots.map((slot, idx) => {
      if (idx === redSlot) return block(pick(redPool).id, "Redação", slot);
      if (idx === simSlot) return block(pick(pool).id, "Simulado", slot);
      const review = todaysReviews.shift();
      if (review) return block(review, "Revisão", slot);
      const tp = pick(pool);
      const c = counts[tp.id] ?? 0;
      const stage = opts.stages?.[tp.area] ?? "regular";
      let activity: Activity;
      if (phase === "final") activity = c % 2 ? "Revisão" : "Resumo";
      else if (phase === "revisao")
        activity =
          stage === "base" ? (c % 2 ? "Resumo" : "Questões") : c % 3 === 0 ? "Resumo" : "Questões";
      // Struggling with easy questions: more base theory. Doing well on hard ones: more depth.
      else if (stage === "base") activity = c % 3 === 0 ? "Questões" : "Videoaula";
      else if (stage === "avancado") activity = c % 2 ? "Aprofundamento" : "Questões";
      else if (phase === "aprofundamento")
        activity = c === 1 ? "Videoaula" : c % 2 ? "Aprofundamento" : "Questões";
      else activity = c % 2 ? "Videoaula" : "Questões";
      // The first two times a topic is studied it gets spaced reviews; later it recurs on its own.
      if (LEARNING.includes(activity) && c <= 2)
        for (const gap of REVIEW_GAPS) (reviews[addDays(day, gap)] ??= []).push(tp.id);
      return block(tp.id, activity, slot);
    });
  }
  return plan;
}

/** Moves today's unfinished blocks to the following days, one per day in rotation. */
export function redistribute(plan: Record<string, Block[]>, day: string, examDate: string) {
  const next = { ...plan };
  const blocks = next[day] ?? [];
  const pending = blocks.filter((b) => !b.done);
  next[day] = blocks.filter((b) => b.done);
  const avail = diffDays(day, examDate) - 1;
  if (avail <= 0) return next;
  pending.forEach((b, i) => {
    const target = addDays(day, 1 + (i % avail));
    next[target] = [...(next[target] ?? []), b];
  });
  return next;
}

export const subjectArea = (s: string) => SUBJECTS.find((x) => x.name === s)?.area;
