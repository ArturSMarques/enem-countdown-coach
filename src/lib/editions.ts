import { addDays, toISO } from "./planner";

/**
 * Edições do ENEM. A edição-alvo do aluno é calculada pela data de hoje, sem ano fixo no código:
 * enquanto o 2º dia do ENEM do ano ainda não passou, vale a edição do ano; depois, a do ano seguinte.
 *
 * Para atualizar quando o INEP publicar um edital novo, acrescente a edição em OFFICIAL com as
 * datas e as regras do dia da prova. Anos ausentes usam uma data estimada pelo padrão histórico.
 */
export type EditionStatus = "oficial" | "estimada";

export type DayRules = {
  gatesOpen: string;
  gatesClose: string;
  start: string;
  endDay1: string;
  endDay2: string;
  /** Regras de material e de acesso que mudam de uma edição para outra. */
  notes: string[];
};

export type Edition = {
  year: number;
  /** 1º e 2º dia de prova (aplicação regular), em ISO yyyy-mm-dd. */
  days: [string, string];
  status: EditionStatus;
  /** De onde vieram as datas (oficiais) ou como foram estimadas. */
  source: string;
  rules: DayRules;
  /** Regras copiadas de outra edição, ainda não confirmadas para esta. */
  rulesFrom?: number;
  extra?: string[];
};

const RULES_2024_2026: DayRules = {
  gatesOpen: "12h",
  gatesClose: "13h",
  start: "13h30",
  endDay1: "19h",
  endDay2: "18h30",
  notes: [
    "Horário de Brasília (DF). É proibida a entrada depois do fechamento dos portões.",
    "Caneta esferográfica de tinta preta, fabricada em material transparente.",
    "Celular e outros eletrônicos desligados, dentro do envelope porta-objetos lacrado, debaixo da carteira.",
    "Documento de identificação original com foto, conforme a lista do edital.",
  ],
};

const OFFICIAL: Record<number, Omit<Edition, "year" | "status">> = {
  2024: {
    days: ["2024-11-03", "2024-11-10"],
    source: "Edital Inep nº 51, de 10 de maio de 2024",
    rules: RULES_2024_2026,
  },
  2025: {
    days: ["2025-11-09", "2025-11-16"],
    source: "Edital Inep nº 52, de 23 de maio de 2025",
    rules: RULES_2024_2026,
    extra: [
      "Em Belém, Ananindeua e Marituba (PA), por causa da COP 30, a prova foi em 30 de novembro e 7 de dezembro de 2025.",
    ],
  },
  2026: {
    days: ["2026-11-08", "2026-11-15"],
    source: "Edital Inep nº 64, de 21 de maio de 2026, e orientações do Inep para os dias de prova",
    rules: {
      ...RULES_2024_2026,
      notes: [
        ...RULES_2024_2026.notes,
        "Documentos digitais com foto (e-Título, CIN, CNH ou RG digital) foram aceitos nos aplicativos oficiais ou no app Gov.br.",
      ],
    },
  },
};

const OFFICIAL_YEARS = Object.keys(OFFICIAL)
  .map(Number)
  .sort((a, b) => a - b);

const parse = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const yearOf = (iso: string) => Number(iso.slice(0, 4));

/**
 * Padrão histórico: dois domingos seguidos de novembro. Quando o 1º domingo cai em 1º ou 2 de
 * novembro (perto do feriado de Finados), a prova vai para o 2º e o 3º domingos. A regra bate com
 * as datas oficiais de 2024 (3 e 10), 2025 (9 e 16) e 2026 (8 e 15).
 */
export function estimatedDays(year: number): [string, string] {
  const nov1 = new Date(year, 10, 1);
  let first = toISO(new Date(year, 10, 1 + ((7 - nov1.getDay()) % 7)));
  if (parse(first).getDate() <= 2) first = addDays(first, 7);
  return [first, addDays(first, 7)];
}

export function getEdition(year: number): Edition {
  const official = OFFICIAL[year];
  if (official) return { year, status: "oficial", ...official };
  const latest = OFFICIAL_YEARS.filter((y) => y < year).at(-1) ?? OFFICIAL_YEARS.at(-1)!;
  return {
    year,
    status: "estimada",
    days: estimatedDays(year),
    source:
      "Estimativa pelo padrão das últimas edições (dois domingos de novembro). A confirmar no edital do Inep.",
    rules: OFFICIAL[latest]!.rules,
    rulesFrom: latest,
  };
}

/** A edição que o aluno deve mirar hoje: a do ano, até o 2º dia de prova; depois, a do ano seguinte. */
export function targetEdition(today: string): Edition {
  const current = getEdition(yearOf(today));
  return today <= current.days[1] ? current : getEdition(yearOf(today) + 1);
}

/** Edições que o aluno pode escolher manualmente: a edição-alvo e as duas seguintes. */
export function selectableEditions(today: string): Edition[] {
  const first = targetEdition(today).year;
  return [first, first + 1, first + 2].map(getEdition);
}

export type DateMode = "auto" | "edicao" | "manual";

/** Data da prova que vale para a configuração do aluno. */
export function resolveExam(
  cfg: { examDate: string; dateMode?: DateMode | undefined; edition?: number | undefined },
  today: string,
): { day1: string; day2: string; edition: Edition | null } {
  const mode = cfg.dateMode ?? "auto";
  if (mode === "manual")
    return { day1: cfg.examDate, day2: addDays(cfg.examDate, 7), edition: null };
  const chosen = mode === "edicao" && cfg.edition ? getEdition(cfg.edition) : null;
  // A chosen edition that is already over gives way to the next one, like "auto".
  const edition = chosen && chosen.days[1] >= today ? chosen : targetEdition(today);
  return { day1: edition.days[0], day2: edition.days[1], edition };
}

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
/** "8 e 15 de novembro de 2026" */
export function formatDays([a, b]: [string, string]) {
  const da = parse(a);
  const db = parse(b);
  return da.getMonth() === db.getMonth()
    ? `${da.getDate()} e ${db.getDate()} de ${MONTHS[da.getMonth()]} de ${da.getFullYear()}`
    : `${da.getDate()} de ${MONTHS[da.getMonth()]} e ${db.getDate()} de ${MONTHS[db.getMonth()]} de ${db.getFullYear()}`;
}
