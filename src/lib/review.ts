import { TOPIC_BY_ID } from "./data";
import { addDays, diffDays } from "./planner";
import { canShowContent, LEVELS } from "./question-types";
import { QUESTION_BY_ID, QUESTIONS } from "./questions";
import type { Attempt } from "./topic-mastery";

/**
 * Spaced review that follows the student's answers (section 11). For each topic, every day with
 * answers is one review: all right moves the topic one step further (the gap grows), any miss sends
 * it back to the first step (it comes back the next day). Topics never answered keep the fixed gaps
 * of the plan (REVIEW_GAPS in planner.ts). Steps in days, adjustable here.
 */
export const REVIEW_STEPS = [1, 3, 7, 14, 30];
/** A first day all right starts at this step (3 days), not at "come back tomorrow". */
const FIRST_HIT_STEP = 1;
/** How many reviews the home card lists. */
export const REVIEW_CARD_MAX = 5;

export type TopicReview = {
  topicId: string;
  /** Last day the topic was answered. */
  last: string;
  /** Index in REVIEW_STEPS. */
  step: number;
  /** Day the topic should be reviewed again. */
  due: string;
  /** The last review day had a miss. */
  missed: boolean;
};

/** Review schedule of every answered topic. */
export function reviewSchedule(attempts: Attempt[]): Record<string, TopicReview> {
  // topic -> day -> all right?
  const days = new Map<string, Map<string, boolean>>();
  for (const a of attempts) {
    const topicId = QUESTION_BY_ID[a.questionId]?.topicId;
    if (!topicId || !TOPIC_BY_ID[topicId]) continue;
    const byDay = days.get(topicId) ?? new Map<string, boolean>();
    byDay.set(a.day, (byDay.get(a.day) ?? true) && a.correct);
    days.set(topicId, byDay);
  }
  const out: Record<string, TopicReview> = {};
  for (const [topicId, byDay] of days) {
    let step = -1;
    let last = "";
    let missed = false;
    for (const day of [...byDay.keys()].sort()) {
      const allRight = byDay.get(day)!;
      step = allRight
        ? step < 0
          ? FIRST_HIT_STEP
          : Math.min(step + 1, REVIEW_STEPS.length - 1)
        : 0;
      last = day;
      missed = !allRight;
    }
    out[topicId] = { topicId, last, step, due: addDays(last, REVIEW_STEPS[step]!), missed };
  }
  return out;
}

/** Topics to review today (due today or overdue), the most overdue and missed first. */
export function reviewsDue(attempts: Attempt[], today: string): TopicReview[] {
  return Object.values(reviewSchedule(attempts))
    .filter((r) => r.due <= today)
    .sort(
      (a, b) =>
        diffDays(b.due, today) - diffDays(a.due, today) ||
        Number(b.missed) - Number(a.missed) ||
        a.topicId.localeCompare(b.topicId),
    );
}

/**
 * Reviews for the plan from `from` to `until`: each answered topic on its due day (overdue ones on
 * `from`, or left out when `includeOverdue` is false). Used with the plan's own reviews for topics
 * that were never answered.
 */
export function adaptiveReviews(
  attempts: Attempt[],
  from: string,
  until: string,
  includeOverdue = true,
): { reviews: Record<string, string[]>; topics: Set<string> } {
  const schedule = reviewSchedule(attempts);
  const reviews: Record<string, string[]> = {};
  for (const r of Object.values(schedule)) {
    if (r.due < from && !includeOverdue) continue;
    const day = r.due < from ? from : r.due;
    if (day <= until) (reviews[day] ??= []).push(r.topicId);
  }
  return { reviews, topics: new Set(Object.keys(schedule)) };
}

/** "amanhã", "em 7 dias". */
export function inDays(from: string, to: string) {
  const n = diffDays(from, to);
  return n <= 0 ? "hoje" : n === 1 ? "amanhã" : `em ${n} dias`;
}

/** How many questions a topic review asks. */
export const REVIEW_QUESTIONS = 3;

/**
 * Questions for a topic review: never answered first (easy to hard), then the ones answered the
 * longest ago, so a review always has something to answer even after the whole topic was done.
 */
export function reviewQuestions(topicId: string, attempts: Attempt[], n = REVIEW_QUESTIONS) {
  const lastSeen = new Map<string, string>();
  for (const a of attempts) {
    const prev = lastSeen.get(a.questionId);
    if (!prev || a.day > prev) lastSeen.set(a.questionId, a.day);
  }
  return QUESTIONS.filter((q) => q.topicId === topicId && canShowContent(q))
    .sort((a, b) => {
      const la = lastSeen.get(a.id);
      const lb = lastSeen.get(b.id);
      if (!la !== !lb) return la ? 1 : -1;
      if (la && lb && la !== lb) return la < lb ? -1 : 1;
      return LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);
    })
    .slice(0, n);
}
