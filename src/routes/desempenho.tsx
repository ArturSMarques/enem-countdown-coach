import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Loading, PageHeader } from "@/components/ui-bits";
import { AREA_ORDER, AREAS, INEP_PROVAS, SUBJECTS } from "@/lib/data";
import { fmtDay, subjectArea, weakSubjects } from "@/lib/planner";
import { addPerf, recalc, removePerf, useAppState } from "@/lib/store";

export const Route = createFileRoute("/desempenho")({
  head: () => ({
    meta: [
      { title: "Questões e simulados — Reta Final ENEM" },
      { name: "description", content: "Registre questões e acertos por matéria e descubra seus pontos fracos." },
      { property: "og:title", content: "Desempenho — Reta Final ENEM" },
      { property: "og:description", content: "Acertos por área e pontos fracos que ajustam o cronograma." },
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
  const totalQ = state.perf.reduce((s, p) => s + p.total, 0);

  return (
    <div>
      <PageHeader title="Desempenho" subtitle={`${totalQ} questões registradas`} />
      <form
        className="card-soft mx-5 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const total = Number(f.total), correct = Number(f.correct);
          if (!total || total < 1 || correct < 0 || correct > total) return setErr("Confira os números: acertos não podem passar do total.");
          setErr("");
          addPerf({ subject: f.subject, total, correct });
          setF({ ...f, total: "", correct: "" });
        }}
      >
        <h2 className="text-base font-bold">Registrar questões</h2>
        <div className="mt-3 grid grid-cols-[1fr_5rem_5rem] gap-2">
          <select value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} className="rounded-xl border bg-background px-2 py-2.5 text-sm">
            {SUBJECTS.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
          <input inputMode="numeric" type="number" placeholder="Feitas" value={f.total} onChange={(e) => setF({ ...f, total: e.target.value })} className="rounded-xl border bg-background px-2 py-2.5 text-sm" />
          <input inputMode="numeric" type="number" placeholder="Acertos" value={f.correct} onChange={(e) => setF({ ...f, correct: e.target.value })} className="rounded-xl border bg-background px-2 py-2.5 text-sm" />
        </div>
        {err && <p className="mt-2 text-xs font-semibold text-destructive">{err}</p>}
        <button className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">Salvar</button>
      </form>

      <section className="card-soft mx-5 mt-4 p-4">
        <h2 className="text-base font-bold">Acertos por área</h2>
        <div className="mt-4 space-y-3">
          {byArea.map(({ a, total, correct, rate }) => (
            <div key={a}>
              <div className="flex justify-between text-sm">
                <span className={`font-semibold ${AREAS[a].color}`}>{AREAS[a].name}</span>
                <span className="font-bold">{total ? `${Math.round(rate * 100)}%` : "—"} <span className="text-xs font-medium text-muted-foreground">{total ? `${correct}/${total}` : ""}</span></span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${AREAS[a].dot} transition-[width] duration-700`} style={{ width: `${rate * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft mx-5 mt-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Pontos fracos</h2>
          {weak.length > 0 && (
            <button onClick={recalc} className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground">
              <RefreshCw className="h-3 w-3" /> Levar ao cronograma
            </button>
          )}
        </div>
        {weak.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Matérias com menos de 60% de acerto (mín. 5 questões) aparecem aqui e ganham mais tempo no plano.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {weak.map((w) => (
              <li key={w.subject} className="flex justify-between rounded-xl bg-destructive/8 px-3 py-2 text-sm">
                <span className="font-semibold">{w.subject}</span>
                <span className="font-bold text-destructive">{Math.round(w.rate * 100)}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <a href={INEP_PROVAS} target="_blank" rel="noreferrer" className="card-soft mx-5 mt-4 flex items-center justify-between p-4">
        <span>
          <span className="block font-bold">Provas anteriores do ENEM</span>
          <span className="text-xs text-muted-foreground">Provas e gabaritos oficiais no portal do INEP</span>
        </span>
        <ExternalLink className="h-5 w-5 text-primary" />
      </a>

      {state.perf.length > 0 && (
        <section className="mx-5 mt-6">
          <h2 className="mb-2 text-sm font-bold text-muted-foreground">Histórico</h2>
          <ul className="space-y-1">
            {[...state.perf].reverse().slice(0, 15).map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm hover:bg-muted">
                <span><span className="text-muted-foreground">{fmtDay(p.date, { day: "2-digit", month: "2-digit" })}</span> · {p.subject}</span>
                <span className="flex items-center gap-2 font-semibold">
                  {p.correct}/{p.total}
                  <button aria-label="Remover" onClick={() => removePerf(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
