import { describe, expect, it } from "vitest";
import {
  estimatedDays,
  getEdition,
  resolveExam,
  selectableEditions,
  targetEdition,
} from "@/lib/editions";

describe("ENEM editions", () => {
  it("keeps the official dates published by Inep", () => {
    expect(getEdition(2024).days).toEqual(["2024-11-03", "2024-11-10"]);
    expect(getEdition(2025).days).toEqual(["2025-11-09", "2025-11-16"]);
    expect(getEdition(2026).days).toEqual(["2026-11-08", "2026-11-15"]);
    expect(getEdition(2026).status).toBe("oficial");
  });

  it("estimates dates with a rule that matches every official edition", () => {
    for (const year of [2024, 2025, 2026])
      expect(estimatedDays(year)).toEqual(getEdition(year).days);
  });

  it("marks future editions without an edital as estimated, on two November Sundays", () => {
    for (let year = 2027; year <= 2040; year++) {
      const e = getEdition(year);
      expect(e.status).toBe("estimada");
      expect(e.source).toMatch(/A confirmar no edital/);
      for (const d of e.days) {
        const date = new Date(`${d}T12:00:00`);
        expect(date.getDay()).toBe(0);
        expect(date.getMonth()).toBe(10);
      }
      expect(e.rulesFrom).toBeLessThan(year);
    }
    expect(getEdition(2027).days).toEqual(["2027-11-07", "2027-11-14"]);
  });

  it("targets the current year until its second exam day, then the next year", () => {
    expect(targetEdition("2026-03-10").year).toBe(2026);
    expect(targetEdition("2026-11-08").year).toBe(2026);
    expect(targetEdition("2026-11-15").year).toBe(2026);
    expect(targetEdition("2026-11-16").year).toBe(2027);
    expect(targetEdition("2026-12-31").year).toBe(2027);
    expect(targetEdition("2027-11-14").year).toBe(2027);
    expect(targetEdition("2027-11-15").year).toBe(2028);
    expect(selectableEditions("2026-11-19").map((e) => e.year)).toEqual([2027, 2028, 2029]);
  });

  it("resolves the exam date for each date mode", () => {
    const base = { examDate: "2030-05-05" };
    expect(resolveExam({ ...base, dateMode: "auto" }, "2026-11-19").day1).toBe("2027-11-07");
    expect(
      resolveExam({ ...base, dateMode: "edicao", edition: 2028 }, "2026-11-19").edition?.year,
    ).toBe(2028);
    expect(resolveExam({ ...base, dateMode: "manual" }, "2026-11-19")).toMatchObject({
      day1: "2030-05-05",
      edition: null,
    });
    expect(resolveExam(base, "2026-11-19").day1).toBe("2027-11-07");
  });
});
