import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { LEVEL_STYLE, QuestionCard } from "@/components/QuestionCard";
import { Chip, Loading, PageHeader, Progress } from "@/components/ui-bits";
import { todayISO } from "@/lib/planner";
import { LEVELS, LEVEL_LABEL, LEVEL_PLURAL } from "@/lib/question-types";
import type { LevelChoice } from "@/lib/quiz";
import { QUESTION_BY_ID, QUESTIONS, type Question } from "@/lib/questions";
import { answerQuestion, ensureDailyQuiz, moreQuestions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/questoes")({
  head: () => ({
    meta: [
      { title: "Questões do dia — Reta Final ENEM" },
      { name: "description", content: "Questões no estilo ENEM, com textos, gráficos, tabelas e imagens, em três níveis de dificuldade." },
      { property: "og:title", content: "Questões do dia — Reta Final ENEM" },
      { property: "og:description", content: "Treine com questões novas todos os dias, escolhidas pelo que você está estudando." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Questions,
});

const FILTERS: [LevelChoice, string][] = [["mix", "Todas"], ...LEVELS.map((l): [LevelChoice, string] => [l, LEVEL_LABEL[l]])];

function Questions() {
  const { state, ready } = useAppState();
  const [filter, setFilter] = useState<LevelChoice>("mix");
  const today = todayISO();
  useEffect(() => {
    if (ready) ensureDailyQuiz(today);
  }, [ready, today]);
  if (!ready) return <Loading />;

  const set = (state.quizDaily[today] ?? []).map((id) => QUESTION_BY_ID[id]).filter((x): x is Question => Boolean(x));
  const done = set.filter((x) => state.quiz[x.id]);
  const hits = done.filter((x) => state.quiz[x.id]?.choice === x.answer).length;
  const finished = set.length > 0 && done.length === set.length;
  const shown = set.filter((x) => filter === "mix" || x.level === filter);
  const left = (l: LevelChoice) => QUESTIONS.filter((x) => (l === "mix" || x.level === l) && !state.quiz[x.id]).length;
  const label = filter === "mix" ? "" : ` ${LEVEL_PLURAL[filter]}`;

  return (
    <div>
      <PageHeader title="Questões do dia" subtitle={`${done.length} de ${set.length} respondidas hoje`} />
      <div className="px-5">
        <Progress value={set.length ? done.length / set.length : 0} />
        <p className="mt-2 text-xs text-muted-foreground">
          Todo dia vêm questões novas, no estilo ENEM, misturando níveis e escolhidas pelo que está no seu plano e pelos seus pontos fracos. Seus acertos entram no Desempenho.
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map(([value, name]) => (
          <Chip key={value} active={filter === value} onClick={() => setFilter(value)}>{name}</Chip>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        {shown.map((x) => (
          <QuestionCard key={x.id} question={x} index={set.indexOf(x)} choice={state.quiz[x.id]?.choice} onAnswer={(c) => answerQuestion(x.id, c)} />
        ))}
        {shown.length === 0 && (
          <p className="card-soft p-4 text-center text-sm text-muted-foreground">
            Nenhuma questão{filter === "mix" ? "" : ` ${LEVEL_LABEL[filter].toLowerCase()}`} no conjunto de hoje. Toque em “Mais questões” para buscar.
          </p>
        )}
      </div>

      {finished && filter === "mix" && (
        <p className="mx-5 mt-4 rounded-2xl bg-success/15 p-4 text-center text-sm font-bold text-success">
          Você acertou {hits} de {done.length} hoje. Bom trabalho!
        </p>
      )}

      <div className="mt-4 px-5">
        {left(filter) > 0 ? (
          <button
            type="button"
            onClick={() => moreQuestions(today, filter)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-3 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Mais questões{label}
          </button>
        ) : (
          <p className="rounded-2xl bg-accent p-4 text-center text-sm text-accent-foreground">
            Você já respondeu todas as questões{label || " do banco"}. {filter === "mix" ? "Amanhã o app volta a sugerir as que você quer rever." : "Escolha outro nível."}
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-semibold">
          {LEVELS.map((l) => (
            <span key={l} className={`rounded-full px-2.5 py-1 ${LEVEL_STYLE[l]}`}>
              {LEVEL_LABEL[l]}: {QUESTIONS.filter((x) => x.level === l && state.quiz[x.id]).length}/{QUESTIONS.filter((x) => x.level === l).length}
            </span>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Questões já respondidas, por nível</p>
      </div>
    </div>
  );
}
