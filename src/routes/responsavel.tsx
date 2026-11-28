import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui-bits";
import {
  guardianStudents,
  setAuthorization,
  signOut,
  useAccount,
  type PendingStudent,
} from "@/lib/account-store";
import { fmtDay } from "@/lib/planner";

export const Route = createFileRoute("/responsavel")({
  head: () => ({
    meta: [
      { title: "Autorização do responsável — Reta Final ENEM" },
      { name: "description", content: "Autorize o uso da conta de um estudante menor de idade." },
    ],
  }),
  component: GuardianPage,
});

/** Opened from the e-mail sent to the guardian: shows who asked and lets them authorize. */
function GuardianPage() {
  const account = useAccount();
  const [students, setStudents] = useState<PendingStudent[] | null>(null);
  const [msg, setMsg] = useState("");
  const load = () => void guardianStudents().then(setStudents);
  useEffect(() => {
    if (account.session) load();
  }, [account.session]);

  return (
    <div>
      <PageHeader
        title="Autorização do responsável"
        subtitle="Reta Enem, um app gratuito de estudos para o ENEM."
      />
      <div className="space-y-4 px-5 pb-10 text-sm leading-relaxed">
        <section className="card-soft p-4">
          <p>
            Um estudante menor de idade criou uma conta no Reta Enem e indicou este e-mail como
            responsável. Ao autorizar, o progresso de estudo dele (plano, respostas e desempenho)
            passa a ficar guardado no servidor, ligado a um apelido. O app não pede nome, telefone
            nem escola, e o apelido é o único dado que pode aparecer para outras pessoas.
          </p>
          <p className="mt-2 text-muted-foreground">
            Você pode retirar a autorização quando quiser, por esta mesma página: o progresso salvo
            no servidor é apagado. Leia os{" "}
            <Link to="/termos" className="font-semibold text-primary">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link to="/privacidade" className="font-semibold text-primary">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        {!account.session ? (
          <p className="card-soft p-4">
            Para continuar, abra o link enviado para o seu e-mail. Ele vale por pouco tempo; se
            expirou, peça ao estudante para reenviar pelo perfil dele.
          </p>
        ) : students === null ? (
          <p className="card-soft p-4">Carregando…</p>
        ) : students.length === 0 ? (
          <p className="card-soft p-4">
            Não há pedidos de autorização para {account.session.user.email}.
          </p>
        ) : (
          <ul className="space-y-3">
            {students.map((s) => (
              <li key={s.id} className="card-soft p-4">
                <p className="text-base font-bold">{s.apelido}</p>
                <p className="text-xs text-muted-foreground">
                  Conta criada em{" "}
                  {fmtDay(s.criado_em.slice(0, 10), {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {s.autorizado ? "autorizada" : "aguardando autorização"}
                </p>
                <button
                  onClick={async () => {
                    setMsg(
                      (await setAuthorization(s.id, !s.autorizado)) ??
                        (s.autorizado
                          ? "Autorização retirada."
                          : "Autorização registrada. Obrigado!"),
                    );
                    load();
                  }}
                  className={`mt-3 rounded-lg px-3 py-2 text-xs font-bold ${s.autorizado ? "border border-destructive/40 text-destructive" : "bg-primary text-primary-foreground"}`}
                >
                  {s.autorizado ? "Retirar autorização" : "Autorizo"}
                </button>
              </li>
            ))}
          </ul>
        )}
        {msg && <p role="status">{msg}</p>}
        {account.session && (
          <button onClick={() => void signOut()} className="text-sm font-semibold text-primary">
            Sair
          </button>
        )}
      </div>
    </div>
  );
}
