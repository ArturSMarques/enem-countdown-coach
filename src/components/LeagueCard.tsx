import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui-bits";
import type { LeagueStatus } from "@/lib/league";
import { INACTIVITY_DAYS, LEAGUE_HINT } from "@/lib/league-config";

const fmt = (n: number) => n.toLocaleString("pt-BR");

/** Discreet card with the league, the XP and how much is left for the next one. */
export function LeagueCard({ league }: { league: LeagueStatus }) {
  return (
    <section className="card-soft p-4" aria-label="Liga e XP">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Trophy className="h-4 w-4 text-area-hum" aria-hidden />
          Liga {league.name}
        </p>
        <span className="text-xs font-semibold text-muted-foreground">{fmt(league.xp)} XP</span>
      </div>
      <div className="mt-2.5">
        <Progress value={league.progress} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {league.next
          ? `Faltam ${fmt(league.next.missing)} XP para a liga ${league.next.name}. `
          : "Você está na liga mais alta. "}
        {LEAGUE_HINT[league.id]}
      </p>
      {league.paused && (
        <p className="mt-1.5 text-xs">
          Você ficou mais de {INACTIVITY_DAYS} dias sem estudar, então a liga desceu um degrau. Ela
          volta assim que você estudar de novo.
        </p>
      )}
    </section>
  );
}
