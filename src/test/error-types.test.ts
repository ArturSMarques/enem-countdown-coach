import { describe, expect, it } from "vitest";
import { ERROR_CODES } from "@/lib/error-types";
import { QUESTION_BY_ID } from "@/lib/questions";
import { DEPTH_QUESTIONS } from "@/lib/questions-depth";

describe("error type of each wrong alternative", () => {
  it("covers every in-depth question, and only them", () => {
    expect(Object.keys(ERROR_CODES).sort()).toEqual(DEPTH_QUESTIONS.map((q) => q.id).sort());
  });

  it.each(Object.entries(ERROR_CODES))(
    "%s: one type per wrong alternative, '.' on the answer",
    (id, code) => {
      const q = QUESTION_BY_ID[id]!;
      expect(code).toMatch(/^[FICKD.]{5}$/);
      expect(code.length).toBe(q.options.length);
      expect(code.indexOf(".")).toBe(q.answer);
      expect(code.split(".").length - 1).toBe(1);
      expect(q.erros).toHaveLength(5);
      expect(q.erros![q.answer]).toBeNull();
      expect(q.erros!.filter((e) => e !== null)).toHaveLength(4);
    },
  );
});
