import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { TOPIC_BY_ID } from "@/lib/data";
import { inDays, REVIEW_CARD_MAX, reviewSchedule, reviewsDue } from "@/lib/review";
import type { Attempt } from "@/lib/topic-mastery";

/**
 * "Revisão de hoje" on the home page: topics whose review is due, from the student's answers. A
 * quick test on the topic page counts as the review. Hidden until the student answers something.
 */
export function ReviewToday({ attempts, today }: { attempts: Attempt[]; today: string }) {
  const schedule = Object.values(reviewSchedule(attempts));
  if (!schedule.length) return null;
  const due = reviewsDue(attempts, today).slice(0, REVIEW_CARD_MAX);
  const next = schedule.filter((r) => r.due > today).sort((a, b) => (a.due < b.due ? -1 : 1))[0];
  return (
    <section className="card-soft p-4" aria-labelledby="review-today">
      <h2 id="review-today" className="flex items-center gap-2 text-sm font-bold">
        <RotateCcw className="h-4 w-4 text-primary" aria-hidden /> Revisão de hoje
      </h2>
      {due.length === 0 ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Nada para revisar hoje.
          {next &&
            ` A próxima é ${TOPIC_BY_ID[next.topicId]?.name ?? next.topicId}, ${inDays(today, next.due)}.`}
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-muted-foreground">
            Responda o teste rápido de cada tópico. Acertando, a próxima revisão fica mais longe;
            errando, o tópico volta amanhã.
          </p>
          <ul className="mt-2 space-y-1.5">
            {due.map((r) => (
              <li key={r.topicId} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0">
                  <span className="font-semibold">{TOPIC_BY_ID[r.topicId]?.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {r.missed ? "Você errou na última vez" : "Revisão programada"}
                  </span>
                </span>
                <Link
                  to="/conteudos/$topicId"
                  params={{ topicId: r.topicId }}
                  className="shrink-0 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground"
                >
                  Revisar
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
