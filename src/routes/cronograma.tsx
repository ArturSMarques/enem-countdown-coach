import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { BlockCard } from "@/components/BlockCard";
import { AreaTag, Chip, Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, TOPIC_BY_ID } from "@/lib/data";
import { addDays, diffDays, fmtDay, isFinalWeek, todayISO } from "@/lib/planner";
import { moveBlock, recalc, toggleBlock, useAppState } from "@/lib/store";

export const Route = createFileRoute("/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma — Reta Final ENEM" },
      { name: "description", content: "Visão semanal e até o dia da prova, com cores por área e blocos arrastáveis." },
      { property: "og:title", content: "Cronograma — Reta Final ENEM" },
      { property: "og:description", content: "Seu cronograma até o ENEM, priorizado pelo que mais cai." },
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
  if (!state.config) return <PageHeader title="Cronograma" subtitle="Configure seu plano na aba Hoje." />;
  const today = todayISO();
  const total = Math.max(diffDays(today, state.config.examDate), 0);
  const days = Array.from({ length: view === "semana" ? Math.min(7, total) : total }, (_, i) => addDays(today, i));

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
          <button onClick={recalc} className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">
            <RefreshCw className="h-3.5 w-3.5" /> Repriorizar
          </button>
        }
      />
      <div className="flex gap-2 px-5">
        <Chip active={view === "semana"} onClick={() => setView("semana")}>Semana</Chip>
        <Chip active={view === "prova"} onClick={() => setView("prova")}>Até a prova</Chip>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 px-5">
        {AREA_ORDER.map((a) => <AreaTag key={a} area={a} label={AREAS[a].name} />)}
      </div>

      {moving && (
        <div className="sticky top-0 z-30 mx-5 mt-3 rounded-2xl bg-primary p-3 text-sm font-semibold text-primary-foreground">
          Toque no dia de destino. <button className="underline" onClick={() => setMoving(null)}>Cancelar</button>
        </div>
      )}

      {view === "semana" ? (
        <div className="mt-4 space-y-4 px-5">
          {days.map((d) => {
            const blocks = state.plan[d] ?? [];
            return (
              <section
                key={d}
                onDragOver={(e) => { e.preventDefault(); setOverDay(d); }}
                onDragLeave={() => setOverDay(null)}
                onDrop={(e) => onDrop(d, e)}
                onClick={() => { if (moving) { moveBlock(moving.day, moving.id, d); setMoving(null); } }}
                className={`rounded-3xl p-3 transition-colors ${overDay === d || moving ? "bg-accent" : "bg-muted/60"}`}
              >
                <h2 className="mb-2 flex items-center justify-between px-1 text-sm font-bold capitalize">
                  {d === today ? "Hoje" : fmtDay(d, { weekday: "long", day: "2-digit", month: "2-digit" })}
                  {isFinalWeek(d, state.config!.examDate) && <span className="text-[11px] font-bold text-primary">Semana final</span>}
                </h2>
                <div className="space-y-2">
                  {blocks.length === 0 && <p className="px-1 text-xs text-muted-foreground">Dia livre. Arraste blocos para cá.</p>}
                  {blocks.map((b) => (
                    <div
                      key={b.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", `${d}|${b.id}`)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <BlockCard block={b} compact onToggle={() => toggleBlock(d, b.id)} />
                      {!moving && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setMoving({ day: d, id: b.id }); }}
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
            return (
              <button
                key={d}
                onClick={() => setOpenDay(openDay === d ? null : d)}
                className={`card-soft p-2 text-left ${openDay === d ? "ring-2 ring-primary" : ""} ${fw ? "bg-accent" : ""}`}
              >
                <p className="text-[11px] font-bold capitalize text-muted-foreground">{fmtDay(d, { weekday: "short" })}</p>
                <p className="text-sm font-extrabold">{fmtDay(d, { day: "2-digit", month: "2-digit" })}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {blocks.map((b) => {
                    const tp = TOPIC_BY_ID[b.topicId];
                    return tp ? <span key={b.id} className={`h-2 w-2 rounded-full ${AREAS[tp.area].dot} ${b.done ? "opacity-30" : ""}`} /> : null;
                  })}
                </div>
              </button>
            );
          })}
          {openDay && (
            <div className="col-span-full space-y-2 py-2">
              <p className="text-sm font-bold capitalize">{fmtDay(openDay, { weekday: "long", day: "numeric", month: "long" })}</p>
              {(state.plan[openDay] ?? []).map((b) => <BlockCard key={b.id} block={b} compact />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
