import { createFileRoute, Link } from "@tanstack/react-router";
import { Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Chip, Loading, PageHeader } from "@/components/ui-bits";
import { canSync } from "@/lib/account";
import {
  fetchMyPoints,
  fetchRanking,
  setShowInRanking,
  useAccount,
  type MyPoints,
} from "@/lib/account-store";
import { LEAGUES } from "@/lib/league-config";
import { PERIODS, RANKING_RULES, type Period } from "@/lib/ranking-config";
import { rankingLeague, type RankingRow } from "@/lib/ranking";
import { accountsEnabled } from "@/lib/supabase";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking — Reta Final ENEM" },
      { name: "description", content: "Ranking da semana, do mês e geral, só com apelidos." },
    ],
  }),
  component: RankingPage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR");
const leagueName = (points: number) =>
  LEAGUES.find((l) => l.id === rankingLeague(points))?.name ?? "";

function RankingPage() {
  const account = useAccount();
  return (
    <div>
      <PageHeader title="Ranking" subtitle="Só o apelido aparece" />
      <div className="space-y-4 px-5 pb-10">
        <Body status={account.status} />
        <Rules />
      </div>
    </div>
  );
}

function Body({ status }: { status: ReturnType<typeof useAccount>["status"] }) {
  const account = useAccount();
  if (!accountsEnabled || status === "off")
    return (
      <Notice>
        O ranking precisa de conta, e as contas ainda não estão ativadas neste site. Seu XP e sua
        liga continuam funcionando neste aparelho.
      </Notice>
    );
  if (status === "loading") return <Loading />;
  if (status === "signed-out" || status === "no-profile")
    return (
      <Notice>
        Para ver o ranking e participar,{" "}
        <Link
          to={status === "signed-out" ? "/entrar" : "/perfil"}
          className="font-semibold text-primary"
        >
          {status === "signed-out" ? "entre na sua conta" : "complete o seu cadastro"}
        </Link>
        . A conta é opcional: sem ela, tudo continua funcionando neste aparelho.
      </Notice>
    );
  if (!canSync(account.profile))
    return (
      <Notice>
        Seu responsável ainda não autorizou a conta. Até lá, suas respostas ficam só neste aparelho
        e você não aparece no ranking. Veja como pedir a autorização no{" "}
        <Link to="/perfil" className="font-semibold text-primary">
          Perfil
        </Link>
        .
      </Notice>
    );
  return <Board />;
}

function Board() {
  const [period, setPeriod] = useState<Period>("semana");
  const [rows, setRows] = useState<RankingRow[] | null | undefined>(undefined);
  const [mine, setMine] = useState<MyPoints | null>(null);
  const [saving, setSaving] = useState(false);
  const lastPoints = useAccount().lastPoints;

  useEffect(() => {
    let alive = true;
    setRows(undefined);
    void Promise.all([fetchRanking(period), fetchMyPoints()]).then(([r, m]) => {
      if (!alive) return;
      setRows(r);
      setMine(m);
    });
    return () => {
      alive = false;
    };
  }, [period, lastPoints?.at]);

  const toggle = async () => {
    if (!mine) return;
    setSaving(true);
    const error = await setShowInRanking(!mine.aparece);
    setSaving(false);
    if (!error) {
      setMine({ ...mine, aparece: !mine.aparece });
      setRows(await fetchRanking(period));
    }
  };

  const top = rows?.filter((r) => r.posicao <= RANKING_RULES.top) ?? [];
  const me = rows?.find((r) => r.eu);
  const myPoints = mine ? mine[period] : 0;

  return (
    <>
      <div className="flex gap-2" role="tablist" aria-label="Período do ranking">
        {PERIODS.map((p) => (
          <Chip key={p.id} active={period === p.id} onClick={() => setPeriod(p.id)}>
            {p.label}
          </Chip>
        ))}
      </div>

      <section className="card-soft p-4" aria-label="Sua posição">
        <p className="text-sm font-bold">
          {me
            ? `Você está em ${me.posicao}º lugar, com ${fmt(me.pontos)} pontos.`
            : mine && !mine.aparece
              ? `Você escolheu não aparecer no ranking (${fmt(myPoints)} pontos neste período).`
              : mine?.sinalizado
                ? "Sua conta está em revisão pela equipe e não aparece no ranking por enquanto."
                : myPoints > 0
                  ? `Você tem ${fmt(myPoints)} pontos neste período.`
                  : "Responda questões com a conta para entrar no ranking."}
        </p>
        {mine && (
          <p className="mt-1 text-xs text-muted-foreground">
            Liga no ranking: {leagueName(mine.geral)} ({fmt(mine.geral)} pontos no total).
          </p>
        )}
        {mine && (
          <button
            type="button"
            onClick={() => void toggle()}
            disabled={saving}
            className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground"
          >
            {mine.aparece ? "Não quero aparecer no ranking" : "Quero aparecer no ranking"}
          </button>
        )}
      </section>

      {rows === undefined ? (
        <Loading />
      ) : rows === null ? (
        <Notice>
          Não foi possível carregar o ranking agora. Confira a internet e tente de novo mais tarde.
        </Notice>
      ) : top.length === 0 ? (
        <Notice>
          Ninguém pontuou neste período ainda. Responda as questões do dia e seja o primeiro!
        </Notice>
      ) : (
        <ol className="card-soft divide-y overflow-hidden p-0" aria-label="Classificação">
          {top.map((r) => (
            <Row key={`${r.posicao}-${r.apelido}`} r={r} />
          ))}
          {me && me.posicao > RANKING_RULES.top && (
            <>
              <li className="px-4 py-1 text-center text-xs text-muted-foreground" aria-hidden>
                ⋯
              </li>
              <Row r={me} />
            </>
          )}
        </ol>
      )}
    </>
  );
}

