import { Link } from "@tanstack/react-router";
import { Check, PlayCircle, X } from "lucide-react";
import { AREAS, TOPIC_BY_ID } from "@/lib/data";
import { LEVEL_LABEL, type Level } from "@/lib/question-types";
import { optionOrder } from "@/lib/quiz";
import type { Question } from "@/lib/questions";
import { AreaTag } from "./ui-bits";

const LETTERS = ["A", "B", "C", "D", "E"];
export const LEVEL_STYLE: Record<Level, string> = {
  facil: "bg-success/15 text-success",
  media: "bg-area-hum/20 text-foreground",
  dificil: "bg-destructive/12 text-destructive",
};

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
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[question.level]}`}>{LEVEL_LABEL[question.level]}</span>
        <span className="text-[11px] font-semibold text-muted-foreground">{topic.name}</span>
      </div>

      {question.passages?.map((p, i) => (
        <blockquote key={i} className="mt-3 rounded-xl border-l-4 border-border bg-muted/60 p-3 text-sm leading-relaxed">
          {p.label && <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{p.label}</p>}
          <p className="whitespace-pre-line">{p.body}</p>
          {p.source && <p className="mt-1.5 text-[11px] text-muted-foreground">{p.source}</p>}
        </blockquote>
      ))}

      {question.figure && (
        <figure className="mt-3">
          <img src={question.figure.src} alt={question.figure.alt} loading="lazy" className="mx-auto w-full max-w-md rounded-xl border bg-white" />
          {question.figure.caption && <figcaption className="mt-1 text-[11px] text-muted-foreground">{question.figure.caption}</figcaption>}
        </figure>
      )}

      {question.table && (
        <div className="mt-3">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-max text-left text-xs">
              {question.table.caption && <caption className="bg-muted/60 px-3 py-2 text-left text-xs font-bold">{question.table.caption}</caption>}
              <thead>
                <tr className="bg-muted/60">
                  {question.table.head.map((h, i) => (
                    <th key={i} scope="col" className="px-3 py-2 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.table.rows.map((row, i) => (
                  <tr key={i} className="border-t">
                    {row.map((cell, j) => (j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-semibold">{cell}</th> : <td key={j} className="px-3 py-2">{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {question.table.note && <p className="mt-1 text-[11px] text-muted-foreground">{question.table.note}</p>}
        </div>
      )}

      <p className="mt-3 text-[15px] leading-relaxed">{question.text}</p>
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
