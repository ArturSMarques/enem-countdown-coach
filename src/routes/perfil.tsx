import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AreaPentagon } from "@/components/AreaPentagon";
import { Avatar, AvatarPicker } from "@/components/Avatar";
import { Loading, PageHeader } from "@/components/ui-bits";
import { canSync, NICKNAME_RULE, PASSWORD_MIN } from "@/lib/account";
import {
  changeEmail,
  changeGuardian,
  deleteAccount,
  sendGuardianLink,
  signOut,
  syncNow,
  updatePassword,
  updateProfile,
  useAccount,
} from "@/lib/account-store";
import { achievementsOf } from "@/lib/achievements";
import { leagueOf } from "@/lib/league";
import { areaScores, pendingSentence, pendingTopics } from "@/lib/performance";
import { todayISO } from "@/lib/planner";
import { clearAllData, streakOf, useAppState } from "@/lib/store";
import { accountsEnabled } from "@/lib/supabase";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Reta Final ENEM" },
      { name: "description", content: "Seu resumo de estudo, conquistas e conta." },
    ],
  }),
  component: ProfilePage,
});

const input = "mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm";
const btn = "rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground";

function ProfilePage() {
  const { state, ready } = useAppState();
  const account = useAccount();
  if (!ready) return <Loading />;
  const today = todayISO();
  const profile = account.status === "student" ? account.profile : null;
  const league = leagueOf(state, today);
  const answers = state.attempts.length;
  const hits = state.attempts.filter((a) => a.correct).length;
  const minutes = Object.values(state.plan)
    .flat()
    .filter((b) => b.done)
    .reduce((m, b) => m + b.minutes, 0);
  const achievements = achievementsOf(state, today);
  const pending = pendingTopics(state.attempts, today).slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Perfil"
        subtitle={profile ? "Sua conta e seu estudo" : "Seu estudo neste aparelho"}
      />
      <div className="space-y-4 px-5 pb-10">
        <section className="card-soft flex items-center gap-4 p-4">
          <Avatar id={profile?.avatar} size={64} />
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold">{profile?.apelido ?? "Você"}</p>
            <p className="text-xs text-muted-foreground">
              Liga {league.name} · {league.xp.toLocaleString("pt-BR")} XP
            </p>
            <SyncLine />
          </div>
        </section>

        <AccountCallout />

        <section className="card-soft p-4" aria-labelledby="resumo">
          <h2 id="resumo" className="text-base font-bold">
            Resumo
          </h2>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Dias seguidos" value={String(streakOf(state.studied))} />
            <Stat
              label="Horas estudadas"
              value={(minutes / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
            />
            <Stat label="Questões" value={String(answers)} />
            <Stat label="Acerto" value={answers ? `${Math.round((hits / answers) * 100)}%` : "—"} />
            <Stat label="XP" value={league.xp.toLocaleString("pt-BR")} />
            <Stat label="Liga" value={league.name} />
          </dl>
        </section>

        <section className="card-soft p-4" aria-labelledby="desempenho">
          <h2 id="desempenho" className="text-base font-bold">
            Desempenho
          </h2>
          <AreaPentagon scores={areaScores(state.attempts, today)} />
          {pending.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm">
              {pending.map((p) => (
                <li key={p.topicId}>{pendingSentence(p)}</li>
              ))}
            </ul>
          )}
          <Link to="/desempenho" className="mt-2 inline-block text-sm font-semibold text-primary">
            Ver o desempenho completo
          </Link>
        </section>

        <section className="card-soft p-4" aria-labelledby="conquistas">
          <h2 id="conquistas" className="text-base font-bold">
            Conquistas{" "}
            <span className="text-xs font-semibold text-muted-foreground">
              {achievements.filter((a) => a.feita).length} de {achievements.length}
            </span>
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {achievements.map((a) => (
              <li
                key={a.id}
                className={`rounded-xl border p-3 text-xs ${a.feita ? "border-primary/40 bg-primary/10" : "bg-muted text-muted-foreground"}`}
              >
                <p className={`text-sm font-bold ${a.feita ? "text-primary" : ""}`}>
                  {a.feita ? "✓ " : ""}
                  {a.titulo}
                </p>
                <p className="mt-0.5">{a.condicao}</p>
                {!a.feita && a.meta > 1 && (
                  <p className="mt-1 font-semibold">
                    {a.atual.toLocaleString("pt-BR")} de {a.meta.toLocaleString("pt-BR")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {profile && <AccountSettings />}
        {!profile && (
          <Link to="/onboarding" className="block text-center text-sm font-semibold text-primary">
            Refazer o plano
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-2">
      <dt className="text-[11px] font-semibold text-muted-foreground">{label}</dt>
      <dd className="text-base font-extrabold">{value}</dd>
    </div>
  );
}

function SyncLine() {
  const a = useAccount();
  if (a.status !== "student") return null;
  const text =
    a.sync === "saving"
      ? "Salvando na conta…"
      : a.sync === "saved"
        ? `Progresso salvo na conta${a.lastSync ? ` às ${new Date(a.lastSync).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : ""}`
        : a.sync === "blocked"
          ? "Progresso só neste aparelho até o responsável autorizar"
          : a.sync === "error"
            ? "Não deu para salvar agora; tentamos de novo na próxima mudança"
            : "";
  return text ? <p className="text-xs text-muted-foreground">{text}</p> : null;
}

/** Sign-in invitation, guardian notice or the minor's pending authorization. */
function AccountCallout() {
  const a = useAccount();
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  if (!accountsEnabled || a.status === "off" || a.status === "loading") return null;
  if (a.status === "signed-out")
    return (
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <p className="font-semibold">Guarde seu progresso numa conta</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Com conta, o progresso não se perde se você trocar de celular. O que já está neste
          aparelho vai junto.
        </p>
        <div className="mt-2 flex gap-2">
          <Link
            to="/entrar"
            search={{ modo: "criar" }}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
          >
            Criar conta
          </Link>
          <Link to="/entrar" className={btn}>
            Entrar
          </Link>
        </div>
      </section>
    );
  if (a.status === "guardian")
    return (
      <section className="rounded-2xl border p-4 text-sm">
        Você entrou como responsável.{" "}
        <Link to="/responsavel" className="font-semibold text-primary">
          Ver a autorização
        </Link>{" "}
        ·{" "}
        <button onClick={() => void signOut()} className="font-semibold text-primary">
          Sair
        </button>
      </section>
    );
  const p = a.profile;
  if (!p || canSync(p)) return null;
  return (
    <section
      className="rounded-2xl border border-area-hum/50 bg-area-hum/10 p-4 text-sm"
      aria-live="polite"
    >
      <p className="font-semibold">Esperando a autorização do responsável</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Enviamos um link para <strong>{p.responsavel_email}</strong>. Até a autorização, seu
        progresso fica só neste aparelho e você não aparece em rankings.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          className={btn}
          onClick={async () =>
            setMsg((await sendGuardianLink(p.responsavel_email ?? "")) ?? "E-mail reenviado.")
          }
        >
          Reenviar e-mail
        </button>
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg(
            (await changeGuardian(email)) ?? "E-mail do responsável corrigido e link enviado.",
          );
        }}
      >
        <input
          type="email"
          placeholder="Corrigir o e-mail do responsável"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${input} mt-0`}
        />
        <button className={btn}>Salvar</button>
      </form>
      {msg && (
        <p className="mt-1 text-xs" role="status">
          {msg}
        </p>
      )}
    </section>
  );
}

function AccountSettings() {
  const a = useAccount();
  const nav = useNavigate();
  const p = a.profile!;
  const [apelido, setApelido] = useState(p.apelido);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const say = (error: string | null, ok: string) => setMsg(error ?? ok);

  return (
    <section className="card-soft space-y-4 p-4" aria-labelledby="config">
      <h2 id="config" className="text-base font-bold">
        Configurações da conta
      </h2>
      <div>
        <p className="text-sm font-semibold">Avatar</p>
        <div className="mt-2">
          <AvatarPicker
            value={p.avatar}
            onChange={async (id) => say(await updateProfile({ avatar: id }), "Avatar trocado.")}
          />
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!NICKNAME_RULE.test(apelido.trim()))
            return setMsg("Apelido: de 3 a 20 caracteres, sem espaço.");
          say(await updateProfile({ apelido: apelido.trim() }), "Apelido salvo.");
        }}
      >
        <label className="text-sm font-semibold">
          Apelido
          <div className="flex gap-2">
            <input value={apelido} onChange={(e) => setApelido(e.target.value)} className={input} />
            <button className={`${btn} mt-1`}>Salvar</button>
          </div>
        </label>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          say(
            await changeEmail(email),
            "Enviamos um link para o novo e-mail. A troca vale depois que você confirmar.",
          );
        }}
      >
        <label className="text-sm font-semibold">
          Trocar e-mail{" "}
          <span className="font-normal text-muted-foreground">
            (atual: {a.session?.user.email})
          </span>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
            <button className={`${btn} mt-1`}>Salvar</button>
          </div>
        </label>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (senha.length < PASSWORD_MIN)
            return setMsg(`Senha: pelo menos ${PASSWORD_MIN} caracteres.`);
          say(await updatePassword(senha), "Senha trocada.");
          setSenha("");
        }}
      >
        <label className="text-sm font-semibold">
          Trocar senha
          <div className="flex gap-2">
            <input
              type="password"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={input}
            />
            <button className={`${btn} mt-1`}>Salvar</button>
          </div>
        </label>
      </form>
      {msg && (
        <p role="status" className="text-sm">
          {msg}
        </p>
      )}
      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Link to="/onboarding" className={btn}>
          Refazer o plano
        </Link>
        <button className={btn} onClick={() => void syncNow()}>
          Salvar agora
        </button>
        <button
          className={btn}
          onClick={async () => {
            await signOut();
            nav({ to: "/" });
          }}
        >
          Sair
        </button>
        <button
          className="rounded-lg border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive"
          onClick={async () => {
            if (
              !confirm(
                "Excluir a sua conta? O perfil e o progresso salvos no servidor serão apagados e não dá para desfazer.",
              )
            )
              return;
            const error = await deleteAccount();
            if (error) return setMsg(error);
            if (confirm("Conta excluída. Apagar também o progresso guardado neste aparelho?"))
              clearAllData();
            nav({ to: "/" });
          }}
        >
          Excluir conta e dados
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Ao sair, o progresso continua neste aparelho. Veja a{" "}
        <Link to="/privacidade" className="font-semibold text-primary">
          Política de Privacidade
        </Link>
        .
      </p>
    </section>
  );
}
