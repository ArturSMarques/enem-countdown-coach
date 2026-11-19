/**
 * Incidência dos tópicos nas provas do ENEM (estimativa).
 *
 * Fonte: classificação própria, uma a uma, das questões dos cadernos 1 (azul) e 5 (amarelo) da
 * aplicação regular do ENEM 2024, 2025 e 2026, baixados do portal do Inep. Cada questão foi
 * atribuída a um único tópico (o principal); língua estrangeira conta 5 por ano. Algumas questões
 * só com imagem não puderam ser lidas no texto extraído, por isso os totais ficam perto de 180.
 * Metodologia e lista completa em docs/incidencia-enem.md.
 */
export const INCIDENCE_YEARS = [2024, 2025, 2026] as const;

/** Questões por tópico, na ordem de INCIDENCE_YEARS. */
export const INCIDENCE: Record<string, [number, number, number]> = {
  "bio-biotec": [1, 2, 3],
  "bio-bot": [1, 1, 1],
  "bio-cito": [3, 1, 1],
  "bio-eco": [4, 5, 4],
  "bio-evo": [2, 0, 2],
  "bio-fisio": [3, 1, 2],
  "bio-gen": [1, 1, 1],
  "bio-saude": [2, 2, 1],
  filo: [2, 3, 2],
  "filo-ant": [1, 4, 3],
  "filo-cont": [6, 5, 3],
  "fis-cine": [1, 1, 0],
  "fis-din": [3, 1, 1],
  "fis-elet": [3, 4, 3],
  "fis-ener": [0, 0, 3],
  "fis-hidro": [0, 1, 2],
  "fis-mag": [0, 2, 0],
  "fis-mod": [2, 0, 0],
  "fis-ondas": [2, 4, 3],
  "fis-opt": [1, 1, 1],
  "fis-termo": [4, 1, 1],
  "geo-agr": [0, 2, 2],
  "geo-amb": [2, 5, 5],
  "geo-carto": [1, 1, 1],
  "geo-geopol": [4, 1, 2],
  "geo-nat": [3, 2, 1],
  "geo-urb": [3, 4, 2],
  "his-br": [7, 6, 9],
  "his-cont": [3, 3, 3],
  "his-geral": [5, 5, 6],
  "lin-arte": [6, 4, 6],
  "lin-ef": [5, 4, 4],
  "lin-estr": [5, 5, 5],
  "lin-fig": [0, 1, 2],
  "lin-gen": [7, 9, 8],
  "lin-gram": [6, 9, 5],
  "lin-interp": [2, 4, 3],
  "lin-lit": [9, 6, 7],
  "lin-tic": [5, 3, 5],
  "mat-alg": [3, 2, 2],
  "mat-estat": [3, 3, 4],
  "mat-fin": [0, 1, 1],
  "mat-func": [6, 2, 4],
  "mat-geoan": [0, 3, 1],
  "mat-geoe": [3, 6, 3],
  "mat-geop": [7, 1, 6],
  "mat-graf": [3, 4, 4],
  "mat-medidas": [2, 2, 3],
  "mat-num": [1, 2, 2],
  "mat-porc": [2, 4, 2],
  "mat-prob": [5, 5, 5],
  "mat-razao": [5, 7, 6],
  "mat-regra3": [1, 1, 0],
  "mat-seq": [2, 0, 0],
  "mat-trig": [1, 2, 1],
  "qui-acid": [0, 2, 0],
  "qui-amb": [2, 2, 2],
  "qui-atom": [0, 3, 2],
  "qui-cin": [0, 1, 0],
  "qui-eletroq": [1, 1, 2],
  "qui-eq": [1, 1, 0],
  "qui-esteq": [1, 2, 1],
  "qui-org": [3, 2, 2],
  "qui-rad": [0, 1, 0],
  "qui-sep": [1, 2, 4],
  "qui-sol": [1, 0, 1],
  "qui-termoq": [1, 0, 1],
  socio: [8, 4, 6],
};

export const incidenceTotal = (topicId: string) =>
  (INCIDENCE[topicId] ?? [0, 0, 0]).reduce((a, b) => a + b, 0);
