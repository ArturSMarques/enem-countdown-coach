import { TOPICS } from "./data";
import { MASTERY_CONFIG as C } from "./mastery-config";
import { addDays, type MasteryLevel } from "./planner";
import { canShowContent } from "./question-types";
import { QUESTION_BY_ID, QUESTIONS } from "./questions";
import type { QuizAnswer } from "./quiz";

/** One answer to one of the app's questions. `ms` is unknown for answers given before v3. */
export type Attempt = {
  questionId: string;
  choice: number;
  correct: boolean;
  day: string;
  ms?: number | undefined;
};

export const MASTERY_LEVELS: MasteryLevel[] = [
  "nao_iniciado",
  "basico",
  "desenvolvendo",
  "avancado",
  "dominado",
];
export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  nao_iniciado: "Não iniciado",
  basico: "Básico",
  desenvolvendo: "Desenvolvendo",
  avancado: "Avançado",
  dominado: "Dominado",
};

/** Questions in the bank per topic that the student can answer in the app. */
export const BANK_SIZE: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (const q of QUESTIONS) if (canShowContent(q)) out[q.topicId] = (out[q.topicId] ?? 0) + 1;
  return out;
})();

/** Attempts rebuilt from the old one-answer-per-question record (oldest first). */
export function attemptsFromQuiz(quiz: Record<string, QuizAnswer>): Attempt[] {
  return Object.entries(quiz)
    .flatMap(([questionId, a]) => {
      const q = QUESTION_BY_ID[questionId];
      return q
        ? [{ questionId, choice: a.choice, correct: a.choice === q.answer, day: a.day }]
        : [];
    })
    .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
}

export type TopicMastery = {
  level: MasteryLevel;
  /** Recent answers that count (inside the window). */
  answers: number;
  /** Hit rate weighted by question level (0–1), or null without recent answers. */
  rate: number | null;
  /** The topic has fewer questions than "Dominado" needs: the ceiling is "Avançado". */
  capped: boolean;
  /** Had answers before, but none inside the window: the level dropped for lack of practice. */
  stale: boolean;
  /** What is missing to reach the next level, in one sentence (empty at the top). */
  next: string;
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const pct = (r: number) => `${Math.round(r * 100)}%`;

/** Mastery of one topic from the student's attempts, as of `today`. */
export function topicMastery(topicId: string, attempts: Attempt[], today: string): TopicMastery {
  const since = addDays(today, -(C.recentDays - 1));
  const all = attempts.filter((a) => QUESTION_BY_ID[a.questionId]?.topicId === topicId);
  const recent = all.filter((a) => a.day >= since && a.day <= today);
  const capped = (BANK_SIZE[topicId] ?? 0) < C.minBankForMastered;
  const n = recent.length;
  let wSum = 0;
  let wHit = 0;
  let mediumHits = 0;
  let hardHits = 0;
  for (const a of recent) {
    const level = QUESTION_BY_ID[a.questionId]!.level;
    const w = C.levelWeight[level];
    wSum += w;
    if (a.correct) {
      wHit += w;
      if (level === "media") mediumHits++;
      if (level === "dificil") hardHits++;
    }
  }
  const rate = wSum ? wHit / wSum : null;
  const r = rate ?? 0;
  const lastK = recent.slice(-C.dominado.lastWithoutSeriousMiss);
  const cleanEnd =
    lastK.length === C.dominado.lastWithoutSeriousMiss &&
    lastK.every(
      (a) => a.correct || !C.seriousMissLevels.includes(QUESTION_BY_ID[a.questionId]!.level),
    );

  const meets = {
    basico: n >= C.basico.answers,
    desenvolvendo: n >= C.desenvolvendo.answers && r >= C.desenvolvendo.rate,
    avancado:
      n >= C.avancado.answers && r >= C.avancado.rate && mediumHits >= C.avancado.mediumHits,
    dominado:
      !capped &&
      n >= C.dominado.answers &&
      r >= C.dominado.rate &&
      hardHits >= C.dominado.hardHits &&
      cleanEnd,
  };
  // Levels are cumulative: each one needs the one below.
  let level: MasteryLevel = "nao_iniciado";
  if (meets.basico) level = "basico";
  if (meets.basico && meets.desenvolvendo) level = "desenvolvendo";
  if (level === "desenvolvendo" && meets.avancado) level = "avancado";
  if (level === "avancado" && meets.dominado) level = "dominado";
  const stale = n === 0 && all.length > 0;
  if (stale) level = "basico";

  const rateTxt = (target: number) =>
    rate === null
      ? `pelo menos ${pct(target)} de acerto`
      : `acerto de ${pct(target)} (hoje ${pct(rate)})`;
  let next = "";
  if (stale)
    next = `Faz mais de ${C.recentDays} dias que você não pratica este tópico. Responda questões para recuperar o nível.`;
  else if (level === "nao_iniciado") next = "Responda uma questão deste tópico para começar.";
  else if (level === "basico") {
    const miss = Math.max(0, C.desenvolvendo.answers - n);
    next = miss
      ? `Faltam ${plural(miss, "questão", "questões")} com bom desempenho para chegar a Desenvolvendo.`
      : `Para chegar a Desenvolvendo: ${rateTxt(C.desenvolvendo.rate)}.`;
  } else if (level === "desenvolvendo") {
    const parts: string[] = [];
    const miss = Math.max(0, C.avancado.answers - n);
    if (miss) parts.push(`mais ${plural(miss, "questão", "questões")}`);
    if (r < C.avancado.rate) parts.push(rateTxt(C.avancado.rate));
    if (mediumHits < C.avancado.mediumHits) parts.push("acertar uma questão média");
    next = `Para chegar a Avançado: ${parts.join(", ")}.`;
  } else if (level === "avancado") {
    if (capped)
      next = `Faltam questões novas neste tópico: o banco tem ${BANK_SIZE[topicId] ?? 0} e "Dominado" exige pelo menos ${C.minBankForMastered}.`;
    else {
      const parts: string[] = [];
      const miss = Math.max(0, C.dominado.answers - n);
      if (miss) parts.push(`mais ${plural(miss, "questão", "questões")}`);
      if (r < C.dominado.rate) parts.push(rateTxt(C.dominado.rate));
      if (hardHits < C.dominado.hardHits) parts.push("acertar uma questão difícil");
      if (!cleanEnd)
        parts.push(`as últimas ${C.dominado.lastWithoutSeriousMiss} sem errar fácil ou média`);
      next = `Para chegar a Dominado: ${parts.join(", ")}.`;
    }
  }
  return { level, answers: n, rate, capped, stale, next };
}

/** Level of every topic, for the planner and the contents screen. */
export function topicLevels(attempts: Attempt[], today: string): Record<string, MasteryLevel> {
  const out: Record<string, MasteryLevel> = {};
  for (const t of TOPICS) {
    const level = topicMastery(t.id, attempts, today).level;
    if (level !== "nao_iniciado") out[t.id] = level;
  }
  return out;
}
