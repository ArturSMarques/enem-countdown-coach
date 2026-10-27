import { TOPICS, SUBJECTS, type Area, type Topic } from "./data";

export type Shift = "manha" | "noite";
export type Activity = "Videoaula" | "Questões" | "Revisão" | "Redação" | "Resumo" | "Simulado";
export type Block = { id: string; topicId: string; activity: Activity; minutes: number; shift: Shift; done: boolean };
export type TopicStatus = "dominado" | "revisar" | "nao";
export type Difficulty = Record<"ling" | "mat" | "nat" | "hum", number>;
export type Config = {
  examDate: string;
  hours: 1 | 1.5 | 2;
  shift: "manha" | "noite" | "ambos";
  difficulty: Difficulty;
  goal?: number | undefined;
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
export const fmtDay = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "2-digit" }) =>
  parse(iso).toLocaleDateString("pt-BR", opts);

export const FINAL_WEEK_DAYS = 7;
export const isFinalWeek = (day: string, examDate: string) => diffDays(day, examDate) <= FINAL_WEEK_DAYS;

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

// ---------- priority ----------
const PRI = { alta: 3, media: 2, baixa: 1 };
const AREA_W: Record<Area, number> = { mat: 1.4, nat: 1.3, red: 1.3, ling: 1, hum: 0.9 };
const ST_W: Record<TopicStatus, number> = { dominado: 0.35, revisar: 1, nao: 1.2 };

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

export function topicScore(topic: Topic, cfg: Config, status: Record<string, TopicStatus>, weak: Set<string>) {
  const diff = topic.area === "red" ? Math.max(cfg.difficulty.ling, 3) : cfg.difficulty[topic.area];
  const st = status[topic.id] ?? "nao";
  return PRI[topic.priority] * AREA_W[topic.area] * (0.6 + diff * 0.2) * ST_W[st] * (weak.has(topic.subject) ? 1.4 : 1);
}

export function rankedTopics(cfg: Config, status: Record<string, TopicStatus>, perf: PerfEntry[]) {
  const weak = new Set(weakSubjects(perf).map((w) => w.subject));
  return TOPICS.map((tp) => ({ topic: tp, score: topicScore(tp, cfg, status, weak) })).sort((a, b) => b.score - a.score);
}

let uid = 0;
const newId = () => `b${Date.now().toString(36)}${(uid++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function buildPlan(opts: {
  cfg: Config;
  status: Record<string, TopicStatus>;
  perf: PerfEntry[];
  from: string;
  counts?: Record<string, number>;
}): Record<string, Block[]> {
  const { cfg, status, perf, from } = opts;
  const counts: Record<string, number> = { ...(opts.counts ?? {}) };
  const ranked = rankedTopics(cfg, status, perf);
  const pool = ranked.filter((r) => r.topic.area !== "red");
  const redPool = ranked.filter((r) => r.topic.area === "red");
  const plan: Record<string, Block[]> = {};
  const nDays = diffDays(from, cfg.examDate);
  const shifts: Shift[] = cfg.shift === "ambos" ? ["manha", "noite"] : [cfg.shift];
  let lastArea: Area | null = null;

  const pick = (list: typeof ranked) => {
    let best = list[0]!;
    let bestV = -1;
    for (const r of list) {
      let v = r.score / (1 + (counts[r.topic.id] ?? 0));
      if (r.topic.area === lastArea) v *= 0.5;
      if (v > bestV) { bestV = v; best = r; }
    }
    counts[best.topic.id] = (counts[best.topic.id] ?? 0) + 1;
    lastArea = best.topic.area;
    return best.topic;
  };

  for (let i = 0; i < nDays; i++) {
    const day = addDays(from, i);
    const final = isFinalWeek(day, cfg.examDate);
    const slots: { shift: Shift; minutes: number }[] = [];
    for (const s of shifts) for (const m of splitMinutes((cfg.hours * 60) / shifts.length)) slots.push({ shift: s, minutes: m });

    const redSlot = final || i % 3 === 0 ? slots.length - 1 : -1;
    const simSlot = final && i % 2 === 1 && slots.length > 1 ? 0 : -1;
    plan[day] = slots.map((slot, idx) => {
      if (idx === redSlot) {
        const tp = pick(redPool);
        return { id: newId(), topicId: tp.id, activity: "Redação", minutes: slot.minutes, shift: slot.shift, done: false };
      }
      const tp = pick(pool);
      const c = counts[tp.id] ?? 0;
      let activity: Activity;
      if (final) activity = idx === simSlot ? "Simulado" : c % 2 ? "Revisão" : "Resumo";
      else activity = c === 1 ? "Videoaula" : c === 2 ? "Questões" : c % 2 ? "Revisão" : "Questões";
      return { id: newId(), topicId: tp.id, activity, minutes: slot.minutes, shift: slot.shift, done: false };
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
