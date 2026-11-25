import { describe, expect, it } from "vitest";
import { formatMs, leagueOf, xpOf, type XpSource } from "@/lib/league";
import { INACTIVITY_DAYS, LEAGUES, XP_RULES } from "@/lib/league-config";
import { addDays, type Block } from "@/lib/planner";
import { pickQuestions } from "@/lib/quiz";
import { BANCAS } from "@/lib/credits";
import { QUESTION_BY_ID, QUESTIONS, type Question } from "@/lib/questions";
import type { Attempt } from "@/lib/topic-mastery";

const today = "2030-05-20";
const empty: XpSource = { attempts: [], plan: {}, studied: [] };
const of = (level: Question["level"]) => QUESTIONS.find((q) => q.level === level)!;
const att = (q: Question, correct: boolean, day = today): Attempt => ({
  questionId: q.id,
  choice: correct ? q.answer : (q.answer + 1) % 5,
  correct,
  day,
});
const block = (done: boolean): Block => ({
  id: Math.random().toString(36),
  topicId: "mat-porc",
  activity: "Questões",
  minutes: 30,
  shift: "manha",
  done,
});

describe("XP", () => {
  it("counts answers, hits by level, finished blocks and streak days", () => {
    const s: XpSource = {
      attempts: [
        att(of("facil"), true),
        att(of("media"), true),
        att(of("dificil"), true),
        att(of("facil"), false),
      ],
      plan: { [today]: [block(true), block(true), block(false)] },
      studied: [addDays(today, -2), addDays(today, -1), today],
    };
    const x = xpOf(s);
    expect(x.answers).toBe(4 * XP_RULES.answer + 5 + 10 + 20);
    expect(x.blocks).toBe(2 * XP_RULES.block);
    expect(x.streak).toBe(5 + 10 + 15);
    expect(x.total).toBe(x.answers + x.blocks + x.streak);
  });

  it("caps the streak bonus and restarts it after a gap", () => {
    const days = Array.from({ length: 10 }, (_, i) => addDays(today, i - 9));
    expect(xpOf({ ...empty, studied: days }).streak).toBe(5 + 10 + 15 + 20 + 25 + 30 + 35 * 4);
    expect(xpOf({ ...empty, studied: [addDays(today, -3), today] }).streak).toBe(10);
  });

  it("ignores attempts on questions that no longer exist", () => {
    expect(
      xpOf({ ...empty, attempts: [{ questionId: "x-1", choice: 0, correct: true, day: today }] })
        .total,
    ).toBe(0);
  });
});

describe("leagues", () => {
  const withXp = (blocks: number): XpSource => ({
    ...empty,
    plan: { [today]: Array.from({ length: blocks }, () => block(true)) },
  });

  it("starts in Fundamentos and goes up at the configured limits", () => {
    expect(leagueOf(empty, today)).toMatchObject({ id: "fundamentos", xp: 0, paused: false });
    expect(leagueOf(withXp(40), today).id).toBe("basico"); // 400 XP
    expect(leagueOf(withXp(150), today).id).toBe("intermediario"); // 1.500 XP
    expect(leagueOf(withXp(800), today)).toMatchObject({ id: "elite", next: null, progress: 1 });
    const mid = leagueOf(withXp(20), today); // 200 of 400
    expect(mid.next).toMatchObject({ name: "Básico", missing: 200 });
    expect(mid.progress).toBeCloseTo(0.5);
  });

  it("goes down only one league after a long break, and comes back with study", () => {
    const old = addDays(today, -(INACTIVITY_DAYS + 1));
    const away = { ...empty, plan: { [old]: Array.from({ length: 150 }, () => block(true)) } };
    expect(leagueOf(away, today)).toMatchObject({
      id: "basico",
      earned: "intermediario",
      paused: true,
    });
    // Exactly at the limit: no drop.
    expect(leagueOf(away, addDays(old, INACTIVITY_DAYS)).paused).toBe(false);
    const back = { ...away, studied: [today] };
    expect(leagueOf(back, today)).toMatchObject({ id: "intermediario", paused: false });
    // Fundamentos never goes lower.
    expect(leagueOf({ ...empty, studied: [old] }, today).id).toBe("fundamentos");
  });

  it("formats the time spent on a question", () => {
    expect(formatMs(4200)).toBe("4 s");
    expect(formatMs(80_000)).toBe("1 min 20 s");
    expect(formatMs(120_000)).toBe("2 min");
  });
});

describe("question difficulty by league", () => {
  const levelsOf = (ids: string[]) => new Set(ids.map((id) => QUESTION_BY_ID[id]!.level));
  const daily = (league: (typeof LEAGUES)[number]["id"]) =>
    pickQuestions({ day: today, count: 10, answered: new Set(), league });

  it("Fundamentos: only easy; Básico: easy and medium; Intermediário: all three", () => {
    expect(levelsOf(daily("fundamentos"))).toEqual(new Set(["facil"]));
    expect(levelsOf(daily("basico"))).toEqual(new Set(["facil", "media"]));
    expect(levelsOf(daily("intermediario"))).toEqual(new Set(["facil", "media", "dificil"]));
    expect(daily("fundamentos")).toHaveLength(10);
  });

  it("asking for a level above the ceiling returns nothing", () => {
    const ask = (league: "fundamentos" | "basico", level: Question["level"]) =>
      pickQuestions({ day: today, count: 5, answered: new Set(), league, level });
    expect(ask("fundamentos", "media")).toEqual([]);
    expect(ask("basico", "dificil")).toEqual([]);
    expect(ask("basico", "media").length).toBeGreaterThan(0);
  });

  it("from Avançado on, released real questions come first", () => {
    const base = QUESTIONS.filter((q) => q.level === "facil").slice(0, 30);
    const real: Question = {
      ...base[29]!,
      id: "mat-porc-901",
      source: { banca: "Enem", ano: 2023, etapa: "1º dia", numero: 1, url: BANCAS.Enem.site! },
      uso: "liberada",
    };
    const bank = [...base, real];
    const pick = (league: "basico" | "avancado") =>
      pickQuestions({ day: today, count: 3, answered: new Set(), league, bank, level: "facil" });
    expect(pick("avancado")[0]).toBe(real.id);
  });

  it("without a league, the selection is the same as before", () => {
    const a = pickQuestions({ day: today, count: 10, answered: new Set() });
    expect(levelsOf(a).size).toBe(3);
  });
});
