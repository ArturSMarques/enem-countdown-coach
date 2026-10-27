import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { Loading, PageHeader, Progress } from "@/components/ui-bits";
import { todayISO } from "@/lib/planner";
import { QUESTION_BY_ID, QUESTIONS, type Question } from "@/lib/questions";
import { answerQuestion, ensureDailyQuiz, moreQuestions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/questoes")({
  head: () => ({
    meta: [
      { title: "Questões do dia — Reta Final ENEM" },
      { name: "description", content: "Questões novas todo dia, no estilo ENEM, com explicação e registro automático de desempenho." },
      { property: "og:title", content: "Questões do dia — Reta Final ENEM" },
      { property: "og:description", content: "Treine com questões novas todos os dias, escolhidas pelo que você está estudando." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Questions,
});

function Questions() {
  const { state, ready } = useAppState();
  const today = todayISO();
  useEffect(() => {
    if (ready) ensureDailyQuiz(today);
  }, [ready, today]);
  if (!ready) return <Loading />;

  const set = (state.quizDaily[today] ?? []).map((id) => QUESTION_BY_ID[id]).filter((x): x is Question => Boolean(x));
  const done = set.filter((x) => state.quiz[x.id]);
  const hits = done.filter((x) => state.quiz[x.id]?.choice === x.answer).length;
  const bankDone = QUESTIONS.filter((x) => state.quiz[x.id]).length;
  const bankLeft = QUESTIONS.length - bankDone;
  const finished = set.length > 0 && done.length === set.length;

  return (
    <div>
      <PageHeader title="Questões do dia" subtitle={`${done.length} de ${set.length} respondidas hoje`} />
      <div className="px-5">
        <Progress value={set.length ? done.length / set.length : 0} />
        <p className="mt-2 text-xs text-muted-foreground">
          Todo dia vêm questões novas, escolhidas pelo que está no seu plano de hoje e pelos seus pontos fracos. Seus acertos entram no Desempenho.
        </p>
      </div>

      <div className="mt-4 space-y-3 px-5">
        {set.map((x, i) => (
          <QuestionCard key={x.id} question={x} index={i} choice={state.quiz[x.id]?.choice} onAnswer={(c) => answerQuestion(x.id, c)} />
        ))}
      </div>

      {finished && (
        <p className="mx-5 mt-4 rounded-2xl bg-success/15 p-4 text-center text-sm font-bold text-success">
          Você acertou {hits} de {done.length} hoje. Bom trabalho!
        </p>
      )}

      <div className="mt-4 px-5">
        {bankLeft > 0 ? (
          <button
            type="button"
            onClick={() => moreQuestions(today)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-3 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Mais questões
          </button>
        ) : (
          <p className="rounded-2xl bg-accent p-4 text-center text-sm text-accent-foreground">
            Você já respondeu todas as questões do banco. Amanhã o app volta a sugerir as que você errou ou quer rever.
          </p>
        )}
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {bankDone} de {QUESTIONS.length} questões do banco já respondidas
        </p>
      </div>
    </div>
  );
}
