import { describe, expect, it } from "vitest";
import { TOPIC_BY_ID } from "@/lib/data";
import {
  curatedBy,
  isVideoId,
  LESSON_LEVELS,
  LESSONS,
  LESSONS_PER_TOPIC,
  lessonsOf,
  lessonURL,
  suggestedLesson,
  type Lesson,
} from "@/lib/lessons";

// Made-up lessons, only for these tests. They are not in LESSONS and are never shown in the app.
const fake = (over: Partial<Lesson>): Lesson => ({
  topicId: "mat-porc",
  nivel: "base",
  videoId: "AAAAAAAAAAA",
  titulo: "Aula de teste",
  canal: "Canal de teste",
  selecionadaPor: "Prof. Teste",
  selecionadaEm: "2030-01-01",
  ...over,
});

describe("selected lessons data (offline checks)", () => {
  it.each(LESSONS.map((l) => [l.videoId, l] as const))("%s is well formed", (_, l) => {
    expect(TOPIC_BY_ID[l.topicId], l.topicId).toBeDefined();
    expect(LESSON_LEVELS).toContain(l.nivel);
    expect(isVideoId(l.videoId)).toBe(true);
    expect(l.titulo.trim()).not.toBe("");
    expect(l.canal.trim()).not.toBe("");
    expect(l.selecionadaPor.trim()).not.toBe("");
    expect(l.selecionadaEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(`${l.titulo} ${l.selecionadaPor}`).not.toMatch(/melhor aula/i);
  });

  it("has no repeated video in a topic, at most one recommended and at most 4 per topic", () => {
    const topics = new Set(LESSONS.map((l) => l.topicId));
    for (const t of topics) {
      const list = LESSONS.filter((l) => l.topicId === t);
      expect(new Set(list.map((l) => l.videoId)).size, t).toBe(list.length);
      expect(list.filter((l) => l.recomendada).length, t).toBeLessThanOrEqual(1);
      expect(list.length, t).toBeLessThanOrEqual(LESSONS_PER_TOPIC.max);
    }
  });

  it("validates video ids and builds plain https links", () => {
    expect(isVideoId("AAAAAAAAAAA")).toBe(true);
    expect(isVideoId("a-b_c123XYZ")).toBe(true);
    expect(isVideoId("curto")).toBe(false);
    expect(isVideoId("AAAAAAAAAAA?x")).toBe(false);
    expect(isVideoId("AAAAAAAAAA!")).toBe(false);
    expect(lessonURL({ videoId: "AAAAAAAAAAA" })).toBe(
      "https://www.youtube.com/watch?v=AAAAAAAAAAA",
    );
  });

  it("orders a topic's lessons: recommended first, then by level, and suggests one", () => {
    const list = [
      fake({ videoId: "BBBBBBBBBBB", nivel: "resolucao" }),
      fake({ videoId: "CCCCCCCCCCC", nivel: "base" }),
      fake({ videoId: "DDDDDDDDDDD", nivel: "aprofundamento", recomendada: true }),
      fake({ videoId: "EEEEEEEEEEE", topicId: "mat-prob" }),
    ];
    expect(lessonsOf("mat-porc", list).map((l) => l.videoId)).toEqual([
      "DDDDDDDDDDD",
      "CCCCCCCCCCC",
      "BBBBBBBBBBB",
    ]);
    expect(suggestedLesson("mat-porc", list)?.videoId).toBe("DDDDDDDDDDD");
    expect(suggestedLesson("mat-porc", list.slice(0, 2))?.videoId).toBe("CCCCCCCCCCC");
    expect(suggestedLesson("mat-geop", list)).toBeUndefined();
  });

  it("credits the teacher without calling it the best lesson", () => {
    expect(curatedBy({ selecionadaPor: "Prof. Alexandre" })).toBe(
      "Selecionada por Prof. Alexandre",
    );
  });
});
