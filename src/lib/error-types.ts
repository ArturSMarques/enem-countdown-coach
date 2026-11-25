/**
 * Tipo de erro de cada alternativa errada das questões de aprofundamento (as que têm `porQue`).
 * Classificação feita a partir da explicação de cada alternativa; o professor pode ajustar aqui.
 *
 * Cada código tem uma letra por alternativa, na ordem de `options`:
 *   F = fórmula (usou a relação ou o método errado)
 *   I = interpretação do enunciado (respondeu a outra pergunta ou leu errado o texto)
 *   C = conta (erro de cálculo, de conversão de unidade ou de contagem)
 *   K = conteúdo que falta (não conhecia o conceito ou o fato)
 *   D = desatenção (esqueceu uma etapa ou um dado do enunciado)
 *   . = a alternativa correta
 * Questões sem código seguem sem tipo de erro.
 */
export type ErrorType = "formula" | "interpretacao" | "conta" | "conteudo" | "desatencao";

export const ERROR_LABEL: Record<ErrorType, string> = {
  formula: "na fórmula",
  interpretacao: "na interpretação do enunciado",
  conta: "na conta",
  conteudo: "por um conteúdo que falta",
  desatencao: "por desatenção",
};

/** What to do about each kind of error, in one short sentence. */
export const ERROR_ADVICE: Record<ErrorType, string> = {
  formula: "Revise qual relação ou fórmula vale para esse tipo de situação antes de calcular.",
  interpretacao: "Releia o comando: sublinhe o que a pergunta pede antes de olhar as alternativas.",
  conta: "Refaça as contas com calma e confira unidades, vírgulas e potências.",
  conteudo: "Estude a base deste tópico: o erro veio de um conceito que ainda falta.",
  desatencao: "Use todos os dados do enunciado e confira cada etapa antes de marcar.",
};

const CODE: Record<string, ErrorType | null> = {
  F: "formula",
  I: "interpretacao",
  C: "conta",
  K: "conteudo",
  D: "desatencao",
  ".": null,
};

export const ERROR_CODES: Record<string, string> = {
  // Matemática
  "mat-alg-1": "I.IID",
  "mat-medidas-1": "D.CCF",
  "mat-num-1": "C.KKC",
  "mat-trig-1": "F.IFF",
  "mat-geoan-1": ".KIID",
  "mat-seq-1": "D.FII",
  "mat-fin-1": ".DIKC",
  "mat-razao-4": "F.DFC",
  "mat-prob-6": "ID.CI",
  "mat-geop-6": "FC.IF",
  "mat-func-6": "CC.CF",
  "mat-estat-5": "K.DDD",
  "mat-geoe-4": "D.FFF",
  "mat-porc-6": "F.DDI",
  // Física
  "fis-opt-1": "KCI.C",
  "fis-hidro-1": "DD.II",
  "fis-mag-1": "K.KKK",
  "fis-mod-1": "K.KKK",
  "fis-elet-6": "FF.FC",
  "fis-ondas-4": "DI.FF",
  "fis-termo-4": "C.DFK",
  // Química
  "qui-sep-1": "K.KKK",
  "qui-amb-1": ".KKKK",
  "qui-atom-1": "KK.KK",
  "qui-acid-1": "KK.KK",
  "qui-eq-1": "K.KKK",
  "qui-cin-1": "I.III",
  "qui-rad-1": "CFC.K",
  "qui-org-4": "I.KKK",
  "qui-esteq-5": "KKD.C",
  // Biologia
  "bio-biotec-1": "KK.II",
  "bio-saude-1": "K.KKK",
  "bio-evo-1": "K.KKK",
  "bio-bot-1": "K.KII",
  "bio-eco-6": "K.KKI",
  "bio-fisio-4": ".KIKK",
  "bio-gen-5": "KC.IK",
  // Humanas
  "his-geral-1": "K.KKK",
  "his-cont-1": "I.IKK",
  "his-br-6": "K.KKK",
  "geo-urb-1": "I.KKK",
  "geo-nat-1": ".KKKK",
  "geo-agr-1": "K.KKK",
  "geo-carto-1": ".KKKK",
  "geo-amb-6": "I.III",
  "geo-geopol-4": "I.KII",
  "socio-4": "I.III",
  "filo-4": "K.KKK",
  "filo-ant-1": ".KKKK",
  "filo-cont-1": "I.KKI",
  // Linguagens e Redação
  "lin-lit-1": "I.III",
  "lin-arte-1": "K.KKI",
  "lin-estr-1": "K.III",
  "lin-ef-1": "KK.KK",
  "lin-tic-1": "K.KKK",
  "lin-gen-5": "I.III",
  "lin-gram-4": "II.II",
  "lin-interp-7": "I.III",
  "red-comp-5": ".IIIK",
  "red-int-4": "I.IIK",
};

/** Error type per alternative for a question id, or undefined when the question has no code. */
export function errorTypesOf(id: string): (ErrorType | null)[] | undefined {
  const code = ERROR_CODES[id];
  return code ? [...code].map((c) => CODE[c] ?? null) : undefined;
}
