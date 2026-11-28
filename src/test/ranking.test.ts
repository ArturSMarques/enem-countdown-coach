import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gabaritoSQL } from "@/lib/gabarito-sql";
import { LEAGUES, XP_RULES } from "@/lib/league-config";
import { RANKING_RULES } from "@/lib/ranking-config";
import { answerBatches, basePoints, parseRanking, rankingLeague } from "@/lib/ranking";
import { QUESTIONS } from "@/lib/questions";
import {
  answerQuestion,
  clearAllData,
  currentState,
  onAnswers,
  recordAnswers,
  type AnswerEvent,
} from "@/lib/store";

const SQL = readFileSync("supabase/migrations/0003_ranking.sql", "utf8");
const constant = (name: string) => {
  const m = SQL.match(new RegExp(`${name} constant int := (\\d+);`));
  if (!m) throw new Error(`constante ${name} não encontrada no SQL`);
  return Number(m[1]);
};

describe("regras do ranking: app e servidor iguais", () => {
  it("o SQL usa os mesmos números de src/lib/ranking-config.ts", () => {
    expect(constant("ms_minimo")).toBe(RANKING_RULES.minMs);
    expect(constant("horas_repeticao")).toBe(RANKING_RULES.repeatHours);
    expect(constant("max_por_minuto")).toBe(RANKING_RULES.maxPerMinute);
    expect(constant("max_pontos_hora")).toBe(RANKING_RULES.maxPointsPerHour);
    expect(constant("max_pontos_dia")).toBe(RANKING_RULES.maxPointsPerDay);
    expect(constant("max_lote")).toBe(RANKING_RULES.batchMax);
    expect(constant("pontos_resposta")).toBe(RANKING_RULES.answer);
    expect(constant("bonus_facil")).toBe(RANKING_RULES.hit.facil);
    expect(constant("bonus_media")).toBe(RANKING_RULES.hit.media);
    expect(constant("bonus_dificil")).toBe(RANKING_RULES.hit.dificil);
    expect(constant("rapidas_suspeitas")).toBe(RANKING_RULES.fastSuspect);
    expect(constant("minimo_acertos_suspeitos")).toBe(RANKING_RULES.hitsSuspectMin);
  });

  it("os pontos por questão são os mesmos do XP do aparelho", () => {
    expect(RANKING_RULES.answer).toBe(XP_RULES.answer);
    expect(RANKING_RULES.hit).toEqual(XP_RULES.hit);
  });

  it("um mini-simulado inteiro cabe numa chamada e não estoura o limite por minuto", () => {
    expect(RANKING_RULES.batchMax).toBeGreaterThanOrEqual(20);
    expect(RANKING_RULES.maxPerMinute).toBeGreaterThanOrEqual(20);
    // 20 difíceis certas (o melhor simulado possível) ficam abaixo do limite por hora.
    expect(20 * (RANKING_RULES.answer + RANKING_RULES.hit.dificil)).toBeLessThanOrEqual(
      RANKING_RULES.maxPointsPerHour,
    );
  });

  it("só quem tem conta chama as funções; o gabarito e as suspeitas ficam fechados", () => {
    for (const fn of [
      "registrar_respostas(jsonb)",
      "ranking(text, int)",
      "minha_pontuacao()",
      "aparecer_no_ranking(boolean)",
    ]) {
      expect(SQL).toContain(`revoke all on function public.${fn} from public, anon;`);
      expect(SQL).toContain(`grant execute on function public.${fn} to authenticated;`);
    }
    expect(SQL).toContain("revoke all on public.gabarito from anon, authenticated;");
    expect(SQL).toContain("revoke all on public.suspeitas from anon, authenticated;");
    // O aluno não grava respostas direto na tabela: só pela função.
    expect(SQL).toContain("revoke all on public.respostas from anon, authenticated;");
    expect(SQL).not.toMatch(/grant (insert|update|delete)[^;]*public\.respostas/);
    // A marcação da equipe não pode ser mudada pelo aluno.
    expect(SQL).not.toMatch(/grant update \([^)]*sinalizado/);
  });

  it("o ranking mostra só apelido, avatar e pontos, e respeita autorização e escolha", () => {
    const fn = SQL.slice(SQL.indexOf("function public.ranking("));
    expect(fn).toMatch(
      /returns table \(posicao bigint, apelido text, avatar text, pontos bigint, eu boolean\)/,
    );
    expect(fn).toContain("not p.sinalizado");
    expect(fn).toContain("p.aparecer_no_ranking");
    expect(fn).toContain("(p.adulto or p.consentimento_em is not null)");
  });
});

