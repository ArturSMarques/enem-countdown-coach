import { describe, expect, it } from "vitest";
import { TOPIC_BY_ID, type Area } from "@/lib/data";
import { levelStats, stageOf, stagesByArea } from "@/lib/mastery";
import { addDays, buildPlan, type Config, type Stage } from "@/lib/planner";
import { QUESTIONS, QUESTION_BY_ID } from "@/lib/questions";
import type { QuizAnswer } from "@/lib/quiz";
import { pickQuestions } from "@/lib/quiz";

const area = (id: string) => TOPIC_BY_ID[QUESTION_BY_ID[id]!.topicId]!.area;
const mathOf = (level: string) =>
  QUESTIONS.filter((q) => q.level === level && area(q.id) === "mat");
const answer = (ids: string[], right: boolean): Record<string, QuizAnswer> =>
  Object.fromEntries(
    ids.map((id) => {
      const q = QUESTION_BY_ID[id]!;
      return [
        id,
        { choice: right ? q.answer : (q.answer + 1) % q.options.length, day: "2030-01-01" },
      ];
    }),
  );

describe("level mastery", () => {
  it("counts answers and hits per area and level", () => {
    const easy = mathOf("facil")
      .slice(0, 4)
      .map((q) => q.id);
    const stats = levelStats({
      ...answer(easy.slice(0, 3), true),
      ...answer(easy.slice(3), false),
    });
    expect(stats.mat?.facil).toEqual({ total: 4, correct: 3 });
    expect(stats.mat?.dificil).toEqual({ total: 0, correct: 0 });
  });

  it("sends back to the base who misses easy questions, and forward who masters medium and hard", () => {
    const s = (f: [number, number], m: [number, number], d: [number, number]) => ({
      facil: { total: f[0], correct: f[1] },
      media: { total: m[0], correct: m[1] },
      dificil: { total: d[0], correct: d[1] },
    });
    expect(stageOf(s([5, 2], [5, 5], [5, 5]))).toBe("base");
    expect(stageOf(s([5, 5], [5, 4], [4, 2]))).toBe("avancado");
    expect(stageOf(s([5, 5], [5, 3], [4, 1]))).toBe("regular");
    // Too few answers in a level do not decide anything.
    expect(stageOf(s([2, 0], [0, 0], [0, 0]))).toBe("regular");
    expect(stageOf(s([0, 0], [4, 1], [0, 0]))).toBe("base");
  });

  it("changes the plan: more base theory for 'base', more depth for 'avancado'", () => {
    const from = "2030-03-04";
    const cfg: Config = {
      examDate: addDays(from, 300),
      hours: 2,
      shift: "ambos",
      difficulty: { mat: 3, nat: 3, ling: 3, hum: 3 },
    };
    const count = (stages: Partial<Record<Area, Stage>>, activity: string) =>
      Object.values(buildPlan({ cfg, status: {}, perf: [], from, stages }))
        .flat()
        .filter((b) => TOPIC_BY_ID[b.topicId]!.area === "mat" && b.activity === activity).length;
    expect(count({ mat: "base" }, "Videoaula")).toBeGreaterThan(count({}, "Videoaula"));
    expect(count({ mat: "avancado" }, "Aprofundamento")).toBeGreaterThan(
      count({}, "Aprofundamento"),
    );
    expect(count({ mat: "base" }, "Aprofundamento")).toBe(0);
  });

  it("changes the daily questions: easier math for 'base', harder math for 'avancado'", () => {
    const math = (stages: Partial<Record<Area, Stage>>, level: string) =>
      pickQuestions({ day: "2030-05-05", count: 10, answered: new Set(), stages }).filter(
        (id) => area(id) === "mat" && QUESTION_BY_ID[id]!.level === level,
      ).length;
    expect(math({ mat: "base" }, "facil")).toBeGreaterThan(math({}, "facil"));
    expect(math({ mat: "avancado" }, "dificil")).toBeGreaterThan(math({}, "dificil"));
    expect(stagesByArea({})).toEqual({});
  });
});
