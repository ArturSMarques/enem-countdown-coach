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

## 6. Conferir

- `bun run test` cobre, sem internet: as regras do cadastro, a junção do progresso do aparelho com o da conta, os avatares e as conquistas.
- As regras de acesso do SQL foram testadas num PostgreSQL local que imita o Supabase, em 19 cenários: quem vê o quê, autorização, revogação e exclusão.
