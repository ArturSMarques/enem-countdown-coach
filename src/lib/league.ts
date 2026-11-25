import { INACTIVITY_DAYS, LEAGUES, XP_RULES, type LeagueId } from "./league-config";
import { addDays, diffDays, type Block } from "./planner";
import { QUESTION_BY_ID } from "./questions";
import type { Attempt } from "./topic-mastery";

export const leagueIndex = (id: LeagueId) => LEAGUES.findIndex((l) => l.id === id);
export const leagueAtLeast = (id: LeagueId, min: LeagueId) => leagueIndex(id) >= leagueIndex(min);

export type XpSource = {
  attempts: Attempt[];
  plan: Record<string, Block[]>;
  studied: string[];
};

export type XpBreakdown = { answers: number; blocks: number; streak: number; total: number };

/** XP earned so far, recomputed from what is already saved (no new data to store). */
export function xpOf(s: XpSource): XpBreakdown {
  let answers = 0;
  for (const a of s.attempts) {
    const q = QUESTION_BY_ID[a.questionId];
    if (!q) continue;
    answers += XP_RULES.answer + (a.correct ? XP_RULES.hit[q.level] : 0);
  }
  let blocks = 0;
  for (const list of Object.values(s.plan))
    blocks += list.filter((b) => b.done).length * XP_RULES.block;
  let streak = 0;
  const days = [...new Set(s.studied)].sort();
  let run = 0;
  days.forEach((d, i) => {
    run = i > 0 && days[i - 1] === addDays(d, -1) ? run + 1 : 1;
    streak += Math.min(run * XP_RULES.streakStep, XP_RULES.streakMax);
  });
  return { answers, blocks, streak, total: answers + blocks + streak };
}

/** Last day with any study activity (answer, finished block or studied day). */
export function lastActiveDay(s: XpSource): string | null {
  let last: string | null = null;
  const see = (d: string) => {
    if (!last || d > last) last = d;
  };
  s.attempts.forEach((a) => see(a.day));
  s.studied.forEach(see);
  for (const [day, list] of Object.entries(s.plan)) if (list.some((b) => b.done)) see(day);
  return last;
}

export type LeagueStatus = {
  id: LeagueId;
  name: string;
  xp: number;
  /** League by XP alone, before the gentle drop for inactivity. */
  earned: LeagueId;
  /** Dropped one league for being away; it comes back with the next study day. */
  paused: boolean;
  next: { name: string; minXp: number; missing: number } | null;
  /** Progress to the next league, 0–1 (1 at the top). */
  progress: number;
};

export function leagueOf(s: XpSource, today: string): LeagueStatus {
  const xp = xpOf(s).total;
  let i = 0;
  LEAGUES.forEach((l, k) => {
    if (xp >= l.minXp) i = k;
  });
  const earned = LEAGUES[i]!.id;
  const last = lastActiveDay(s);
  const paused = i > 0 && last !== null && diffDays(last, today) > INACTIVITY_DAYS;
  const shown = paused ? i - 1 : i;
  const nextLeague = LEAGUES[i + 1];
  const cur = LEAGUES[i]!;
  return {
    id: LEAGUES[shown]!.id,
    name: LEAGUES[shown]!.name,
    xp,
    earned,
    paused,
    next: nextLeague
      ? { name: nextLeague.name, minXp: nextLeague.minXp, missing: nextLeague.minXp - xp }
      : null,
    progress: nextLeague ? (xp - cur.minXp) / (nextLeague.minXp - cur.minXp) : 1,
  };
}

/** "1 min 20 s" / "45 s". */
export function formatMs(ms: number) {
  const s = Math.max(1, Math.round(ms / 1000));
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ""}`;
}
