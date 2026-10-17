import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
import { Chip, Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, TOPICS, type Area } from "@/lib/data";
import type { TopicStatus } from "@/lib/planner";
import { setTopicStatus, useAppState } from "@/lib/store";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos prioritários — Reta Final ENEM" },
      { name: "description", content: "Os tópicos que mais caem no ENEM por matéria, com prioridade e seu nível de domínio." },
      { property: "og:title", content: "Conteúdos que mais caem no ENEM" },
      { property: "og:description", content: "Marque o que já domina e o app ajusta seu cronograma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contents,
});

const PRI_STYLE = { alta: "bg-destructive/12 text-destructive", media: "bg-area-hum/20 text-foreground", baixa: "bg-muted text-muted-foreground" };
const PRI_LABEL = { alta: "Alta", media: "Média", baixa: "Baixa" };
const STATUS: [TopicStatus, string][] = [["dominado", "Dominado"], ["revisar", "Revisar"], ["nao", "Não vi"]];

function Contents() {
  const { state, ready } = useAppState();
  const [area, setArea] = useState<Area>("mat");
  const [open, setOpen] = useState<string | null>(null);
  if (!ready) return <Loading />;
  const list = TOPICS.filter((t) => t.area === area);
  const subjects = Array.from(new Set(list.map((t) => t.subject)));
  const mastered = TOPICS.filter((t) => state.status[t.id] === "dominado").length;

  return (
    <div>
      <PageHeader
        title="Conteúdos"
        subtitle={`${mastered} de ${TOPICS.length} tópicos dominados`}
        right={
          <Link to="/aulas" search={{}} className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">
            <PlayCircle className="h-3.5 w-3.5" /> Aulas
          </Link>
        }
      />
      <div className="flex gap-2 overflow-x-auto px-5 pb-1">
        {AREA_ORDER.map((a) => <Chip key={a} active={area === a} onClick={() => setArea(a)}>{AREAS[a].name}</Chip>)}
      </div>
      <div className="mt-4 space-y-6 px-5">
        {subjects.map((s) => (
          <section key={s}>
            {subjects.length > 1 && <h2 className={`mb-2 text-sm font-bold ${AREAS[area].color}`}>{s}</h2>}
            <div className="space-y-2">
              {list.filter((t) => t.subject === s).map((t) => {
                const st = state.status[t.id] ?? "nao";
                return (
                  <div key={t.id} className="card-soft p-3.5">
                    <button className="flex w-full items-center justify-between gap-2 text-left" onClick={() => setOpen(open === t.id ? null : t.id)}>
                      <span className="font-semibold">{t.name}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${PRI_STYLE[t.priority]}`}>{PRI_LABEL[t.priority]}</span>
                    </button>
                    {open === t.id && (
                      <div className="animate-in fade-in mt-2 text-sm">
                        <p className="text-muted-foreground">{t.tip}</p>
                        <Link to="/aulas" search={{ topic: t.id }} className="mt-1.5 inline-flex items-center gap-1 font-semibold text-primary">
                          <PlayCircle className="h-4 w-4" /> Ver aulas
                        </Link>
                      </div>
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                      {STATUS.map(([v, l]) => (
                        <button
                          key={v}
                          onClick={() => setTopicStatus(t.id, v)}
                          className={`rounded-lg py-1.5 text-xs font-bold transition-colors ${st === v ? (v === "dominado" ? "bg-success text-primary-foreground" : "bg-card text-foreground shadow-sm") : "text-muted-foreground"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <p className="text-center text-xs text-muted-foreground">Mudou algo? Use “Repriorizar” no Cronograma para atualizar os próximos dias.</p>
      </div>
    </div>
  );
}
