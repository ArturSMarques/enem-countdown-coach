import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AvatarPicker } from "@/components/Avatar";
import { Chip, PageHeader } from "@/components/ui-bits";
import { PASSWORD_MIN, signUpProblem } from "@/lib/account";
import { sendPasswordReset, signIn, signUp } from "@/lib/account-store";
import { DEFAULT_AVATAR } from "@/lib/avatars";
import { accountsEnabled } from "@/lib/supabase";

type Mode = "entrar" | "criar" | "senha";

export const Route = createFileRoute("/entrar")({
  validateSearch: (s: Record<string, unknown>): { modo?: Mode | undefined } => ({
    modo: s["modo"] === "criar" || s["modo"] === "senha" ? s["modo"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — Reta Final ENEM" },
      { name: "description", content: "Entre ou crie sua conta para guardar o progresso." },
    ],
  }),
  component: SignInPage,
});

const input = "mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-base";

function SignInPage() {
  const { modo } = Route.useSearch();
  const [mode, setMode] = useState<Mode>(modo ?? "entrar");
  if (!accountsEnabled)
    return (
      <div>
        <PageHeader title="Conta" subtitle="As contas ainda não estão ativadas neste site." />
        <p className="px-5 text-sm text-muted-foreground">
          Tudo continua funcionando, com o seu progresso salvo neste aparelho.{" "}
          <Link to="/" className="font-semibold text-primary">
            Voltar para Hoje
          </Link>
        </p>
      </div>
    );
  return (
    <div>
      <PageHeader
        title={mode === "criar" ? "Criar conta" : mode === "senha" ? "Recuperar senha" : "Entrar"}
        subtitle="Com uma conta, o seu progresso fica guardado e vai junto para outros aparelhos."
      />
      <div className="flex gap-2 px-5">
        <Chip active={mode === "entrar"} onClick={() => setMode("entrar")}>
          Entrar
        </Chip>
        <Chip active={mode === "criar"} onClick={() => setMode("criar")}>
          Criar conta
        </Chip>
      </div>
      <div className="px-5 pb-10 pt-4">
        {mode === "entrar" && <SignInForm onForgot={() => setMode("senha")} />}
        {mode === "criar" && <SignUpForm />}
        {mode === "senha" && <ResetForm />}
      </div>
    </div>
  );
}

function SignInForm({ onForgot }: { onForgot: () => void }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="card-soft space-y-3 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const error = await signIn(email, senha);
        setBusy(false);
        if (error) setMsg(error);
        else nav({ to: "/perfil" });
      }}
    >
      <label className="block text-sm font-semibold">
        E-mail
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
      </label>
      <label className="block text-sm font-semibold">
        Senha
        <input
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={input}
        />
      </label>
      {msg && (
        <p role="alert" className="text-sm text-destructive">
          {msg}
        </p>
      )}
      <button
        disabled={busy}
        className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Entrando…" : "Entrar"}
      </button>
      <button
        type="button"
        onClick={onForgot}
        className="w-full text-sm font-semibold text-primary"
      >
        Esqueci minha senha
      </button>
    </form>
  );
}

