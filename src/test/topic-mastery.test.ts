import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/data";
import { MASTERY_CONFIG } from "@/lib/mastery-config";
import { addDays, buildPlan, LEVEL_W, type Config } from "@/lib/planner";
import { QUESTIONS, type Question } from "@/lib/questions";
import { migrate, STATE_VERSION } from "@/lib/store";
import {
  attemptsFromQuiz,
  BANK_SIZE,
  topicLevels,
  topicMastery,
  type Attempt,
} from "@/lib/topic-mastery";

const today = "2030-05-20";
// A topic with easy, medium and hard questions in the bank.
const topicId = TOPICS.find((t) =>
  (["facil", "media", "dificil"] as const).every((l) =>
    QUESTIONS.some((q) => q.topicId === t.id && q.level === l),
  ),
)!.id;
const of = (level: Question["level"]) =>
  QUESTIONS.find((q) => q.topicId === topicId && q.level === level)!;
const hit = (level: Question["level"], day = today): Attempt => {
  const q = of(level);
  return { questionId: q.id, choice: q.answer, correct: true, day };
};
const miss = (level: Question["level"], day = today): Attempt => {
  const q = of(level);
  return { questionId: q.id, choice: (q.answer + 1) % q.options.length, correct: false, day };
};
const levelOf = (attempts: Attempt[]) => topicMastery(topicId, attempts, today).level;
/** Runs `fn` as if the topic had `size` questions in the bank. */
function withBank<T>(size: number, fn: () => T): T {
  const before = BANK_SIZE[topicId];
  BANK_SIZE[topicId] = size;
  try {
    return fn();
  } finally {
    BANK_SIZE[topicId] = before!;
  }
}

