import { describe, expect, it } from "vitest";
import { buildPlan, redistribute, splitMinutes, type Config } from "@/lib/planner";

const cfg: Config = { examDate: "2026-11-08", hours: 2, shift: "ambos", difficulty: { mat: 3, nat: 3, ling: 3, hum: 3 } };

describe("planner", () => {
  it("blocks are 25 to 50 minutes and sum to daily time", () => {
    for (const total of [30, 45, 60, 90, 120]) {
      const parts = splitMinutes(total);
      expect(parts.reduce((a, b) => a + b, 0)).toBe(total);
      parts.forEach((p) => expect(p >= 25 && p <= 50).toBe(true));
    }
  });

  it("final 7 days contain only review, summaries, mock tests and essay", () => {
    const plan = buildPlan({ cfg, status: {}, perf: [], from: "2026-10-20" });
    for (const day of ["2026-11-01", "2026-11-05", "2026-11-07"])
      plan[day].forEach((b) => expect(["Revisão", "Resumo", "Simulado", "Redação"]).toContain(b.activity));
    expect(plan["2026-11-08"]).toBeUndefined();
  });

  it("skipping a day moves pending blocks to the next days", () => {
    const plan = buildPlan({ cfg, status: {}, perf: [], from: "2026-10-20" });
    const n = plan["2026-10-20"].length;
    const next = redistribute(plan, "2026-10-20", cfg.examDate);
    expect(next["2026-10-20"]).toHaveLength(0);
    expect(next["2026-10-21"].length).toBe(plan["2026-10-21"].length + 1);
    expect(Object.values(next).flat().length).toBe(Object.values(plan).flat().length);
    expect(n).toBeGreaterThan(0);
  });
});
