import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { saveConfig, useAppState } from "@/lib/store";
import { formatDays, resolveExam, selectableEditions, targetEdition } from "@/lib/editions";
import { todayISO, type Config } from "@/lib/planner";
import { AREAS } from "@/lib/data";
import { Chip } from "@/components/ui-bits";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Configurar plano — Reta Final ENEM" },
      {
        name: "description",
        content: "Em 1 minuto: data da prova, tempo por dia e nível em cada área.",
      },
      { property: "og:title", content: "Configurar plano — Reta Final ENEM" },
      {
        property: "og:description",
        content: "Monte seu cronograma de reta final do ENEM em 1 minuto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const DEFAULT: Omit<Config, "examDate"> = {
  dateMode: "auto",
  hours: 1.5,
  shift: "ambos",
  difficulty: { mat: 3, nat: 3, ling: 3, hum: 3 },
};

function Onboarding() {
  const { state, ready } = useAppState();
  const nav = useNavigate();
  const today = todayISO();
  const [cfg, setCfg] = useState<Config>(() => ({
    ...DEFAULT,
    examDate: targetEdition(today).days[0],
  }));
  const mode = cfg.dateMode ?? "auto";
  const exam = resolveExam(cfg, today);
  useEffect(() => {
    if (ready && state.config) setCfg(state.config);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    saveConfig(cfg);
    nav({ to: "/" });
  };

  return (
    <div className="px-5 pb-10 pt-8">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Reta Final ENEM</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight">
        Vamos montar seu plano em 1 minuto.
      </h1>
      <p className="mt-2 text-muted-foreground">
        Prioridade para Matemática, Natureza e Redação. Você ajusta depois.
      </p>

      <div className="mt-8 space-y-5">
        <section className="card-soft p-5">
          <p className="text-sm font-bold">Data da prova</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["auto", "Automática (recomendado)"],
                ["edicao", "Escolher edição"],
                ["manual", "Data manual"],
              ] as const
            ).map(([v, l]) => (
              <Chip
                key={v}
                active={mode === v}
                onClick={() =>
                  setCfg({
                    ...cfg,
                    dateMode: v,
                    edition:
                      v === "edicao"
                        ? (cfg.edition ?? exam.edition?.year ?? targetEdition(today).year)
                        : undefined,
                    examDate: v === "manual" ? exam.day1 : cfg.examDate,
                  })
                }
              >
                {l}
              </Chip>
            ))}
          </div>
          {mode === "edicao" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectableEditions(today).map((e) => (
                <Chip
                  key={e.year}
                  active={cfg.edition === e.year}
                  onClick={() => setCfg({ ...cfg, edition: e.year })}
                >
                  ENEM {e.year}
                </Chip>
              ))}
            </div>
          )}
          {mode === "manual" ? (
            <>
              <label
                className="mt-4 block text-xs font-semibold text-muted-foreground"
                htmlFor="exam"
              >
                1º dia da prova
              </label>
              <input
                id="exam"
                type="date"
                value={cfg.examDate}
                onChange={(e) => setCfg({ ...cfg, examDate: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-base"
              />
            </>
          ) : (
            exam.edition && (
              <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
                <p className="font-bold">
                  ENEM {exam.edition.year}: {formatDays(exam.edition.days)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {exam.edition.status === "oficial"
                    ? `Data oficial (${exam.edition.source}).`
                    : "Data estimada pelo padrão das últimas edições. A confirmar no edital do Inep."}
                  {mode === "auto" &&
                    " Quando a prova passar, o app muda sozinho para a edição seguinte."}
                </p>
              </div>
            )
          )}
        </section>

        <section className="card-soft p-5">
          <p className="text-sm font-bold">Horas por dia</p>
          <div className="mt-3 flex gap-2">
            {([1, 1.5, 2] as const).map((h) => (
              <Chip key={h} active={cfg.hours === h} onClick={() => setCfg({ ...cfg, hours: h })}>
                {String(h).replace(".", ",")}h
              </Chip>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold">Turno preferido</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["manha", "Manhã (até 12h)"],
                ["noite", "Noite (após 22h30)"],
                ["ambos", "Ambos"],
              ] as const
            ).map(([v, l]) => (
              <Chip key={v} active={cfg.shift === v} onClick={() => setCfg({ ...cfg, shift: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </section>

        <section className="card-soft p-5">
          <p className="text-sm font-bold">Quanta dificuldade você sente em cada área?</p>
          <p className="text-xs text-muted-foreground">
            1 = tranquilo · 5 = muito difícil. Áreas difíceis ganham mais tempo.
          </p>
          <div className="mt-4 space-y-4">
            {(["mat", "nat", "ling", "hum"] as const).map((a) => (
              <div key={a}>
                <div className="flex justify-between text-sm">
                  <span className={`font-semibold ${AREAS[a].color}`}>{AREAS[a].name}</span>
                  <span className="font-bold">{cfg.difficulty[a]}</span>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${AREAS[a].name} nível ${n}`}
                      onClick={() => setCfg({ ...cfg, difficulty: { ...cfg.difficulty, [a]: n } })}
                      className={`h-9 rounded-lg text-sm font-bold transition-colors ${n <= cfg.difficulty[a] ? `${AREAS[a].dot} text-primary-foreground` : "bg-muted text-muted-foreground"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-soft p-5">
          <label className="text-sm font-bold" htmlFor="goal">
            Meta de nota geral no ENEM (opcional)
          </label>
          <p id="goal-help" className="mt-1 text-xs text-muted-foreground">
            A nota geral que você quer tirar no ENEM, ou seja, a média das cinco provas (Linguagens,
            Humanas, Natureza, Matemática e Redação). A escala vai de 0 a 1000.
          </p>
          <input
            id="goal"
            type="number"
            inputMode="numeric"
            min={0}
            max={1000}
            aria-describedby="goal-help"
            placeholder="Ex.: 720"
            value={cfg.goal ?? ""}
            onChange={(e) =>
              setCfg({
                ...cfg,
                goal: e.target.value
                  ? Math.min(1000, Math.max(0, Math.round(Number(e.target.value))))
                  : undefined,
              })
            }
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-base"
          />
        </section>

        <button
          onClick={submit}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
        >
          {state.config ? "Salvar e recalcular plano" : "Criar meu plano"}
        </button>
      </div>
    </div>
  );
}
