import { describe, expect, it } from "vitest";
import { BANCAS, hasOfficialLink } from "@/lib/credits";
import { TOPIC_BY_ID } from "@/lib/data";
import { canShowContent, sourceLabel, type Question } from "@/lib/question-types";
import { QUESTIONS } from "@/lib/questions";
import { NEW_QUESTIONS } from "@/lib/questions-novas";

const ALL: Question[] = [...QUESTIONS, ...NEW_QUESTIONS.filter((q) => !q.revisada)];

describe("question bank integrity (published and pending review)", () => {
  it.each(ALL.map((q) => [q.id, q] as const))("%s is well formed", (_, q) => {
    expect(q.options).toHaveLength(5);
    expect(new Set(q.options.map((o) => o.trim())).size, "repeated alternatives").toBe(5);
    expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 5).toBe(true);
    expect(q.why.trim().length).toBeGreaterThan(20);
    expect(q.text.trim().length).toBeGreaterThan(10);
    // The id pattern carries the topic: "<topicId>-<number>".
    expect(q.id).toMatch(/^[a-z0-9-]+-\d+$/);
    expect(q.topicId).toBe(q.id.replace(/-\d+$/, ""));
    expect(TOPIC_BY_ID[q.topicId], `topic ${q.topicId}`).toBeDefined();
    if (q.porQue) expect(q.porQue).toHaveLength(q.options.length);
  });

  it("has unique ids across every file, including questions waiting for review", () => {
    const ids = [...QUESTIONS, ...NEW_QUESTIONS].map((q) => q.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect([...new Set(dup)]).toEqual(
      // A reviewed new question is in QUESTIONS and in NEW_QUESTIONS: that is the same question.
      NEW_QUESTIONS.filter((q) => q.revisada).map((q) => q.id),
    );
  });

  it("publishes only reviewed new questions", () => {
    for (const q of NEW_QUESTIONS) {
      expect(typeof q.revisada, q.id).toBe("boolean");
      expect(QUESTIONS.some((x) => x.id === q.id)).toBe(q.revisada === true);
    }
    expect(QUESTIONS.every((q) => q.revisada !== false)).toBe(true);
  });

  it("every real question shows its full source with an official link", () => {
    for (const q of ALL.filter((x) => x.source)) {
      expect(q.uso, q.id).toBeDefined();
      expect(hasOfficialLink(q), `${q.id}: ${q.source!.url}`).toBe(true);
      expect(sourceLabel(q.source!)).toMatch(/^(Enem|ITA|Fuvest) \d{4}, .+, questão \d+$/);
    }
  });

  it("shows the content of real questions only when released", () => {
    const source = {
      banca: "Enem" as const,
      ano: 2023,
      etapa: "1º dia",
      numero: 45,
      url: BANCAS.Enem.site!,
    };
    expect(canShowContent({})).toBe(true);
    expect(canShowContent({ source, uso: "liberada" })).toBe(true);
    expect(canShowContent({ source, uso: "em-verificacao" })).toBe(false);
    expect(canShowContent({ source, uso: "somente-link" })).toBe(false);
    expect(canShowContent({ source })).toBe(false);
    expect(sourceLabel(source)).toBe("Enem 2023, 1º dia, questão 45");
  });

  it("accepts only official hosts, and none for boards whose link is not confirmed yet", () => {
    const base = { ano: 2022, etapa: "1ª fase", numero: 1 };
    expect(hasOfficialLink({ source: { ...base, banca: "Enem", url: BANCAS.Enem.site! } })).toBe(
      true,
    );
    expect(
      hasOfficialLink({ source: { ...base, banca: "Enem", url: "https://exemplo.com/prova" } }),
    ).toBe(false);
    expect(
      hasOfficialLink({ source: { ...base, banca: "Enem", url: "http://www.gov.br/inep" } }),
    ).toBe(false);
    expect(
      hasOfficialLink({ source: { ...base, banca: "ITA", url: "https://www.gov.br/x" } }),
    ).toBe(false);
  });

  it("new questions mix levels in each topic they cover", () => {
    const topics = new Set(NEW_QUESTIONS.map((q) => q.topicId));
    for (const t of topics) {
      const all = [...QUESTIONS, ...NEW_QUESTIONS.filter((q) => !q.revisada)].filter(
        (q) => q.topicId === t,
      );
      const levels = new Set(all.map((q) => q.level));
      expect(levels.size, t).toBe(3);
      expect(all.length, t).toBeGreaterThanOrEqual(10);
    }
  });
});

describe("review list", () => {
  it("docs/revisao-questoes-novas.md lists every question waiting for review (run `bun run revisao`)", async () => {
    const { readFileSync } = await import("node:fs");
    const doc = readFileSync("docs/revisao-questoes-novas.md", "utf8");
    const listed = [...doc.matchAll(/^## (\S+) ·/gm)].map((m) => m[1]);
    expect(listed).toEqual(NEW_QUESTIONS.filter((q) => !q.revisada).map((q) => q.id));
  });
});
