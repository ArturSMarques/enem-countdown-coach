import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestionCard } from "@/components/QuestionCard";
import { BANCAS } from "@/lib/credits";
import type { Question } from "@/lib/question-types";
import { pickQuestions } from "@/lib/quiz";
import { QUESTIONS } from "@/lib/questions";

// A made-up real question, only to test how the app treats one (not part of the bank).
const real = (uso: Question["uso"] | undefined): Question => {
  const q: Question = {
    ...QUESTIONS[0]!,
    id: "mat-porc-900",
    source: { banca: "Enem", ano: 2023, etapa: "1º dia", numero: 45, url: BANCAS.Enem.site! },
  };
  if (uso) q.uso = uso;
  return q;
};

describe("real exam questions on screen", () => {
  it("shows the full origin and official link, and the content only when released", () => {
    render(
      <QuestionCard question={real("liberada")} index={0} choice={undefined} onAnswer={() => {}} />,
    );
    expect(screen.getByText("Enem 2023, 1º dia, questão 45")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ver no site oficial" })).toHaveAttribute(
      "href",
      BANCAS.Enem.site,
    );
    expect(screen.getAllByRole("button").length).toBe(5);
  });

  it.each(["em-verificacao", "somente-link", undefined] as const)(
    "with uso %s shows only the reference and link, no statement or alternatives",
    (uso) => {
      const q = real(uso);
      render(<QuestionCard question={q} index={0} choice={undefined} onAnswer={() => {}} />);
      expect(screen.getByText("Enem 2023, 1º dia, questão 45")).toBeInTheDocument();
      expect(screen.getByText(/enunciado não é reproduzido/)).toBeInTheDocument();
      expect(screen.queryByText(q.text)).toBeNull();
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    },
  );

  it("never puts an unreleased real question in the daily set", () => {
    const bank = [real("somente-link"), real("em-verificacao")];
    expect(pickQuestions({ day: "2030-01-01", bank, count: 5, answered: new Set() })).toEqual([]);
  });
});
