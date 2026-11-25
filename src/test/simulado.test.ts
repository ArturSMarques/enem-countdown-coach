import { describe, expect, it } from "vitest";
import { TOPIC_BY_ID } from "@/lib/data";
import { QUESTION_BY_ID } from "@/lib/questions";
import { clock, pickSimulado, simuladoResult, timeLimitSeconds } from "@/lib/simulado";

const day = "2030-05-20";

describe("mini-simulado", () => {
  it("picks questions of the chosen area only, without repeats", () => {
    for (const area of ["mat", "nat", "hum", "ling"] as const) {
      const ids = pickSimulado({ area, count: 10, day, seed: "1", answered: new Set() });
      expect(ids).toHaveLength(10);
      expect(new Set(ids).size).toBe(10);
      for (const id of ids) expect(TOPIC_BY_ID[QUESTION_BY_ID[id]!.topicId]!.area).toBe(area);
    }
  });

  it("respects the league ceiling and varies with the seed", () => {
    const easy = pickSimulado({
      area: "mat",
      count: 10,
      day,
      seed: "1",
      answered: new Set(),
      league: "fundamentos",
    });
    expect(new Set(easy.map((id) => QUESTION_BY_ID[id]!.level))).toEqual(new Set(["facil"]));
    const a = pickSimulado({ area: "mat", count: 10, day, seed: "1", answered: new Set() });
    const b = pickSimulado({ area: "mat", count: 10, day, seed: "2", answered: new Set() });
    expect(a).not.toEqual(b);
  });

  it("prefers questions never answered", () => {
    const first = pickSimulado({ area: "mat", count: 10, day, seed: "1", answered: new Set() });
    const next = pickSimulado({ area: "mat", count: 10, day, seed: "1", answered: new Set(first) });
    expect(next.filter((id) => first.includes(id))).toEqual([]);
  });

  it("gives 3 minutes per question and formats the clock", () => {
    expect(timeLimitSeconds(10)).toBe(1800);
    expect(clock(1800)).toBe("30:00");
    expect(clock(65)).toBe("01:05");
    expect(clock(-3)).toBe("00:00");
  });

  it("scores hits, blanks as misses, and lists topics from weakest", () => {
    const ids = pickSimulado({ area: "mat", count: 10, day, seed: "1", answered: new Set() });
    const q0 = QUESTION_BY_ID[ids[0]!]!;
    const q1 = QUESTION_BY_ID[ids[1]!]!;
    const r = simuladoResult(
      ids,
      {
        [q0.id]: { choice: q0.answer, ms: 1000 },
        [q1.id]: { choice: (q1.answer + 1) % 5, ms: 1000 },
      },
      600,
    );
    expect(r).toMatchObject({ total: 10, answered: 2, hits: 1, usedSeconds: 600 });
    expect(r.rate).toBeCloseTo(0.1);
    expect(r.byTopic.reduce((s, t) => s + t.total, 0)).toBe(10);
    const rates = r.byTopic.map((t) => t.hits / t.total);
    expect([...rates].sort((a, b) => a - b)).toEqual(rates);
  });
});
