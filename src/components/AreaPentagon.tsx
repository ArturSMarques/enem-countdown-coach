import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { AREAS } from "@/lib/data";
import { PERFORMANCE_CONFIG, type AreaScore } from "@/lib/performance";

const LABEL = {
  ling: "Linguagens",
  hum: "Humanas",
  nat: "Natureza",
  mat: "Matemática",
  red: "Redação",
} as const;

const config = {
  value: { label: "Acerto ponderado", color: "var(--primary)" },
} satisfies ChartConfig;

/**
 * Five-point radar: each point grows with the weighted hit rate of the area. Areas without enough
 * answers sit at the center and are explained in the list below the chart.
 */
export function AreaPentagon({ scores }: { scores: AreaScore[] }) {
  const data = scores.map((s) => ({ area: LABEL[s.area], value: s.value ?? 0 }));
  const any = scores.some((s) => s.value !== null);
  return (
    <div>
      <ChartContainer
        config={config}
        className="mx-auto aspect-square max-h-[260px] w-full"
        role="img"
        aria-label={`Pentágono de desempenho: ${scores
          .map((s) => `${LABEL[s.area]} ${s.value === null ? "sem dados" : `${s.value}%`}`)
          .join(", ")}`}
      >
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            fill="var(--color-value)"
            fillOpacity={any ? 0.35 : 0}
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 3, fillOpacity: 1 }}
            isAnimationActive
          />
        </RadarChart>
      </ChartContainer>
      <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
        {scores.map((s) => (
          <li key={s.area} className="flex justify-between gap-2 rounded-lg bg-muted px-2.5 py-1.5">
            <span className={`font-semibold ${AREAS[s.area].color}`}>{LABEL[s.area]}</span>
            <span className="text-right font-bold">
              {s.value !== null
                ? `${s.value}%`
                : s.reason === "redacao"
                  ? "sem dados (ainda não há correção de redação)"
                  : `sem dados suficientes (${s.answers} de ${PERFORMANCE_CONFIG.minAnswersPerArea})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
