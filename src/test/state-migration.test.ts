import { describe, expect, it } from "vitest";
import { addDays, diffDays, HORIZON_DAYS, type Block } from "@/lib/planner";
import { extendPlan, migrate, refresh, STATE_VERSION } from "@/lib/store";

const difficulty = { mat: 3, nat: 3, ling: 3, hum: 3 };
const block = (id: string, done = true): Block => ({
  id,
  topicId: "mat-porc",
  activity: "Questões",
  minutes: 30,
  shift: "manha",
  done,
});
/** A state saved by the previous version of the app (no version field, fixed exam date). */
const v1 = (examDate: string) => ({
  config: { examDate, hours: 1.5, shift: "ambos", difficulty },
  plan: { "2026-11-01": [block("a")], "2026-11-02": [block("b")] },
  status: { "mat-porc": "revisar" },
  perf: [{ id: "p", date: "2026-11-02", subject: "Matemática", total: 5, correct: 3 }],
  links: [{ id: "l", title: "Canal", url: "https://www.youtube.com/@x", area: "mat" }],
  checklist: { doc: true },
  studied: ["2026-11-01", "2026-11-02"],
  skipped: [],
  theme: "dark",
  quiz: { "mat-porc-1": { choice: 2, day: "2026-11-02" } },
  quizDaily: { "2026-11-02": ["mat-porc-1"] },
});

describe("saved state migration", () => {
  it("turns the old fixed 2026 date, now in the past, into the automatic target edition", () => {
    const today = "2026-11-19";
    const s = refresh(migrate(v1("2026-11-08"), today), today);
    expect(s.version).toBe(STATE_VERSION);
    expect(s.config?.dateMode).toBe("auto");
    expect(s.config?.examDate).toBe("2027-11-07");
    // Nothing the student did is lost.
    expect(s.plan["2026-11-01"]).toEqual([block("a")]);
    expect(s.studied).toEqual(["2026-11-01", "2026-11-02"]);
    expect(s.quiz["mat-porc-1"]).toEqual({ choice: 2, day: "2026-11-02" });
    expect(s.perf).toHaveLength(1);
    expect(s.links).toHaveLength(1);
    expect(s.status["mat-porc"]).toBe("revisar");
    expect(s.theme).toBe("dark");
    // The new edition gets a fresh checklist and a rolling plan from today.
    expect(s.checklist).toEqual({});
    expect(s.checklistYear).toBe(2027);
    expect(s.plan[today]?.length).toBeGreaterThan(0);
    expect(s.plan[addDays(today, HORIZON_DAYS)]).toBeUndefined();
  });

  it("keeps a future date the student typed as manual, and a future edition date as that edition", () => {
    const today = "2026-11-19";
    expect(migrate(v1("2027-10-30"), today).config).toMatchObject({
      dateMode: "manual",
      examDate: "2027-10-30",
    });
    expect(migrate(v1("2027-11-07"), today).config?.dateMode).toBe("auto");
    expect(migrate(v1("2028-11-05"), today).config).toMatchObject({
      dateMode: "edicao",
      edition: 2028,
    });
  });

  it("is safe on empty or broken data and does not touch a current state", () => {
    expect(migrate(null, "2026-11-19").config).toBeNull();
    expect(migrate("garbage", "2026-11-19").plan).toEqual({});
    const current = migrate(v1("2027-10-30"), "2026-11-19");
    expect(migrate(JSON.parse(JSON.stringify(current)), "2026-11-19")).toEqual(current);
  });

  it("switches to the next edition by itself once the exam is over", () => {
    const during = refresh(migrate(v1("2026-11-08"), "2026-11-15"), "2026-11-15");
    expect(during.config?.examDate).toBe("2026-11-08");
    expect(during.checklist).toEqual({ doc: true });
    const after = refresh(during, "2026-11-16");
    expect(after.config?.examDate).toBe("2027-11-07");
    expect(after.checklist).toEqual({});
  });

  it("extends the rolling plan when fewer than four weeks are left in it", () => {
    const today = "2026-11-19";
    const s = refresh(migrate(v1("2026-11-08"), today), today);
    const later = addDays(today, 40);
    const extended = extendPlan(s, later);
    const lastDay = Object.keys(extended.plan).sort().at(-1)!;
    expect(diffDays(later, lastDay)).toBeGreaterThanOrEqual(HORIZON_DAYS - 2);
    // Days already planned are kept as they were.
    expect(extended.plan[addDays(today, 10)]).toEqual(s.plan[addDays(today, 10)]);
    expect(extendPlan(s, addDays(today, 5))).toBe(s);
  });
});
