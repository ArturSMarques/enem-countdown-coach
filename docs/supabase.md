# Contas no Supabase: configuração

As contas são **opcionais**: sem elas, o Reta Enem continua funcionando com tudo no aparelho. Com elas, o progresso fica guardado no Supabase e vai junto para outros aparelhos. As decisões da equipe foram: Supabase (decisão 1) e cadastro aberto com confirmação do responsável por e-mail (decisão 2).

O código está em:
- `src/lib/supabase.ts` e `src/lib/account-store.ts`: login e salvamento do progresso;
- `src/routes/entrar.tsx`, `perfil.tsx`, `responsavel.tsx` e `nova-senha.tsx`: as telas;
- `supabase/migrations/0001_contas.sql`: o banco e as regras de acesso.

## 1. Criar as tabelas e as regras (uma vez)

1. No Supabase, abram o projeto e cliquem em **SQL Editor → New query**.
2. Colem **todo** o conteúdo de `supabase/migrations/0001_contas.sql` e cliquem em **Run**.
3. Deve aparecer **"Success. No rows returned"**.

Pode rodar de novo sem problema.

O SQL cria:
- `profiles`: apelido, avatar, se a pessoa é maior de idade, e-mail do responsável e autorização;
- `progress`: uma cópia do progresso.

E garante que:
- cada pessoa só vê os próprios dados;
- o aluno não consegue se autorizar sozinho;
- o progresso de menor de idade só vai para o servidor depois da autorização;
- excluir a conta apaga tudo.

## 2. Endereços do site

Em **Authentication → URL Configuration**:
- **Site URL:** o endereço oficial do site, o mesmo serviço do Render ligado à `main` (ex.: `https://retaenem.com.br`).
- **Redirect URLs:** acrescentem o endereço oficial com `/**` no fim e o da prévia (ex.: `https://enem-countdown-coach-preview-14.onrender.com/**`).

Os links dos e-mails só voltam para endereços desta lista.

## 3. E-mails: leiam antes de testar

O envio grátis do Supabase, pela documentação oficial ("Custom SMTP"):
- **só entrega para endereços da equipe do projeto** (*Organization → Team*);
- tem limite de **2 e-mails por hora**;
- **não é feito para uso real**.

Na prática:
- **Testar o cadastro com e-mails da equipe:** convidem os e-mails de quem vai testar em *Organization settings → Team*.
- **Contas de colegas fora da equipe**, enquanto não houver um provedor de e-mail: desliguem a confirmação de e-mail em *Authentication → Sign In / Providers → Email → Confirm email*. Assim o aluno entra logo depois de criar a conta, mas não fica comprovado que o e-mail é dele.
- **Menores de idade:** o link de autorização vai para o e-mail do responsável. Com o envio grátis, ele **só chega se o responsável estiver na equipe**. Para uso real com menores, configurem um provedor de e-mail em *Authentication → Emails → SMTP Settings*, por exemplo o Resend, com o domínio `retaenem.com.br`.

## 3.1 Provedor de e-mail com o Resend (para funcionar com qualquer e-mail)

Com um provedor, os e-mails chegam para qualquer endereço (Gmail, Outlook…), inclusive o link dos responsáveis. O código do app não muda. Os limites do plano grátis do Resend mudam com o tempo: confiram no site.

**No Resend:**
1. Criem a conta em https://resend.com. Dá para entrar com o GitHub.
2. Em **Domains → Add Domain**, digitem `retaenem.com.br`.
3. O Resend mostra alguns registros de DNS (do tipo TXT e MX). Abram o painel onde o domínio foi registrado (por exemplo, o Registro.br) e criem esses registros exatamente como aparecem.
4. Voltem ao Resend e cliquem em **Verify**. A verificação pode levar de alguns minutos a algumas horas.
5. Em **API Keys → Create API Key**, criem uma chave com permissão **Sending access** e copiem. Essa chave é **secreta**: ela só vai no painel do Supabase (passo abaixo). Nunca no chat, no código ou no GitHub.

**No Supabase:**
1. Abram **Authentication → Emails → SMTP Settings** e liguem **Enable custom SMTP**.
2. Preencham os campos. Os dados do servidor aparecem na própria página de SMTP do Resend; se forem diferentes destes, vale o que estiver lá.
   - **Sender email:** `nao-responda@retaenem.com.br`
   - **Sender name:** `Reta Enem`
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** a API key do Resend
3. Cliquem em **Save**.
4. Em **Authentication → Rate Limits**, confiram o limite de e-mails por hora e ajustem se precisarem de mais.
5. Liguem de novo **Confirm email**, caso tenha sido desligado para os testes.

**Para testar:** criem uma conta com um Gmail que **não** esteja na equipe. O e-mail de confirmação deve chegar; se não aparecer, olhem a caixa de spam.

## 4. Textos dos e-mails, em português

Em **Authentication → Emails → Templates**, troquem o assunto e o corpo de cada e-mail. Mantenham `{{ .ConfirmationURL }}` exatamente assim.

**Confirm signup**
- **Assunto:** `Confirme sua conta no Reta Enem`
- **Corpo:**
  ```html
  <p>Olá! Você criou uma conta no Reta Enem.</p>
  <p><a href="{{ .ConfirmationURL }}">Confirmar meu e-mail</a></p>
  <p>Se não foi você, ignore este e-mail.</p>
  ```

**Magic link.** Usado só para o **responsável** autorizar:
- **Assunto:** `Autorização para a conta de estudos no Reta Enem`
- **Corpo:**
  ```html
  <p>Olá! Um estudante menor de idade criou uma conta no Reta Enem, um app gratuito de estudos para o ENEM, e indicou este e-mail como responsável.</p>
  <p><a href="{{ .ConfirmationURL }}">Ver o pedido e autorizar</a></p>
  <p>O app não pede nome, telefone nem escola do estudante. Você pode retirar a autorização quando quiser. Se não reconhece este pedido, ignore este e-mail.</p>
  ```