function Row({ r }: { r: RankingRow }) {
  const podium = r.posicao <= 3;
  return (
    <li
      className={`flex items-center gap-3 px-4 py-2.5 ${r.eu ? "bg-primary/10" : ""}`}
      aria-current={r.eu ? "true" : undefined}
    >
      <span
        className={`w-8 shrink-0 text-center text-sm font-extrabold ${podium ? "text-area-hum" : "text-muted-foreground"}`}
      >
        {podium ? (
          <span className="inline-flex items-center gap-0.5">
            <Medal className="h-3.5 w-3.5" aria-hidden />
            {r.posicao}
          </span>
        ) : (
          `${r.posicao}º`
        )}
      </span>
      <Avatar id={r.avatar} size={32} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">
          {r.apelido}
          {r.eu && <span className="ml-1 text-xs font-semibold text-primary">(você)</span>}
        </span>
      </span>
      <span className="text-sm font-extrabold tabular-nums">{fmt(r.pontos)}</span>
    </li>
  );
}

function Rules() {
  const R = RANKING_RULES;
  return (
    <section className="card-soft p-4 text-xs text-muted-foreground" aria-labelledby="regras">
      <h2 id="regras" className="text-sm font-bold text-foreground">
        Como funciona
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        <li>
          Contam só as questões respondidas com a conta, a partir do lançamento do ranking:{" "}
          {R.answer} pontos por resposta e mais {R.hit.facil}, {R.hit.media} ou {R.hit.dificil} por
          acerto (fácil, média ou difícil). Quem confere o gabarito e soma os pontos é o servidor.
        </li>
        <li>
          Vale 0 ponto: resposta em menos de {R.minMs / 1000} segundos, a mesma questão de novo em
          menos de {R.repeatHours} horas e o que passar de {fmt(R.maxPointsPerHour)} pontos por hora
          ou {fmt(R.maxPointsPerDay)} por dia.
        </li>
        <li>Sem internet, a resposta conta no seu aparelho, mas não pontua no ranking.</li>
        <li>
          A semana começa na segunda-feira e o mês no dia 1º (horário de Brasília). Casos estranhos
          são revisados pela equipe, e contas com trapaça saem do ranking.
        </li>
        <li>
          A liga do ranking usa só esses pontos; a liga do seu aparelho também conta blocos de
          estudo, dias seguidos e respostas anteriores ao ranking.
        </li>
      </ul>
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <section className="card-soft p-4 text-sm">{children}</section>;
}
