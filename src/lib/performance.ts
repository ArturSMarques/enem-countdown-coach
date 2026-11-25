import { CONTENT, type Trap } from "./content";
import { AREAS, TOPIC_BY_ID, type Area } from "./data";
import { ERROR_ADVICE, ERROR_LABEL, type ErrorType } from "./error-types";
import { MASTERY_CONFIG } from "./mastery-config";
import { addDays, type MasteryLevel } from "./planner";
import { QUESTION_BY_ID } from "./questions";
import { topicMastery, type Attempt } from "./topic-mastery";

/**
 * Settings of the Desempenho screen (initial values; the team adjusts here). The window is the same
 * as the one used for topic mastery, so both screens tell the same story.
 */
export const PERFORMANCE_CONFIG = {
  recentDays: MASTERY_CONFIG.recentDays,
  /** Answers an area needs in the window before the pentagon shows a value for it. */
  minAnswersPerArea: 5,
  /** How many "Pendências a melhorar" to show. */
  maxPending: 5,
};

/** The five points of the pentagon, in the order of the ENEM tests. */
export const PENTAGON_AREAS: Area[] = ["ling", "hum", "nat", "mat", "red"];

export type AreaScore = {
  area: Area;
  /** Weighted hit rate 0–100, or null when there is not enough data. */
  value: number | null;
  answers: number;
  /** Why there is no value: too few answers, or essay (no automatic correction yet). */
  reason?: "poucas" | "redacao";
};

const recent = (attempts: Attempt[], today: string) => {
  const since = addDays(today, -(PERFORMANCE_CONFIG.recentDays - 1));
  return attempts.filter((a) => a.day >= since && a.day <= today && QUESTION_BY_ID[a.questionId]);
};

/**
 * Value of each point of the pentagon: hit rate weighted by difficulty (easy 1, medium 2, hard 3) in
 * the window. Essay has no multiple-choice measure of writing: it shows "sem dados" until essays are
 * corrected (section 11), even if the student answered theory questions about the essay.
 */
export function areaScores(attempts: Attempt[], today: string): AreaScore[] {
  const rows = recent(attempts, today);
  return PENTAGON_AREAS.map((area) => {
    if (area === "red") return { area, value: null, answers: 0, reason: "redacao" as const };
    let n = 0;
    let w = 0;
    let hit = 0;
    for (const a of rows) {
      const q = QUESTION_BY_ID[a.questionId]!;
      if (TOPIC_BY_ID[q.topicId]?.area !== area) continue;
      const weight = MASTERY_CONFIG.levelWeight[q.level];
      n++;
      w += weight;
      if (a.correct) hit += weight;
    }
    if (n < PERFORMANCE_CONFIG.minAnswersPerArea)
      return { area, value: null, answers: n, reason: "poucas" as const };
    return { area, value: Math.round((hit / w) * 100), answers: n };
  });
}

export type Pending = {
  topicId: string;
  topicName: string;
  area: Area;
  level: MasteryLevel;
  /** Recent misses in the topic. */
  misses: number;
  /** Most recent miss with a known error type, explained with the chosen alternative. */
  lastError?: { type: ErrorType; label: string; detail: string; advice: string };
  /** One concrete tip: the topic tip and, when the topic has depth content, a common trap. */
  tip: string;
  trap?: Trap;
};

/**
 * "Pendências a melhorar": topics with recent misses, the ones with more misses and lower level
 * first. Topics already at "Dominado" are left out. Each one says what to do, in a positive tone.
 */
export function pendingTopics(attempts: Attempt[], today: string): Pending[] {
  const rows = recent(attempts, today);
  const byTopic = new Map<string, Attempt[]>();
  for (const a of rows) {
    const t = QUESTION_BY_ID[a.questionId]!.topicId;
    byTopic.set(t, [...(byTopic.get(t) ?? []), a]);
  }
  const order: MasteryLevel[] = ["nao_iniciado", "basico", "desenvolvendo", "avancado", "dominado"];
  const out: Pending[] = [];
  for (const [topicId, list] of byTopic) {
    const topic = TOPIC_BY_ID[topicId];
    const misses = list.filter((a) => !a.correct);
    if (!topic || misses.length === 0) continue;
    const level = topicMastery(topicId, attempts, today).level;
    if (level === "dominado") continue;
    const p: Pending = {
      topicId,
      topicName: topic.name,
      area: topic.area,
      level,
      misses: misses.length,
      tip: topic.tip,
    };
    const trap = CONTENT[topicId]?.armadilhas[0];
    if (trap) p.trap = trap;
    for (const a of [...misses].reverse()) {
      const q = QUESTION_BY_ID[a.questionId]!;
      const type = q.erros?.[a.choice];
      if (!type) continue;
      p.lastError = {
        type,
        label: ERROR_LABEL[type],
        detail: q.porQue?.[a.choice] ?? "",
        advice: ERROR_ADVICE[type],
      };
      break;
    }
    out.push(p);
  }
  return out
    .sort((a, b) => b.misses - a.misses || order.indexOf(a.level) - order.indexOf(b.level))
    .slice(0, PERFORMANCE_CONFIG.maxPending);
}

/** The pending sentence, e.g. "Em Porcentagem, você errou na fórmula: …". */
export const pendingSentence = (p: Pending) =>
  p.lastError
    ? `Em ${p.topicName}, você errou ${p.lastError.label}${p.lastError.detail ? `: ${lowerFirst(p.lastError.detail)}` : "."}`
    : `Em ${p.topicName}, ${p.misses === 1 ? "houve 1 erro recente" : `houve ${p.misses} erros recentes`}.`;

const lowerFirst = (s: string) => (s ? s[0]!.toLowerCase() + s.slice(1) : s);

export const areaName = (a: Area) => AREAS[a].name;
