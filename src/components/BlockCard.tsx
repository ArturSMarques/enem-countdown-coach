import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, ListChecks, PlayCircle } from "lucide-react";
import { useState } from "react";
import { AREAS, TOPIC_BY_ID } from "@/lib/data";
import type { Block } from "@/lib/planner";
import { AreaTag } from "./ui-bits";

export function BlockCard({ block, onToggle, compact }: { block: Block; onToggle?: () => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState(false);
  const tp = TOPIC_BY_ID[block.topicId];
  if (!tp) return null;
  const a = AREAS[tp.area];
  return (
    <div className={`card-soft border-l-4 ${a.border} ${pop ? "pop-done" : ""} ${block.done ? "opacity-60" : ""}`} onAnimationEnd={() => setPop(false)}>
      <div className="flex items-center gap-3 p-3.5">
        <button type="button" onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            <AreaTag area={tp.area} label={tp.subject} />
            <span className="text-[11px] font-semibold text-muted-foreground">
              {block.activity} · {block.minutes} min
            </span>
          </div>
          <p className={`mt-1 font-semibold leading-snug ${block.done ? "line-through" : ""} ${compact ? "text-sm" : ""}`}>{tp.name}</p>
        </button>
        {onToggle ? (
          <button
            type="button"
            onClick={() => {
              if (!block.done) setPop(true);
              onToggle();
            }}
            aria-label={block.done ? "Desfazer" : "Concluir"}
            className={`flex h-10 shrink-0 items-center gap-1 rounded-xl px-3 text-sm font-bold transition-colors ${block.done ? "bg-success text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
          >
            <Check className="h-4 w-4" />
            {!compact && (block.done ? "Feito" : "Concluir")}
          </button>
        ) : (
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </div>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t px-3.5 pb-3.5 pt-3 text-sm">
          <p className="text-muted-foreground">{tp.tip}</p>
          <Link to="/aulas" search={{ topic: tp.id }} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-primary">
            <PlayCircle className="h-4 w-4" /> Aulas sobre este tópico
          </Link>
          {block.activity === "Questões" && (
            <Link to="/questoes" className="mt-2 flex items-center gap-1.5 font-semibold text-primary">
              <ListChecks className="h-4 w-4" /> Fazer questões do dia
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
