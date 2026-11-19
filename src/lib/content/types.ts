import type { DataTable, Figure } from "../question-types";

/**
 * Aprofundamento de um tópico, em camadas (revelação progressiva):
 * - base: o conceito e o porquê, suficiente para as questões fáceis;
 * - intermediario: aplicações, fórmulas e exemplos resolvidos no estilo ENEM;
 * - avancado: o que as questões difíceis e conteudistas exigem (várias etapas, casos limite,
 *   conexão entre assuntos, dados em gráfico, tabela ou texto);
 * - armadilhas: erros comuns e como as alternativas erradas tentam enganar.
 */
export type Formula = { expr: string; legenda: string };

export type WorkedExample = {
  titulo?: string;
  enunciado: string;
  figure?: Figure;
  table?: DataTable;
  /** Resolução passo a passo, mostrada ao toque. */
  passos: string[];
  resposta: string;
};

export type Layer = {
  texto: string[];
  formulas?: Formula[];
  exemplos?: WorkedExample[];
};

export type Trap = { erro: string; comoEvitar: string };

/** Exercício rápido com correção na hora (não entra no desempenho). */
export type Exercise =
  | {
      tipo: "numero";
      pergunta: string;
      resposta: number;
      /** Diferença aceita em relação à resposta, para arredondamentos. */
      tolerancia?: number;
      unidade?: string;
      explicacao: string;
    }
  | {
      tipo: "opcoes";
      pergunta: string;
      opcoes: string[];
      resposta: number;
      explicacao: string;
    };

export type TopicContent = {
  topicId: string;
  /** Revisão rápida: o que precisa estar na ponta da língua. */
  resumo: string[];
  base: Layer;
  intermediario?: Layer;
  avancado?: Layer;
  armadilhas: Trap[];
  exercicios?: Exercise[];
  /** Tópicos relacionados (ids de TOPICS). */
  conexoes?: string[];
  /** Pontos que ainda precisam de conferência humana; aparecem na tela como aviso. */
  aConfirmar?: string[];
};
