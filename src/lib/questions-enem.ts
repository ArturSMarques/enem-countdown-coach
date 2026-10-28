import {
  ambulancePoster,
  barChart,
  climograph,
  cylinderAndSphere,
  donut,
  elevator,
  energyPyramid,
  lShapedLot,
  parallelCircuit,
  pedigree,
  riverCrossing,
  rollerCoaster,
  toFigure,
  xyChart,
} from "./figures";
import type { Question } from "./question-types";

/**
 * Questões no estilo ENEM: situação-problema, textos para comparar, gráficos, tabelas e imagens.
 * Todo o material é autoral (textos e dados elaborados para estudo; quando os dados são fictícios,
 * isso está indicado). Para acrescentar questões, inclua no FIM da lista, com id inédito.
 */
type Input = Omit<Question, "topicId">;
const e = (x: Input): Question => ({ ...x, topicId: x.id.replace(/-\d+$/, "") });

export const ENEM_QUESTIONS: Question[] = [
  // ======================= Matemática =======================
  e({
    id: "mat-graf-3",
    level: "media",
    figure: toFigure(
      barChart({
        title: "Lucro anual das empresas (milhões de reais)",
        labels: ["Empresa A", "Empresa B", "Empresa C"],
        series: [
          { name: "2023", values: [20, 50, 8], color: "#9aa5b1" },
          { name: "2024", values: [24, 55, 10], color: "#2f6fb3" },
        ],
        y: { min: 0, max: 60, step: 10 },
      }),
      "Gráfico de barras com o lucro de três empresas em 2023 e 2024, em milhões de reais: empresa A, 20 e 24; empresa B, 50 e 55; empresa C, 8 e 10.",
    ),
    text: "O gráfico mostra o lucro de três empresas em dois anos consecutivos. Um investidor quer comparar o desempenho delas usando dois critérios: o maior crescimento absoluto (em milhões de reais) e o maior crescimento relativo (em porcentagem). Quais empresas apresentam, respectivamente, o maior crescimento absoluto e o maior crescimento relativo?",
    options: ["A e B", "B e C", "C e A", "B e A", "A e C"],
    answer: 1,
    why: "Crescimento absoluto: A = 4, B = 5, C = 2, então o maior é o de B. Crescimento relativo: A = 4/20 = 20%, B = 5/50 = 10%, C = 2/8 = 25%, então o maior é o de C. A empresa que mais cresceu em reais não é a que mais cresceu em proporção.",
  }),
  e({
    id: "mat-porc-4",
    level: "dificil",
    passages: [
      {
        label: "Situação",
        body: "Uma loja anuncia um notebook por R$ 3.000,00. Um cliente dispõe desse valor e pode deixá-lo em uma aplicação que rende 1% ao mês. A loja oferece duas propostas:\n\nProposta I: pagamento à vista, com 8% de desconto.\nProposta II: duas parcelas iguais de R$ 1.500,00, sem juros, a primeira no ato da compra e a segunda 30 dias depois.",
      },
    ],
    text: "Considerando apenas essas informações, qual proposta deixa o cliente com mais dinheiro ao final de 30 dias, e com que valor?",
    options: [
      "Proposta II, com R$ 15,00",
      "Proposta I, com R$ 240,00",
      "Proposta I, com R$ 242,40",
      "Proposta II, com R$ 1.515,00",
      "As duas propostas deixam o cliente com o mesmo valor",
    ],
    answer: 2,
    why: "Proposta I: paga 3.000 × 0,92 = 2.760 e aplica os R$ 240 restantes, que rendem 1% e viram 242,40. Proposta II: paga 1.500 hoje, aplica os outros 1.500, que viram 1.515, paga a segunda parcela de 1.500 e sobram 15. A proposta I deixa 242,40 contra 15,00.",
  }),
  e({
    id: "mat-geoe-3",
    level: "dificil",
    figure: toFigure(
      cylinderAndSphere(),
      "Desenho de um recipiente cilíndrico de raio 10 cm com água até 12 cm de altura e, ao lado, uma esfera maciça de aço com 5 cm de raio, que será mergulhada.",
    ),
    text: "Uma esfera maciça de aço, com 5 cm de raio, é totalmente mergulhada em um recipiente cilíndrico de 10 cm de raio que contém água até a altura de 12 cm, sem que a água transborde. O volume de uma esfera de raio r é 4πr³/3. Qual é, aproximadamente, a nova altura da água?",
    options: ["12,5 cm", "13,0 cm", "13,7 cm", "14,2 cm", "17,0 cm"],
    answer: 2,
    why: "O volume deslocado é o da esfera: 4π·5³/3 = 500π/3 cm³. A área da base do cilindro é π·10² = 100π cm². A água sobe (500π/3) ÷ 100π = 5/3 ≈ 1,7 cm, e a nova altura é 12 + 1,7 ≈ 13,7 cm.",
  }),
  e({
    id: "mat-prob-4",
    level: "dificil",
    text: "Uma urna contém 4 bolas azuis e 6 bolas vermelhas, todas idênticas ao tato. Duas bolas são retiradas ao acaso, uma após a outra e sem reposição. Qual é a probabilidade de as duas bolas retiradas terem a mesma cor?",
    options: ["2/5", "7/15", "8/15", "1/2", "4/9"],
    answer: 1,
    why: "Duas azuis: (4/10) · (3/9) = 12/90. Duas vermelhas: (6/10) · (5/9) = 30/90. Como os casos são excludentes, soma-se: 42/90 = 7/15.",
  }),
  e({
    id: "mat-regra3-3",
    level: "media",
    passages: [
      {
        label: "Situação",
        body: "Uma equipe de 4 pedreiros, trabalhando 6 horas por dia, assenta o piso de 120 m² em 5 dias. Todos trabalham no mesmo ritmo.",
      },
    ],
    text: "Em quantos dias uma equipe de 5 pedreiros, trabalhando 4 horas por dia, assentará o piso de 200 m²?",
    options: ["4 dias", "6 dias", "8 dias", "10 dias", "12 dias"],
    answer: 3,
    why: "Os dias são diretamente proporcionais à área e inversamente proporcionais ao número de pedreiros e às horas diárias: 5 = k · 120/(4 · 6), então k = 1. Para a nova obra: 200/(5 · 4) = 10 dias.",
  }),
  e({
    id: "mat-estat-4",
    level: "media",
    table: {
      caption: "Notas de 20 alunos em uma prova",
      head: ["Nota", "4", "5", "6", "7", "8"],
      rows: [["Número de alunos", "2", "5", "8", "3", "2"]],
    },
    text: "A tabela mostra a distribuição das notas de uma turma. Sobre as medidas de tendência central dessas notas, é correto afirmar que:",
    options: [
      "a média é igual à mediana, e as duas valem 6.",
      "a mediana e a moda são iguais a 6, e a média (5,9) é um pouco menor que elas.",
      "a moda é 5, porque é a nota que mais aparece.",
      "a média é 6,4, maior que a mediana.",
      "a mediana é 5,5, pois há cinco notas diferentes.",
    ],
    answer: 1,
    why: "Média: (4·2 + 5·5 + 6·8 + 7·3 + 8·2) ÷ 20 = 118 ÷ 20 = 5,9. Mediana: com 20 notas, é a média da 10ª e da 11ª, ambas iguais a 6. Moda: a nota 6 aparece 8 vezes, mais que qualquer outra.",
  }),
  e({
    id: "mat-func-4",
    level: "media",
    figure: toFigure(
      xyChart({
        title: "Custo mensal dos planos (R$)",
        x: { min: 0, max: 80, step: 20, label: "Minutos usados por mês" },
        y: { min: 0, max: 100, step: 20, label: "Custo (R$)" },
        series: [
          { name: "Plano A", points: [[0, 30], [80, 70]], color: "#2f6fb3" },
          { name: "Plano B", points: [[0, 10], [80, 90]], color: "#e08a1e" },
        ],
      }),
      "Gráfico de duas retas. O plano A começa em R$ 30 e chega a R$ 70 com 80 minutos. O plano B começa em R$ 10 e chega a R$ 90 com 80 minutos. As retas se cruzam em 40 minutos, no custo de R$ 50.",
    ),
    text: "Duas operadoras oferecem planos com valor fixo mensal mais um valor por minuto de uso, como mostra o gráfico. Um cliente que fala, em média, 55 minutos por mês quer escolher o plano mais barato. Qual plano ele deve escolher e quanto economiza por mês em relação ao outro?",
    options: [
      "Plano A, economizando R$ 7,50",
      "Plano B, economizando R$ 7,50",
      "Plano A, economizando R$ 15,00",
      "Plano B, economizando R$ 10,00",
      "Os dois custam o mesmo valor",
    ],
    answer: 0,
    why: "Plano A: C = 30 + 0,5x. Plano B: C = 10 + 1,0x. Com x = 55: A custa 30 + 27,50 = 57,50 e B custa 10 + 55 = 65,00. O plano A é mais barato em R$ 7,50. Acima de 40 minutos (onde as retas se cruzam), A sempre compensa.",
  }),
  e({
    id: "mat-geop-4",
    level: "media",
    figure: toFigure(lShapedLot(), "Planta de um terreno em formato de L. A parte de cima mede 20 m, o recorte no canto superior direito mede 10 m por 8 m, a lateral direita mede 12 m, a base mede 30 m e a lateral esquerda mede 20 m."),
    text: "O terreno da planta será vendido a R$ 150,00 o metro quadrado. Qual é o valor total do terreno?",
    options: ["R$ 12.000,00", "R$ 72.000,00", "R$ 78.000,00", "R$ 90.000,00", "R$ 105.000,00"],
    answer: 2,
    why: "O terreno é um retângulo de 30 m × 20 m (600 m²) sem o recorte de 10 m × 8 m (80 m²): 600 − 80 = 520 m². Valor: 520 × 150 = R$ 78.000,00.",
  }),
  e({
    id: "mat-porc-5",
    level: "media",
    figure: toFigure(
      donut({
        title: "Distribuição da renda de uma família",
        slices: [
          { label: "Moradia", value: 35 },
          { label: "Alimentação", value: 25 },
          { label: "Transporte", value: 15 },
          { label: "Educação", value: 10 },
          { label: "Lazer", value: 5 },
          { label: "Outros", value: 10 },
        ],
      }),
      "Gráfico de rosca com a distribuição da renda de uma família: moradia 35%, alimentação 25%, transporte 15%, educação 10%, lazer 5% e outros 10%.",
    ),
    text: "A renda mensal dessa família é de R$ 4.000,00. Ela decidiu reduzir em 20% o gasto com transporte e em 10% o gasto com alimentação. Qual será a economia mensal total?",
    options: ["R$ 160,00", "R$ 190,00", "R$ 220,00", "R$ 250,00", "R$ 280,00"],
    answer: 2,
    why: "Transporte: 15% de 4.000 = 600, e 20% de 600 = 120. Alimentação: 25% de 4.000 = 1.000, e 10% de 1.000 = 100. Economia: 120 + 100 = R$ 220,00. Atenção: os percentuais do gráfico são da renda, e os cortes são sobre cada gasto.",
  }),
  e({
    id: "mat-func-5",
    level: "dificil",
    figure: toFigure(
      xyChart({
        title: "Lucro semanal L(x) = −x² + 60x − 500",
        x: { min: 0, max: 60, step: 10, label: "Peças vendidas (x)" },
        y: { min: -600, max: 600, step: 200, label: "Lucro (R$)" },
        series: [
          {
            name: "Lucro",
            color: "#2f6fb3",
            points: Array.from({ length: 13 }, (_, i) => [i * 5, -((i * 5) ** 2) + 60 * i * 5 - 500] as [number, number]),
            markers: true,
          },
        ],
      }),
      "Gráfico de uma parábola com concavidade para baixo. O lucro é zero com 10 e com 50 peças vendidas, é negativo fora desse intervalo e atinge o máximo de R$ 400 com 30 peças.",
    ),
    text: "O lucro semanal L, em reais, de uma pequena fábrica em função do número x de peças vendidas é dado por L(x) = −x² + 60x − 500, e seu gráfico está representado. Para quais quantidades de peças vendidas a fábrica tem lucro, e qual é o lucro máximo possível?",
    options: [
      "Entre 0 e 60 peças, com lucro máximo de R$ 400,00.",
      "Entre 10 e 50 peças, com lucro máximo de R$ 400,00, vendendo 30 peças.",
      "Entre 10 e 50 peças, com lucro máximo de R$ 500,00, vendendo 30 peças.",
      "Acima de 10 peças, com lucro sempre crescente.",
      "Entre 30 e 60 peças, com lucro máximo de R$ 400,00.",
    ],
    answer: 1,
    why: "As raízes de −x² + 60x − 500 = 0 são x = 10 e x = 50 (x² − 60x + 500 = 0 dá x = (60 ± 40)/2). Entre elas o lucro é positivo. O máximo está no vértice, em x = 30: L(30) = −900 + 1.800 − 500 = 400.",
  }),
  e({
    id: "mat-geop-5",
    level: "dificil",
    figure: toFigure(
      riverCrossing(),
      "Desenho de um rio. O ponto A está na margem oposta e o ponto B está na margem próxima, exatamente em frente a A. Na margem próxima, o ponto C está a 30 m de B, o ponto D está 10 m depois de C, e o ponto E está a 12 m de D, perpendicular à margem, de modo que A, C e E estão alinhados.",
    ),
    text: "Para medir a largura de um rio sem atravessá-lo, uma equipe marcou na margem próxima os pontos B, C e D, alinhados, com B exatamente em frente à árvore A da outra margem. Em seguida, marcou o ponto E de modo que DE é perpendicular à margem e A, C e E ficam alinhados, conforme a figura. Qual é a largura AB do rio?",
    options: ["4 m", "12 m", "30 m", "36 m", "40 m"],
    answer: 3,
    why: "Os triângulos ABC e EDC são semelhantes (ângulos retos em B e em D e ângulos opostos pelo vértice em C). Logo AB/DE = BC/CD, então AB/12 = 30/10 e AB = 36 m.",
  }),
  e({
    id: "mat-prob-5",
    level: "dificil",
    text: "Em uma pesquisa com 200 estudantes sobre esportes, 120 disseram gostar de futebol, 90 disseram gostar de vôlei e 40 disseram gostar dos dois. Escolhendo um desses estudantes ao acaso, qual é a probabilidade de ele não gostar de nenhum dos dois esportes?",
    options: ["10%", "15%", "20%", "25%", "30%"],
    answer: 1,
    why: "Os que gostam de pelo menos um esporte são 120 + 90 − 40 = 170 (os 40 foram contados duas vezes). Não gostam de nenhum: 200 − 170 = 30, e 30/200 = 15%.",
  }),

  // ======================= Física =======================
  e({
    id: "fis-cine-4",
    level: "dificil",
    figure: toFigure(
      xyChart({
        title: "Velocidade do trem × tempo",
        x: { min: 0, max: 20, step: 5, label: "Tempo (s)" },
        y: { min: 0, max: 25, step: 5, label: "Velocidade (m/s)" },
        series: [{ name: "Trem", points: [[0, 0], [5, 20], [15, 20], [20, 0]], color: "#2f6fb3", markers: true }],
      }),
      "Gráfico da velocidade em função do tempo: sobe em linha reta de 0 a 20 m/s entre 0 e 5 s, fica constante em 20 m/s entre 5 e 15 s e desce em linha reta até 0 entre 15 e 20 s.",
    ),
    text: "O gráfico mostra a velocidade de um trem em função do tempo no trajeto entre duas estações vizinhas. Qual é a distância entre as estações e a velocidade média do trem nesse trajeto?",
    options: ["300 m e 20 m/s", "300 m e 15 m/s", "400 m e 20 m/s", "400 m e 15 m/s", "200 m e 10 m/s"],
    answer: 1,
    why: "A distância é a área sob a curva: 0–5 s, ½·5·20 = 50 m; 5–15 s, 10·20 = 200 m; 15–20 s, ½·5·20 = 50 m. Total: 300 m. Velocidade média = 300 m ÷ 20 s = 15 m/s (menor que os 20 m/s do trecho constante).",
  }),
  e({
    id: "fis-elet-4",
    level: "media",
    table: {
      caption: "Dois chuveiros elétricos de mesma tensão (dados do fabricante)",
      head: ["Modelo", "Potência", "Uso no banho"],
      rows: [
        ["Chuveiro I", "5.500 W", "30 min por dia"],
        ["Chuveiro II", "3.500 W", "30 min por dia"],
      ],
      note: "Considere o mês com 30 dias e a tarifa de R$ 0,80 por kWh.",
    },
    text: "Uma família troca o Chuveiro I pelo Chuveiro II, mantendo o mesmo tempo de banho. Qual é a economia mensal na conta de energia?",
    options: ["R$ 12,00", "R$ 16,00", "R$ 24,00", "R$ 30,00", "R$ 48,00"],
    answer: 2,
    why: "A diferença de potência é 5,5 − 3,5 = 2 kW. Em 0,5 h por dia durante 30 dias: 2 × 0,5 × 30 = 30 kWh a menos. Economia: 30 × 0,80 = R$ 24,00.",
  }),
  e({
    id: "fis-termo-3",
    level: "dificil",
    figure: toFigure(
      xyChart({
        title: "Aquecimento de 100 g de gelo",
        x: { min: 0, max: 12000, step: 2000, label: "Calor recebido (cal)" },
        y: { min: -20, max: 40, step: 20, label: "Temperatura (°C)" },
        series: [{ name: "Amostra", points: [[0, -10], [500, 0], [8500, 0], [10500, 20]], color: "#c0392b", markers: true }],
      }),
      "Gráfico da temperatura em função do calor recebido: sobe de −10 °C até 0 °C com 500 cal, fica em 0 °C até 8.500 cal e depois sobe até 20 °C com 10.500 cal.",
    ),
    text: "Uma amostra de 100 g de gelo a −10 °C é aquecida até se transformar em água a 20 °C. São dados: calor específico do gelo = 0,5 cal/g·°C; calor latente de fusão do gelo = 80 cal/g; calor específico da água = 1 cal/g·°C. Qual é a quantidade total de calor recebida pela amostra?",
    options: ["2.500 cal", "8.000 cal", "8.500 cal", "10.500 cal", "12.500 cal"],
    answer: 3,
    why: "Etapas: aquecer o gelo, 100 · 0,5 · 10 = 500 cal; fundir, 100 · 80 = 8.000 cal (temperatura constante em 0 °C); aquecer a água, 100 · 1 · 20 = 2.000 cal. Total: 500 + 8.000 + 2.000 = 10.500 cal, o valor em que o gráfico termina.",
  }),
  e({
    id: "fis-din-3",
    level: "media",
    figure: toFigure(elevator(), "Desenho de um elevador com uma pessoa em pé sobre uma balança. Uma seta para cima indica que o elevador sobe com aceleração de 2 m/s²."),
    text: "Uma pessoa de 60 kg está em pé sobre uma balança dentro de um elevador que sobe com aceleração constante de 2 m/s². Adotando g = 10 m/s², qual é a intensidade da força que a balança exerce sobre a pessoa?",
    options: ["480 N", "600 N", "720 N", "1.200 N", "120 N"],
    answer: 2,
    why: "Na vertical, a resultante é N − P = m·a. Então N = m(g + a) = 60 · (10 + 2) = 720 N, maior que o peso (600 N), por isso a pessoa se sente mais pesada ao acelerar para cima.",
  }),
  e({
    id: "fis-ener-4",
    level: "media",
    figure: toFigure(rollerCoaster(), "Desenho de um trilho. O carrinho parte do repouso no ponto A, a 45 m de altura, desce até o ponto B, ao nível do chão, e sobe até o ponto C, a 25 m de altura."),
    text: "Um carrinho parte do repouso do ponto A de um trilho sem atrito, como mostra a figura. Adotando g = 10 m/s² e desprezando a resistência do ar, qual é a velocidade do carrinho ao passar pelo ponto C?",
    options: ["10 m/s", "15 m/s", "20 m/s", "25 m/s", "30 m/s"],
    answer: 2,
    why: "Pela conservação da energia mecânica, a energia potencial perdida vira cinética: g·(45 − 25) = v²/2, então v² = 2 · 10 · 20 = 400 e v = 20 m/s. O formato do trilho não importa, só a diferença de altura.",
  }),
  e({
    id: "fis-ondas-3",
    level: "media",
    figure: toFigure(
      xyChart({
        title: "Onda registrada em um instante",
        x: { min: 0, max: 10, step: 2, label: "Posição (m)" },
        y: { min: -1, max: 1, step: 0.5, label: "Altura (m)" },
        series: [{ name: "Onda", points: Array.from({ length: 41 }, (_, i) => [i * 0.25, 0.5 * Math.sin((2 * Math.PI * i * 0.25) / 5)] as [number, number]), color: "#2f6fb3" }],
      }),
      "Gráfico de uma onda senoidal com dois ciclos completos ao longo de 10 metros e amplitude de 0,5 metro.",
    ),
    text: "A figura mostra uma onda que se propaga com velocidade de 20 m/s. Qual é a frequência dessa onda?",
    options: ["2 Hz", "4 Hz", "5 Hz", "10 Hz", "40 Hz"],
    answer: 1,
    why: "Em 10 m cabem dois ciclos completos, então o comprimento de onda é λ = 5 m. Da equação v = λ·f, f = 20 ÷ 5 = 4 Hz. A amplitude (0,5 m) não interfere na frequência.",
  }),
  e({
    id: "fis-elet-5",
    level: "dificil",
    figure: toFigure(parallelCircuit(), "Esquema de um circuito com uma fonte de 12 volts ligada a dois resistores em paralelo: um de 6 ohms e outro de 3 ohms."),
    text: "No circuito da figura, uma fonte de 12 V alimenta dois resistores ligados em paralelo, de 6 Ω e de 3 Ω. Qual é a corrente total fornecida pela fonte e a potência total dissipada?",
    options: ["2 A e 24 W", "6 A e 72 W", "1,33 A e 16 W", "12 A e 144 W", "4 A e 48 W"],
    answer: 1,
    why: "Em paralelo a tensão é de 12 V em cada resistor: i₁ = 12/6 = 2 A e i₂ = 12/3 = 4 A, totalizando 6 A (resistência equivalente de 2 Ω). Potência: P = U·i = 12 · 6 = 72 W. Os valores 1,33 A e 16 W correspondem à ligação em série.",
  }),

  // ======================= Química =======================
  e({
    id: "qui-sol-4",
    level: "media",
    table: {
      caption: "pH aproximado de algumas substâncias do dia a dia",
      head: ["Substância", "pH"],
      rows: [
        ["Suco de limão", "2"],
        ["Café", "5"],
        ["Água pura", "7"],
        ["Sangue humano", "7,4"],
        ["Sabão", "10"],
        ["Amônia doméstica", "11"],
      ],
      note: "pH = −log [H⁺]. A cada unidade de pH, a concentração de H⁺ muda 10 vezes.",
    },
    text: "Com base nos dados da tabela, quantas vezes a concentração de íons H⁺ no suco de limão é maior que a do café?",
    options: ["3 vezes", "30 vezes", "100 vezes", "1.000 vezes", "10.000 vezes"],
    answer: 3,
    why: "A escala de pH é logarítmica. A diferença é 5 − 2 = 3 unidades, então [H⁺] do limão é 10³ = 1.000 vezes maior que a do café.",
  }),
  e({
    id: "qui-esteq-4",
    level: "dificil",
    passages: [
      {
        label: "Texto",
        body: "A cal virgem (CaO), usada na construção civil, é obtida pela decomposição térmica do calcário, segundo a reação CaCO₃ → CaO + CO₂. Uma empresa processa 1 tonelada de calcário que contém 80% de CaCO₃, e o processo tem rendimento de 90%.\nMassas molares: CaCO₃ = 100 g/mol; CaO = 56 g/mol.",
      },
    ],
    text: "Qual é, aproximadamente, a massa de cal virgem produzida?",
    options: ["280 kg", "403 kg", "448 kg", "498 kg", "560 kg"],
    answer: 1,
    why: "Massa de CaCO₃ puro: 80% de 1.000 kg = 800 kg. Pela proporção 100 : 56, a massa teórica de CaO é 800 · 56/100 = 448 kg. Com rendimento de 90%: 448 · 0,9 ≈ 403 kg.",
  }),
  e({
    id: "qui-termoq-3",
    level: "media",
    table: {
      caption: "Calor liberado na combustão completa de 1 mol (valores aproximados)",
      head: ["Combustível", "Energia liberada (kJ/mol)", "Massa molar (g/mol)"],
      rows: [
        ["Etanol", "1.370", "46"],
        ["Metano", "890", "16"],
        ["Hidrogênio", "286", "2"],
      ],
    },
    text: "Um engenheiro quer escolher o combustível que libera mais energia por unidade de massa. Com base na tabela, a melhor escolha é:",
    options: [
      "o etanol, pois libera mais energia por mol.",
      "o metano, por ter massa molar intermediária.",
      "o hidrogênio, pois libera cerca de 143 kJ por grama.",
      "o etanol, pois tem a maior massa molar.",
      "qualquer um deles, pois a energia por grama é igual.",
    ],
    answer: 2,
    why: "É preciso converter para energia por grama: etanol, 1.370 ÷ 46 ≈ 29,8 kJ/g; metano, 890 ÷ 16 ≈ 55,6 kJ/g; hidrogênio, 286 ÷ 2 = 143 kJ/g. O maior valor por mol (etanol) não é o maior por grama.",
  }),
  e({
    id: "qui-eletroq-3",
    level: "dificil",
    table: {
      caption: "Potenciais padrão de redução",
      head: ["Semirreação", "E° (V)"],
      rows: [
        ["Zn²⁺ + 2e⁻ → Zn", "−0,76"],
        ["Fe²⁺ + 2e⁻ → Fe", "−0,44"],
        ["Cu²⁺ + 2e⁻ → Cu", "+0,34"],
        ["Ag⁺ + e⁻ → Ag", "+0,80"],
      ],
    },
    text: "Para proteger o casco de ferro de um navio contra a corrosão, fixam-se nele placas de outro metal, que funcionam como ânodo de sacrifício. Com base na tabela, o metal mais adequado e a justificativa são:",
    options: [
      "o cobre, pois tem potencial de redução maior que o do ferro e se reduz no lugar dele.",
      "a prata, pois é o metal mais nobre e protege o ferro por reagir com a água do mar.",
      "o zinco, pois tem potencial de redução menor que o do ferro e se oxida no lugar dele.",
      "o zinco, pois tem potencial de redução menor que o do ferro e por isso se reduz no lugar dele.",
      "qualquer um deles, pois o potencial de redução não influencia a proteção.",
    ],
    answer: 2,
    why: "O metal de sacrifício precisa ter menor potencial de redução que o ferro, isto é, maior tendência a oxidar. O zinco (−0,76 V) é menor que o ferro (−0,44 V): ele se oxida (ânodo) e o ferro é preservado. Cobre e prata têm potenciais maiores e não protegem o ferro.",
  }),

  // ======================= Biologia =======================
  e({
    id: "bio-gen-4",
    level: "dificil",
    figure: toFigure(
      pedigree(),
      "Heredograma: um casal sem a doença (homem I-1 e mulher I-2) tem três filhos: uma filha com a doença (II-1), um filho sem a doença (II-2) e uma filha sem a doença (II-3).",
    ),
    text: "O heredograma mostra uma família em que um casal sem a doença teve uma filha afetada. Qual é o padrão de herança da doença e a probabilidade de o casal ter, em uma nova gestação, uma criança do sexo masculino com a doença?",
    options: [
      "Autossômica dominante; 1/4",
      "Autossômica recessiva; 1/4",
      "Autossômica recessiva; 1/8",
      "Recessiva ligada ao X; 1/8",
      "Autossômica dominante; 1/8",
    ],
    answer: 2,
    why: "Pais sem a doença com filha afetada indicam herança recessiva. Se fosse ligada ao X, a filha afetada exigiria um pai afetado, e ele não é. Logo é autossômica recessiva, e os pais são Aa. A chance de aa é 1/4, e a de ser menino é 1/2: 1/4 · 1/2 = 1/8.",
  }),
  e({
    id: "bio-eco-4",
    level: "media",
    figure: toFigure(
      energyPyramid([
        { name: "Produtores", kcal: "10.000" },
        { name: "Consumidores primários", kcal: "1.000" },
        { name: "Consumidores secundários", kcal: "100" },
        { name: "Consumidores terciários", kcal: "10" },
      ]),
      "Pirâmide de energia com quatro níveis. Produtores: 10.000 kcal. Consumidores primários: 1.000 kcal. Consumidores secundários: 100 kcal. Consumidores terciários: 10 kcal.",
    ),
    text: "A pirâmide mostra que apenas cerca de 10% da energia de cada nível passa para o seguinte. Considerando o esquema, quantas vezes mais energia dos produtores chega a quem se alimenta diretamente de plantas (consumidor primário) do que a quem se alimenta de um animal carnívoro (consumidor secundário)?",
    options: ["2 vezes", "5 vezes", "10 vezes", "100 vezes", "1.000 vezes"],
    answer: 2,
    why: "Consumidores primários dispõem de 1.000 kcal e consumidores secundários, de 100 kcal: 1.000 ÷ 100 = 10 vezes. Por isso cadeias alimentares curtas aproveitam melhor a energia e sustentam mais indivíduos.",
  }),
  e({
    id: "bio-eco-5",
    level: "media",
    table: {
      caption: "Monitoramento de um lago que recebe esgoto de um bairro",
      head: ["Ano", "Fósforo (µg/L)", "Algas (mil células/mL)", "Oxigênio dissolvido (mg/L)"],
      rows: [
        ["2019", "20", "5", "8,0"],
        ["2020", "40", "12", "7,2"],
        ["2021", "70", "40", "5,6"],
        ["2022", "100", "95", "4,1"],
        ["2023", "120", "140", "3,0"],
      ],
      note: "Dados elaborados para esta questão.",
    },
    text: "Os dados indicam que, ao longo dos anos, o lago passou a registrar mortandade de peixes. Qual medida é mais adequada para recuperar o lago, considerando a relação entre as variáveis da tabela?",
    options: [
      "Aumentar a temperatura da água para acelerar a decomposição.",
      "Reduzir o lançamento de esgoto e de fertilizantes, diminuindo a entrada de fósforo.",
      "Introduzir mais peixes para consumir o oxigênio em excesso.",
      "Retirar a vegetação das margens para aumentar a luz sobre a água.",
      "Adicionar adubo rico em fósforo para estimular o crescimento das plantas.",
    ],
    answer: 1,
    why: "Mais fósforo (nutriente) provocou proliferação de algas; ao morrerem, elas são decompostas por microrganismos que consomem o oxigênio, o que mata os peixes. Reduzir o fósforo que entra no lago ataca a causa do processo (eutrofização).",
  }),
  e({
    id: "bio-fisio-3",
    level: "media",
    table: {
      caption: "Resultados de hemogramas",
      head: ["Exame", "Valor de referência", "Paciente 1", "Paciente 2", "Paciente 3"],
      rows: [
        ["Hemácias (milhões/µL)", "4,5 a 5,9", "3,2", "5,0", "4,8"],
        ["Leucócitos (por µL)", "4.000 a 11.000", "7.500", "15.800", "6.000"],
        ["Plaquetas (por µL)", "150.000 a 450.000", "250.000", "300.000", "80.000"],
      ],
      note: "Dados elaborados para esta questão.",
    },
    text: "Hemácias transportam oxigênio, leucócitos participam da defesa do organismo e plaquetas atuam na coagulação. Com base nos resultados, qual interpretação é a mais coerente?",
    options: [
      "Paciente 1: sinais de anemia; Paciente 2: possível infecção; Paciente 3: risco de dificuldade de coagulação.",
      "Paciente 1: possível infecção; Paciente 2: sinais de anemia; Paciente 3: risco de dificuldade de coagulação.",
      "Paciente 1: risco de dificuldade de coagulação; Paciente 2: possível infecção; Paciente 3: sinais de anemia.",
      "Paciente 1: sinais de anemia; Paciente 2: risco de dificuldade de coagulação; Paciente 3: possível infecção.",
      "Os três pacientes têm resultados dentro dos valores de referência.",
    ],
    answer: 0,
    why: "Paciente 1: hemácias (3,2) abaixo da referência, o que sugere anemia. Paciente 2: leucócitos (15.800) acima de 11.000, o que sugere infecção. Paciente 3: plaquetas (80.000) abaixo de 150.000, o que aumenta o risco de sangramento.",
  }),

  // ======================= Humanas =======================
  e({
    id: "his-br-4",
    level: "dificil",
    passages: [
      {
        label: "Texto I",
        body: "\"O trabalhador brasileiro tem hoje um amigo no poder. A carteira profissional, o salário mínimo e as férias remuneradas não são favores: são a prova de que o Estado cuida de seus filhos. Quem trabalha com ordem constrói a Pátria.\"",
        source: "Texto elaborado para estudo, inspirado na propaganda oficial das décadas de 1930 e 1940.",
      },
      {
        label: "Texto II",
        body: "\"Tiraram de nós o direito de escolher o nosso sindicato. Para existir, ele precisa do reconhecimento do ministério, e o dirigente que faz greve é chamado de agitador. A carteira assinada veio, é verdade, mas a voz do operário, essa, continua calada.\"",
        source: "Texto elaborado para estudo, baseado em relatos de trabalhadores do período.",
      },
    ],
    text: "A comparação entre os textos permite identificar, nas relações entre o Estado e os trabalhadores no Brasil das décadas de 1930 e 1940, uma tensão entre:",
    options: [
      "a ampliação de direitos sociais e o controle estatal sobre a organização e a mobilização dos trabalhadores.",
      "a defesa do liberalismo econômico e a livre negociação entre patrões e empregados.",
      "o fim da legislação trabalhista e o retorno ao trabalho escravo.",
      "o apoio dos sindicatos ao fim do governo e a ausência de leis trabalhistas.",
      "a ausência total de intervenção do Estado nas relações de trabalho e a autonomia sindical.",
    ],
    answer: 0,
    why: "O Texto I destaca direitos concedidos pelo Estado (carteira, salário mínimo, férias). O Texto II mostra o outro lado: sindicatos atrelados ao Ministério do Trabalho e repressão às greves. A política trabalhista combinou conquistas sociais com controle da participação dos trabalhadores.",
  }),
  e({
    id: "his-br-5",
    level: "media",
    figure: toFigure(
      barChart({
        title: "População urbana no Brasil (% do total)",
        labels: ["1940", "1950", "1960", "1970", "1980", "1991", "2000", "2010"],
        series: [{ name: "Urbana", values: [31, 36, 45, 56, 68, 76, 81, 84], color: "#2f6fb3" }],
        y: { min: 0, max: 100, step: 20 },
      }),
      "Gráfico de barras com a porcentagem da população urbana do Brasil: 31% em 1940, 36% em 1950, 45% em 1960, 56% em 1970, 68% em 1980, 76% em 1991, 81% em 2000 e 84% em 2010. Valores aproximados dos Censos do IBGE.",
      "Valores aproximados, a partir dos Censos do IBGE.",
    ),
    text: "A partir de qual década a maior parte da população brasileira passou a viver em cidades, e que processo histórico ajuda a explicar essa mudança?",
    options: [
      "Em 1950, devido ao fim da industrialização.",
      "Em 1960, devido à reforma agrária realizada no governo militar.",
      "Em 1970, devido à industrialização concentrada nas cidades e ao êxodo rural.",
      "Em 1980, devido à proibição da migração entre regiões.",
      "Em 1940, devido à chegada de imigrantes aos campos.",
    ],
    answer: 2,
    why: "A população urbana ultrapassa 50% no Censo de 1970 (56%), contra 45% em 1960. A industrialização e a mecanização do campo atraíram e expulsaram trabalhadores rurais, num intenso êxodo rural, principalmente em direção ao Sudeste.",
  }),
  e({
    id: "geo-amb-4",
    level: "dificil",
    passages: [
      {
        label: "Texto I",
        body: "\"A expansão da fronteira agrícola é indispensável para garantir a oferta de alimentos e as exportações do país. O uso de máquinas, de sementes melhoradas e de grandes extensões de terra eleva a produtividade e gera divisas.\"",
        source: "Texto elaborado para estudo.",
      },
      {
        label: "Texto II",
        body: "\"A concentração de terras e a monocultura em larga escala pressionam florestas e nascentes e reduzem a variedade de alimentos produzidos. Os pequenos produtores, que cultivam espécies diversas e abastecem a feira da cidade, são responsáveis por parte significativa do que chega à mesa dos brasileiros.\"",
        source: "Texto elaborado para estudo.",
      },
    ],
    text: "Os textos apresentam visões distintas sobre o modelo de produção agrícola. A principal divergência entre eles está em:",
    options: [
      "o Texto I prioriza escala, produtividade e exportação; o Texto II prioriza diversidade, pequenos produtores e proteção ambiental.",
      "ambos negam a importância de produzir alimentos para a população.",
      "o Texto I defende a agricultura familiar; o Texto II defende a monocultura de exportação.",
      "o Texto I trata dos impactos ambientais; o Texto II trata apenas de máquinas e sementes.",
      "ambos defendem o fim da produção agrícola em grandes propriedades.",
    ],
    answer: 0,
    why: "O Texto I valoriza ganho de escala, tecnologia e exportações. O Texto II critica a concentração de terras e a monocultura e destaca a agricultura diversificada de pequenos produtores e a preservação de florestas e nascentes.",
  }),
  e({
    id: "geo-amb-5",
    level: "media",
    figure: toFigure(
      climograph({
        title: "Climograma de uma cidade brasileira",
        rain: [240, 200, 180, 90, 30, 10, 10, 15, 50, 130, 200, 250],
        temp: [25, 25, 25, 24, 22, 21, 21, 23, 25, 25, 25, 25],
      }),
      "Climograma mensal. As chuvas passam de 180 mm de dezembro a março, caem para menos de 30 mm entre maio e agosto e voltam a subir a partir de outubro. A temperatura fica entre 21 e 25 graus durante todo o ano.",
    ),
    text: "O climograma apresenta a precipitação e a temperatura médias mensais de uma cidade brasileira. Com base nele, o clima e a vegetação mais prováveis dessa região são:",
    options: [
      "equatorial úmido, com chuvas bem distribuídas o ano todo, como na Floresta Amazônica.",
      "semiárido, com chuvas escassas e irregulares em todos os meses, como na Caatinga.",
      "tropical, com verão chuvoso e inverno seco, como no Cerrado.",
      "subtropical, com chuvas regulares e invernos frios, como nos Campos do Sul.",
      "desértico, com ausência quase total de chuvas.",
    ],
    answer: 2,
    why: "O gráfico mostra duas estações bem definidas: verão quente e chuvoso (mais de 180 mm em vários meses) e inverno seco (menos de 30 mm entre maio e agosto), com temperaturas altas o ano todo. Isso caracteriza o clima tropical típico do Cerrado.",
  }),
  e({
    id: "geo-geopol-3",
    level: "media",
    table: {
      caption: "Composição das exportações de três países (% do valor exportado)",
      head: ["País", "Produtos primários", "Produtos industrializados", "Serviços e outros"],
      rows: [
        ["País A", "85", "10", "5"],
        ["País B", "20", "70", "10"],
        ["País C", "45", "40", "15"],
      ],
      note: "Dados fictícios, elaborados para esta questão.",
    },
    text: "O preço internacional de produtos primários, como minérios, petróleo e grãos, oscila bastante. Com base nos dados da tabela, o país mais vulnerável a uma queda brusca desses preços é:",
    options: [
      "o país A, pois a maior parte de suas exportações é de produtos primários.",
      "o país B, pois exporta poucos produtos primários.",
      "o país C, pois exporta valores iguais de todos os tipos de produto.",
      "o país B, pois a maior parte de suas exportações é industrializada.",
      "nenhum deles, pois os preços dos produtos primários nunca oscilam.",
    ],
    answer: 0,
    why: "O país A obtém 85% de suas exportações com produtos primários, então uma queda de preços reduz fortemente sua receita. Economias mais diversificadas, como a do país B, sofrem menos com essas oscilações.",
  }),
  e({
    id: "filo-3",
    level: "dificil",
    passages: [
      {
        label: "Texto I",
        body: "\"Quando não existe um poder comum que mantenha todos em respeito, os homens vivem em guerra de todos contra todos, pois cada um teme o outro e busca a própria segurança. Para escapar desse medo, entregam a um soberano o direito de governá-los.\"",
        source: "Paráfrase livre de ideias de Thomas Hobbes.",
      },
      {
        label: "Texto II",
        body: "\"O homem nasce livre e, por toda parte, encontra-se acorrentado. Não é a natureza, mas a vida em sociedade e a desigualdade que a acompanha que corrompem os homens. Legítimo é apenas o pacto em que todos se submetem à vontade geral.\"",
        source: "Paráfrase livre de ideias de Jean-Jacques Rousseau.",
      },
    ],
    text: "Os dois textos recorrem à ideia de contrato social, mas divergem quanto:",
    options: [
      "à concepção sobre a origem dos conflitos: para o Texto I, eles vêm da natureza humana; para o Texto II, vêm da sociedade e da desigualdade.",
      "à existência do Estado: o Texto I rejeita qualquer forma de governo, e o Texto II a defende.",
      "ao valor da liberdade: o Texto I a considera irrelevante, e o Texto II a considera sua única preocupação.",
      "à origem divina do poder: ambos afirmam que o governante é escolhido por Deus.",
      "ao papel da lei: ambos concordam que as leis não devem limitar ninguém.",
    ],
    answer: 0,
    why: "Em ambos os textos o Estado nasce de um pacto. Para Hobbes (Texto I), o ser humano em estado de natureza vive em conflito e precisa de um soberano forte para garantir a paz. Para Rousseau (Texto II), o ser humano é livre por natureza, e a desigualdade social é que o corrompe. Por isso o pacto legítimo exprime a vontade geral.",
  }),
  e({
    id: "socio-3",
    level: "media",
    passages: [
      {
        label: "Situação",
        body: "Em uma pequena comunidade ribeirinha, quase todas as famílias pescam, plantam e constroem suas casas de maneira muito parecida, e as pessoas se mantêm unidas porque compartilham costumes, crenças e rotinas. Em uma metrópole, ao contrário, as pessoas exercem profissões muito diferentes, como médico, motorista, programador e padeiro, e dependem umas das outras para ter acesso a serviços e bens.",
      },
    ],
    text: "Na sociologia de Émile Durkheim, os dois tipos de laço social descritos são conhecidos, respectivamente, como solidariedade:",
    options: [
      "orgânica e mecânica.",
      "mecânica e orgânica.",
      "mecânica e mecânica.",
      "orgânica e orgânica.",
      "econômica e política.",
    ],
    answer: 1,
    why: "Na solidariedade mecânica, típica de sociedades tradicionais, a coesão vem da semelhança entre os indivíduos e de valores comuns. Na solidariedade orgânica, típica de sociedades complexas, a coesão vem da divisão do trabalho e da interdependência entre funções diferentes.",
  }),

  // ======================= Linguagens =======================
  e({
    id: "lin-interp-4",
    level: "dificil",
    passages: [
      {
        label: "Texto I",
        body: "A mesa de jantar virou ponto de wi-fi: cada um com o prato numa mão e a tela na outra, todos juntos e cada qual em outro lugar. Pergunta-se qualquer coisa e a resposta chega, quando chega, sem tirar os olhos do aparelho.",
        source: "Texto elaborado para estudo.",
      },
      {
        label: "Texto II",
        body: "Minha avó, em Recife, nunca tinha visto o neto que mora em Portugal. Até que veio a videochamada de domingo: ela chorou, riu e ensinou a receita de cuscuz pela tela, como se estivessem na mesma cozinha.",
        source: "Texto elaborado para estudo.",
      },
    ],
    text: "Os textos tratam do papel da tecnologia nas relações entre as pessoas. A comparação entre eles revela que:",
    options: [
      "o Texto I problematiza a perda da interação presencial, enquanto o Texto II valoriza a aproximação entre pessoas distantes; ambos tratam a tecnologia como mediadora dos vínculos.",
      "ambos condenam o uso de qualquer tecnologia nas relações familiares.",
      "o Texto I elogia a tecnologia, enquanto o Texto II defende que as pessoas deixem de usá-la.",
      "o Texto II critica o uso de telas durante as refeições, enquanto o Texto I elogia as videochamadas.",
      "ambos concordam que a tecnologia aproxima pessoas sempre que estão no mesmo ambiente.",
    ],
    answer: 0,
    why: "O Texto I critica o uso de telas na mesa, que isola quem está fisicamente junto. O Texto II mostra a tecnologia aproximando uma avó e um neto separados por um oceano. Os dois reconhecem que ela medeia as relações; o efeito depende do uso.",
  }),
  e({
    id: "lin-gen-4",
    level: "media",
    figure: toFigure(ambulancePoster(), "Cartaz vermelho com um relógio e o texto: Sua pressa pode esperar. A vida dele, não. Embaixo: Ouviu a sirene? Dê passagem à ambulância."),
    text: "O cartaz é um texto de campanha de conscientização. Considerando o gênero e a linguagem empregada, é correto afirmar que:",
    options: [
      "predomina a função conativa (apelativa), pois o texto se dirige ao leitor para orientar seu comportamento, e há contraste entre a pressa do motorista e a urgência da vida.",
      "predomina a função poética, pois o objetivo é exprimir sentimentos do autor sobre o trânsito.",
      "predomina a função referencial, pois o texto apenas descreve como funciona uma ambulância.",
      "o texto tem caráter narrativo, pois conta a história de um motorista apressado.",
      "o texto é uma notícia, pois relata um fato ocorrido recentemente.",
    ],
    answer: 0,
    why: "O cartaz usa verbos no imperativo (\"Dê passagem\"), dirige-se diretamente ao leitor e busca mudar sua atitude: função conativa. O contraste entre \"sua pressa pode esperar\" e \"a vida dele, não\" reforça o argumento.",
  }),
  e({
    id: "lin-fig-4",
    level: "media",
    passages: [
      {
        label: "Poema",
        body: "A tarde dobrou a esquina com pressa\ne deixou, sobre a calçada, seu casaco de sombras.\nO relógio da praça, rouco de tanto contar,\nadormeceu entre pombos e silêncio.",
        source: "Poema elaborado para estudo.",
      },
    ],
    text: "No poema, a tarde \"dobra a esquina\" e o relógio fica \"rouco\" e \"adormece\". O principal recurso expressivo empregado nesses versos é:",
    options: [
      "a hipérbole, pois há exagero para intensificar um sentimento.",
      "a personificação, pois características humanas são atribuídas à tarde e ao relógio.",
      "a ironia, pois se diz o contrário do que se quer dizer.",
      "o eufemismo, pois se suaviza uma ideia desagradável.",
      "o pleonasmo, pois se repete desnecessariamente uma informação.",
    ],
    answer: 1,
    why: "Dobrar a esquina, ficar rouco e adormecer são ações e estados humanos atribuídos a seres não humanos (a tarde e o relógio). Esse recurso é a personificação (ou prosopopeia).",
  }),
  e({
    id: "lin-interp-5",
    level: "media",
    passages: [
      {
        label: "Texto",
        body: "Uma pesquisa fictícia sobre hábitos de leitura por faixa etária mostra que os mais jovens leem muito, mas em telas, enquanto a leitura de livros impressos cresce com a idade.",
        source: "Dados fictícios, elaborados para esta questão.",
      },
    ],
    figure: toFigure(
      barChart({
        title: "Horas semanais de leitura",
        labels: ["15–19", "20–29", "30–44", "45 ou mais"],
        series: [
          { name: "Livros impressos", values: [2, 3, 4, 5], color: "#2e8b57" },
          { name: "Telas", values: [9, 8, 6, 3], color: "#7b5ea7" },
        ],
        y: { min: 0, max: 10, step: 2 },
      }),
      "Gráfico de barras agrupadas com horas semanais de leitura por faixa etária. Livros impressos: 2, 3, 4 e 5 horas. Telas: 9, 8, 6 e 3 horas, respectivamente, para as faixas de 15 a 19, 20 a 29, 30 a 44 e 45 anos ou mais.",
    ),
    text: "Considerando o texto e o gráfico, é correto concluir que:",
    options: [
      "os jovens de 15 a 19 anos leem mais livros impressos do que qualquer outro grupo.",
      "o tempo total de leitura é igual em todas as faixas etárias.",
      "com o aumento da idade, cresce a leitura de livros impressos e diminui a leitura em telas.",
      "o grupo de 45 anos ou mais lê mais em telas do que em livros impressos.",
      "a leitura em telas aumenta com a idade.",
    ],
    answer: 2,
    why: "Os livros impressos sobem de 2 para 5 horas semanais conforme a idade, e as telas caem de 9 para 3 horas. O grupo de 45 anos ou mais lê mais livros (5 h) do que em telas (3 h), e o tempo total varia: 11, 11, 10 e 8 horas.",
  }),
  e({
    id: "lin-gram-3",
    level: "media",
    passages: [
      {
        label: "Diálogo",
        body: "— Seu Zé, o senhor sabe me dizer se a venda ainda tá aberta?\n— Ói, moço, nóis foi lá ontem e tava funcionando. Só num sei se hoje abriu.\n— Obrigado. Vou até lá ver.",
        source: "Diálogo elaborado para estudo.",
      },
    ],
    text: "No diálogo, a fala de seu Zé apresenta marcas de variação linguística (\"Ói\", \"nóis foi\", \"tava\", \"num sei\"). Do ponto de vista da língua, essas marcas devem ser entendidas como:",
    options: [
      "erros que mostram falta de inteligência do falante.",
      "uma variedade legítima da língua, ligada à região, à escolaridade e à situação de fala, que pode ser julgada pela adequação ao contexto.",
      "uma forma inferior de falar que impede a comunicação.",
      "o único jeito correto de falar português no Brasil.",
      "uma linguagem formal usada em documentos oficiais.",
    ],
    answer: 1,
    why: "Variedades linguísticas refletem região, grupo social, idade e situação. A fala de seu Zé é compreendida pelo interlocutor e adequada à conversa informal. Não existe variedade \"melhor\"; existe a mais adequada a cada contexto (por exemplo, a norma-padrão em textos formais).",
  }),
  e({
    id: "lin-interp-6",
    level: "dificil",
    passages: [
      {
        label: "Crônica",
        body: "Na agência, a senha 147 aguardava, resignada, o painel chegar ao número 112. Ao lado, um cartaz sorridente garantia: \"Sua satisfação é a nossa prioridade\". Duas horas depois, o gerente, solícito, ofereceu-me um copo d'água e um panfleto sobre \"a importância da paciência\". Saí agradecido: afinal, eu nunca havia aprendido tanto sobre a espera.",
        source: "Texto elaborado para estudo.",
      },
    ],
    text: "No último período do texto (\"Saí agradecido: afinal, eu nunca havia aprendido tanto sobre a espera\"), o efeito de sentido decorre do uso de:",
    options: [
      "ironia, que revela uma crítica ao mau atendimento ao simular um agradecimento.",
      "elogio sincero, que reconhece a eficiência da agência.",
      "linguagem científica, que explica o funcionamento do atendimento bancário.",
      "metáfora, que compara o cliente a uma senha numérica.",
      "eufemismo, que suaviza a notícia de que a agência fechou.",
    ],
    answer: 0,
    why: "O narrador diz que saiu \"agradecido\" por ter aprendido sobre a espera, mas o contexto (duas horas de fila, cartaz de \"satisfação\", panfleto sobre paciência) mostra o contrário: ele critica o atendimento. Dizer o oposto do que se pensa, com intenção crítica, é ironia.",
  }),

  // ======================= Redação =======================
  e({
    id: "red-int-3",
    level: "dificil",
    passages: [
      {
        label: "Trecho de uma conclusão",
        body: "\"Portanto, o governo precisa tomar providências para acabar com o problema da desigualdade no acesso à internet. Assim, a sociedade será melhor.\"",
        source: "Trecho elaborado para estudo.",
      },
    ],
    text: "Considerando os critérios de avaliação da redação do ENEM, a competência mais prejudicada por esse trecho de conclusão e o motivo são:",
    options: [
      "Competência 1, pois há muitos desvios de ortografia.",
      "Competência 2, pois o texto não menciona nenhum repertório.",
      "Competência 3, pois a tese está ausente do texto inteiro.",
      "Competência 4, pois não há nenhum conectivo.",
      "Competência 5, pois a proposta é vaga, sem indicar a ação, o meio e o detalhamento da medida.",
    ],
    answer: 4,
    why: "A Competência 5 avalia a proposta de intervenção. O trecho tem agente (\"o governo\"), mas só diz \"tomar providências\" (ação genérica), sem meio ou modo de execução, sem detalhamento e com finalidade vaga (\"a sociedade será melhor\"). Uma boa proposta explicita agente, ação, meio, finalidade e detalhamento.",
  }),
  e({
    id: "red-rep-3",
    level: "media",
    passages: [
      {
        label: "Tema de redação",
        body: "Desafios para a valorização da leitura no Brasil.",
      },
    ],
    text: "Um estudante quer usar um repertório sociocultural na introdução. Qual das opções é a mais adequada, por ser legitimada, pertinente ao tema e produtiva para o argumento?",
    options: [
      "Citar o provérbio \"o saber não ocupa lugar\" sem relacioná-lo ao problema.",
      "Citar a pesquisa Retratos da Leitura no Brasil, do Instituto Pró-Livro, para mostrar que parte da população lê pouco e ligar o dado à falta de acesso a bibliotecas.",
      "Citar a letra de uma música de amor, sem relação com a leitura.",
      "Contar que o primo do autor nunca leu um livro.",
      "Copiar integralmente um trecho do texto motivador, sem alterações.",
    ],
    answer: 1,
    why: "Dados de pesquisas reconhecidas são repertório legitimado. Aqui há pertinência (tratam de leitura) e produtividade (são conectados a um argumento sobre acesso a bibliotecas). Provérbios soltos, anedotas, músicas sem relação e cópia dos textos de apoio não valem como repertório produtivo.",
  }),
  e({
    id: "red-comp-4",
    level: "media",
    passages: [
      {
        label: "Trecho de um desenvolvimento",
        body: "\"As escolas públicas de diversas regiões carecem de laboratórios. ______, muitos estudantes chegam ao ensino superior sem nenhuma experiência de prática experimental.\"",
        source: "Trecho elaborado para estudo.",
      },
    ],
    text: "Para garantir a coesão (Competência 4), a lacuna deve ser preenchida com o conectivo que estabelece relação de:",
    options: [
      "oposição, como em \"Entretanto\".",
      "consequência, como em \"Consequentemente\".",
      "concessão, como em \"Embora\".",
      "exemplificação, como em \"Por exemplo\".",
      "condição, como em \"Caso contrário\".",
    ],
    answer: 1,
    why: "A segunda frase é resultado da primeira: faltam laboratórios, e, por isso, os estudantes não têm prática experimental. A relação é de consequência, expressa por conectivos como \"Consequentemente\", \"Por isso\" e \"Dessa forma\".",
  }),
];
