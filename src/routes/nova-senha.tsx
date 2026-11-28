import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui-bits";
import { PASSWORD_MIN } from "@/lib/account";
import { updatePassword, useAccount } from "@/lib/account-store";

export const Route = createFileRoute("/nova-senha")({
  head: () => ({ meta: [{ title: "Nova senha — Reta Final ENEM" }] }),
  component: NewPassword,
});

/** Opened from the "Esqueci minha senha" e-mail: the link signs the person in to set a new one. */
function NewPassword() {
  const account = useAccount();
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div>
      <PageHeader title="Nova senha" subtitle="Escolha uma senha nova para a sua conta." />
      <div className="px-5">
        {!account.session ? (
          <p className="card-soft p-5 text-sm">
            Abra o link que enviamos para o seu e-mail para criar a senha nova. O link vale por
            pouco tempo; se expirou,{" "}
            <Link to="/entrar" search={{ modo: "senha" }} className="font-semibold text-primary">
              peça outro
            </Link>
            .
          </p>
        ) : (
          <form
            className="card-soft space-y-3 p-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (senha.length < PASSWORD_MIN)
                return setMsg({ ok: false, text: `Use pelo menos ${PASSWORD_MIN} caracteres.` });
              const error = await updatePassword(senha);
              setMsg(error ? { ok: false, text: error } : { ok: true, text: "Senha trocada." });
            }}
          >
            <label className="block text-sm font-semibold">
              Senha nova
              <input
                type="password"
                autoComplete="new-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-base"
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
              Salvar
            </button>
            {msg?.ok && (
              <Link to="/perfil" className="block text-center text-sm font-semibold text-primary">
                Ir para o perfil
              </Link>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
