import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { Flame, Moon, Settings2, Sun, Sunrise, Sunset } from "lucide-react";
import { useEffect, useRef } from "react";
import { BlockCard } from "@/components/BlockCard";
import { Loading, Progress } from "@/components/ui-bits";
import { CHECKLIST, MOTIVATION } from "@/lib/data";
import { diffDays, fmtDay, isFinalWeek, todayISO } from "@/lib/planner";
import { setTheme, skipToday, streakOf, toggleBlock, toggleCheck, useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoje — Reta Final ENEM" },
      { name: "description", content: "Seu plano de estudos de hoje para a reta final do ENEM, em blocos curtos." },
      { property: "og:title", content: "Reta Final ENEM — o que estudar hoje" },
      { property: "og:description", content: "Contagem regressiva, blocos de 25 a 50 minutos e foco no que mais cai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Today,
});

function Today() {
  const { state, ready } = useAppState();
  const nav = useNavigate();
  const today = todayISO();
  const blocks = state.plan[today] ?? [];
  const done = blocks.filter((b) => b.done).length;
  const allDone = blocks.length > 0 && done === blocks.length;
  const prevAll = useRef<boolean | null>(null);

  useEffect(() => {
    if (ready && !state.config) nav({ to: "/onboarding" });
  }, [ready, state.config, nav]);

  useEffect(() => {
    if (!ready) return;
    if (prevAll.current === false && allDone) confetti({ particleCount: 120, spread: 75, origin: { y: 0.7 } });
    prevAll.current = allDone;
  }, [allDone, ready]);

  if (!ready || !state.config) return <Loading />;
  const cfg = state.config;
  const daysLeft = diffDays(today, cfg.examDate);
  const final = daysLeft > 0 && isFinalWeek(today, cfg.examDate);
  const streak = streakOf(state.studied);
  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const msg = MOTIVATION[new Date().getDate() % MOTIVATION.length];
  const skipped = state.skipped.includes(today);
  const shifts = (["manha", "noite"] as const).filter((s) => blocks.some((b) => b.shift === s));

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold capitalize text-muted-foreground">{fmtDay(today, { weekday: "long", day: "numeric", month: "long" })}</p>
        <div className="flex gap-1">
          <button aria-label="Alternar tema" onClick={() => setTheme(dark ? "light" : "dark")} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/onboarding" aria-label="Ajustes" className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <Settings2 className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <section className="mt-3 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground">
        <p className="text-sm font-semibold opacity-80">{final ? "Modo Semana Final" : "Faltam"}</p>
        <div className="flex items-end gap-2">
          <span className="font-display text-7xl font-extrabold leading-none tracking-tighter">{Math.max(daysLeft, 0)}</span>
          <span className="pb-2 text-lg font-semibold">{daysLeft === 1 ? "dia" : "dias"} para o ENEM</span>
        </div>
        <p className="mt-3 text-sm opacity-90">{daysLeft <= 0 ? "É hoje (ou já foi). Confie no que você estudou." : msg}</p>
        {cfg.goal && <p className="mt-1 text-xs font-semibold opacity-75">Meta no ENEM: {cfg.goal} pontos (nota geral)</p>}
      </section>

      <section className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <div className="card-soft p-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>Progresso de hoje</span>
            <span>{done}/{blocks.length}</span>
          </div>
          <div className="mt-2.5">
            <Progress value={blocks.length ? done / blocks.length : 0} />
          </div>
        </div>
        <div className="card-soft flex flex-col items-center justify-center px-4">
          <Flame className={`h-5 w-5 ${streak ? "text-area-ling" : "text-muted-foreground"}`} />
          <span className="text-lg font-extrabold leading-tight">{streak}</span>
          <span className="text-[10px] font-semibold text-muted-foreground">{streak === 1 ? "dia" : "dias"} seguidos</span>
        </div>
      </section>

      {final && (
        <p className="mt-4 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
          <strong>Última semana:</strong> nada de conteúdo novo. Só revisão, resumos, simulados e redação.
        </p>
      )}

      {allDone && <p className="mt-4 rounded-2xl bg-success/15 p-4 text-center text-sm font-bold text-success">Dia fechado. Bom trabalho — agora descanse.</p>}

      {blocks.length === 0 && (
        <p className="card-soft mt-5 p-5 text-center text-sm text-muted-foreground">
          {skipped ? "Tudo bem. O conteúdo de hoje foi para os próximos dias." : "Nenhum bloco para hoje."}
        </p>
      )}

      {shifts.map((s) => (
        <section key={s} className="mt-6">
          <h2 className="mb-2.5 flex items-center gap-2 text-base font-bold">
            {s === "manha" ? <Sunrise className="h-4 w-4 text-area-hum" /> : <Sunset className="h-4 w-4 text-area-mat" />}
            {s === "manha" ? "Manhã · antes das 12h" : "Noite · depois das 22h30"}
          </h2>
          <div className="space-y-2.5">
            {blocks.filter((b) => b.shift === s).map((b) => (
              <BlockCard key={b.id} block={b} onToggle={() => toggleBlock(today, b.id)} />
            ))}
          </div>
        </section>
      ))}

      {blocks.some((b) => !b.done) && daysLeft > 1 && (
        <button
          onClick={() => {
            if (confirm("Mover os blocos pendentes de hoje para os próximos dias?")) skipToday();
          }}
          className="mt-6 w-full rounded-2xl border border-dashed py-3.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
        >
          Não consegui estudar hoje
        </button>
      )}

      {(final || daysLeft <= 0) && <ExamChecklist checked={state.checklist} />}
    </div>
  );
}

function ExamChecklist({ checked }: { checked: Record<string, boolean> }) {
  const n = CHECKLIST.filter((c) => checked[c.id]).length;
  return (
    <section className="card-soft mt-6 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Checklist do dia da prova</h2>
        <span className="text-sm font-semibold text-muted-foreground">{n}/{CHECKLIST.length}</span>
      </div>
      <ul className="mt-3 space-y-1">
        {CHECKLIST.map((c) => (
          <li key={c.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-muted">
              <input type="checkbox" checked={!!checked[c.id]} onChange={() => toggleCheck(c.id)} className="mt-0.5 h-5 w-5 accent-primary" />
              <span className={`text-sm ${checked[c.id] ? "text-muted-foreground line-through" : ""}`}>
                <span className="font-semibold">{c.group}:</span> {c.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
