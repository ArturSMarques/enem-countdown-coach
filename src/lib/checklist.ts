import type { Edition } from "./editions";

export type ChecklistItem = {
  id: string;
  group: string;
  label: string;
  /** Regra que muda de uma edição para outra: mostrar "confirme no edital". */
  edital?: boolean;
};

/**
 * Checklist do dia da prova. Os ids são os mesmos da versão anterior, porque as marcações ficam
 * salvas no navegador. Horários e regras de material vêm da edição; com data manual (sem edição),
 * os itens que dependem do edital ficam genéricos.
 */
export function checklistFor(edition: Edition | null): ChecklistItem[] {
  const r = edition?.rules;
  return [
    {
      id: "doc",
      group: "Documentos",
      label: "Documento oficial com foto, original ou digital aceito no edital",
      edital: true,
    },
    {
      id: "cartao",
      group: "Documentos",
      label: "Cartão de Confirmação da Inscrição (o Inep recomenda levar)",
    },
    {
      id: "caneta",
      group: "Material",
      label: "Caneta esferográfica de tinta preta, de material transparente (leve duas)",
      edital: true,
    },
    {
      id: "celular",
      group: "Material",
      label: "Celular e eletrônicos desligados, guardados no envelope porta-objetos",
      edital: true,
    },
    {
      id: "garrafa",
      group: "Material",
      label: "Água e lanche: confira no edital o que pode entrar na sala",
      edital: true,
    },
    {
      id: "horario",
      group: "Horário",
      label: r
        ? `Portões abrem às ${r.gatesOpen} e fecham às ${r.gatesClose} (horário de Brasília). Provas das ${r.start} às ${r.endDay1} (1º dia) e às ${r.endDay2} (2º dia)`
        : "Horário de abertura e fechamento dos portões no Cartão de Confirmação",
      edital: true,
    },
    {
      id: "trajeto",
      group: "Trajeto",
      label: "Conferi o local de prova e o tempo de deslocamento",
    },
    {
      id: "alim",
      group: "Alimentação",
      label: "Lanche leve separado (frutas, castanhas, chocolate)",
    },
    { id: "almoco", group: "Alimentação", label: "Almoço leve e conhecido antes da prova" },
    { id: "sono", group: "Sono", label: "Dormir pelo menos 7h nas duas noites anteriores" },
  ];
}
