import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { authErrorText, canSync, signUpProblem, type SignUpInput } from "@/lib/account";
import { achievementsOf, longestStreak } from "@/lib/achievements";
import { AVATARS, avatarSvg } from "@/lib/avatars";
import { mergeStates } from "@/lib/merge-state";
import { addDays, type Block } from "@/lib/planner";
import { QUESTIONS } from "@/lib/questions";
import { migrate, type State } from "@/lib/store";

const today = "2030-05-20";
const base = (over: Partial<State> = {}): State => ({ ...migrate(null, today), ...over });
const block = (id: string, done: boolean): Block => ({
  id,
  topicId: "mat-porc",
  activity: "Questões",
  minutes: 30,
  shift: "manha",
  done,
});
const q = QUESTIONS[0]!;

describe("sign-up rules", () => {
  const ok: SignUpInput = {
    apelido: "estudante_1",
    email: "a@ex.com",
    senha: "12345678",
    adulto: true,
    responsavelEmail: "",
    aceitou: true,
  };
  it("accepts a valid adult and a minor with a different guardian e-mail", () => {
    expect(signUpProblem(ok)).toBeNull();
    expect(signUpProblem({ ...ok, adulto: false, responsavelEmail: "mae@ex.com" })).toBeNull();
  });
  it("explains each problem in plain words", () => {
    expect(signUpProblem({ ...ok, apelido: "a b" })).toMatch(/apelido/);
    expect(signUpProblem({ ...ok, email: "x" })).toMatch(/e-mail/);
    expect(signUpProblem({ ...ok, senha: "123" })).toMatch(/8 caracteres/);
    expect(signUpProblem({ ...ok, adulto: null })).toMatch(/18 anos/);
    expect(signUpProblem({ ...ok, adulto: false, responsavelEmail: "" })).toMatch(/responsável/);
    expect(signUpProblem({ ...ok, adulto: false, responsavelEmail: "A@ex.com" })).toMatch(
      /diferente/,
    );
    expect(signUpProblem({ ...ok, aceitou: false })).toMatch(/Termos/);
  });
  it("syncs only adults or authorized minors, and translates errors", () => {
    expect(canSync({ adulto: true, consentimento_em: null })).toBe(true);
    expect(canSync({ adulto: false, consentimento_em: null })).toBe(false);
    expect(canSync({ adulto: false, consentimento_em: "2030-01-01" })).toBe(true);
    expect(canSync(null)).toBe(false);
    expect(authErrorText("Invalid login credentials")).toBe("E-mail ou senha incorretos.");
    expect(authErrorText("Email not confirmed")).toMatch(/Confirme/);
  });
});

describe("joining device and account progress", () => {
  it("joins answers without duplicates and keeps the earliest first answer", () => {
    const a1 = { questionId: q.id, choice: 0, correct: false, day: "2030-05-01" };
    const a2 = { questionId: q.id, choice: q.answer, correct: true, day: "2030-05-03" };
    const local = base({
      attempts: [a1, a2],
      quiz: { [q.id]: { choice: q.answer, day: "2030-05-03" } },
    });
    const remote = base({ attempts: [a1], quiz: { [q.id]: { choice: 0, day: "2030-05-01" } } });
    const m = mergeStates(local, remote);
    expect(m.attempts).toEqual([a1, a2]);
    expect(m.quiz[q.id]).toEqual({ choice: 0, day: "2030-05-01" });
    // Merging again changes nothing.
    expect(mergeStates(m, remote)).toEqual(m);
  });

  it("keeps blocks done on either side and the device's plan settings", () => {
    const local = base({
      config: {
        ...base().config!,
        examDate: "2031-11-09",
        hours: 2,
        shifts: ["manha"],
        difficulty: { mat: 6, nat: 6, ling: 6, hum: 6 },
      },
      plan: { [today]: [block("x", false), block("y", false)] },
    });
    const remote = base({
      config: {
        examDate: "2031-11-09",
        hours: 4,
        shifts: ["noite"],
        difficulty: { mat: 2, nat: 2, ling: 2, hum: 2 },
      },
      plan: {
        [today]: [block("x", true), block("z", true), block("w", false)],
        [addDays(today, -1)]: [block("o", true)],
      },
    });
    const m = mergeStates(local, remote);
    expect(m.config?.hours).toBe(2);
    expect(m.plan[today]!.map((b) => `${b.id}:${b.done}`)).toEqual(["x:true", "y:false", "z:true"]);
    expect(m.plan[addDays(today, -1)]).toEqual([block("o", true)]);
    // A new device without a plan takes the account's.
    expect(mergeStates(base(), remote).config?.hours).toBe(4);
  });

  it("joins records, links, studied days and keeps the newest terms acceptance", () => {
    const local = base({
      studied: ["2030-05-02"],
      links: [{ id: "l1", title: "A", url: "https://a.com", area: "mat" }],
      termsAccepted: { version: "1", day: "2030-05-01" },
      theme: "dark",
    });
    const remote = base({
      studied: ["2030-05-01", "2030-05-02"],
      links: [{ id: "l2", title: "B", url: "https://b.com", area: "nat" }],
      termsAccepted: { version: "2", day: "2030-05-02" },
      theme: "light",
    });
    const m = mergeStates(local, remote);
    expect(m.studied).toEqual(["2030-05-01", "2030-05-02"]);
    expect(m.links.map((l) => l.id).sort()).toEqual(["l1", "l2"]);
    expect(m.termsAccepted).toEqual({ version: "2", day: "2030-05-02" });
    expect(m.theme).toBe("dark");
  });
});

describe("avatars and achievements", () => {
  it("has 10 original avatars matching the database rule", () => {
    const sql = readFileSync("supabase/migrations/0001_contas.sql", "utf8");
    const rule = new RegExp(sql.match(/avatar ~ '([^']+)'/)![1]!);
    expect(AVATARS).toHaveLength(10);
    expect(new Set(AVATARS.map((a) => a.id)).size).toBe(10);
    for (const a of AVATARS) {
      expect(rule.test(a.id)).toBe(true);
      expect(avatarSvg(a.id)).toContain("<svg");
    }
  });

  it("computes achievements from saved data, with the condition visible", () => {
    const empty = achievementsOf(base(), today);
    expect(empty.every((a) => !a.feita && a.condicao.length > 5)).toBe(true);
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    const s = base({
      studied: days,
      attempts: [{ questionId: q.id, choice: q.answer, correct: true, day: today }],
      plan: { [today]: Array.from({ length: 10 }, (_, i) => block(`b${i}`, true)) },
    });
    const got = Object.fromEntries(achievementsOf(s, today).map((a) => [a.id, a]));
    expect(got["primeira-questao"]!.feita).toBe(true);
    expect(got["7-dias"]!.feita).toBe(true);
    expect(got["10-blocos"]!.feita).toBe(true);
    expect(got["30-dias"]).toMatchObject({ feita: false, atual: 7, meta: 30 });
    expect(longestStreak(["2030-01-01", "2030-01-02", "2030-01-05"])).toBe(2);
  });
});
