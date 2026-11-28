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
          Resumo: sem conta, tudo fica só neste aparelho. A conta é opcional: com ela, guardamos um
          apelido, o e-mail e o seu progresso num servidor, para não perder nada ao trocar de
          aparelho. Você pode baixar ou apagar seus dados quando quiser.
        </p>
        <LegalSection title="Quem é responsável">
          <p>
            {RESPONSIBLE}, autora do site como Trabalho de Conclusão de Curso. Contato: {CONTACT}.
          </p>
        </LegalSection>
        <LegalSection title="Sem conta: o que fica neste aparelho">
          <p>
            No armazenamento do seu navegador (neste aparelho), o app guarda: as escolhas do plano
            (data da prova, horas, horários, dificuldade, metas e curso), o cronograma e os blocos
            concluídos, as respostas às questões (com o dia e o tempo gasto), os registros de
            questões feitas fora do app, os seus links, a lista do dia da prova, os dias estudados,
            o tema, a economia de dados e o aceite destes termos.
          </p>
          <p>
            Sem conta, esses dados não saem do aparelho. Nunca pedimos nome, telefone, escola nem
            localização, e nenhum dado é vendido ou compartilhado.
          </p>
        </LegalSection>
        <LegalSection title="Com conta (opcional): o que guardamos no servidor">
          <p>
            Ao criar uma conta, guardamos: apelido, avatar, e-mail, se você tem 18 anos ou mais, a
            versão dos termos aceita e, para menores de idade, o e-mail do responsável e a data da
            autorização. A senha é guardada de forma protegida (com hash) pelo serviço de login: nem
            a equipe consegue vê-la.
          </p>
          <p>
            Com a conta ativa, uma cópia do seu progresso (o mesmo conteúdo listado acima) fica
            salva no servidor para você não perder nada ao trocar de aparelho. Para menores de
            idade, isso só acontece depois da autorização do responsável.
          </p>
          <p>
            O banco de dados, o login e os e-mails da conta (confirmação, autorização e nova senha)
            são do Supabase, o fornecedor contratado para isso. Regras de acesso no próprio banco
            garantem que cada pessoa só veja os próprios dados.
          </p>
        </LegalSection>
        <LegalSection title="Ranking (só com conta)">
          <p>
            Com a conta ativa, cada questão respondida no app é enviada ao servidor (qual questão, a
            alternativa escolhida, o tempo gasto e o horário), que confere o gabarito e calcula os
            pontos do ranking. Esses registros também servem para evitar trapaça: respostas rápidas
            demais ou acima dos limites valem 0 ponto, e casos estranhos ficam anotados para a
            equipe revisar.
          </p>
          <p>
            Outros alunos com conta veem no ranking apenas o seu <strong>apelido</strong>, o{" "}
            <strong>avatar</strong> e os <strong>pontos</strong>. E-mail, idade e respostas nunca
            aparecem. Você pode escolher não aparecer no ranking quando quiser, na própria página do
            ranking. Menores de idade só enviam respostas e aparecem depois da autorização do
            responsável; se a autorização for retirada, as respostas do ranking são apagadas.
          </p>
        </LegalSection>
        <LegalSection title="Entrar com o Google (opcional)">
          <p>
            Se você escolher "Continuar com o Google", o Google informa ao serviço de login o seu
            nome, e-mail e foto de perfil. O Reta Enem usa só o e-mail: o nome e a foto ficam
            guardados pelo serviço de login junto da conta, não aparecem no app e são apagados se
            você excluir a conta. Depois do primeiro acesso, o app pede um apelido, a sua idade (18
            anos ou mais) e o aceite destes termos, como no cadastro por e-mail.
          </p>
        </LegalSection>
        <LegalSection title="Para que servem">
          <p>
            Só para o app funcionar: montar o seu plano, escolher questões, calcular o seu nível,
            mostrar o seu desempenho e, com conta, montar o ranking.
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
            de saber quais dados existem, de corrigi-los e de excluí-los. Você mesmo faz isso no
            app: em{" "}
            <Link to="/onboarding" className="font-semibold text-primary">
              Ajustes
            </Link>
            , corrigir as escolhas do plano, <strong>baixar meus dados</strong> e{" "}
            <strong>apagar todos os meus dados deste aparelho</strong>; no{" "}
            <Link to="/perfil" className="font-semibold text-primary">
              Perfil
            </Link>
            , trocar apelido, e-mail, senha e avatar e <strong>excluir a conta e os dados</strong>{" "}
            do servidor.
          </p>
        </LegalSection>
        <LegalSection title="Menores de idade">
          <p>
            Muitos usuários são menores de idade, e os dados deles têm proteção especial. Quem tem
            menos de 18 anos informa o e-mail de um responsável, que recebe um link para autorizar.
            Até a autorização, o progresso fica só no aparelho e o estudante não aparece no ranking.
            O responsável pode retirar a autorização quando quiser, e então o progresso e as
            respostas do ranking salvos no servidor são apagados.
          </p>
        </LegalSection>
        <LegalSection title="Mudanças">
          <p>
            Se esta política mudar de forma importante (por exemplo, com a correção de redação por
            inteligência artificial), o app avisa e pede um novo aceite.
          </p>
        </LegalSection>
      </article>
    </div>
  );
}
