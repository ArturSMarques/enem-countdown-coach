import { createFileRoute, Link } from "@tanstack/react-router";
import { LessonItem } from "@/components/LessonList";
import { suggestedLesson } from "@/lib/lessons";
import { ArrowLeft, BookOpenCheck, PlayCircle } from "lucide-react";
import { MasteryDetail } from "@/components/MasteryBadge";
import { QuestionCard } from "@/components/QuestionCard";
import { todayISO } from "@/lib/planner";
import { topicMastery } from "@/lib/topic-mastery";
import { Collapsible, ExerciseCard, LayerBody, TrapList } from "@/components/TopicDepth";
import { AreaTag, Loading } from "@/components/ui-bits";
import { CONTENT, LAYER_HINT, LAYER_LABEL } from "@/lib/content";
import { TOPIC_BY_ID } from "@/lib/data";
import { INCIDENCE, INCIDENCE_YEARS } from "@/lib/incidence";
import { LEVELS } from "@/lib/question-types";
import { QUESTIONS } from "@/lib/questions";
import { answerQuestion, recordAnswers, useAppState } from "@/lib/store";
import { reviewQuestions, reviewsDue } from "@/lib/review";
import { useState } from "react";

export const Route = createFileRoute("/conteudos_/$topicId")({
  head: ({ params }) => {
    const topic = TOPIC_BY_ID[params.topicId];
    const title = topic ? `${topic.name} — Reta Final ENEM` : "Conteúdo — Reta Final ENEM";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Do básico ao nível das questões difíceis do ENEM, com exemplos resolvidos e exercícios.",
        },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: TopicPage,
});

const PRI_LABEL = { alta: "Prioridade alta", media: "Prioridade média", baixa: "Prioridade baixa" };
const QUICK_TEST = 3;

