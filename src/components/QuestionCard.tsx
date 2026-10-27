import { Link } from "@tanstack/react-router";
import { Check, PlayCircle, X } from "lucide-react";
import { AREAS, TOPIC_BY_ID } from "@/lib/data";
import { optionOrder } from "@/lib/quiz";
import type { Question } from "@/lib/questions";
import { AreaTag } from "./ui-bits";

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuestionCard({
  question,
  index,
  choice,
  onAnswer,
}: {
  question: Question;
  index: number;
  /** Index of the chosen alternative in `question.options`, or undefined if not answered yet. */
  choice: number | undefined;
  onAnswer: (choice: number) => void;
}) {
  const topic = TOPIC_BY_ID[question.topicId];
  if (!topic) return null;
  const answered = choice !== undefined;
  const hit = choice === question.answer;
  return (
    <article className={`card-soft border-l-4 ${AREAS[topic.area].border} p-4`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-muted-foreground">Questão {index + 1}</span>
        <AreaTag area={topic.area} label={topic.subject} />
        <span className="text-[11px] font-semibold text-muted-foreground">{topic.name}</span>
      </div>
      <p className="mt-2.5 text-[15px] leading-relaxed">{question.text}</p>
      <ul className="mt-3 space-y-2">
        {optionOrder(question).map((original, position) => {
          const picked = choice === original;
          const right = original === question.answer;
          const tone = !answered
            ? "bg-card hover:bg-muted"
            : right
              ? "border-success bg-success/15"
              : picked
                ? "border-destructive bg-destructive/10"
                : "opacity-60";
          return (
            <li key={original}>
              <button
                type="button"
                disabled={answered}
                onClick={() => onAnswer(original)}
                aria-label={`Alternativa ${LETTERS[position]}`}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${tone}`}
              >
                <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                  {answered && right ? <Check className="h-3.5 w-3.5 text-success" /> : answered && picked ? <X className="h-3.5 w-3.5 text-destructive" /> : LETTERS[position]}
                </span>
                <span className="min-w-0 flex-1">{question.options[original]}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div role="status" className="animate-in fade-in mt-3 rounded-xl bg-muted p-3 text-sm">
          <p className={`font-bold ${hit ? "text-success" : "text-destructive"}`}>{hit ? "Você acertou!" : "Não foi dessa vez."}</p>
          <p className="mt-1 text-muted-foreground">{question.why}</p>
          {!hit && (
            <Link to="/aulas" search={{ topic: topic.id }} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-primary">
              <PlayCircle className="h-4 w-4" /> Rever aulas de {topic.name}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