describe("gabarito do servidor", () => {
  it("supabase/gabarito.sql está atualizado (rode `bun run gabarito` se este teste falhar)", () => {
    expect(readFileSync("supabase/gabarito.sql", "utf8")).toBe(gabaritoSQL(QUESTIONS));
  });

  it("tem uma linha por questão, sem o enunciado", () => {
    const sql = gabaritoSQL(QUESTIONS);
    expect(sql.match(/^ {2}\('/gm)?.length).toBe(QUESTIONS.length);
    expect(sql).not.toContain(QUESTIONS[0]!.text);
    expect(gabaritoSQL([{ ...QUESTIONS[0]!, id: "a'b" }])).toContain("('a''b'");
  });

  it("cabe nas regras da tabela (2 a 6 alternativas, resposta válida)", () => {
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.length).toBeLessThanOrEqual(6);
      expect(q.answer).toBeLessThan(q.options.length);
    }
  });
});

describe("pontos e envio", () => {
  const q = { answer: 1, level: "dificil" as const };
  it("calcula como o servidor antes dos limites", () => {
    expect(basePoints(q, 1, 10_000)).toBe(22);
    expect(basePoints(q, 0, 10_000)).toBe(2);
    expect(basePoints({ answer: 0, level: "facil" }, 0, 5_000)).toBe(7);
    expect(basePoints({ answer: 0, level: "media" }, 0, 5_000)).toBe(12);
    expect(basePoints(q, 1, 2_999)).toBe(0);
    expect(basePoints(q, 1, null)).toBe(0);
  });

  it("monta lotes limpos para o servidor", () => {
    const list = Array.from({ length: 35 }, (_, i) => ({ id: `q${i}`, choice: i % 5, ms: 4000.4 }));
    const batches = answerBatches([...list, { id: "x", choice: -1, ms: 1 }]);
    expect(batches.map((b) => b.length)).toEqual([30, 5]);
    expect(batches[0]![0]).toEqual({ q: "q0", c: 0, ms: 4000 });
    expect(answerBatches([{ id: "a", choice: 2 }])[0]![0]!.ms).toBeNull();
    expect(answerBatches([{ id: "a", choice: 2, ms: Number.NaN }])[0]![0]!.ms).toBeNull();
  });

  it("lê o ranking do servidor com segurança", () => {
    expect(parseRanking(null)).toEqual([]);
    expect(
      parseRanking([
        { posicao: "1", apelido: "ana", avatar: "a3", pontos: "120", eu: false },
        { posicao: 2, apelido: 5 },
        { posicao: 7, apelido: "eu_mesmo", avatar: null, pontos: 40, eu: true },
      ]),
    ).toEqual([
      { posicao: 1, apelido: "ana", avatar: "a3", pontos: 120, eu: false },
      { posicao: 7, apelido: "eu_mesmo", avatar: "a1", pontos: 40, eu: true },
    ]);
  });

  it("a liga do ranking segue as faixas das ligas", () => {
    expect(rankingLeague(0)).toBe("fundamentos");
    for (const l of LEAGUES) {
      expect(rankingLeague(l.minXp)).toBe(l.id);
      if (l.minXp > 0) expect(rankingLeague(l.minXp - 1)).not.toBe(l.id);
    }
  });
});

describe("respostas novas avisam a conta", () => {
  it("avisa uma vez por resposta nova, com o tempo, e ignora repetição e alternativa inválida", () => {
    clearAllData();
    const seen: AnswerEvent[][] = [];
    const stop = onAnswers((l) => seen.push(l));
    const [a, b, c] = QUESTIONS;
    answerQuestion(a!.id, a!.answer, 5000);
    answerQuestion(a!.id, 0, 5000); // já respondida: não registra nem avisa
    answerQuestion(b!.id, 99, 5000); // alternativa que não existe
    recordAnswers([
      { id: a!.id, choice: a!.answer, ms: 4000 },
      { id: b!.id, choice: 0, ms: 6000 },
    ]);
    stop();
    answerQuestion(c!.id, 0, 5000); // depois de parar, registra mas não avisa
    expect(seen).toEqual([
      [{ id: a!.id, choice: a!.answer, ms: 5000 }],
      [
        { id: a!.id, choice: a!.answer, ms: 4000 },
        { id: b!.id, choice: 0, ms: 6000 },
      ],
    ]);
    expect(currentState().attempts).toHaveLength(4);
    clearAllData();
  });
});
