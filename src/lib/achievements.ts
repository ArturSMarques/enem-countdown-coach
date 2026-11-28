import { TOPIC_BY_ID, type Area } from "./data";
import { xpOf } from "./league";
import { LEAGUES } from "./league-config";
import { addDays } from "./planner";
import { QUESTION_BY_ID } from "./questions";
import type { State } from "./store";
import { topicLevels } from "./topic-mastery";

/**
 * Achievements, computed from what is already saved (no extra data). Locked ones show their
 * condition. They work with or without an account.
 */
export type Achievement = {
  id: string;
  titulo: string;
  condicao: string;
  progresso: (s: State, today: string) => { atual: number; meta: number };
};

const answered = (s: State) => s.attempts.filter((a) => QUESTION_BY_ID[a.questionId]);
const inArea = (s: State, area: Area) =>
  answered(s).filter((a) => TOPIC_BY_ID[QUESTION_BY_ID[a.questionId]!.topicId]?.area === area)
    .length;

/** Longest run of consecutive studied days. */
export function longestStreak(studied: string[]): number {
  const days = [...new Set(studied)].sort();
  let best = 0;
  let run = 0;
  days.forEach((d, i) => {
    run = i > 0 && addDays(days[i - 1]!, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

const blocksDone = (s: State) =>
  Object.values(s.plan).reduce((n, list) => n + list.filter((b) => b.done).length, 0);

const count =
  (meta: number, f: (s: State, today: string) => number): Achievement["progresso"] =>
  (s, today) => ({ atual: Math.min(meta, f(s, today)), meta });

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "primeira-questao",
    titulo: "Primeira questão",
    condicao: "Responda 1 questão no app.",
    progresso: count(1, (s) => answered(s).length),
  },
  {
    id: "50-questoes",
    titulo: "50 questões",
    condicao: "Responda 50 questões no app.",
    progresso: count(50, (s) => answered(s).length),
  },
  {
    id: "200-questoes",
    titulo: "200 questões",
    condicao: "Responda 200 questões no app.",
    progresso: count(200, (s) => answered(s).length),
  },
  {
    id: "acerto-dificil",
    titulo: "Questão difícil",
    condicao: "Acerte uma questão difícil.",
    progresso: count(
      1,
      (s) =>
        answered(s).filter((a) => a.correct && QUESTION_BY_ID[a.questionId]!.level === "dificil")
          .length,
    ),
  },
  {
    id: "7-dias",
    titulo: "7 dias seguidos",
    condicao: "Estude 7 dias seguidos.",
    progresso: count(7, (s) => longestStreak(s.studied)),
  },
  {
    id: "30-dias",
    titulo: "30 dias seguidos",
    condicao: "Estude 30 dias seguidos.",
    progresso: count(30, (s) => longestStreak(s.studied)),
  },
  {
    id: "10-blocos",
    titulo: "10 blocos",
    condicao: "Conclua 10 blocos do plano.",
    progresso: count(10, blocksDone),
  },
  {
    id: "100-blocos",
    titulo: "100 blocos",
    condicao: "Conclua 100 blocos do plano.",
    progresso: count(100, blocksDone),
  },
  {
    id: "mat-50",
    titulo: "Matemática 50",
    condicao: "Responda 50 questões de Matemática.",
    progresso: count(50, (s) => inArea(s, "mat")),
  },
  {
    id: "nat-50",
    titulo: "Natureza 50",
    condicao: "Responda 50 questões de Ciências da Natureza.",
    progresso: count(50, (s) => inArea(s, "nat")),
  },
  {
    id: "hum-50",
    titulo: "Humanas 50",
    condicao: "Responda 50 questões de Ciências Humanas.",
    progresso: count(50, (s) => inArea(s, "hum")),
  },
  {
    id: "ling-50",
    titulo: "Linguagens 50",
    condicao: "Responda 50 questões de Linguagens.",
    progresso: count(50, (s) => inArea(s, "ling")),
  },
  {
    id: "topico-avancado",
    titulo: "Tópico avançado",
    condicao: "Chegue ao nível Avançado em um tópico.",
    progresso: count(
      1,
      (s, today) =>
        Object.values(topicLevels(s.attempts, today)).filter(
          (l) => l === "avancado" || l === "dominado",
        ).length,
    ),
  },
  {
    id: "liga-intermediario",
    titulo: "Liga Intermediário",
    condicao: "Chegue à liga Intermediário.",
    progresso: count(LEAGUES.find((l) => l.id === "intermediario")!.minXp, (s) => xpOf(s).total),
  },
];

export function achievementsOf(s: State, today: string) {
  return ACHIEVEMENTS.map((a) => {
    const p = a.progresso(s, today);
    return { ...a, ...p, feita: p.atual >= p.meta };
  });
}
