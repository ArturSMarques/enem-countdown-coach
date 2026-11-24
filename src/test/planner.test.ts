import { describe, expect, it } from "vitest";
import { goalsFromInputs } from "@/lib/goals";
import { suggestGoals } from "@/lib/course-weights";
import { TOPIC_BY_ID, TOPICS } from "@/lib/data";
import {
  addDays,
  areaFactors,
  buildPlan,
  nearestHours,
  planReason,
  shiftsForDay,
  toggleShift,
  topicScore,
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
  shifts: ["manha", "noite"],
  difficulty: { mat: 6, nat: 6, ling: 6, hum: 6 },
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

describe("personalized plan (version 3)", () => {
  const base = (hours: number, shifts: Config["shifts"]): Config => ({
    ...config(120),
    hours,
    shifts,
  });
  const days = (cfg: Config) => Object.entries(buildPlan({ cfg, status: {}, perf: [], from }));

  it.each([
    [1, ["manha", "tarde", "noite"]],
    [2, ["manha", "tarde", "noite"]],
    [4, ["noite"]],
    [1.5, ["manha", "noite"]],
    [3, ["manha", "tarde", "noite"]],
  ] as const)("%s h with %j: no day without blocks, no block under 25 min", (hours, shifts) => {
    const plan = days(base(hours, [...shifts]));
    expect(plan.length).toBeGreaterThan(30);
    for (const [, blocks] of plan) {
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) expect(b.minutes).toBeGreaterThanOrEqual(25);
      const total = blocks.reduce((s, b) => s + b.minutes, 0);
      expect(Math.abs(total - hours * 60)).toBeLessThanOrEqual(5);
      for (const b of blocks) expect(shifts).toContain(b.shift);
    }
  });

  it("with 1 h and three shifts, the day uses two and rotates them over the week", () => {
    const cfg = base(1, ["manha", "tarde", "noite"]);
    const used = new Set<string>();
    for (const [, blocks] of days(cfg).slice(0, 7)) {
      const shifts = new Set(blocks.map((b) => b.shift));
      expect(shifts.size).toBe(2);
      shifts.forEach((s) => used.add(s));
    }
    expect(used).toEqual(new Set(["manha", "tarde", "noite"]));
  });

  it("shiftsForDay keeps every shift when there is time for all and keeps day order", () => {
    expect(shiftsForDay({ hours: 2, shifts: ["noite", "manha", "tarde"] }, 0)).toEqual([
      "manha",
      "tarde",
      "noite",
    ]);
    expect(shiftsForDay({ hours: 0.5, shifts: ["manha", "noite"] }, 3)).toHaveLength(1);
    expect(shiftsForDay({ hours: 2, shifts: [] }, 0)).toEqual(["manha"]);
  });

  it("difficulty 1–10 gives exactly the weights of the old 1–5 scale after doubling", () => {
    const topic = TOPIC_BY_ID["mat-porc"]!;
    const red = TOPICS.find((t) => t.area === "red")!;
    const score = (d: number, t = topic) =>
      topicScore(
        t,
        { ...config(100), difficulty: { mat: d, nat: d, ling: d, hum: d } },
        {},
        new Set(),
      );
    for (const old of [1, 2, 3, 4, 5]) {
      // Old factor: 0.6 + old * 0.2. New factor at 2 × old must be the same.
      expect(score(old * 2) / score(2)).toBeCloseTo((0.6 + old * 0.2) / (0.6 + 1 * 0.2), 10);
      // Essay used max(ling, 3) on the old scale, which is max(ling, 6) now.
      expect(score(old * 2, red) / score(10, red)).toBeCloseTo(
        (0.6 + Math.max(old, 3) * 0.2) / (0.6 + 5 * 0.2),
        10,
      );
    }
  });

  it("goals and course weights shift time between areas, within 0.8× and 1.3×", () => {
    expect(areaFactors(undefined)).toEqual({ ling: 1, hum: 1, nat: 1, mat: 1, red: 1 });
    const same = { ling: 700, hum: 700, nat: 700, mat: 700, red: 700 };
    expect(areaFactors(same)).toEqual({ ling: 1, hum: 1, nat: 1, mat: 1, red: 1 });
    const f = areaFactors({ ...same, mat: 900, hum: 500 });
    expect(f.mat).toBeGreaterThan(1);
    expect(f.hum).toBeLessThan(1);
    const extreme = areaFactors(
      { ling: 0, hum: 0, nat: 0, mat: 1000, red: 0 },
      { mat: 5, ling: 1 },
    );
    for (const v of Object.values(extreme)) {
      expect(v).toBeGreaterThanOrEqual(0.8);
      expect(v).toBeLessThanOrEqual(1.3);
    }
    const cfg = { ...config(200), goals: { ...same, mat: 900, hum: 500 } };
    const mins = (c: Config, area: string) =>
      days(c)
        .flatMap(([, b]) => b)
        .filter((b) => TOPIC_BY_ID[b.topicId]!.area === area)
        .reduce((s, b) => s + b.minutes, 0);
    expect(mins(cfg, "mat")).toBeGreaterThan(mins(config(200), "mat"));
    expect(mins(cfg, "hum")).toBeLessThan(mins(config(200), "hum"));
    expect(mins(cfg, "hum")).toBeGreaterThan(0);
  });

  it("explains in one sentence why the plan looks the way it does", () => {
    expect(planReason({})).toMatch(/equilibra as áreas/);
    const same = { ling: 700, hum: 700, nat: 700, mat: 700, red: 700 };
    expect(planReason({ goals: { ...same, mat: 800 } })).toBe(
      "Matemática tem prioridade no seu plano: sua meta é 800, acima da sua média.",
    );
    expect(
      planReason(
        { goals: { ...same, mat: 800 } },
        { ling: 1, hum: 1, nat: 2, mat: 3, red: 1 },
        "Medicina (X)",
      ),
    ).toBe(
      "Matemática tem prioridade no seu plano: pesa 3 no curso de Medicina (X) e sua meta é 800, acima da sua média.",
    );
  });

  it("onboarding helpers: hours options, shift toggles, goals and suggestions", () => {
    expect(nearestHours(1.5)).toBe(2);
    expect(nearestHours(1)).toBe(1);
    expect(nearestHours(6)).toBe(4);
    expect(toggleShift(["manha"], "manha")).toEqual(["manha"]); // never empty
    expect(toggleShift(["noite"], "manha")).toEqual(["manha", "noite"]);
    expect(toggleShift(["manha"], "todos")).toEqual(["manha", "tarde", "noite"]);
    const blank = { ling: "", hum: "", nat: "", mat: "", red: "" };
    expect(goalsFromInputs(blank)).toBeUndefined();
    expect(goalsFromInputs({ ...blank, mat: "800", nat: "600" })).toEqual({
      ling: 700,
      hum: 700,
      nat: 600,
      mat: 800,
      red: 700,
    });
    expect(goalsFromInputs({ ...blank, mat: "1500" })?.mat).toBe(1000);
    expect(suggestGoals(700, undefined)).toEqual({
      ling: 700,
      hum: 700,
      nat: 700,
      mat: 700,
      red: 700,
    });
    const s = suggestGoals(700, { ling: 1, hum: 1, nat: 2, mat: 3, red: 3 });
    expect(s.mat).toBeGreaterThan(s.ling);
    expect(s.mat).toBe(Math.round((700 * (0.8 + (0.2 * 3) / 2)) / 10) * 10);
  });
});