function TopicPage() {
  const { topicId } = Route.useParams();
  const { state, ready } = useAppState();
  // Answers given in this visit's review (a review can repeat questions answered before).
  const [reviewChoices, setReviewChoices] = useState<Record<string, number>>({});
  if (!ready) return <Loading />;
  const topic = TOPIC_BY_ID[topicId];
  if (!topic)
    return (
      <div className="px-5 pt-8">
        <p className="font-bold">Tópico não encontrado.</p>
        <Link to="/conteudos" className="mt-2 inline-block font-semibold text-primary">
          Voltar para Conteúdos
        </Link>
      </div>
    );
  const content = CONTENT[topicId];
  // Quick test: questions of this topic, new ones first, from easy to hard.
  const pool = QUESTIONS.filter((q) => q.topicId === topicId).sort(
    (a, b) =>
      Number(Boolean(state.quiz[a.id])) - Number(Boolean(state.quiz[b.id])) ||
      LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level),
  );
  const quick = pool.slice(0, QUICK_TEST);
  const today = todayISO();
  const due = reviewsDue(state.attempts, today).some((r) => r.topicId === topicId);
  // Once a review starts, its questions stay on screen until the page is left.
  const reviewing = due || Object.keys(reviewChoices).length > 0;
  const review = reviewing
    ? reviewQuestions(
        topicId,
        state.attempts.filter((a) => !(a.questionId in reviewChoices) || a.day < today),
      )
    : [];

  return (
    <div className="px-5 pb-6 pt-6">
      <Link
        to="/conteudos"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Conteúdos
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <AreaTag area={topic.area} label={topic.subject} />
        <span className="text-[11px] font-bold text-muted-foreground">
          {PRI_LABEL[topic.priority]}
        </span>
      </div>
      <h1 className="mt-1.5 text-2xl font-extrabold leading-tight">{topic.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{topic.tip}</p>
      {INCIDENCE[topic.id] && (
        <p className="mt-2 text-xs text-muted-foreground">
          No ENEM {INCIDENCE_YEARS.join(", ")}:{" "}
          {INCIDENCE[topic.id]!.map((n, i) => `${n} em ${INCIDENCE_YEARS[i]}`).join(", ")}{" "}
          (estimativa por classificação própria das provas oficiais).
        </p>
      )}

      {content ? (
        <>
          <section className="mt-4 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
            <h2 className="flex items-center gap-1.5 font-bold">
              <BookOpenCheck className="h-4 w-4" /> Revisão rápida
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {content.resumo.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <div className="mt-4 space-y-3">
            <Collapsible title={LAYER_LABEL.base} hint={LAYER_HINT.base} defaultOpen>
              <LayerBody layer={content.base} />
            </Collapsible>
            {content.intermediario && (
              <Collapsible title={LAYER_LABEL.intermediario} hint={LAYER_HINT.intermediario}>
                <LayerBody layer={content.intermediario} />
              </Collapsible>
            )}
            {content.avancado && (
              <Collapsible title={LAYER_LABEL.avancado} hint={LAYER_HINT.avancado}>
                <LayerBody layer={content.avancado} />
              </Collapsible>
            )}
            <Collapsible
              title="Armadilhas"
              hint="Erros comuns e como as alternativas erradas tentam enganar."
            >
              <TrapList traps={content.armadilhas} />
            </Collapsible>
            {content.exercicios && content.exercicios.length > 0 && (
              <Collapsible title="Pratique agora" hint="Exercícios rápidos com correção na hora.">
                {content.exercicios.map((ex, i) => (
                  <ExerciseCard key={i} exercise={ex} index={i} />
                ))}
              </Collapsible>
            )}
          </div>
          {content.aConfirmar?.map((x) => (
            <p key={x} className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              A confirmar: {x}
            </p>
          ))}
        </>
      ) : (
        <p className="card-soft mt-4 p-4 text-sm text-muted-foreground">
          O aprofundamento deste tópico ainda está em construção. Enquanto isso, use as aulas
          recomendadas e o teste rápido abaixo.
        </p>
      )}

      {suggestedLesson(topicId) && (
        <section className="mt-6 card-soft p-4 text-sm">
          <h2 className="text-base font-bold">Aula recomendada</h2>
          <div className="mt-2">
            <LessonItem lesson={suggestedLesson(topicId)!} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Assistir ajuda a entender, mas o seu nível no tópico vem das questões que você responde.
          </p>
        </section>
      )}

      {reviewing && review.length > 0 && (
        <section className="mt-6" aria-labelledby="review-title">
          <h2 id="review-title" className="text-base font-bold">
            Revisão de hoje
          </h2>
          <p className="text-xs text-muted-foreground">
            Responda {review.length} questões deste tópico. Acertando todas, a próxima revisão fica
            mais longe; errando, o tópico volta amanhã.
          </p>
          <div className="mt-3 space-y-3">
            {review.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                choice={reviewChoices[q.id]}
                onAnswer={(c, ms) => {
                  setReviewChoices((prev) => ({ ...prev, [q.id]: c }));
                  recordAnswers([{ id: q.id, choice: c, ms }]);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {!reviewing && quick.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Teste rápido</h2>
          <p className="text-xs text-muted-foreground">
            Questões do banco sobre este tópico. As respostas entram no Desempenho e definem o seu
            nível neste tópico.
          </p>
          <div className="mt-3">
            <MasteryDetail mastery={topicMastery(topicId, state.attempts, todayISO())} />
          </div>
          <div className="mt-3 space-y-3">
            {quick.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                choice={state.quiz[q.id]?.choice}
                onAnswer={(c, ms) => answerQuestion(q.id, c, ms)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          to="/aulas"
          search={{ topic: topic.id }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 font-bold text-secondary-foreground"
        >
          <PlayCircle className="h-4 w-4" /> Aulas sobre este tópico
        </Link>
      </div>

      {content?.conexoes && content.conexoes.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold">Conecta com</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {content.conexoes
              .map((id) => TOPIC_BY_ID[id])
              .filter((t) => t !== undefined)
              .map((t) => (
                <Link
                  key={t.id}
                  to="/conteudos/$topicId"
                  params={{ topicId: t.id }}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                >
                  {t.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