describe("computed mastery (stricter initial values)", () => {
  it("starts at 'Não iniciado' and goes to 'Básico' with one answer", () => {
    expect(levelOf([])).toBe("nao_iniciado");
    expect(levelOf([miss("facil")])).toBe("basico");
  });

  it("'Desenvolvendo' needs 3 answers and 50% weighted hits", () => {
    expect(levelOf([hit("facil"), hit("facil")])).toBe("basico");
    // 1 easy miss (w1) + 1 medium hit (w2) + 1 easy miss (w1): 2/4 = 50%.
    expect(levelOf([miss("facil"), hit("media"), miss("facil")])).toBe("desenvolvendo");
    // Same count but 1/4 = 25%.
    expect(levelOf([hit("facil"), miss("media"), miss("facil")])).toBe("basico");
  });

  it("weights hits by difficulty (easy 1, medium 2, hard 3)", () => {
    const m = topicMastery(topicId, [hit("dificil"), miss("facil")], today);
    expect(m.rate).toBeCloseTo(3 / 4);
  });

  it("'Avançado' needs 5 answers, 75% and one medium hit", () => {
    const five = [hit("facil"), hit("facil"), hit("dificil"), hit("media"), miss("facil")];
    expect(levelOf(five)).toBe("avancado"); // (1+1+3+2)/(1+1+3+2+1) = 87.5%
    // No medium hit: stays at Desenvolvendo.
    expect(levelOf([hit("facil"), hit("facil"), hit("dificil"), hit("facil"), miss("facil")])).toBe(
      "desenvolvendo",
    );
    // 70% is not enough with the stricter values: (2+3+1+1)/(2+3+1+1+2+1) = 70%.
    expect(
      levelOf([
        hit("media"),
        hit("dificil"),
        hit("facil"),
        hit("facil"),
        miss("media"),
        miss("facil"),
      ]),
    ).toBe("desenvolvendo");
  });

  it("caps at 'Avançado' when the bank has fewer than 8 questions, and says so", () => {
    const strong = [
      ...Array.from({ length: 6 }, () => hit("facil")),
      hit("media"),
      hit("dificil"),
      hit("dificil"),
    ];
    const capped = withBank(7, () => topicMastery(topicId, strong, today));
    expect(capped.level).toBe("avancado");
    expect(capped.capped).toBe(true);
    expect(capped.next).toMatch(/Faltam questões novas neste tópico/);
    expect(withBank(8, () => levelOf(strong))).toBe("dominado");
  });

  it("'Dominado' needs 90%, a hard hit and the last 3 without a serious miss", () => {
    const base = Array.from({ length: 8 }, () => hit("facil"));
    // No hard hit.
    expect(withBank(10, () => levelOf([...base, hit("media")]))).toBe("avancado");
    // A miss on an easy question among the last 3 (serious), even with a high rate.
    const lateMiss = [
      ...base,
      hit("media"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      miss("facil"),
    ];
    expect(withBank(10, () => levelOf(lateMiss))).toBe("avancado");
    // A miss on a hard question is not serious.
    const hardMiss = [
      ...base,
      hit("media"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      hit("dificil"),
      miss("dificil"),
    ];
    expect(withBank(10, () => topicMastery(topicId, hardMiss, today).rate)).toBeGreaterThanOrEqual(
      0.9,
    );
    expect(withBank(10, () => levelOf(hardMiss))).toBe("dominado");
  });

  it("only the last 30 days count, so the level drops without practice", () => {
    const old = addDays(today, -MASTERY_CONFIG.recentDays);
    const strong = [
      hit("facil", old),
      hit("facil", old),
      hit("dificil", old),
      hit("media", old),
      hit("facil", old),
    ];
    const m = topicMastery(topicId, strong, today);
    expect(m.level).toBe("basico");
    expect(m.stale).toBe(true);
    expect(m.next).toMatch(/Faz mais de 30 dias/);
    // Same answers inside the window: Avançado.
    const recent = strong.map((a) => ({
      ...a,
      day: addDays(today, -(MASTERY_CONFIG.recentDays - 1)),
    }));
    expect(levelOf(recent)).toBe("avancado");
  });

  it("says what is missing to go up", () => {
    expect(topicMastery(topicId, [], today).next).toMatch(/Responda uma questão/);
    expect(topicMastery(topicId, [hit("facil")], today).next).toBe(
      "Faltam 2 questões com bom desempenho para chegar a Desenvolvendo.",
    );
    expect(topicMastery(topicId, [hit("facil"), hit("facil"), hit("facil")], today).next).toBe(
      "Para chegar a Avançado: mais 2 questões, acertar uma questão média.",
    );
  });

  it("ignores manual marks: only answers count", () => {
    expect(topicLevels([], today)).toEqual({});
    expect(topicLevels([hit("facil")], today)).toEqual({ [topicId]: "basico" });
  });
});

describe("planner uses the computed level", () => {
  const from = "2030-03-04";
  const cfg: Config = {
    examDate: addDays(from, 200),
    hours: 2,
    shifts: ["manha", "noite"],
    difficulty: { mat: 6, nat: 6, ling: 6, hum: 6 },
  };
  const count = (status: Record<string, never> | Record<string, string>) =>
    Object.values(buildPlan({ cfg, status: status as never, perf: [], from }))
      .flat()
      .filter((b) => b.topicId === topicId).length;

  it("keeps the old anchors and interpolates the levels in between", () => {
    expect(LEVEL_W.nao_iniciado).toBe(1.2);
    expect(LEVEL_W.desenvolvendo).toBe(1);
    expect(LEVEL_W.dominado).toBe(0.35);
    expect(LEVEL_W.basico).toBeLessThan(1.2);
    expect(LEVEL_W.basico).toBeGreaterThan(1);
    expect(LEVEL_W.avancado).toBeLessThan(1);
    expect(LEVEL_W.avancado).toBeGreaterThan(0.35);
  });

  it("a topic at Avançado gets fewer blocks than one not started", () => {
    expect(count({ [topicId]: "avancado" })).toBeLessThan(count({}));
  });
});

describe("attempts history in version 3", () => {
  const q = QUESTIONS[0]!;
  const wrong = (q.answer + 1) % q.options.length;
  const q2 = QUESTIONS[1]!;
  const savedV2 = {
    version: 2,
    config: null,
    quiz: {
      [q2.id]: { choice: q2.answer, day: "2026-11-03" },
      [q.id]: { choice: wrong, day: "2026-11-01" },
      "id-que-nao-existe": { choice: 0, day: "2026-11-02" },
    },
    status: { "mat-porc": "dominado" },
  };

  it("fills attempts from quiz, oldest first, keeping quiz and the old marks", () => {
    const s = migrate(savedV2, "2026-11-24");
    expect(s.version).toBe(STATE_VERSION);
    expect(s.attempts).toEqual([
      { questionId: q.id, choice: wrong, correct: false, day: "2026-11-01" },
      { questionId: q2.id, choice: q2.answer, correct: true, day: "2026-11-03" },
    ]);
    expect(s.quiz).toEqual(savedV2.quiz);
    expect(s.status).toEqual({ "mat-porc": "dominado" });
  });

  it("also fills a version 3 state saved before attempts existed, and keeps existing ones", () => {
    const early = migrate({ ...savedV2, version: 3 }, "2026-11-24");
    expect(early.attempts).toHaveLength(2);
    const kept: Attempt[] = [
      { questionId: q.id, choice: 0, correct: q.answer === 0, day: "2026-11-20", ms: 4200 },
    ];
    expect(migrate({ ...savedV2, version: 3, attempts: kept }, "2026-11-24").attempts).toEqual(
      kept,
    );
  });

  it("attemptsFromQuiz is safe on an empty record", () => {
    expect(attemptsFromQuiz({})).toEqual([]);
  });
});