**Reset password**
- **Assunto:** `Nova senha no Reta Enem`
- **Corpo:**
  ```html
  <p>Recebemos um pedido para criar uma senha nova.</p>
  <p><a href="{{ .ConfirmationURL }}">Criar senha nova</a></p>
  <p>Se não foi você, ignore este e-mail.</p>
  ```

**Change email address**
- **Assunto:** `Confirme seu novo e-mail no Reta Enem`
- **Corpo:**
  ```html
  <p><a href="{{ .ConfirmationURL }}">Confirmar o novo e-mail</a></p>
  ```

## 5. Ligar as contas no site (Render)

No serviço do Render ligado à `main`, abram **Environment → Add Environment Variable** e criem:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | a *Project URL* (`https://ywxojviayappbetedkcp.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | a *publishable key* (`sb_publishable_...`) |

Depois, cliquem em **Manual Deploy → Deploy latest commit**. As variáveis entram no momento do build.

Sem essas variáveis, o site funciona como antes, sem a opção de conta.

**Nunca** coloquem a chave **secret** (`sb_secret_...` ou `service_role`) no Render, no código ou no chat. O app não precisa dela.

## 5.1 Entrar com o Google (opcional)

Quem entra com o Google não precisa do e-mail de confirmação: o Google já garante que o endereço é da pessoa. No primeiro acesso, o app pede o apelido, o avatar, a idade, o e-mail do responsável (para menores) e o aceite dos termos.

**No SQL Editor**, rodem também `supabase/migrations/0002_login_google.sql`. Ele cria a função que completa o cadastro.

**No Google Cloud** (console.cloud.google.com):
1. Criem um projeto `Reta Enem`.
2. Na tela de consentimento OAuth (*Branding*), preencham:
   - **Tipo:** Externo.
   - **Nome:** `Reta Enem`.
   - **Domínio autorizado:** `retaenem.com.br`. Se aceitar, também `ywxojviayappbetedkcp.supabase.co`; o `supabase.co` puro não é aceito.
   - **Links:** a página inicial, `/privacidade` e `/termos`.
   - **Permissões:** só `email`, `profile` e `openid`.
   - Para liberar para todos, cliquem em **Publicar app**. Em modo de teste, só entram os *Test users*.
3. Em **Credenciais → Criar credenciais → ID do cliente OAuth → Aplicativo da Web**, preencham:
   - **Origens JavaScript:** `https://retaenem.com.br`, `https://www.retaenem.com.br` e o endereço da prévia.
   - **URI de redirecionamento:** `https://ywxojviayappbetedkcp.supabase.co/auth/v1/callback`.
4. Copiem o **ID do cliente** e a **chave secreta**. A chave secreta só aparece uma vez: se perderem, abram o cliente e usem **Adicionar chave secreta**.

**No Supabase:** em **Authentication → Sign In / Providers → Google**, liguem a opção e colem o **Client ID** e o **Client Secret**. A chave secreta vai só nesse campo.

## 5.2 Ranking (fase 12)

1. No **SQL Editor**, rodem `supabase/migrations/0003_ranking.sql` (New query → colar → Run).
2. Em seguida, rodem `supabase/gabarito.sql`: é o gabarito das questões, que o servidor usa para conferir as respostas. Ninguém consegue ler essa tabela pelo app.
3. **Sempre que questões entrarem no banco** (ou uma questão nova for marcada como `revisada: true`): rodem `bun run gabarito` e rodem de novo o `supabase/gabarito.sql` no Supabase. Um teste (`src/test/ranking.test.ts`) avisa se o arquivo ficou desatualizado. Questão que não está no gabarito do servidor funciona normalmente no app, só não pontua no ranking.

**Para a equipe acompanhar (Table Editor):**

- `suspeitas`: casos anotados automaticamente (`muitas_rapidas`: 10 ou mais respostas em menos de 3 s na mesma hora; `limite_atingido`: passou de um limite; `acertos_demais`: 30 ou mais respostas na hora com 95% ou mais de acerto). Ninguém é punido automaticamente: são só pistas. Depois de olhar, marquem `revisada = true`.
- `respostas`: cada resposta com o ponto ganho e, quando valeu 0, o `motivo` (`rapida`, `sem_tempo`, `repetida`, `limite_minuto`, `limite_hora`, `limite_dia`).
- Para **tirar alguém do ranking** por trapaça, em `profiles` marquem `sinalizado = true` (e `false` para devolver). O aluno vê "conta em revisão" e continua usando o app normalmente.
- Apelido impróprio: troquem o `apelido` em `profiles`.

As regras (3 s, 24 h, 30 por minuto, 600 pontos por hora, 2.000 por dia) estão em `src/lib/ranking-config.ts` e no próprio SQL. Para mudar, alterem os dois e rodem o 0003 de novo.

## 6. Conferir

- `bun run test` cobre, sem internet: as regras do cadastro, a junção do progresso do aparelho com o da conta, os avatares e as conquistas.
- As regras de acesso do SQL foram testadas num PostgreSQL local que imita o Supabase, em 19 cenários: quem vê o quê, autorização, revogação e exclusão.
- O ranking (0003) foi testado do mesmo jeito, em 42 cenários: pontos calculados pelo servidor, 0 ponto para resposta rápida, sem tempo, repetida ou acima dos limites, lote grande recusado, menor sem autorização bloqueado, gabarito e suspeitas fechados, conta sinalizada e quem escolheu não aparecer fora do ranking, semana/mês/geral e apagamento ao revogar ou excluir a conta.
