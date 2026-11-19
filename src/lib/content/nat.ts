import type { TopicContent } from "./types";

export const CONTENT_NAT: TopicContent[] = [
  {
    topicId: "qui-esteq",
    resumo: [
      "Os coeficientes da equação balanceada são proporções em mol, não em gramas.",
      "Caminho padrão: massa → mol (n = m/M) → proporção da equação → mol → massa, volume ou partículas.",
      "Reagente limitante é o que acaba primeiro; é ele que define quanto produto se forma.",
      "Pureza se aplica ao reagente (quanto dele é a substância que reage); rendimento se aplica ao produto (quanto do teórico foi obtido).",
    ],
    base: {
      texto: [
        "Estequiometria é a contagem das substâncias numa reação. Como os átomos não somem nem aparecem (conservação da massa, de Lavoisier), a equação balanceada diz em que proporção as substâncias reagem e são produzidas.",
        "Essa proporção é em quantidade de matéria (mol), porque cada molécula de um reagente encontra um número fixo de moléculas do outro. Em 2 H₂ + O₂ → 2 H₂O, duas moléculas de H₂ reagem com uma de O₂; logo, 2 mol de H₂ reagem com 1 mol de O₂ e formam 2 mol de água.",
        "Para passar de massa para mol, use a massa molar M (soma das massas atômicas, em g/mol): n = m/M. Ex.: M(H₂O) = 2·1 + 16 = 18 g/mol, então 36 g de água são 2 mol.",
      ],
      formulas: [
        {
          expr: "n = m / M",
          legenda: "quantidade de matéria (mol) = massa (g) ÷ massa molar (g/mol)",
        },
        {
          expr: "1 mol = 6,0 × 10²³ partículas",
          legenda: "constante de Avogadro (valor arredondado usado no ENEM)",
        },
      ],
      exemplos: [
        {
          enunciado:
            "Na reação 2 H₂ + O₂ → 2 H₂O, que massa de água se forma a partir de 8 g de H₂? (H = 1; O = 16)",
          passos: [
            "Converta a massa dada em mol: M(H₂) = 2 g/mol, então n = 8 ÷ 2 = 4 mol de H₂.",
            "Use a proporção da equação: 2 mol H₂ formam 2 mol H₂O, ou seja, 1 : 1. Então 4 mol de H₂ formam 4 mol de H₂O.",
            "Converta para massa: M(H₂O) = 18 g/mol, então 4 × 18 = 72 g.",
          ],
          resposta: "72 g de água.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Quando o enunciado dá a quantidade de dois reagentes, um deles costuma sobrar. Compare o que cada um exige: calcule quanto do segundo seria necessário para consumir todo o primeiro. Se houver menos do que o necessário, o segundo é o limitante.",
        'Todo o cálculo de produto é feito a partir do limitante. O excesso não reage e não aumenta o produto, mas pode ser cobrado em uma questão ("quanto sobra?").',
        "Gases: em questões com volume, o próprio enunciado informa o volume molar a usar (por exemplo, 22,4 L/mol nas condições que ele indicar). Use sempre o valor dado.",
      ],
      formulas: [
        {
          expr: "V = n · Vₘ",
          legenda: "volume de gás = mol × volume molar informado no enunciado",
        },
      ],
      exemplos: [
        {
          titulo: "Reagente limitante",
          enunciado:
            "Na síntese da amônia, N₂ + 3 H₂ → 2 NH₃, misturam-se 28 g de N₂ e 9 g de H₂. Qual é a massa máxima de amônia formada e qual reagente sobra? (H = 1; N = 14)",
          passos: [
            "Mols disponíveis: N₂ = 28 ÷ 28 = 1 mol; H₂ = 9 ÷ 2 = 4,5 mol.",
            "Para consumir 1 mol de N₂ são necessários 3 mol de H₂. Há 4,5 mol, então o H₂ está em excesso (sobram 1,5 mol, ou 3 g) e o N₂ é o limitante.",
            "Pelo limitante: 1 mol de N₂ forma 2 mol de NH₃. M(NH₃) = 17 g/mol, então 2 × 17 = 34 g.",
          ],
          resposta: "34 g de NH₃; sobram 3 g de H₂.",
        },
      ],
    },
    avancado: {
      texto: [
        "As questões difíceis juntam várias etapas na mesma conta: reagente impuro, reação com rendimento menor que 100%, conversão de unidades (t, kg, g) e, às vezes, uma pergunta ambiental (quanto CO₂ é emitido).",
        "A ordem que evita erro: (1) aplique a pureza ao reagente, para saber quanto da substância de fato reage; (2) faça a proporção estequiométrica para achar o produto teórico; (3) aplique o rendimento ao produto. Pureza e rendimento são multiplicações, então a ordem não muda o número, mas pensar nessa sequência evita aplicar um deles duas vezes ou esquecê-lo.",
        'Quando o enunciado pede o inverso ("quanto minério é preciso para obter X de produto?"), divida pelo rendimento e pela pureza, porque você precisa de MAIS matéria-prima do que o cálculo ideal indica.',
      ],
      formulas: [
        {
          expr: "massa que reage = massa da amostra × pureza",
          legenda: "pureza em decimal (80% = 0,8)",
        },
        {
          expr: "produto obtido = produto teórico × rendimento",
          legenda: "rendimento em decimal (90% = 0,9)",
        },
        {
          expr: "rendimento = obtido ÷ teórico × 100%",
          legenda: "quando a questão pede o rendimento",
        },
      ],
      exemplos: [
        {
          titulo: "Pureza e rendimento na mesma questão",
          enunciado:
            "Na siderurgia, Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂. Uma usina processa 1 tonelada de minério com 80% de Fe₂O₃, e o processo tem rendimento de 90%. Que massa de ferro é obtida? (Fe = 56; O = 16)",
          passos: [
            "Pureza: 80% de 1.000 kg = 800 kg de Fe₂O₃ reagem de fato.",
            "M(Fe₂O₃) = 2·56 + 3·16 = 160 g/mol. Em kg e kmol: 800 kg ÷ 160 = 5 kmol de Fe₂O₃.",
            "Proporção: 1 Fe₂O₃ → 2 Fe, então 10 kmol de Fe, ou 10 × 56 = 560 kg (produto teórico).",
            "Rendimento: 560 × 0,9 = 504 kg.",
          ],
          resposta:
            "504 kg de ferro. As alternativas erradas costumam trazer 560 kg (esqueceu o rendimento), 700 kg (esqueceu a pureza e o rendimento: 1.000 kg dariam 700 kg de Fe) e 448 kg (aplicou 80% duas vezes).",
        },
      ],
    },
    armadilhas: [
      {
        erro: 'Usar os coeficientes como proporção entre massas ("2 g de H₂ para 1 g de O₂").',
        comoEvitar:
          "Coeficientes são proporção em mol. Converta tudo para mol antes de usar a equação.",
      },
      {
        erro: "Calcular a partir de uma equação não balanceada.",
        comoEvitar:
          "Confira se cada elemento tem o mesmo número de átomos dos dois lados antes de qualquer conta.",
      },
      {
        erro: "Calcular o produto a partir do reagente em excesso.",
        comoEvitar: "Quando o enunciado dá dois reagentes, descubra primeiro qual é o limitante.",
      },
      {
        erro: "Esquecer a pureza ou o rendimento (ou aplicar um deles duas vezes).",
        comoEvitar:
          "Pureza vale para o reagente; rendimento, para o produto. As alternativas erradas costumam ser exatamente esses valores intermediários.",
      },
      {
        erro: "Misturar unidades (t, kg, g; L e mL).",
        comoEvitar:
          "Escolha uma unidade no início e mantenha. 1 t = 1.000 kg; com kg, trabalhe em kmol.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Na decomposição CaCO₃ → CaO + CO₂, quantos gramas de CO₂ se formam a partir de 50 g de CaCO₃? (CaCO₃ = 100 g/mol; CO₂ = 44 g/mol)",
        resposta: 22,
        tolerancia: 0.5,
        unidade: "g",
        explicacao:
          "50 g ÷ 100 g/mol = 0,5 mol de CaCO₃. A proporção é 1 : 1, então forma 0,5 mol de CO₂, ou 0,5 × 44 = 22 g.",
      },
      {
        tipo: "opcoes",
        pergunta:
          "Em uma reação em que um dos reagentes está em excesso, a quantidade máxima de produto é determinada:",
        opcoes: [
          "pelo reagente em excesso, que está em maior quantidade",
          "pelo reagente limitante, que é totalmente consumido",
          "pela soma das massas dos reagentes",
          "pelo reagente de maior massa molar",
        ],
        resposta: 1,
        explicacao:
          "Quando o limitante acaba, a reação para. O excesso sobra sem reagir, então não aumenta o produto.",
      },
      {
        tipo: "numero",
        pergunta:
          "Uma reação deveria produzir 40 g de produto, mas foram obtidos 30 g. Qual foi o rendimento, em porcentagem?",
        resposta: 75,
        tolerancia: 0.5,
        unidade: "%",
        explicacao: "Rendimento = obtido ÷ teórico × 100% = 30 ÷ 40 × 100% = 75%.",
      },
    ],
    conexoes: ["qui-sol", "qui-termoq", "mat-regra3", "mat-porc"],
  },
];
