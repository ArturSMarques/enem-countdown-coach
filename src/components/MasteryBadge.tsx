import type { MasteryLevel } from "@/lib/planner";
import { MASTERY_LABEL, MASTERY_LEVELS, type TopicMastery } from "@/lib/topic-mastery";

const LEVEL_STYLE: Record<MasteryLevel, string> = {
  nao_iniciado: "bg-muted text-muted-foreground",
  basico: "bg-area-hum/20 text-foreground",
  desenvolvendo: "bg-area-mat/15 text-area-mat",
  avancado: "bg-primary/15 text-primary",
  dominado: "bg-success text-primary-foreground",
};

/** Computed mastery level of a topic: a label plus a five-step meter. */
export function MasteryChip({ level }: { level: MasteryLevel }) {
  const step = MASTERY_LEVELS.indexOf(level);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_STYLE[level]}`}
      aria-label={`Nível: ${MASTERY_LABEL[level]}`}
    >
      <span aria-hidden className="flex gap-0.5">
        {MASTERY_LEVELS.slice(1).map((l, i) => (
          <span
            key={l}
            className={`h-1.5 w-1.5 rounded-full ${i < step ? "bg-current" : "bg-current opacity-25"}`}
          />
        ))}
      </span>
      {MASTERY_LABEL[level]}
    </span>
  );
}

/** Level, the numbers behind it and what is missing to go up. */
export function MasteryDetail({ mastery }: { mastery: TopicMastery }) {
  return (
    <div className="rounded-xl bg-muted p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold">Seu nível neste tópico</span>
        <MasteryChip level={mastery.level} />
      </div>
      {mastery.answers > 0 && mastery.rate !== null && (
        <p className="mt-1 text-xs text-muted-foreground">
          {mastery.answers} {mastery.answers === 1 ? "resposta recente" : "respostas recentes"} ·
          acerto ponderado pela dificuldade: {Math.round(mastery.rate * 100)}%
        </p>
      )}
      {mastery.next && <p className="mt-1.5 text-xs">{mastery.next}</p>}
    </div>
  );
}
