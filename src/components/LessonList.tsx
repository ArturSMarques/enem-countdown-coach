import { ExternalResourceLink } from "@/components/ExternalResourceLink";
import {
  curatedBy,
  LESSON_LEVEL_LABEL,
  LESSON_LEVELS,
  lessonURL,
  type Lesson,
} from "@/lib/lessons";

/** One selected lesson: title and channel as credit, who selected it, and the plain link. */
export function LessonItem({ lesson }: { lesson: Lesson }) {
  return (
    <div className="min-w-0">
      <ExternalResourceLink href={lessonURL(lesson)}>{lesson.titulo}</ExternalResourceLink>
      <p className="text-xs text-muted-foreground">
        {lesson.canal}
        {lesson.duracao ? ` · ${lesson.duracao}` : ""} · {curatedBy(lesson)}
        {lesson.recomendada && (
          <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            Recomendada
          </span>
        )}
      </p>
    </div>
  );
}

/** A topic's selected lessons, grouped by level. Renders nothing when there are none. */
export function LessonList({ lessons }: { lessons: Lesson[] }) {
  if (!lessons.length) return null;
  return (
    <section aria-label="Aulas selecionadas pelo professor" className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Aulas selecionadas pelo professor
      </p>
      {LESSON_LEVELS.filter((n) => lessons.some((l) => l.nivel === n)).map((n) => (
        <div key={n}>
          <p className="text-xs font-semibold">{LESSON_LEVEL_LABEL[n]}</p>
          <ul className="mt-1 space-y-2">
            {lessons
              .filter((l) => l.nivel === n)
              .map((l) => (
                <li key={l.videoId}>
                  <LessonItem lesson={l} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
