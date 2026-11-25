import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalSection } from "@/components/LegalSection";
import { PageHeader } from "@/components/ui-bits";
import { CONTACT, DISCLAIMER, RESPONSIBLE, TERMS_UPDATED, TERMS_VERSION } from "@/lib/legal";
import { fmtDay } from "@/lib/planner";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Reta Final ENEM" },
      { name: "description", content: "Termos de uso do Reta Enem, em linguagem simples." },
      { property: "og:title", content: "Termos de Uso — Reta Final ENEM" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div>
      <PageHeader
        title="Termos de Uso"
        subtitle={`Versão ${TERMS_VERSION}, atualizada em ${fmtDay(TERMS_UPDATED, { day: "numeric", month: "long", year: "numeric" })}`}
      />
      <article className="space-y-4 px-5 pb-10 text-sm leading-relaxed">
        <p className="rounded-2xl bg-accent p-4 font-semibold text-accent-foreground">
          {DISCLAIMER}
        </p>
        <LegalSection title="O que é o Reta Enem">
          É um site gratuito de apoio aos estudos para o ENEM, feito como Trabalho de Conclusão de
          Curso pela {RESPONSIBLE}. Ele monta um cronograma, sugere questões, revisões e aulas e
          mostra o seu desempenho.
        </LegalSection>
        <LegalSection title="Sem garantia de resultado">
          O plano, as metas, os níveis e as notas mostradas no app são estimativas para orientar o
          estudo. Eles não são oficiais e não preveem a nota do ENEM. Datas e regras da prova devem
          ser sempre conferidas no edital do Inep.
        </LegalSection>
        <LegalSection title="Como usar">
          Use o site para estudar, de forma pessoal e educacional. Não tente atrapalhar o
          funcionamento do site nem copiar o conteúdo para vender.
        </LegalSection>
        <LegalSection title="Conteúdo">
          As explicações e as questões autorais foram escritas pela equipe e revisadas antes de
          entrar. Questões de provas reais pertencem às instituições que as aplicaram e só aparecem
          com a fonte e quando o uso é permitido. Veja{" "}
          <Link to="/creditos" className="font-semibold text-primary">
            Créditos e fontes
          </Link>
          . Se encontrar um erro, avise a equipe.
        </LegalSection>
        <LegalSection title="Links para outros sites">
          As aulas e os resumos abrem em outros sites, como o YouTube. Esses sites têm regras
          próprias, e o Reta Enem não controla o conteúdo deles.
        </LegalSection>
        <LegalSection title="Seus dados">
          Hoje não há cadastro: o seu progresso fica salvo só neste aparelho. Veja os detalhes na{" "}
          <Link to="/privacidade" className="font-semibold text-primary">
            Política de Privacidade
          </Link>
          . Se você limpar os dados do navegador ou trocar de aparelho, o progresso não vem junto.
        </LegalSection>
        <LegalSection title="Mudanças">
          Estes termos podem mudar, por exemplo quando houver contas. Quando a mudança for
          importante, o app pede um novo aceite.
        </LegalSection>
        <LegalSection title="Contato">Dúvidas ou pedidos: {CONTACT}.</LegalSection>
      </article>
    </div>
  );
}
