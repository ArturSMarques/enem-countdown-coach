import type { Area } from "./data";
import type { Goals } from "./planner";

/**
 * Weights of each ENEM test in a course's selection (SiSU). Only weights confirmed in an official
 * source (the institution's SiSU "termo de adesão" or its edital) go here, with source, year and
 * link. Anything not confirmed stays out and is listed in docs/pesos-pendentes.md.
 */
export type CourseWeights = {
  id: string;
  course: string;
  institution: string;
  /** Weight of each test, as published (Linguagens, Humanas, Natureza, Matemática, Redação). */
  weights: Record<Area, number>;
  source: string;
  year: number;
  url: string;
};

export const COURSES: CourseWeights[] = [];

export const COURSE_BY_ID: Record<string, CourseWeights> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
);

export const courseLabel = (c: CourseWeights) => `${c.course} (${c.institution})`;

/**
 * Rule that turns a course's weights into suggested goals (adjustable). The student picks an
 * average goal M; each area gets M × (1 − SPREAD + SPREAD × weight ÷ average weight), rounded to
 * tens and kept within 0–1000. With SPREAD = 0.2, an area that weighs twice the average gets a
 * goal 20% above M, and one with half the average weight, 10% below. Equal weights: M everywhere.
 */
export const GOAL_SUGGESTION = { spread: 0.2, defaultAverage: 700 };

const AREAS: Area[] = ["ling", "hum", "nat", "mat", "red"];

export function suggestGoals(
  average: number,
  weights: Partial<Record<Area, number>> | undefined,
  spread = GOAL_SUGGESTION.spread,
): Goals {
  const mean = AREAS.reduce((s, a) => s + (weights?.[a] ?? 0), 0) / AREAS.length;
  return Object.fromEntries(
    AREAS.map((a) => {
      const rel = weights && mean > 0 ? (weights[a] ?? 0) / mean : 1;
      const v = average * (1 - spread + spread * rel);
      return [a, Math.min(1000, Math.max(0, Math.round(v / 10) * 10))];
    }),
  ) as Goals;
}
