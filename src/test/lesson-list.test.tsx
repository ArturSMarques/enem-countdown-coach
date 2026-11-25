import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonList } from "@/components/LessonList";
import type { Lesson } from "@/lib/lessons";

// Made-up lessons, only for this test (never part of LESSONS).
const lessons: Lesson[] = [
  {
    topicId: "mat-porc",
    nivel: "resolucao",
    videoId: "BBBBBBBBBBB",
    titulo: "Resolvendo questões",
    canal: "Canal B",
    selecionadaPor: "Prof. Teste",
    selecionadaEm: "2030-01-01",
  },
  {
    topicId: "mat-porc",
    nivel: "base",
    videoId: "AAAAAAAAAAA",
    titulo: "Porcentagem do zero",
    canal: "Canal A",
    duracao: "18 min",
    selecionadaPor: "Prof. Teste",
    selecionadaEm: "2030-01-01",
    recomendada: true,
  },
];

describe("selected lessons on screen", () => {
  it("groups by level, credits title, channel and teacher, and opens a plain https link", () => {
    render(<LessonList lessons={lessons} />);
    const levels = screen.getAllByText(/^(Base|Resolução de questões)$/).map((e) => e.textContent);
    expect(levels).toEqual(["Base", "Resolução de questões"]);
    const link = screen.getByRole("link", { name: /Porcentagem do zero/ });
    expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=AAAAAAAAAAA");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText(/Canal A · 18 min · Selecionada por Prof\. Teste/)).toBeInTheDocument();
    expect(screen.getByText("Recomendada")).toBeInTheDocument();
    // Same safe exit as the other lesson links (phase 1).
    expect(screen.getAllByRole("button", { name: /Copiar link/ })).toHaveLength(2);
    expect(document.body.textContent).not.toMatch(/melhor aula/i);
  });

  it("renders nothing when the topic has no selected lessons", () => {
    const { container } = render(<LessonList lessons={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
