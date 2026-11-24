import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Chip, Loading, PageHeader } from "@/components/ui-bits";
import { CONTENT } from "@/lib/content";
import { AREA_ORDER, AREAS, TOPICS, type Area } from "@/lib/data";
import { MasteryChip, MasteryDetail } from "@/components/MasteryBadge";
import { todayISO } from "@/lib/planner";
import { useAppState } from "@/lib/store";
import { topicMastery } from "@/lib/topic-mastery";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos prioritários — Reta Final ENEM" },
      {
        name: "description",
        content:
          "Os tópicos que mais caem no ENEM por matéria, com prioridade e seu nível de domínio.",
      },
      { property: "og:title", content: "Conteúdos que mais caem no ENEM" },
      {
        property: "og:description",
        content: "Seu nível em cada tópico vem das questões que você responde no app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contents,
});

const PRI_STYLE = {
  alta: "bg-destructive/12 text-destructive",
  media: "bg-area-hum/20 text-foreground",
  baixa: "bg-muted text-muted-foreground",
};
const PRI_LABEL = { alta: "Alta", media: "Média", baixa: "Baixa" };

function Contents() {
  const { state, ready } = useAppState();
  const [area, setArea] = useState<Area>("mat");
  const [open, setOpen] = useState<string | null>(null);
  if (!ready) return <Loading />;
  const list = TOPICS.filter((t) => t.area === area);
  const subjects = Array.from(new Set(list.map((t) => t.subject)));
  const today = todayISO();
  const mastery = Object.fromEntries(
    TOPICS.map((t) => [t.id, topicMastery(t.id, state.attempts, today)]),
  );
  const strong = TOPICS.filter((t) =>
    ["avancado", "dominado"].includes(mastery[t.id]!.level),
  ).length;

  return (
    <div>
      <PageHeader
        title="Conteúdos"
        subtitle={`${strong} de ${TOPICS.length} tópicos em Avançado ou Dominado`}
        right={
          <Link
            to="/aulas"
            search={{}}
            className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground"
          >
            <PlayCircle className="h-3.5 w-3.5" /> Aulas
          </Link>
        }
      />
      <div className="flex gap-2 overflow-x-auto px-5 pb-1">
        {AREA_ORDER.map((a) => (
          <Chip key={a} active={area === a} onClick={() => setArea(a)}>
            {AREAS[a].name}
          </Chip>
        ))}
      </div>
      <div className="mt-4 space-y-6 px-5">
        {subjects.map((s) => (
          <section key={s}>
            {subjects.length > 1 && (
              <h2 className={`mb-2 text-sm font-bold ${AREAS[area].color}`}>{s}</h2>
            )}
            <div className="space-y-2">
              {list
                .filter((t) => t.subject === s)
                .map((t) => {
                  const m = mastery[t.id]!;
                  return (
                    <div key={t.id} className="card-soft p-3.5">
                      <button
                        className="flex w-full items-center justify-between gap-2 text-left"
                        onClick={() => setOpen(open === t.id ? null : t.id)}
                      >
                        <span className="font-semibold">
                          {t.name}
                          {CONTENT[t.id] && (
                            <span className="ml-1.5 align-middle text-[10px] font-bold uppercase tracking-wide text-primary">
                              aprofundado
                            </span>
                          )}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${PRI_STYLE[t.priority]}`}
                        >
                          {PRI_LABEL[t.priority]}
                        </span>
                      </button>
                      <div className="mt-2">
                        <MasteryChip level={m.level} />
                      </div>
                      {open === t.id && (
                        <div className="animate-in fade-in mt-2 text-sm">
                          <p className="text-muted-foreground">{t.tip}</p>
                          <div className="mt-2">
                            <MasteryDetail mastery={m} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                            <Link
                              to="/conteudos/$topicId"
                              params={{ topicId: t.id }}
                              className="inline-flex items-center gap-1 font-semibold text-primary"
                            >
                              <BookOpen className="h-4 w-4" />
                              {CONTENT[t.id] ? "Estudar o tópico" : "Teste rápido"}
                            </Link>
                            <Link
                              to="/aulas"
                              search={{ topic: t.id }}
                              className="inline-flex items-center gap-1 font-semibold text-primary"
                            >
                              <PlayCircle className="h-4 w-4" /> Ver aulas
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
        <p className="text-center text-xs text-muted-foreground">
          O nível de cada tópico é calculado pelas questões que você responde no app (as dos últimos
          30 dias), com mais peso para as médias e difíceis. Questões registradas à mão em
          Desempenho não contam para o nível.
        </p>
      </div>
    </div>
  );
}
