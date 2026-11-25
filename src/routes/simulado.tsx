import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { Chip, Loading, PageHeader } from "@/components/ui-bits";
import { AREAS, TOPIC_BY_ID, type Area } from "@/lib/data";
import { leagueOf } from "@/lib/league";
import { LEAGUES } from "@/lib/league-config";
import { todayISO } from "@/lib/planner";
import { LEVEL_PLURAL } from "@/lib/question-types";
import { QUESTION_BY_ID } from "@/lib/questions";
import {
  clock,
  pickSimulado,
  SIMULADO_AREAS,
  SIMULADO_CONFIG,
  simuladoResult,
  timeLimitSeconds,
  type SimuladoAnswer,
  type SimuladoResult,
} from "@/lib/simulado";
import { recalc, recordAnswers, useAppState } from "@/lib/store";

export const Route = createFileRoute("/simulado")({
  head: () => ({
    meta: [
      { title: "Mini-simulado — Reta Final ENEM" },
      {
        name: "description",
        content: "Mini-simulados por área do ENEM, com cronômetro e correção comentada.",
      },
      { property: "og:title", content: "Mini-simulado — Reta Final ENEM" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Simulado,
});

type Run = { ids: string[]; startedAt: number; limit: number };

function Simulado() {
  const { state, ready } = useAppState();
  const [area, setArea] = useState<Area>("mat");
  const [size, setSize] = useState<number>(SIMULADO_CONFIG.sizes[0]);
  const [run, setRun] = useState<Run | null>(null);
  const [answers, setAnswers] = useState<Record<string, SimuladoAnswer>>({});
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const finished = useRef(false);

  const remaining = run ? run.limit - Math.floor((now - run.startedAt) / 1000) : 0;

  const finish = () => {
    if (!run || finished.current) return;
    finished.current = true;
    const used = Math.min(run.limit, Math.round((Date.now() - run.startedAt) / 1000));
    recordAnswers(run.ids.flatMap((id) => (answers[id] ? [{ id, ...answers[id] }] : [])));
    setResult(simuladoResult(run.ids, answers, used));
  };

  useEffect(() => {
    if (!run || result) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [run, result]);
  useEffect(() => {
    if (run && !result && remaining <= 0) finish();
  });

  if (!ready) return <Loading />;
  const today = todayISO();
  const league = leagueOf(state, today);
  const levels = LEAGUES.find((l) => l.id === league.id)!.levels;

  const start = () => {
    const ids = pickSimulado({
      area,
      count: size,
      day: today,
      seed: String(Date.now()),
      answered: new Set(Object.keys(state.quiz)),
      league: league.id,
    });
    finished.current = false;
    setAnswers({});
    setResult(null);
    setNow(Date.now());
    setRun({ ids, startedAt: Date.now(), limit: timeLimitSeconds(ids.length) });
  };

  // ---------- setup ----------
  if (!run)
    return (
      <div>
        <PageHeader
          title="Mini-simulado"
          subtitle="Questões de uma área, com cronômetro e correção no fim."
        />
        <div className="space-y-4 px-5 pb-10">
          <section className="card-soft p-4">
            <h2 className="text-sm font-bold">Área</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIMULADO_AREAS.map((a) => (
                <Chip key={a} active={area === a} onClick={() => setArea(a)}>
                  {AREAS[a].name}
                </Chip>
              ))}
            </div>
            <h2 className="mt-4 text-sm font-bold">Quantidade</h2>
            <div className="mt-2 flex gap-2">
              {SIMULADO_CONFIG.sizes.map((n) => (
                <Chip key={n} active={size === n} onClick={() => setSize(n)}>
                  {n} questões
                </Chip>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Você terá {clock(timeLimitSeconds(size)).replace(/:00$/, "")} minutos (3 min por
              questão, perto do ritmo do ENEM). Dá para mudar a resposta até entregar; a correção,
              com a explicação de cada questão, aparece no fim. Na liga {league.name}, as questões
              são {levels.map((l) => LEVEL_PLURAL[l]).join(", ")}.
            </p>
            <button
              onClick={start}
              className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-base font-bold text-primary-foreground"
            >
              Começar
            </button>
          </section>
          <p className="text-center text-xs text-muted-foreground">
            O simulado completo do ENEM (dois dias, 90 questões cada) chega quando o banco de
            questões crescer.
          </p>
        </div>
      </div>
    );

  const questions = run.ids.map((id) => QUESTION_BY_ID[id]!).filter(Boolean);
  const answeredCount = Object.keys(answers).length;

  // ---------- result ----------
  if (result)
    return (
      <div>
        <PageHeader title="Resultado" subtitle={`Mini-simulado de ${AREAS[area].name}`} />
        <div className="space-y-4 px-5 pb-10">
          <section className="card-soft p-4" aria-live="polite">
            <p className="text-3xl font-extrabold">
              {result.hits} de {result.total}
              <span className="ml-2 text-base font-semibold text-muted-foreground">
                {Math.round(result.rate * 100)}% de acerto
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tempo usado: {clock(result.usedSeconds)} de {clock(run.limit)}
              {result.total - result.answered > 0 &&
                ` · ${result.total - result.answered} em branco`}
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {result.byTopic.map((t) => (
                <li key={t.topicId} className="flex justify-between gap-2">
                  <Link
                    to="/conteudos/$topicId"
                    params={{ topicId: t.topicId }}
                    className="font-semibold text-primary"
                  >
                    {TOPIC_BY_ID[t.topicId]?.name}
                  </Link>
                  <span className="shrink-0 font-bold">
                    {t.hits}/{t.total}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              As respostas já entraram no seu Desempenho (pentágono e pendências), no nível de cada
              tópico e no XP.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={recalc}
                className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground"
              >
                <RefreshCw className="h-3 w-3" /> Atualizar cronograma com o resultado
              </button>
              <button
                onClick={() => setRun(null)}
                className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground"
              >
                Novo simulado
              </button>
            </div>
          </section>
          <h2 className="text-base font-bold">Correção</h2>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              choice={answers[q.id]?.choice}
              mode="result"
              onAnswer={() => {}}
            />
          ))}
        </div>
      </div>
    );

  // ---------- running ----------
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 px-5 py-3 backdrop-blur">
        <p className="flex items-center gap-1.5 text-sm font-bold" role="timer">
          <Timer className="h-4 w-4 text-primary" aria-hidden />
          <span aria-label={`Tempo restante ${clock(remaining)}`}>{clock(remaining)}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {answeredCount} de {questions.length} respondidas
        </p>
        <button
          onClick={() => {
            const blank = questions.length - answeredCount;
            if (blank === 0 || confirm(`Entregar com ${blank} em branco?`)) finish();
          }}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
        >
          Entregar
        </button>
      </div>
      <div className="space-y-3 px-5 pb-10 pt-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            choice={answers[q.id]?.choice}
            mode="exam"
            onAnswer={(choice, ms) => setAnswers((prev) => ({ ...prev, [q.id]: { choice, ms } }))}
          />
        ))}
        <button
          onClick={finish}
          className="w-full rounded-2xl bg-primary py-3.5 text-base font-bold text-primary-foreground"
        >
          Entregar simulado
        </button>
      </div>
    </div>
  );
}
