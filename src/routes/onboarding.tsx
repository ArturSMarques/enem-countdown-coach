import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  acceptTerms,
  clearAllData,
  currentState,
  saveConfig,
  setDataSaver,
  useAppState,
} from "@/lib/store";
import { acceptedCurrentTerms, DISCLAIMER, exportFileName, exportJSON } from "@/lib/legal";
import { formatDays, resolveExam, selectableEditions, targetEdition } from "@/lib/editions";
import {
  DIFFICULTY_MAX,
  HOURS_OPTIONS,
  nearestHours,
  planReason,
  SHIFT_LABEL,
  SHIFT_ORDER,
  todayISO,
  toggleShift,
  type Config,
} from "@/lib/planner";
import { AREA_ORDER, AREAS } from "@/lib/data";
import { clampGoal, goalInputsOf, goalsFromInputs, type GoalInputs } from "@/lib/goals";
import {
  COURSE_BY_ID,
  COURSES,
  courseLabel,
  GOAL_SUGGESTION,
  suggestGoals,
} from "@/lib/course-weights";
import { Chip } from "@/components/ui-bits";

/** "Baixar meus dados": saves everything kept on this device as a JSON file. */
function downloadData() {
  const blob = new Blob([exportJSON(currentState())], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = exportFileName(todayISO());
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Plano personalizado — Reta Final ENEM" },
      {
        name: "description",
        content:
          "Data da prova, horas e horários de estudo, dificuldade e meta de nota em cada área.",
      },
      { property: "og:title", content: "Plano personalizado — Reta Final ENEM" },
      {
        property: "og:description",
        content: "Monte um plano de estudos para o ENEM do seu jeito: tempo, horários e metas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const DEFAULT: Omit<Config, "examDate"> = {
  dateMode: "auto",
  hours: 2,
  shifts: ["manha", "noite"],
  difficulty: { mat: 6, nat: 6, ling: 6, hum: 6 },
};

function Onboarding() {
  const { state, ready } = useAppState();
  const nav = useNavigate();
  const today = todayISO();
  const [agreed, setAgreed] = useState(false);
  const [cfg, setCfg] = useState<Config>(() => ({
    ...DEFAULT,
    examDate: targetEdition(today).days[0],
  }));
  const [goals, setGoals] = useState<GoalInputs>(() => goalInputsOf(undefined));
  const [average, setAverage] = useState(String(GOAL_SUGGESTION.defaultAverage));
  const mode = cfg.dateMode === "edicao" ? "edicao" : "auto";
  const exam = resolveExam({ ...cfg, dateMode: mode }, today);
  useEffect(() => {
    if (ready && state.config) {
      setCfg(state.config);
      setGoals(goalInputsOf(state.config.goals));
    }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const course = cfg.course ? COURSE_BY_ID[cfg.course] : undefined;
  const typedGoals = goalsFromInputs(goals);
  const reason = planReason({ goals: typedGoals }, course?.weights, course && courseLabel(course));
  const allShifts = cfg.shifts.length === SHIFT_ORDER.length;

  const firstTime = !state.config;
  const mustAccept = firstTime && !acceptedCurrentTerms(state.termsAccepted);
  const submit = () => {
    if (mustAccept && !agreed) return;
    if (mustAccept) acceptTerms();
    const next: Config = { ...cfg, dateMode: mode };
    if (mode !== "edicao") delete next.edition;
    if (typedGoals) next.goals = typedGoals;
    else delete next.goals;
    saveConfig(next);
    nav({ to: "/" });
  };

  return (
    <div className="px-5 pb-10 pt-8">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Reta Final ENEM</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight">
        Vamos montar seu plano personalizado
      </h1>
      <p className="mt-2 text-muted-foreground">
        Com a data da prova, o seu tempo, a dificuldade de cada área e as suas metas, o app monta um
        plano dia a dia. Você muda tudo depois em Ajustes.
      </p>

      <div className="mt-8 space-y-5">
        <section className="card-soft p-5" aria-labelledby="q-date">
          <h2 id="q-date" className="text-sm font-bold">
            Data da prova
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["auto", "Automática (recomendado)"],
                ["edicao", "Escolher edição"],
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
          {exam.edition && (
            <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
              <p className="font-bold">
                ENEM {exam.edition.year}: {formatDays(exam.edition.days)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {exam.edition.status === "oficial"
                  ? `Data oficial (${exam.edition.source}).`
                  : "Data estimada pelo padrão das últimas edições. A confirmar no edital do Inep."}{" "}
                Quando a prova passar, o app muda sozinho para a edição seguinte.
              </p>
            </div>
          )}
        </section>

        <section className="card-soft p-5" aria-labelledby="q-time">
          <h2 id="q-time" className="text-sm font-bold">
            Quanto tempo por dia você consegue estudar?
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {HOURS_OPTIONS.map((h) => (
              <Chip
                key={h}
                active={nearestHours(cfg.hours) === h}
                onClick={() => setCfg({ ...cfg, hours: h })}
              >
                {h === 4 ? "4 h ou mais" : `${h} h`}
              </Chip>
            ))}
          </div>
          {!(HOURS_OPTIONS as readonly number[]).includes(cfg.hours) && (
            <p className="mt-2 text-xs text-muted-foreground">
              Seu plano atual usa {String(cfg.hours).replace(".", ",")} h por dia. Escolha uma opção
              para mudar.
            </p>
          )}

          <h2 className="mt-6 text-sm font-bold">Em que horários você estuda?</h2>
          <p className="text-xs text-muted-foreground">
            Pode marcar mais de um. Cada horário recebe blocos de pelo menos 25 minutos; se o tempo
            do dia não der para todos, o plano alterna os horários ao longo da semana.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SHIFT_ORDER.map((s) => (
              <Chip
                key={s}
                active={cfg.shifts.includes(s)}
                onClick={() => setCfg({ ...cfg, shifts: toggleShift(cfg.shifts, s) })}
              >
                {SHIFT_LABEL[s]}
              </Chip>
            ))}
            <Chip
              active={allShifts}
              onClick={() => setCfg({ ...cfg, shifts: toggleShift(cfg.shifts, "todos") })}
            >
              Todos os horários
            </Chip>
          </div>
        </section>

        <section className="card-soft p-5" aria-labelledby="q-diff">
          <h2 id="q-diff" className="text-sm font-bold">
            Quanta dificuldade você sente em cada área?
          </h2>
          <p className="text-xs text-muted-foreground">
            De 1 (tranquilo) a 10 (muito difícil). Áreas mais difíceis ganham mais tempo no plano.
          </p>
          <div className="mt-4 space-y-4">
            {(["mat", "nat", "ling", "hum"] as const).map((a) => (
              <div key={a}>
                <div className="flex justify-between text-sm">
                  <label htmlFor={`diff-${a}`} className={`font-semibold ${AREAS[a].color}`}>
                    {AREAS[a].name}
                  </label>
                  <span className="font-bold tabular-nums">{cfg.difficulty[a]}</span>
                </div>
                <input
                  id={`diff-${a}`}
                  type="range"
                  min={1}
                  max={DIFFICULTY_MAX}
                  step={1}
                  value={cfg.difficulty[a]}
                  aria-valuetext={`${cfg.difficulty[a]} de ${DIFFICULTY_MAX}`}
                  onChange={(e) =>
                    setCfg({
                      ...cfg,
                      difficulty: { ...cfg.difficulty, [a]: Number(e.target.value) },
                    })
                  }
                  className="mt-2 h-2 w-full cursor-pointer accent-primary"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card-soft p-5" aria-labelledby="q-goals">
          <h2 id="q-goals" className="text-sm font-bold">
            Meta de nota em cada área (opcional)
          </h2>
          <p className="text-xs text-muted-foreground">
            De 0 a 1000. Áreas com meta mais alta ganham mais tempo. Se deixar alguma em branco, ela
            recebe a média das outras.
          </p>

          {COURSES.length > 0 && (
            <div className="mt-4 rounded-xl bg-muted p-3">
              <label htmlFor="course" className="text-xs font-semibold">
                Curso que você quer (opcional)
              </label>
              <select
                id="course"
                value={cfg.course ?? ""}
                onChange={(e) => {
                  const next = { ...cfg };
                  if (e.target.value) next.course = e.target.value;
                  else delete next.course;
                  setCfg(next);
                }}
                className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm"
              >
                <option value="">Sem curso definido</option>
                {COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {courseLabel(c)}
                  </option>
                ))}
              </select>
              {course && (
                <>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Pesos:{" "}
                    {AREA_ORDER.map((a) => `${AREAS[a].short} ${course.weights[a]}`).join(" · ")} ·{" "}
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {course.source} ({course.year})
                    </a>
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <div className="flex-1">
                      <label htmlFor="average" className="text-xs font-semibold">
                        Média que você quer
                      </label>
                      <input
                        id="average"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={1000}
                        value={average}
                        onChange={(e) => setAverage(e.target.value)}
                        className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setGoals(goalInputsOf(suggestGoals(clampGoal(average), course.weights)))
                      }
                      className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
                    >
                      Sugerir metas
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            {AREA_ORDER.map((a) => (
              <div key={a}>
                <label htmlFor={`goal-${a}`} className={`text-xs font-semibold ${AREAS[a].color}`}>
                  {AREAS[a].name}
                </label>
                <input
                  id={`goal-${a}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  placeholder="Ex.: 700"
                  value={goals[a]}
                  onChange={(e) => setGoals({ ...goals, [a]: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-base"
                />
              </div>
            ))}
          </div>
        </section>

        <p className="rounded-2xl bg-accent p-4 text-sm text-accent-foreground" aria-live="polite">
          {reason}
        </p>

        {state.config && (
          <section className="card-soft p-5" aria-labelledby="q-saver">
            <label className="flex items-start justify-between gap-3">
              <span>
                <span id="q-saver" className="block text-sm font-bold">
                  Economia de dados
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Desliga animações e o confete. Bom para celular simples ou internet fraca. Vale na
                  hora, sem precisar salvar.
                </span>
              </span>
              <input
                type="checkbox"
                checked={state.dataSaver}
                onChange={(e) => setDataSaver(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-primary"
              />
            </label>
          </section>
        )}

        {state.config && (
          <section className="card-soft p-5" aria-labelledby="q-data">
            <h2 id="q-data" className="text-sm font-bold">
              Seus dados
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tudo fica salvo só neste aparelho. Veja a{" "}
              <Link to="/privacidade" className="font-semibold text-primary">
                Política de Privacidade
              </Link>{" "}
              e os{" "}
              <Link to="/termos" className="font-semibold text-primary">
                Termos de Uso
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadData}
                className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground"
              >
                Baixar meus dados
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Apagar todo o seu progresso deste aparelho? Plano, respostas, metas e links serão apagados e não dá para desfazer.",
                    )
                  ) {
                    clearAllData();
                    nav({ to: "/onboarding" });
                  }
                }}
                className="rounded-lg border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive"
              >
                Apagar todos os meus dados deste aparelho
              </button>
            </div>
          </section>
        )}

        <p className="text-center text-xs text-muted-foreground">{DISCLAIMER}</p>

        {mustAccept && (
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
            />
            <span>
              Li e aceito os{" "}
              <Link to="/termos" className="font-semibold text-primary">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link to="/privacidade" className="font-semibold text-primary">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
        )}

        <button
          onClick={submit}
          disabled={mustAccept && !agreed}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.config ? "Salvar e recalcular plano" : "Criar meu plano"}
        </button>
      </div>
    </div>
  );
}
