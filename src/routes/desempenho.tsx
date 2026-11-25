import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink, PlayCircle, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { AreaPentagon } from "@/components/AreaPentagon";
import { LeagueCard } from "@/components/LeagueCard";
import { MasteryChip } from "@/components/MasteryBadge";
import { Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, INEP_PROVAS, SUBJECTS } from "@/lib/data";
import { levelStats, stageOf, STAGE_HINT, STAGE_LABEL } from "@/lib/mastery";
import { leagueOf, xpOf } from "@/lib/league";
import { INACTIVITY_DAYS, XP_RULES } from "@/lib/league-config";
import { areaScores, pendingSentence, pendingTopics } from "@/lib/performance";
import { fmtDay, subjectArea, todayISO, weakSubjects } from "@/lib/planner";
import { LEVEL_LABEL, LEVELS } from "@/lib/question-types";
import { addPerf, recalc, removePerf, useAppState } from "@/lib/store";

export const Route = createFileRoute("/desempenho")({
  head: () => ({
    meta: [
      { title: "Questões e simulados — Reta Final ENEM" },
      {
        name: "description",
        content:
          "Seu desempenho nas cinco áreas do ENEM e o que melhorar em cada tópico, com dicas e atalhos.",
      },
      { property: "og:title", content: "Desempenho — Reta Final ENEM" },
      {
        property: "og:description",
        content: "Pentágono por área e pendências a melhorar, com dicas para estudar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Performance,
});

function Performance() {
  const { state, ready } = useAppState();
  const [f, setF] = useState({ subject: "Matemática", total: "", correct: "" });
  const [err, setErr] = useState("");
  if (!ready) return <Loading />;

  const byArea = AREA_ORDER.filter((a) => a !== "red").map((a) => {
    const rows = state.perf.filter((p) => subjectArea(p.subject) === a);
    const total = rows.reduce((s, p) => s + p.total, 0);
    const correct = rows.reduce((s, p) => s + p.correct, 0);
    return { a, total, correct, rate: total ? correct / total : 0 };
  });
  const weak = weakSubjects(state.perf);
  const byLevel = levelStats(state.quiz);
  const totalQ = state.perf.reduce((s, p) => s + p.total, 0);
  const today = todayISO();
  const scores = areaScores(state.attempts, today);
  const pending = pendingTopics(state.attempts, today);
  const xp = xpOf(state);

  return (
    <div>
      <PageHeader title="Desempenho" subtitle={`${totalQ} questões registradas`} />
      <section className="card-soft mx-5 p-4">
        <h2 className="text-base font-bold">Suas cinco áreas</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Cada ponta cresce com os seus acertos nas questões do app nos últimos 30 dias, com mais
          peso para as médias e difíceis.
        </p>
        <AreaPentagon scores={scores} />
      </section>

      <section className="card-soft mx-5 mt-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">Pendências a melhorar</h2>
          {(pending.length > 0 || weak.length > 0) && (
            <button
              onClick={recalc}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground"
            >
              <RefreshCw className="h-3 w-3" /> Levar ao cronograma
            </button>
          )}
        </div>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Nenhuma pendência por enquanto. Quando você errar uma questão no app, o tópico aparece
            aqui com uma dica do que fazer.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((p) => (
              <li key={p.topicId} className="rounded-xl bg-muted p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`font-bold ${AREAS[p.area].color}`}>{p.topicName}</span>
                  <MasteryChip level={p.level} />
                </div>
                <p className="mt-1.5">{pendingSentence(p)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.lastError ? p.lastError.advice : p.tip}
                </p>
                {p.trap && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Cuidado:</span> {p.trap.erro}{" "}
                    {p.trap.comoEvitar}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                  <Link
                    to="/conteudos/$topicId"
                    params={{ topicId: p.topicId }}
                    className="inline-flex items-center gap-1 text-primary"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Estudar o tópico
                  </Link>
                  <Link
                    to="/aulas"
                    search={{ topic: p.topicId }}
                    className="inline-flex items-center gap-1 text-primary"
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Ver aulas
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        {weak.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Nos seus registros de questões feitas fora do app,{" "}
            {weak.map((w) => `${w.subject} (${Math.round(w.rate * 100)}%)`).join(", ")}{" "}
            {weak.length === 1 ? "pede" : "pedem"} mais prática. O cronograma já dá mais tempo a{" "}
            {weak.length === 1 ? "ela" : "elas"}.
          </p>
        )}
      </section>

      <form
        className="card-soft mx-5 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const total = Number(f.total),
            correct = Number(f.correct);
          if (!total || total < 1 || correct < 0 || correct > total)
            return setErr("Confira os números: acertos não podem passar do total.");
          setErr("");
          addPerf({ subject: f.subject, total, correct });
          setF({ ...f, total: "", correct: "" });
        }}
      >
        <h2 className="text-base font-bold">Registrar questões</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Para questões feitas fora do app (livro, simulado). Entram no plano, mas não no nível dos
          tópicos, que vem só das questões respondidas aqui.
        </p>
        <div className="mt-3 grid grid-cols-[1fr_5rem_5rem] gap-2">
          <select
            value={f.subject}
            onChange={(e) => setF({ ...f, subject: e.target.value })}
            className="rounded-xl border bg-background px-2 py-2.5 text-sm"
          >
            {SUBJECTS.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </select>
          <input
            inputMode="numeric"
            type="number"
            placeholder="Feitas"
            value={f.total}
            onChange={(e) => setF({ ...f, total: e.target.value })}
            className="rounded-xl border bg-background px-2 py-2.5 text-sm"
          />
          <input
            inputMode="numeric"
            type="number"
            placeholder="Acertos"
            value={f.correct}
            onChange={(e) => setF({ ...f, correct: e.target.value })}
            className="rounded-xl border bg-background px-2 py-2.5 text-sm"
          />
        </div>
        {err && <p className="mt-2 text-xs font-semibold text-destructive">{err}</p>}
        <button className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">
          Salvar
        </button>
      </form>

      <section className="card-soft mx-5 mt-4 p-4">
        <h2 className="text-base font-bold">Acertos por área</h2>
        <div className="mt-4 space-y-3">
          {byArea.map(({ a, total, correct, rate }) => (
            <div key={a}>
              <div className="flex justify-between text-sm">
                <span className={`font-semibold ${AREAS[a].color}`}>{AREAS[a].name}</span>
                <span className="font-bold">
                  {total ? `${Math.round(rate * 100)}%` : "—"}{" "}
                  <span className="text-xs font-medium text-muted-foreground">
                    {total ? `${correct}/${total}` : ""}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${AREAS[a].dot} transition-[width] duration-700`}
                  style={{ width: `${rate * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft mx-5 mt-4 p-4">
        <h2 className="text-base font-bold">Seu nível por área</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Calculado pelas questões do app, separadas em fáceis, médias e difíceis. Ele ajusta o
          cronograma e a escolha das questões do dia.
        </p>
        {Object.keys(byLevel).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Responda algumas questões na aba Questões para ver seu nível.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {(Object.keys(AREAS) as (keyof typeof AREAS)[])
              .filter((a) => byLevel[a])
              .map((a) => {
                const st = byLevel[a]!;
                const stage = stageOf(st);
                return (
                  <li key={a}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className={`font-semibold ${AREAS[a].color}`}>{AREAS[a].name}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold">
                        {STAGE_LABEL[stage]}
                      </span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-center text-xs">
                      {LEVELS.map((l) => (
                        <div key={l} className="rounded-lg bg-muted px-1 py-1.5">
                          <p className="font-semibold text-muted-foreground">{LEVEL_LABEL[l]}</p>
                          <p className="font-bold">
                            {st[l].total ? `${st[l].correct}/${st[l].total}` : "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{STAGE_HINT[stage]}</p>
                  </li>
                );
              })}
          </ul>
        )}
        {Object.keys(byLevel).length > 0 && (
          <button
            onClick={recalc}
            className="mt-3 flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground"
          >
            <RefreshCw className="h-3 w-3" /> Atualizar cronograma com meu nível
          </button>
        )}
      </section>

      <section className="mx-5 mt-4 space-y-2">
        <LeagueCard league={leagueOf(state, today)} />
        <div className="card-soft p-4 text-xs text-muted-foreground">
          <p className="text-sm font-bold text-foreground">Como você ganha XP</p>
          <p className="mt-1">
            Até agora: {xp.answers} XP em questões, {xp.blocks} XP em blocos concluídos e{" "}
            {xp.streak} XP em dias seguidos.
          </p>
          <ul className="mt-2 list-disc space-y-0.5 pl-4">
            <li>
              Cada questão respondida vale {XP_RULES.answer} XP; acertar soma {XP_RULES.hit.facil}{" "}
              (fácil), {XP_RULES.hit.media} (média) ou {XP_RULES.hit.dificil} (difícil).
            </li>
            <li>Cada bloco do plano concluído vale {XP_RULES.block} XP.</li>
            <li>
              Cada dia seguido de estudo soma {XP_RULES.streakStep} XP a mais que o anterior, até{" "}
              {XP_RULES.streakMax} XP por dia.
            </li>
            <li>
              A liga só desce depois de {INACTIVITY_DAYS} dias sem estudar, e volta quando você
              retoma. O XP fica neste aparelho.
            </li>
          </ul>
        </div>
      </section>

      <a
        href={INEP_PROVAS}
        target="_blank"
        rel="noreferrer"
        className="card-soft mx-5 mt-4 flex items-center justify-between p-4"
      >
        <span>
          <span className="block font-bold">Provas anteriores do ENEM</span>
          <span className="text-xs text-muted-foreground">
            Provas e gabaritos oficiais no portal do INEP
          </span>
        </span>
        <ExternalLink className="h-5 w-5 text-primary" />
      </a>
      <p className="mx-5 mt-2 text-center text-xs text-muted-foreground">
        <Link to="/creditos" className="font-semibold text-primary hover:underline">
          Créditos e fontes
        </Link>{" "}
        das questões e conteúdos
      </p>

      {state.perf.length > 0 && (
        <section className="mx-5 mt-6">
          <h2 className="mb-2 text-sm font-bold text-muted-foreground">Histórico</h2>
          <ul className="space-y-1">
            {[...state.perf]
              .reverse()
              .slice(0, 15)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span>
                    <span className="text-muted-foreground">
                      {fmtDay(p.date, { day: "2-digit", month: "2-digit" })}
                    </span>{" "}
                    · {p.subject}
                    {p.source === "quiz" && (
                      <span className="text-muted-foreground"> · questões do dia</span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 font-semibold">
                    {p.correct}/{p.total}
                    <button
                      aria-label="Remover"
                      onClick={() => removePerf(p.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
