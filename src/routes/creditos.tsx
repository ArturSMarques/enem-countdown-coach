import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { BANCAS } from "@/lib/credits";
import type { Banca } from "@/lib/question-types";
import { QUESTIONS } from "@/lib/questions";
import { NEW_QUESTIONS } from "@/lib/questions-novas";

export const Route = createFileRoute("/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos e fontes — Reta Final ENEM" },
      {
        name: "description",
        content: "De onde vêm as questões e os conteúdos do Reta Enem, e como eles são revisados.",
      },
      { property: "og:title", content: "Créditos e fontes — Reta Final ENEM" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Credits,
});

function Credits() {
  const real = QUESTIONS.filter((q) => q.source);
  const authored = QUESTIONS.length - real.length;
  const pending = NEW_QUESTIONS.filter((q) => !q.revisada).length;
  const byBanca = (b: Banca) => real.filter((q) => q.source!.banca === b).length;

  return (
    <div>
      <PageHeader title="Créditos e fontes" subtitle="De onde vêm as questões e os conteúdos." />
      <div className="space-y-4 px-5 pb-10 text-sm leading-relaxed">
        <section className="card-soft p-4">
          <h2 className="text-base font-bold">Questões do banco</h2>
          <p className="mt-1">
            {authored} {authored === 1 ? "questão é autoral" : "questões são autorais"}: foram
            escritas para o Reta Enem no estilo do Enem e não são cópias de provas.
            {real.length === 0
              ? " Ainda não há questões de provas reais no banco."
              : ` ${real.length} ${real.length === 1 ? "é de prova real" : "são de provas reais"}, sempre com a origem e o link oficial.`}
          </p>
          <p className="mt-2 text-muted-foreground">
            Questões novas passam por revisão antes de aparecer no app: os alunos da equipe resolvem
            e conferem cada uma, e o professor dá a aprovação final.
            {pending > 0 &&
              ` Neste momento, ${pending} ${pending === 1 ? "questão aguarda" : "questões aguardam"} revisão.`}
          </p>
        </section>

        <section className="card-soft p-4">
          <h2 className="text-base font-bold">Questões de provas reais</h2>
          <p className="mt-1">
            As questões de provas do Enem, do ITA e da Fuvest pertencem às respectivas instituições
            e são usadas aqui apenas para fins educacionais. Cada uma mostra a origem completa (por
            exemplo, “Enem 2023, 1º dia, questão 45”) com link para a fonte oficial.
          </p>
          <p className="mt-2 text-muted-foreground">
            Citar a fonte não substitui a autorização de uso. O app só reproduz o enunciado de uma
            questão real quando os termos de uso da instituição (e dos textos e imagens de terceiros
            dentro da prova) foram conferidos. Nos outros casos, mostra apenas a referência e o link
            para resolver no site oficial.
          </p>
          <ul className="mt-3 space-y-2.5">
            {(Object.keys(BANCAS) as Banca[]).map((b) => {
              const info = BANCAS[b];
              return (
                <li key={b} className="rounded-xl bg-muted p-3">
                  <p className="font-semibold">{info.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {byBanca(b)} {byBanca(b) === 1 ? "questão" : "questões"} no banco
                  </p>
                  {info.site ? (
                    <a
                      href={info.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Provas e gabaritos oficiais <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">{info.pendente}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card-soft p-4">
          <h2 className="text-base font-bold">Aulas e resumos</h2>
          <p className="mt-1">
            As aulas são de canais gratuitos do YouTube e os resumos, de sites educacionais. O app
            só leva até eles por links: os vídeos e textos pertencem aos seus criadores.
          </p>
          <Link to="/aulas" search={{}} className="mt-2 inline-block font-semibold text-primary">
            Ver canais recomendados
          </Link>
        </section>

        <section className="card-soft p-4">
          <h2 className="text-base font-bold">Datas e prioridades do Enem</h2>
          <p className="mt-1">
            As datas vêm dos editais do Inep; quando ainda não há edital, o app mostra uma data
            estimada e avisa. A prioridade de cada tópico vem de uma classificação própria das
            provas oficiais de 2024 a 2026.
          </p>
        </section>
        <p className="text-center text-xs text-muted-foreground">
          Veja também os{" "}
          <Link to="/termos" className="font-semibold text-primary">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link to="/privacidade" className="font-semibold text-primary">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
