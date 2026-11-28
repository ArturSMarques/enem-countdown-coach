# Privacidade: o que falta antes de abrir contas

Hoje o Reta Enem **não tem cadastro**, e todo o progresso fica no aparelho do aluno.

O que já está no ar:
- os Termos de Uso (`/termos`) e a Política de Privacidade (`/privacidade`);
- o aviso de que o app não garante nota;
- o aceite, salvo com a versão dos termos em `src/lib/legal.ts`;
- em Ajustes, "Baixar meus dados" e "Apagar todos os meus dados deste aparelho".

Antes de existirem **contas, ranking compartilhado ou IA externa** (seções 11 e 13), a equipe precisa resolver os pontos abaixo **com a escola ou o orientador**.

## Decisões pendentes

- [x] **Consentimento dos responsáveis (decisão 2):** a equipe escolheu cadastro aberto, com o responsável autorizando por um link enviado ao e-mail dele (fase 11). Mesmo assim, vale **validar essa forma com a escola ou o orientador** antes de divulgar.
- [ ] **Provedor de e-mail:** o envio grátis do Supabase só entrega para e-mails da equipe do projeto e tem limite de 2 por hora. Para menores de fora da equipe receberem a autorização, é preciso configurar um provedor (docs/supabase.md, item 3).
- [ ] **Contato:** hoje aparece "fale com a equipe do projeto pela escola". Antes das contas, é preciso um e-mail ou canal oficial para pedidos de acesso, correção e exclusão.
- [x] **Servidor de dados e login (decisão 1):** Supabase (fase 11), com regras de acesso por linha.

## Regras para quando houver contas

- Coletar o mínimo e explicar para quê. Por exemplo: apelido e e-mail para recuperar a conta; nada de escola, telefone ou endereço sem necessidade.
- Ranking **só com apelido**, sem nenhum contato público. Feito na fase 12: o ranking mostra apelido, avatar e pontos; o aluno pode escolher não aparecer; menor só aparece depois da autorização; revogar a autorização apaga as respostas do ranking.
- Deixar o aluno **ver, corrigir e excluir** a conta e os dados direto no app.
- **Nunca** vender nem compartilhar dados de alunos.
- Se houver IA externa (explicações ou correção de redação), a política deve dizer, **antes** do uso, que o texto do aluno é enviado a esse fornecedor.
- Ao mudar a política ou os termos de forma importante, subir `TERMS_VERSION` em `src/lib/legal.ts`. Quem aceitou a versão anterior vê o aviso de novo.
- Os textos de `/termos` e `/privacidade` foram escritos pela equipe em linguagem simples. **Não são parecer jurídico.** Vale a escola ou o orientador revisarem antes de abrir o site ao público.
