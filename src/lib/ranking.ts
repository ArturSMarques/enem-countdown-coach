import { LEAGUES, type LeagueId } from "./league-config";
import { RANKING_RULES } from "./ranking-config";
import type { Question } from "./question-types";

/** One answer as sent to the server: question, alternative (0 = A) and time spent. */
export type RankedAnswer = { q: string; c: number; ms: number | null };

/** Builds what goes to `registrar_respostas`, dropping anything malformed, in batches. */
export function answerBatches(
  list: { id: string; choice: number; ms?: number | undefined }[],
  size: number = RANKING_RULES.batchMax,
): RankedAnswer[][] {
  const clean = list
    .filter((a) => typeof a.id === "string" && Number.isInteger(a.choice) && a.choice >= 0)
    .map((a) => ({
      q: a.id,
      c: a.choice,
      ms: a.ms !== undefined && Number.isFinite(a.ms) && a.ms >= 0 ? Math.round(a.ms) : null,
    }));
  const out: RankedAnswer[][] = [];
  for (let i = 0; i < clean.length; i += size) out.push(clean.slice(i, i + size));
  return out;
}

/**
 * Points a single answer would give before the server's limits (repeat, per-minute, hour and day).
 * Same rule as registrar_respostas; used by the tests and to explain the rule on screen.
 */
export function basePoints(
  q: Pick<Question, "answer" | "level">,
  choice: number,
  ms: number | null,
) {
  if (ms === null || ms < RANKING_RULES.minMs) return 0;
  return RANKING_RULES.answer + (choice === q.answer ? RANKING_RULES.hit[q.level] : 0);
}

/** Row of the ranking as the server returns it. */
export type RankingRow = {
  posicao: number;
  apelido: string;
  avatar: string;
  pontos: number;
  eu: boolean;
};

export function parseRanking(data: unknown): RankingRow[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((r) => {
    if (!r || typeof r !== "object") return [];
    const x = r as Partial<Record<keyof RankingRow, unknown>>;
    if (typeof x.apelido !== "string") return [];
    return [
      {
        posicao: Number(x.posicao) || 0,
        apelido: x.apelido,
        avatar: typeof x.avatar === "string" ? x.avatar : "a1",
        pontos: Number(x.pontos) || 0,
        eu: x.eu === true,
      },
    ];
  });
}

/**
 * League shown in the ranking, from the account's all-time ranking points (same thresholds as the
 * device leagues). It can be lower than the league on the device, which also counts blocks and
 * streaks and answers from before the ranking started.
 */
export function rankingLeague(totalPoints: number): LeagueId {
  let id: LeagueId = LEAGUES[0]!.id;
  for (const l of LEAGUES) if (totalPoints >= l.minXp) id = l.id;
  return id;
}
