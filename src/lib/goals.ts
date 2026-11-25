import { AREA_ORDER, type Area } from "./data";
import type { Goals } from "./planner";

/** Goal fields as typed in the onboarding (text, possibly blank). */
export type GoalInputs = Record<Area, string>;

export const goalInputsOf = (goals: Goals | undefined): GoalInputs =>
  Object.fromEntries(AREA_ORDER.map((a) => [a, goals ? String(goals[a]) : ""])) as GoalInputs;

export const clampGoal = (v: string | number) =>
  Math.min(1000, Math.max(0, Math.round(Number(v) || 0)));

/**
 * Goals typed by the student. All blank: no goals (every area keeps its base weight). Some blank:
 * they get the average of the filled ones, so the plan does not treat them as a goal of zero.
 */
export function goalsFromInputs(inputs: GoalInputs): Goals | undefined {
  const filled = AREA_ORDER.filter(
    (a) => inputs[a].trim() !== "" && !Number.isNaN(Number(inputs[a])),
  );
  if (!filled.length) return undefined;
  const avg = Math.round(filled.reduce((s, a) => s + clampGoal(inputs[a]), 0) / filled.length);
  return Object.fromEntries(
    AREA_ORDER.map((a) => [a, filled.includes(a) ? clampGoal(inputs[a]) : avg]),
  ) as Goals;
}
