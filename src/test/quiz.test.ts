import { describe, expect, it } from "vitest";
import { TOPIC_BY_ID } from "@/lib/data";
import { LEVELS } from "@/lib/question-types";
import { DAILY_COUNT, optionOrder, pickQuestions, withQuizResult } from "@/lib/quiz";
import { QUESTIONS, QUESTION_BY_ID } from "@/lib/questions";
import { ENEM_QUESTIONS } from "@/lib/questions-enem";

describe("question bank", () => {
  it("has unique ids, valid topics, five options and a valid answer", () => {
    expect(new Set(QUESTIONS.map((x) => x.id)).size).toBe(QUESTIONS.length);
    for (const x of QUESTIONS) {
      expect(TOPIC_BY_ID[x.topicId], x.id).toBeDefined();
      expect(x.options, x.id).toHaveLength(5);
      expect(new Set(x.options).size, x.id).toBe(5);
      expect(x.answer, x.id).toBeGreaterThanOrEqual(0);
      expect(x.answer, x.id).toBeLessThan(5);
      expect(x.why.length, x.id).toBeGreaterThan(10);
    }
  });

  it("has questions in all three levels, with enough ENEM-style material in the harder ones", () => {
    for (const l of LEVELS) expect(QUESTIONS.filter((x) => x.level === l).length, l).toBeGreaterThanOrEqual(15);
    const rich = (x: (typeof QUESTIONS)[number]) => Boolean(x.figure || x.table || x.passages?.length);
    const hard = QUESTIONS.filter((x) => x.level === "dificil");
    expect(hard.filter(rich).length / hard.length).toBeGreaterThan(0.8);
    expect(ENEM_QUESTIONS.filter(rich).length / ENEM_QUESTIONS.length).toBeGreaterThan(0.9);
    expect(QUESTIONS.filter((x) => x.level === "facil").every((x) => !x.figure)).toBe(true);
  });

  it("describes every figure in text and every table with consistent columns", () => {
    for (const x of QUESTIONS) {
      if (x.figure) {
        expect(x.figure.alt.length, x.id).toBeGreaterThan(30);
        expect(decodeURIComponent(x.figure.src.split(",")[1] ?? ""), x.id).toContain("<svg");
      }
      if (x.table) for (const row of x.table.rows) expect(row.length, x.id).toBe(x.table.head.length === 2 || x.table.head.length > 2 ? x.table.head.length : row.length);
      for (const p of x.passages ?? []) expect(p.body.length, x.id).toBeGreaterThan(20);
    }
  });

  it("covers every study topic", () => {
    const covered = new Set(QUESTIONS.map((x) => x.topicId));
    expect(Object.keys(TOPIC_BY_ID).filter((id) => !covered.has(id))).toEqual([]);
  });

  it("shuffles alternatives in a stable way without losing any", () => {
    for (const x of QUESTIONS) {
      const order = optionOrder(x);
      expect([...order].sort()).toEqual([0, 1, 2, 3, 4]);
      expect(optionOrder(x)).toEqual(order);
    }
    const slots = new Set(QUESTIONS.map((x) => optionOrder(x).indexOf(x.answer)));
    expect(slots.size).toBe(5);
  });
});

describe("daily selection", () => {
  const none = new Set<string>();

  it("returns the same set for the same day and a different one on another day", () => {
    const a = pickQuestions({ day: "2026-11-01", count: DAILY_COUNT, answered: none });
    expect(pickQuestions({ day: "2026-11-01", count: DAILY_COUNT, answered: none })).toEqual(a);
    expect(pickQuestions({ day: "2026-11-02", count: DAILY_COUNT, answered: none })).not.toEqual(a);
    expect(a).toHaveLength(DAILY_COUNT);
  });

  it("mixes levels in the daily set, weighted toward the harder ones", () => {
    const ids = pickQuestions({ day: "2026-11-07", count: DAILY_COUNT, answered: none });
    const levels = ids.map((id) => QUESTION_BY_ID[id]!.level);
    expect(levels.filter((l) => l === "dificil")).toHaveLength(2);
    expect(levels.filter((l) => l === "media")).toHaveLength(2);
    expect(levels.filter((l) => l === "facil")).toHaveLength(1);
  });

  it("returns only the chosen level, never an answered question", () => {
    const answered = new Set(QUESTIONS.filter((x) => x.level === "dificil").slice(0, 3).map((x) => x.id));
    const ids = pickQuestions({ day: "2026-11-08", count: 5, answered, level: "dificil" });
    expect(ids).toHaveLength(5);
    for (const id of ids) {
      expect(QUESTION_BY_ID[id]!.level).toBe("dificil");
      expect(answered.has(id)).toBe(false);
    }
    const all = new Set(QUESTIONS.filter((x) => x.level === "dificil").map((x) => x.id));
    expect(pickQuestions({ day: "2026-11-08", count: 5, answered: all, level: "dificil" })).toEqual([]);
  });

  it("never repeats an answered question while new ones remain", () => {
    const answered = new Set<string>();
    for (let i = 0; i < 15; i++) {
      const ids = pickQuestions({ day: `2026-11-${String(i + 1).padStart(2, "0")}`, count: DAILY_COUNT, answered });
      for (const id of ids) {
        expect(answered.has(id), id).toBe(false);
        answered.add(id);
      }
    }
    expect(answered.size).toBe(15 * DAILY_COUNT);
  });

  it("favours topics from today's plan", () => {
    const ids = pickQuestions({ day: "2026-11-03", count: DAILY_COUNT, answered: none, planTopics: new Set(["fis-ener", "mat-porc"]) });
    const topics = ids.map((id) => QUESTION_BY_ID[id]!.topicId);
    expect(topics.filter((t) => t === "fis-ener" || t === "mat-porc").length).toBeGreaterThanOrEqual(2);
  });

  it("limits each topic to two questions and avoids duplicates", () => {
    const ids = pickQuestions({ day: "2026-11-04", count: 10, answered: none, planTopics: new Set(["mat-porc"]) });
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => QUESTION_BY_ID[id]!.topicId === "mat-porc").length).toBeLessThanOrEqual(2);
  });

  it("excludes questions already in today's set when asking for more", () => {
    const first = pickQuestions({ day: "2026-11-05", count: DAILY_COUNT, answered: none });
    const more = pickQuestions({ day: "2026-11-05", count: DAILY_COUNT, answered: none, exclude: new Set(first) });
    expect(more.filter((id) => first.includes(id))).toEqual([]);
  });

  it("reuses answered questions once the bank is exhausted", () => {
    const all = new Set(QUESTIONS.map((x) => x.id));
    expect(pickQuestions({ day: "2026-11-06", count: DAILY_COUNT, answered: all })).toHaveLength(DAILY_COUNT);
  });
});

describe("performance integration", () => {
  it("groups the day's answers by subject in a single quiz entry", () => {
    let perf = withQuizResult([], "Matemática", true, "2026-11-01", "a");
    perf = withQuizResult(perf, "Matemática", false, "2026-11-01", "b");
    perf = withQuizResult(perf, "Física", true, "2026-11-01", "c");
    perf = withQuizResult(perf, "Matemática", true, "2026-11-02", "d");
    expect(perf).toHaveLength(3);
    expect(perf[0]).toMatchObject({ subject: "Matemática", total: 2, correct: 1, source: "quiz" });
  });
});
