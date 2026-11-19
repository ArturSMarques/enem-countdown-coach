import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExerciseCard } from "@/components/TopicDepth";
import { CONTENT } from "@/lib/content";
import { TOPIC_BY_ID } from "@/lib/data";

describe("topic depth content", () => {
  const all = Object.values(CONTENT);

  it("only describes existing topics and links to existing topics", () => {
    expect(all.length).toBeGreaterThan(0);
    for (const c of all) {
      expect(TOPIC_BY_ID[c.topicId], c.topicId).toBeDefined();
      for (const id of c.conexoes ?? [])
        expect(TOPIC_BY_ID[id], `${c.topicId} → ${id}`).toBeDefined();
    }
  });

  it("has a summary, a base layer and traps for every topic, and well-formed exercises", () => {
    for (const c of all) {
      expect(c.resumo.length, c.topicId).toBeGreaterThanOrEqual(3);
      expect(c.base.texto.length, c.topicId).toBeGreaterThan(0);
      expect(c.armadilhas.length, c.topicId).toBeGreaterThanOrEqual(2);
      for (const layer of [c.base, c.intermediario, c.avancado])
        for (const ex of layer?.exemplos ?? []) {
          expect(ex.passos.length, c.topicId).toBeGreaterThan(0);
          expect(ex.resposta.length, c.topicId).toBeGreaterThan(0);
        }
      for (const ex of c.exercicios ?? []) {
        if (ex.tipo === "opcoes") {
          expect(ex.resposta, c.topicId).toBeGreaterThanOrEqual(0);
          expect(ex.resposta, c.topicId).toBeLessThan(ex.opcoes.length);
        } else expect(Number.isFinite(ex.resposta), c.topicId).toBe(true);
        expect(ex.explicacao.length, c.topicId).toBeGreaterThan(10);
      }
    }
  });
});

describe("ExerciseCard", () => {
  it("accepts a numeric answer written with a comma, within the tolerance", () => {
    render(
      <ExerciseCard
        index={0}
        exercise={{
          tipo: "numero",
          pergunta: "Quanto?",
          resposta: 0.5,
          tolerancia: 0.01,
          unidade: "mol",
          explicacao: "Porque sim, de verdade.",
        }}
      />,
    );
    fireEvent.change(screen.getByLabelText("Sua resposta"), { target: { value: "0,5" } });
    fireEvent.click(screen.getByRole("button", { name: "Conferir" }));
    expect(screen.getByRole("status")).toHaveTextContent("Certo!");
    fireEvent.change(screen.getByLabelText("Sua resposta"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Conferir" }));
    expect(screen.getByRole("status")).toHaveTextContent("Ainda não");
  });

  it("gives immediate feedback on multiple choice", () => {
    render(
      <ExerciseCard
        index={1}
        exercise={{
          tipo: "opcoes",
          pergunta: "Qual?",
          opcoes: ["Errada", "Certa"],
          resposta: 1,
          explicacao: "A segunda é a certa.",
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Certa" }));
    expect(screen.getByRole("status")).toHaveTextContent("Certo!");
  });
});

describe("topic priorities", () => {
  it("follow the incidence counted in the official 2024–2026 exams", async () => {
    const { TOPICS } = await import("@/lib/data");
    const { incidenceTotal, INCIDENCE } = await import("@/lib/incidence");
    for (const t of TOPICS) {
      if (t.area === "red") continue;
      expect(INCIDENCE[t.id], t.id).toBeDefined();
      const n = incidenceTotal(t.id);
      expect(t.priority, `${t.id} (${n})`).toBe(n >= 6 ? "alta" : n >= 3 ? "media" : "baixa");
    }
    for (const id of Object.keys(INCIDENCE))
      expect(
        TOPICS.some((t) => t.id === id),
        id,
      ).toBe(true);
  });
});
