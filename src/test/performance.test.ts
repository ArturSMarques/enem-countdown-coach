import { describe, expect, it } from "vitest";
import { addDays } from "@/lib/planner";
import { areaScores, pendingSentence, pendingTopics, PERFORMANCE_CONFIG } from "@/lib/performance";
import { QUESTION_BY_ID, QUESTIONS, type Question } from "@/lib/questions";
import type { Attempt } from "@/lib/topic-mastery";

const today = "2030-05-20";
const att = (q: Question, correct: boolean, day = today, choice?: number): Attempt => ({
  questionId: q.id,
  choice: choice ?? (correct ? q.answer : (q.answer + 1) % q.options.length),
  correct,
  day,
});
const mat = (level: Question["level"]) =>
  QUESTIONS.filter((q) => q.topicId.startsWith("mat-") && q.level === level);

describe("pentagon by area", () => {
  it("shows 'sem dados' below the minimum and for the essay", () => {
    const s = areaScores([att(mat("facil")[0]!, true)], today);
    expect(s.map((x) => x.area)).toEqual(["ling", "hum", "nat", "mat", "red"]);
    expect(s.find((x) => x.area === "mat")).toMatchObject({
      value: null,
      reason: "poucas",
      answers: 1,
    });
    expect(s.find((x) => x.area === "red")).toMatchObject({ value: null, reason: "redacao" });
  });

  it("weights hits by difficulty and grows with hits", () => {
    const n = PERFORMANCE_CONFIG.minAnswersPerArea;
    // One hard hit (3) and four easy misses (4): 3/7 ≈ 43%.
    const a = [
      att(mat("dificil")[0]!, true),
      ...mat("facil")
        .slice(0, n - 1)
        .map((q) => att(q, false)),
    ];
    expect(areaScores(a, today).find((x) => x.area === "mat")!.value).toBe(43);
    const better = [
      ...a.slice(0, 1),
      ...mat("facil")
        .slice(0, n - 1)
        .map((q) => att(q, true)),
    ];
    expect(areaScores(better, today).find((x) => x.area === "mat")!.value).toBe(100);
  });

  it("ignores answers older than the window", () => {
    const old = addDays(today, -PERFORMANCE_CONFIG.recentDays);
    const a = mat("facil")
      .slice(0, 6)
      .map((q) => att(q, true, old));
    expect(areaScores(a, today).find((x) => x.area === "mat")!.value).toBeNull();
  });
});

describe("pendências a melhorar", () => {
  it("lists topics with recent misses, most misses first, with a tip", () => {
    const porc = QUESTIONS.filter((q) => q.topicId === "mat-porc");
    const prob = QUESTIONS.filter((q) => q.topicId === "mat-prob");
    const p = pendingTopics(
      [att(porc[0]!, false), att(porc[1]!, false), att(prob[0]!, false), att(prob[1]!, true)],
      today,
    );
    expect(p.map((x) => x.topicId)).toEqual(["mat-porc", "mat-prob"]);
    expect(p[0]!.misses).toBe(2);
    expect(p[0]!.tip.length).toBeGreaterThan(5);
  });

  it("names the kind of error from the alternative the student chose", () => {
    const q = QUESTION_BY_ID["mat-porc-6"]!; // alternative 0: summed the percentages (fórmula)
    const [p] = pendingTopics([att(q, false, today, 0)], today);
    expect(p!.lastError).toMatchObject({ type: "formula", label: "na fórmula" });
    expect(pendingSentence(p!)).toBe(
      "Em Porcentagem, você errou na fórmula: somou os percentuais (18%) e aplicou de uma vez sobre o bruto.",
    );
  });

  it("without an error type, still says what happened, in a neutral tone", () => {
    const q = QUESTIONS.find((x) => x.topicId === "mat-porc" && !x.erros)!;
    const [p] = pendingTopics([att(q, false)], today);
    expect(p!.lastError).toBeUndefined();
    expect(pendingSentence(p!)).toBe("Em Porcentagem, houve 1 erro recente.");
  });

  it("leaves out topics without misses and limits the list", () => {
    expect(pendingTopics([att(mat("facil")[0]!, true)], today)).toEqual([]);
    const many = QUESTIONS.filter((q) => q.level === "facil").map((q) => att(q, false));
    expect(pendingTopics(many, today)).toHaveLength(PERFORMANCE_CONFIG.maxPending);
  });
});
