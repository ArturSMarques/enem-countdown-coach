import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpen, CalendarDays, ListChecks, Sun } from "lucide-react";

const TABS = [
  { to: "/", label: "Hoje", icon: Sun },
  { to: "/cronograma", label: "Cronograma", icon: CalendarDays },
  { to: "/conteudos", label: "Conteúdos", icon: BookOpen },
  { to: "/questoes", label: "Questões", icon: ListChecks },
  { to: "/desempenho", label: "Desempenho", icon: BarChart3 },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/onboarding")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to) || (to === "/conteudos" && path.startsWith("/aulas"));
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className={`rounded-full px-4 py-1 transition-colors ${active ? "bg-accent" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
