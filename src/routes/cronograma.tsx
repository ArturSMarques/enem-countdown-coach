import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { BlockCard } from "@/components/BlockCard";
import { AreaTag, Chip, Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, TOPIC_BY_ID } from "@/lib/data";
import {
  addDays,
  diffDays,
  fmtDay,
  isFinalWeek,
  PHASE_LABEL,
  phaseOf,
  todayISO,
  SHIFT_LABEL,
} from "@/lib/planner";
import { moveBlock, recalc, toggleBlock, useAppState } from "@/lib/store";

export const Route = createFileRoute("/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma — Reta Final ENEM" },
      {
        name: "description",
        content: "Visão semanal e até o dia da prova, com cores por área e blocos arrastáveis.",
      },
      { property: "og:title", content: "Cronograma — Reta Final ENEM" },
      {
        property: "og:description",
        content: "Seu cronograma até o ENEM, priorizado pelo que mais cai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  const { state, ready } = useAppState();
  const [view, setView] = useState<"semana" | "prova">("semana");
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [overDay, setOverDay] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ day: string; id: string } | null>(null);
  if (!ready) return <Loading />;
  if (!state.config)
    return <PageHeader title="Cronograma" subtitle="Configure seu plano na aba Hoje." />;
  const today = todayISO();
  const total = Math.max(diffDays(today, state.config.examDate), 0);
  // The plan is built HORIZON_DAYS ahead and extended as days go by.
  const planned = Math.min(
    total,
    Math.max(
      0,
      ...Object.keys(state.plan)
        .filter((d) => d >= today)
        .map((d) => diffDays(today, d) + 1),
    ),
  );
  const days = Array.from({ length: view === "semana" ? Math.min(7, total) : planned }, (_, i) =>
    addDays(today, i),
  );
  const phase = PHASE_LABEL[phaseOf(today, state.config.examDate)];

  const onDrop = (day: string, e: React.DragEvent) => {
    e.preventDefault();
    setOverDay(null);
    const [from, id] = e.dataTransfer.getData("text/plain").split("|");
    if (from && id) moveBlock(from, id, day);
  };

  return (
    <div>
      <PageHeader
        title="Cronograma"
        subtitle={`${total} dias até a prova`}
        right={
          <button
            onClick={recalc}
            className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Repriorizar
          </button>
        }
      />
      <div className="flex gap-2 px-5">
        <Chip active={view === "semana"} onClick={() => setView("semana")}>
          Semana
        </Chip>
        <Chip active={view === "prova"} onClick={() => setView("prova")}>
          Até a prova
        </Chip>
      </div>
      <p className="mt-3 px-5 text-xs text-muted-foreground">
        Fase atual: <strong>{phase}</strong>.
        {total > planned &&
          ` O plano está montado para as próximas ${Math.round(planned / 7)} semanas e se estende sozinho conforme os dias passam, com revisões espaçadas e simulado aos domingos.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5 px-5">
        {AREA_ORDER.map((a) => (
          <AreaTag key={a} area={a} label={AREAS[a].name} />
        ))}
      </div>

      {moving && (
        <div className="sticky top-0 z-30 mx-5 mt-3 rounded-2xl bg-primary p-3 text-sm font-semibold text-primary-foreground">
          Toque no dia de destino.{" "}
          <button className="underline" onClick={() => setMoving(null)}>
            Cancelar
          </button>
        </div>
      )}

      {view === "semana" ? (
        <div className="mt-4 space-y-4 px-5">
          {days.map((d) => {
            const blocks = state.plan[d] ?? [];
            const minutes = blocks.reduce((m, b) => m + b.minutes, 0);
            const doneCount = blocks.filter((b) => b.done).length;
            const isToday = d === today;
            return (
              <section
                aria-label={
                  isToday ? "Hoje" : fmtDay(d, { weekday: "long", day: "numeric", month: "long" })
                }
                key={d}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverDay(d);
                }}
                onDragLeave={() => setOverDay(null)}
                onDrop={(e) => onDrop(d, e)}
                onClick={() => {
                  if (moving) {
                    moveBlock(moving.day, moving.id, d);
                    setMoving(null);
                  }
                }}
                className={`rounded-3xl p-3 transition-colors ${overDay === d || moving ? "bg-accent" : "bg-muted/60"} ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <h2 className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 px-1 text-sm font-bold capitalize">
                  <span>
                    {isToday ? "Hoje" : fmtDay(d, { weekday: "long" })}
                    <span className="ml-1.5 text-xs font-semibold text-muted-foreground">
                      {fmtDay(d, { day: "2-digit", month: "2-digit" })}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold normal-case text-muted-foreground">
                    {blocks.length > 0 &&
                      `${fmtMinutes(minutes)} · ${doneCount}/${blocks.length} feitos`}
                    {isFinalWeek(d, state.config!.examDate) && (
                      <span className="ml-1.5 font-bold text-primary">Semana final</span>
                    )}
                  </span>
                </h2>
                <div className="space-y-2">
                  {blocks.length === 0 && (
                    <p className="px-1 text-xs text-muted-foreground">
                      Dia livre. Arraste blocos para cá.
                    </p>
                  )}
                  {blocks.map((b, i) => (
                    <div
                      key={b.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", `${d}|${b.id}`)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {(i === 0 || blocks[i - 1]!.shift !== b.shift) && (
                        <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                          {SHIFT_LABEL[b.shift]}
                        </p>
                      )}
                      <BlockCard block={b} compact onToggle={() => toggleBlock(d, b.id)} />
                      {!moving && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoving({ day: d, id: b.id });
                          }}
                          className="mt-1 px-1 text-[11px] font-semibold text-muted-foreground md:hidden"
                        >
                          Mover para outro dia
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-4 gap-2 px-5 sm:grid-cols-7">
          {days.map((d) => {
            const blocks = state.plan[d] ?? [];
            const fw = isFinalWeek(d, state.config!.examDate);
            const minutes = blocks.reduce((m, b) => m + b.minutes, 0);
            return (
              <button
                key={d}
                onClick={() => setOpenDay(openDay === d ? null : d)}
                aria-pressed={openDay === d}
                aria-label={`${d === today ? "Hoje, " : ""}${fmtDay(d, { weekday: "long", day: "numeric", month: "long" })}: ${blocks.length} blocos, ${fmtMinutes(minutes)}`}
                className={`card-soft p-2 text-left ${openDay === d ? "ring-2 ring-primary" : d === today ? "ring-2 ring-primary/50" : ""} ${fw ? "bg-accent" : ""}`}
              >
                <p className="text-[11px] font-bold capitalize text-muted-foreground">
                  {fmtDay(d, { weekday: "short" })}
                </p>
                <p className="text-sm font-extrabold">
                  {d === today ? "Hoje" : fmtDay(d, { day: "2-digit", month: "2-digit" })}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {blocks.map((b) => {
                    const tp = TOPIC_BY_ID[b.topicId];
                    return tp ? (
                      <span
                        key={b.id}
                        className={`h-2 w-2 rounded-full ${AREAS[tp.area].dot} ${b.done ? "opacity-30" : ""}`}
                      />
                    ) : null;
                  })}
                </div>
              </button>
            );
          })}
          {openDay && (
            <div className="col-span-full space-y-2 py-2">
              <p className="text-sm font-bold capitalize">
                {fmtDay(openDay, { weekday: "long", day: "numeric", month: "long" })}
                <span className="ml-1.5 text-xs font-semibold normal-case text-muted-foreground">
                  {fmtMinutes((state.plan[openDay] ?? []).reduce((m, b) => m + b.minutes, 0))}
                </span>
              </p>
              {(state.plan[openDay] ?? []).map((b) => (
                <BlockCard key={b.id} block={b} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** "45 min", "2 h", "2 h 30 min". */
function fmtMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
