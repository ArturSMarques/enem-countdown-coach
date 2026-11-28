import type { Block } from "./planner";
import type { State } from "./store";
import type { Attempt } from "./topic-mastery";

/**
 * Joins the progress saved on this device with the progress saved in the account, without losing
 * or duplicating anything (first login on a device, or a second device). Both sides must already
 * be in the current format (run migrate() on the remote copy first).
 *
 * Rules: history-like data is a union (answers, records, studied days, links, plan blocks); a block
 * done on either side stays done; the plan settings come from this device when it has a plan,
 * otherwise from the account; display preferences (theme, data saver) stay as on this device.
 */
export function mergeStates(local: State, remote: State): State {
  const key = (a: Attempt) => `${a.questionId}|${a.day}|${a.choice}|${a.ms ?? ""}`;
  const attempts = uniqueBy([...remote.attempts, ...local.attempts], key).sort((a, b) =>
    a.day < b.day ? -1 : a.day > b.day ? 1 : 0,
  );

  const quiz = { ...local.quiz };
  for (const [id, a] of Object.entries(remote.quiz))
    if (!quiz[id] || a.day < quiz[id]!.day) quiz[id] = a;

  const plan: Record<string, Block[]> = {};
  for (const day of new Set([...Object.keys(remote.plan), ...Object.keys(local.plan)])) {
    const mine = local.plan[day] ?? [];
    const theirs = remote.plan[day] ?? [];
    const doneIds = new Set([...mine, ...theirs].filter((b) => b.done).map((b) => b.id));
    const base = mine.length ? mine : theirs;
    const extra = mine.length ? theirs.filter((b) => !mine.some((m) => m.id === b.id)) : [];
    // Extra blocks from the other device are kept only when they were done (real study).
    plan[day] = [...base, ...extra.filter((b) => b.done)].map((b) =>
      doneIds.has(b.id) ? { ...b, done: true } : b,
    );
  }

  const checklist = { ...remote.checklist };
  for (const [k, v] of Object.entries(local.checklist)) checklist[k] = Boolean(checklist[k] || v);

  const quizDaily = { ...remote.quizDaily, ...local.quizDaily };

  const terms = [local.termsAccepted, remote.termsAccepted]
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .sort((a, b) => Number(b.version) - Number(a.version) || (a.day < b.day ? 1 : -1))[0];

  return {
    ...local,
    config: local.config ?? remote.config,
    plan,
    status: { ...remote.status, ...local.status },
    perf: uniqueBy([...remote.perf, ...local.perf], (p) => p.id),
    links: uniqueBy([...remote.links, ...local.links], (l) => l.id),
    checklist,
    studied: [...new Set([...remote.studied, ...local.studied])].sort(),
    skipped: [...new Set([...remote.skipped, ...local.skipped])].sort(),
    termsAccepted: terms ?? null,
    quiz,
    attempts,
    quizDaily,
    checklistYear: local.checklistYear ?? remote.checklistYear,
    version: Math.max(local.version, remote.version),
  };
}

function uniqueBy<T>(list: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return list.filter((x) => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
