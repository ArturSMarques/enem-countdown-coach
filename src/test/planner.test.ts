import { describe, expect, it } from "vitest";
import {
  addDays,
  buildPlan,
  diffDays,
  HORIZON_DAYS,
  phaseOf,
  redistribute,
  splitMinutes,
  type Config,
} from "@/lib/planner";

// Dates are relative to an arbitrary start, so the tests do not expire with the calendar.
const from = "2030-03-04";
const config = (daysToExam: number): Config => ({
  examDate: addDays(from, daysToExam),
  hours: 2,
  shift: "ambos",
  difficulty: { mat: 3, nat: 3, ling: 3, hum: 3 },
});
const weekday = (iso: string) => new Date(`${iso}T12:00:00`).getDay();

describe("planner", () => {
  it("blocks are 25 to 50 minutes and sum to daily time", () => {
    for (const total of [30, 45, 60, 90, 120]) {
      const parts = splitMinutes(total);
      expect(parts.reduce((a, b) => a + b, 0)).toBe(total);
      parts.forEach((p) => expect(p >= 25 && p <= 50).toBe(true));
    }
  });

  it("final 7 days contain only review, summaries, mock tests and essay", () => {
    const cfg = config(19);
    const plan = buildPlan({ cfg, status: {}, perf: [], from });
    for (const back of [7, 4, 1])
      plan[addDays(cfg.examDate, -back)]!.forEach((b) =>
        expect(["Revisão", "Resumo", "Simulado", "Redação"]).toContain(b.activity),
      );
    expect(plan[cfg.examDate]).toBeUndefined();
  });

  it("skipping a day moves pending blocks to the next days", () => {
    const cfg = config(19);
    const plan = buildPlan({ cfg, status: {}, perf: [], from });
    const n = plan[from]!.length;
    const next = redistribute(plan, from, cfg.examDate);
    expect(next[from]).toHaveLength(0);
    expect(next[addDays(from, 1)]!.length).toBe(plan[addDays(from, 1)]!.length + 1);
    expect(Object.values(next).flat().length).toBe(Object.values(plan).flat().length);
    expect(n).toBeGreaterThan(0);
  });

  it("splits a long preparation into phases", () => {
    const exam = addDays(from, 360);
    expect(phaseOf(from, exam)).toBe("base");
    expect(phaseOf(addDays(exam, -100), exam)).toBe("aprofundamento");
    expect(phaseOf(addDays(exam, -30), exam)).toBe("revisao");
    expect(phaseOf(addDays(exam, -3), exam)).toBe("final");
  });

  it("plans a long preparation a few weeks at a time, with weekly mock tests, essays and spaced reviews", () => {
    const cfg = config(360);
    const plan = buildPlan({ cfg, status: {}, perf: [], from });
    const days = Object.keys(plan).sort();
    expect(days).toHaveLength(HORIZON_DAYS);
    for (const day of days) {
      const acts = plan[day]!.map((b) => b.activity);
      if (weekday(day) === 0) expect(acts).toContain("Simulado");
      if (weekday(day) === 3 || weekday(day) === 6) expect(acts).toContain("Redação");
      // Far from the exam there is no final-week mode.
      expect(acts).not.toContain("Resumo");
    }
    const reviews = Object.entries(plan).flatMap(([day, bs]) =>
      bs.filter((b) => b.activity === "Revisão").map((b) => ({ day, topic: b.topicId })),
    );
    expect(reviews.length).toBeGreaterThan(10);
    // Each review comes after the topic was first studied.
    for (const r of reviews) {
      const firstStudy = days.find((d) =>
        plan[d]!.some((b) => b.topicId === r.topic && b.activity !== "Revisão"),
      );
      expect(firstStudy && firstStudy < r.day).toBe(true);
    }
    // Reviews never take more than a third of a day.
    for (const day of days)
      expect(plan[day]!.filter((b) => b.activity === "Revisão").length).toBeLessThanOrEqual(1);
    // Every high-priority topic shows up in the first weeks.
    const topics = new Set(
      Object.values(plan)
        .flat()
        .map((b) => b.topicId),
    );
    expect(topics.size).toBeGreaterThan(25);
  });

  it("never plans past the day before the exam", () => {
    const cfg = config(10);
    const plan = buildPlan({ cfg, status: {}, perf: [], from });
    expect(Object.keys(plan).sort().at(-1)).toBe(addDays(cfg.examDate, -1));
    expect(diffDays(from, cfg.examDate)).toBe(10);
  });
});
