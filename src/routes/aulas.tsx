import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AreaTag, Chip, Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, CHANNELS_BY_SUBJECT, TOPICS, TOPIC_BY_ID, brasilEscola, todaMateria, ytChannel, ytSearch, type Area } from "@/lib/data";
import { addLink, removeLink, useAppState } from "@/lib/store";

export const Route = createFileRoute("/aulas")({
  validateSearch: (s: Record<string, unknown>): { topic?: string | undefined } => ({ topic: typeof s["topic"] === "string" ? s["topic"] : undefined }),
  head: () => ({
    meta: [
      { title: "Aulas e criadores — Reta Final ENEM" },
      { name: "description", content: "Canais gratuitos recomendados para cada tópico do ENEM, e seus próprios links." },
      { property: "og:title", content: "Aulas gratuitas para o ENEM" },
      { property: "og:description", content: "Ferretto, Equaciona, Me Salva!, Descomplica, Biologia Total, Boaro e mais." },
    ],
  }),
  component: Lessons,
});

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
    {children} <ExternalLink className="h-3 w-3" />
  </a>
);

function Lessons() {
  const { topic } = Route.useSearch();
  const { state, ready } = useAppState();
  const [area, setArea] = useState<Area>(topic ? TOPIC_BY_ID[topic]?.area ?? "mat" : "mat");
  const [open, setOpen] = useState<string | null>(topic ?? null);
  const [form, setForm] = useState({ title: "", url: "" });
  if (!ready) return <Loading />;
  const list = TOPICS.filter((t) => t.area === area);
  const mine = state.links.filter((l) => l.area === area);

  return (
    <div>
      <PageHeader title="Aulas e criadores" subtitle="Links de busca e canais — não quebram com o tempo." />
      <div className="flex gap-2 overflow-x-auto px-5 pb-1">
        {AREA_ORDER.map((a) => <Chip key={a} active={area === a} onClick={() => setArea(a)}>{AREAS[a].name}</Chip>)}
      </div>

      <div className="mt-4 space-y-2 px-5">
        {list.map((t) => (
          <div key={t.id} className="card-soft p-3.5">
            <button onClick={() => setOpen(open === t.id ? null : t.id)} className="flex w-full items-center justify-between gap-2 text-left">
              <span className="font-semibold">{t.name}</span>
              <AreaTag area={t.area} label={t.subject} />
            </button>
            {open === t.id && (
              <ul className="animate-in fade-in mt-3 space-y-2.5 text-sm">
                {(CHANNELS_BY_SUBJECT[t.subject] ?? []).map((c) => (
                  <li key={c.name} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span>
                      <span className="font-semibold">{c.name}</span>
                      <span className="block text-xs text-muted-foreground">{c.desc}</span>
                    </span>
                    <span className="flex gap-3 text-xs">
                      <A href={ytSearch(`${c.name} ${t.name} ENEM`)}>Buscar aula</A>
                      <A href={ytChannel(c.name)}>Canal</A>
                    </span>
                  </li>
                ))}
                <li className="flex flex-wrap gap-3 border-t pt-2.5 text-xs">
                  <span className="text-muted-foreground">Resumos:</span>
                  <A href={todaMateria(t.name)}>Toda Matéria</A>
                  <A href={brasilEscola(t.name)}>Brasil Escola</A>
                </li>
              </ul>
            )}
          </div>
        ))}
      </div>

      <section className="mx-5 mt-6 card-soft p-4">
        <h2 className="text-base font-bold">Meus links · {AREAS[area].name}</h2>
        <ul className="mt-2 space-y-1.5">
          {mine.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
              <A href={l.url}>{l.title}</A>
              <button aria-label="Remover" onClick={() => removeLink(l.id)} className="p-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {mine.length === 0 && <li className="text-xs text-muted-foreground">Adicione canais ou playlists que você gosta.</li>}
        </ul>
        <form
          className="mt-3 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.title.trim() || !/^https?:\/\//.test(form.url)) return;
            addLink({ ...form, area });
            setForm({ title: "", url: "" });
          }}
        >
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome (ex.: Canal do Fulano)" className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
          <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">
            <Plus className="h-4 w-4" /> Adicionar link
          </button>
        </form>
      </section>
    </div>
  );
}
