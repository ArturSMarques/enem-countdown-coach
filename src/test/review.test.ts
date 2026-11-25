import { describe, expect, it } from "vitest";
import { addDays, buildPlan, type Config } from "@/lib/planner";
import { QUESTIONS, type Question } from "@/lib/questions";
import { adaptiveReviews, inDays, REVIEW_STEPS, reviewSchedule, reviewsDue } from "@/lib/review";
import type { Attempt } from "@/lib/topic-mastery";

const d0 = "2030-03-04";
const porc = QUESTIONS.filter((q) => q.topicId === "mat-porc");
const prob = QUESTIONS.filter((q) => q.topicId === "mat-prob");
const att = (q: Question, correct: boolean, day: string): Attempt => ({
  questionId: q.id,
  choice: correct ? q.answer : (q.answer + 1) % 5,
  correct,
  day,
});

describe("adaptive spaced review", () => {
  it("a first day all right comes back in 3 days, and each right review grows the gap", () => {
    let a = [att(porc[0]!, true, d0)];
    expect(reviewSchedule(a)["mat-porc"]).toMatchObject({ due: addDays(d0, 3), missed: false });
    a = [...a, att(porc[1]!, true, addDays(d0, 3))];
    expect(reviewSchedule(a)["mat-porc"]!.due).toBe(addDays(d0, 3 + 7));
    a = [...a, att(porc[2]!, true, addDays(d0, 10)), att(porc[3]!, true, addDays(d0, 24))];
    expect(reviewSchedule(a)["mat-porc"]!.due).toBe(addDays(d0, 24 + 30));
    // It stays at the last step.
    a = [...a, att(porc[4]!, true, addDays(d0, 54))];
    expect(reviewSchedule(a)["mat-porc"]!.due).toBe(addDays(d0, 54 + REVIEW_STEPS.at(-1)!));
  });

  it("a miss brings the topic back the next day", () => {
    const a = [
      att(porc[0]!, true, d0),
      att(porc[1]!, true, addDays(d0, 3)),
      att(porc[2]!, false, addDays(d0, 10)),
    ];
    expect(reviewSchedule(a)["mat-porc"]).toMatchObject({ due: addDays(d0, 11), missed: true });
    // One miss on the day is enough, even with hits.
    const mixed = [att(porc[0]!, true, d0), att(porc[1]!, false, d0)];
    expect(reviewSchedule(mixed)["mat-porc"]!.due).toBe(addDays(d0, 1));
  });

  it("lists today's reviews, the most overdue and missed first", () => {
    const a = [att(porc[0]!, true, d0), att(prob[0]!, false, addDays(d0, 2))];
    const today = addDays(d0, 3);
    expect(reviewsDue(a, today).map((r) => r.topicId)).toEqual(["mat-prob", "mat-porc"]);
    expect(reviewsDue(a, addDays(d0, 1))).toEqual([]);
    expect(inDays(d0, addDays(d0, 1))).toBe("amanhã");
    expect(inDays(d0, addDays(d0, 7))).toBe("em 7 dias");
  });

  it("puts answered topics in the plan on their due day, overdue ones on the first day", () => {
    const a = [att(porc[0]!, true, d0), att(prob[0]!, false, d0)];
    const from = addDays(d0, 5);
    const { reviews, topics } = adaptiveReviews(a, from, addDays(from, 30));
    expect(topics).toEqual(new Set(["mat-porc", "mat-prob"]));
    expect(reviews[from]?.sort()).toEqual(["mat-porc", "mat-prob"]);
    expect(adaptiveReviews(a, from, addDays(from, 30), false).reviews).toEqual({});
  });

  it("the plan schedules those reviews and skips fixed gaps for answered topics", () => {
    const cfg: Config = {
      examDate: addDays(d0, 200),
      hours: 2,
      shifts: ["manha", "noite"],
      difficulty: { mat: 6, nat: 6, ling: 6, hum: 6 },
    };
    const day = addDays(d0, 1);
    const plan = buildPlan({
      cfg,
      status: {},
      perf: [],
      from: day,
      reviews: { [day]: ["mat-prob"] },
      adaptiveTopics: new Set(["mat-prob"]),
    });
    expect(plan[day]!.some((b) => b.topicId === "mat-prob" && b.activity === "Revisão")).toBe(true);
  });
});