function SignUpForm() {
  const [f, setF] = useState({ apelido: "", email: "", senha: "", responsavelEmail: "" });
  const [adulto, setAdulto] = useState<boolean | null>(null);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [aceitou, setAceitou] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<null | { confirmar: boolean }>(null);
  const [busy, setBusy] = useState(false);

  if (done)
    return (
      <div className="card-soft space-y-2 p-5 text-sm" role="status">
        <p className="text-base font-bold">Conta criada!</p>
        {done.confirmar && (
          <p>
            Enviamos um link para <strong>{f.email}</strong>. Abra o e-mail e confirme para poder
            entrar.
          </p>
        )}
        {adulto === false && (
          <p>
            Também enviamos um e-mail para o seu responsável (<strong>{f.responsavelEmail}</strong>)
            com um link para autorizar. Até lá, o seu progresso continua salvo só neste aparelho.
          </p>
        )}
        {!done.confirmar && (
          <p>
            Você já entrou na conta, e o progresso deste aparelho foi junto.{" "}
            <Link to="/perfil" className="font-semibold text-primary">
              Ver meu perfil
            </Link>
          </p>
        )}
        {(done.confirmar || adulto === false) && (
          <p className="text-muted-foreground">
            Se o e-mail não chegar em alguns minutos, olhe a caixa de spam.
          </p>
        )}
      </div>
    );

  return (
    <form
      className="card-soft space-y-4 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const problem = signUpProblem({ ...f, adulto, aceitou });
        if (problem) return setMsg(problem);
        setBusy(true);
        const r = await signUp({ ...f, adulto: adulto!, avatar });
        setBusy(false);
        if (r.error) setMsg(r.error);
        else setDone({ confirmar: r.needsConfirmation });
      }}
    >
      <label className="block text-sm font-semibold">
        Apelido (aparece no app; não use seu nome completo)
        <input
          autoComplete="nickname"
          value={f.apelido}
          onChange={(e) => setF({ ...f, apelido: e.target.value })}
          className={input}
        />
      </label>
      <div>
        <p className="text-sm font-semibold">Avatar</p>
        <div className="mt-2">
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </div>
      </div>
      <label className="block text-sm font-semibold">
        E-mail
        <input
          type="email"
          autoComplete="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          className={input}
        />
      </label>
      <label className="block text-sm font-semibold">
        Senha (pelo menos {PASSWORD_MIN} caracteres)
        <input
          type="password"
          autoComplete="new-password"
          value={f.senha}
          onChange={(e) => setF({ ...f, senha: e.target.value })}
          className={input}
        />
      </label>
      <fieldset>
        <legend className="text-sm font-semibold">Você tem 18 anos ou mais?</legend>
        <div className="mt-2 flex gap-2">
          <Chip active={adulto === true} onClick={() => setAdulto(true)}>
            Sim
          </Chip>
          <Chip active={adulto === false} onClick={() => setAdulto(false)}>
            Não
          </Chip>
        </div>
      </fieldset>
      {adulto === false && (
        <label className="block text-sm font-semibold">
          E-mail do seu responsável
          <span className="block text-xs font-normal text-muted-foreground">
            Ele recebe um link para autorizar. Até autorizar, nada do seu progresso vai para o
            servidor e você não aparece em rankings.
          </span>
          <input
            type="email"
            value={f.responsavelEmail}
            onChange={(e) => setF({ ...f, responsavelEmail: e.target.value })}
            className={input}
          />
        </label>
      )}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={aceitou}
          onChange={(e) => setAceitou(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
        />
        <span>
          Li e aceito os{" "}
          <Link to="/termos" className="font-semibold text-primary">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link to="/privacidade" className="font-semibold text-primary">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>
      {msg && (
        <p role="alert" className="text-sm text-destructive">
          {msg}
        </p>
      )}
      <button
        disabled={busy}
        className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Criando…" : "Criar conta"}
      </button>
      <p className="text-xs text-muted-foreground">
        O progresso que já está neste aparelho vai para a conta no primeiro acesso. Ninguém recomeça
        do zero.
      </p>
    </form>
  );
}

function ResetForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className="card-soft space-y-3 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const error = await sendPasswordReset(email);
        setMsg(
          error
            ? { ok: false, text: error }
            : {
                ok: true,
                text: "Se existir uma conta com esse e-mail, enviamos um link para criar uma senha nova.",
              },
        );
      }}
    >
      <label className="block text-sm font-semibold">
        E-mail da conta
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
      </label>
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={`text-sm ${msg.ok ? "" : "text-destructive"}`}
        >
          {msg.text}
        </p>
      )}
      <button className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">
        Enviar link
      </button>
    </form>
  );
}
