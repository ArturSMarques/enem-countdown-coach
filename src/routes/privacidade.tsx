import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalSection } from "@/components/LegalSection";
import { PageHeader } from "@/components/ui-bits";
import { CONTACT, RESPONSIBLE, TERMS_UPDATED, TERMS_VERSION } from "@/lib/legal";
import { fmtDay } from "@/lib/planner";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Reta Final ENEM" },
      {
        name: "description",
        content: "Que dados o Reta Enem guarda, onde ficam e como apagar, em linguagem simples.",
      },
      { property: "og:title", content: "Política de Privacidade — Reta Final ENEM" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div>
      <PageHeader
        title="Política de Privacidade"
        subtitle={`Versão ${TERMS_VERSION}, atualizada em ${fmtDay(TERMS_UPDATED, { day: "numeric", month: "long", year: "numeric" })}`}
      />
      <article className="space-y-4 px-5 pb-10 text-sm leading-relaxed">
        <p className="rounded-2xl bg-accent p-4 font-semibold text-accent-foreground">
          Resumo: hoje o Reta Enem não tem cadastro e não envia o seu progresso para nenhum
          servidor. Tudo fica guardado só neste aparelho, e você pode baixar ou apagar quando
          quiser.
        </p>
        <LegalSection title="Quem é responsável">
          <p>
            {RESPONSIBLE}, autora do site como Trabalho de Conclusão de Curso. Contato: {CONTACT}.
          </p>
        </LegalSection>
        <LegalSection title="O que fica guardado e onde">
          <p>
            No armazenamento do seu navegador (neste aparelho), o app guarda: as escolhas do plano
            (data da prova, horas, horários, dificuldade, metas e curso), o cronograma e os blocos
            concluídos, as respostas às questões (com o dia e o tempo gasto), os registros de
            questões feitas fora do app, os seus links, a lista do dia da prova, os dias estudados,
            o tema, a economia de dados e o aceite destes termos.
          </p>
          <p>
            Não pedimos nome, e-mail, telefone, escola nem localização. Esses dados não saem do
            aparelho e não são vendidos nem compartilhados.
          </p>
        </LegalSection>
        <LegalSection title="Para que servem">
          <p>
            Só para o app funcionar: montar o seu plano, escolher questões, calcular o seu nível e
            mostrar o seu desempenho.
          </p>
        </LegalSection>
        <LegalSection title="Uso sem internet">
          <p>
            Quando instalado ou aberto uma vez com internet, o app guarda no aparelho as páginas do
            próprio site para funcionar sem rede. Isso não inclui dados pessoais.
          </p>
        </LegalSection>
        <LegalSection title="O que outros serviços podem registrar">
          <p>
            Como em qualquer site, a plataforma de hospedagem recebe dados técnicos de acesso (como
            endereço IP, tipo de navegador e páginas abertas) e pode gerar estatísticas de visitas,
            conforme as regras dela.
          </p>
          <p>
            As fontes de letra vêm do Google Fonts: ao abrir o site, o navegador faz um pedido aos
            servidores do Google.
          </p>
          <p>
            Aulas e resumos abrem em outros sites (como o YouTube), que têm as próprias políticas de
            privacidade.
          </p>
          <p>
            Hoje o app não usa inteligência artificial externa. Se um dia usar (por exemplo, para
            corrigir redações), esta política vai dizer antes que o texto do aluno é enviado a esse
            fornecedor.
          </p>
        </LegalSection>
        <LegalSection title="Seus direitos (LGPD)">
          <p>
            A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante, entre outros, o direito
            de saber quais dados existem, de corrigi-los e de excluí-los. Como os dados ficam no seu
            aparelho, você mesmo faz isso em{" "}
            <Link to="/onboarding" className="font-semibold text-primary">
              Ajustes
            </Link>
            : corrigir as escolhas do plano, <strong>baixar meus dados</strong> (um arquivo com tudo
            o que está guardado) e <strong>apagar todos os meus dados deste aparelho</strong>.
          </p>
        </LegalSection>
        <LegalSection title="Menores de idade">
          <p>
            Muitos usuários são menores de idade, e os dados deles têm proteção especial. Por isso o
            app não tem cadastro nem perfil público. Antes de existirem contas, a forma de
            consentimento dos responsáveis será definida com a escola, e esta política será
            atualizada.
          </p>
        </LegalSection>
        <LegalSection title="Mudanças">
          <p>
            Se esta política mudar de forma importante (por exemplo, com contas ou ranking
            compartilhado), o app avisa e pede um novo aceite.
          </p>
        </LegalSection>
      </article>
    </div>
  );
}
