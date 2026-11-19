import { Check, ChevronDown, Lightbulb, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Exercise, Layer, Trap, WorkedExample } from "@/lib/content";

/** Seção que abre ao toque (revelação progressiva). */
export function Collapsible({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="card-soft">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span>
          <span className="block text-base font-bold">{title}</span>
          {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="animate-in fade-in space-y-3 border-t px-4 pb-4 pt-3 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </section>
  );
}

export function LayerBody({ layer }: { layer: Layer }) {
  return (
    <>
      {layer.texto.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {layer.formulas && layer.formulas.length > 0 && (
        <ul className="space-y-2">
          {layer.formulas.map((f) => (
            <li key={f.expr} className="rounded-xl bg-muted p-3">
              <p className="font-mono text-[15px] font-semibold">{f.expr}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.legenda}</p>
            </li>
          ))}
        </ul>
      )}
      {layer.exemplos?.map((ex, i) => (
        <ExampleCard key={i} example={ex} />
      ))}
    </>
  );
}

function ExampleCard({ example }: { example: WorkedExample }) {
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {example.titulo ? `Exemplo resolvido · ${example.titulo}` : "Exemplo resolvido"}
      </p>
      <p className="mt-1.5">{example.enunciado}</p>
      {example.figure && (
        <img
          src={example.figure.src}
          alt={example.figure.alt}
          loading="lazy"
          className="mx-auto mt-2 w-full max-w-md rounded-xl border bg-white"
        />
      )}
      {show ? (
        <div className="animate-in fade-in mt-2 space-y-1.5">
          <ol className="list-decimal space-y-1.5 pl-5">
            {example.passos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          <p className="rounded-lg bg-success/15 p-2 font-semibold text-success">
            Resposta: {example.resposta}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="mt-2 text-sm font-semibold text-primary"
        >
          Ver resolução passo a passo
        </button>
      )}
    </div>
  );
}

export function TrapList({ traps }: { traps: Trap[] }) {
  return (
    <ul className="space-y-2">
      {traps.map((t) => (
        <li key={t.erro} className="rounded-xl bg-destructive/8 p-3">
          <p className="font-semibold">
            <X className="mr-1 inline h-4 w-4 text-destructive" />
            {t.erro}
          </p>
          <p className="mt-1 text-muted-foreground">
            <Lightbulb className="mr-1 inline h-4 w-4 text-primary" />
            {t.comoEvitar}
          </p>
        </li>
      ))}
    </ul>
  );
}

const parseNumber = (s: string) =>
  Number(
    s
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "")
      .replace(",", "."),
  );

/** Exercício rápido com correção na hora. */
export function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const check = (ok: boolean) => setResult(ok);
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Exercício {index + 1}
      </p>
      <p className="mt-1.5">{exercise.pergunta}</p>
      {exercise.tipo === "numero" ? (
        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const n = parseNumber(value);
            if (!Number.isFinite(n)) return;
            check(Math.abs(n - exercise.resposta) <= (exercise.tolerancia ?? 0));
          }}
        >
          <input
            inputMode="decimal"
            aria-label="Sua resposta"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult(null);
            }}
            className="w-28 rounded-xl border bg-background px-3 py-2 text-base"
          />
          {exercise.unidade && (
            <span className="text-sm text-muted-foreground">{exercise.unidade}</span>
          )}
          <button className="ml-auto rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
            Conferir
          </button>
        </form>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {exercise.opcoes.map((o, i) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => check(i === exercise.resposta)}
                className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
      {result !== null && (
        <div
          role="status"
          className={`animate-in fade-in mt-2 rounded-lg p-2.5 ${result ? "bg-success/15" : "bg-destructive/10"}`}
        >
          <p className={`font-bold ${result ? "text-success" : "text-destructive"}`}>
            {result ? (
              <>
                <Check className="mr-1 inline h-4 w-4" />
                Certo!
              </>
            ) : (
              "Ainda não. Veja a resolução:"
            )}
          </p>
          <p className="mt-1 text-muted-foreground">{exercise.explicacao}</p>
        </div>
      )}
    </div>
  );
}
