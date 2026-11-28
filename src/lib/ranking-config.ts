import { XP_RULES } from "./league-config";

/**
 * Shared ranking rules (phase 12). The server applies them in supabase/migrations/0003_ranking.sql
 * (function registrar_respostas); src/test/ranking.test.ts checks that both files have the same
 * numbers. Change both together and run the SQL again in Supabase.
 *
 * Points follow the XP rule for questions (answer + hit bonus by level). Blocks and streaks count
 * only on the device: the server cannot check them.
 */
export const RANKING_RULES = {
  answer: XP_RULES.answer,
  hit: XP_RULES.hit,
  /** Answers faster than this are recorded but give 0 points. */
  minMs: 3000,
  /** The same question again within this many hours gives 0 points. */
  repeatHours: 24,
  /** More answers than this in one minute give 0 points. */
  maxPerMinute: 30,
  /** Points above these limits give 0 points (and are logged for the team). */
  maxPointsPerHour: 600,
  maxPointsPerDay: 2000,
  /** Most answers sent in one call (a mini-simulado has up to 20). */
  batchMax: 30,
  /** Logged for the team: this many too-fast answers in one hour. */
  fastSuspect: 10,
  /** Logged for the team: at least this many answers in one hour with 95% or more right. */
  hitsSuspectMin: 30,
  /** How many places the ranking shows (plus your own place, when outside). */
  top: 50,
} as const;

export type Period = "semana" | "mes" | "geral";
export const PERIODS: { id: Period; label: string }[] = [
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mês" },
  { id: "geral", label: "Geral" },
];
