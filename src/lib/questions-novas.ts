import type { Level, Question } from "./question-types";

/**
 * Questões novas, escritas para crescer o banco (seção 7.2). Ficam aqui com `revisada: false` e
 * NÃO aparecem no app até passarem pela revisão: os alunos resolvem e conferem cada uma, e o
 * professor dá a palavra final. Aprovada, a questão recebe `revisada: true` e entra em QUESTIONS
 * sozinha (veja questions.ts). Corrigir uma questão = editar o texto aqui antes de aprovar.
 *
 * Regras: ids novos no fim (nunca reaproveitar nem mudar um id), cinco alternativas, gabarito e
 * explicação conferidos. Lote 1: Matemática, tópicos de incidência alta, todas as contas checadas.
 * Lista para revisão: docs/revisao-questoes-novas.md.
 */
const nova = (
  id: string,
  level: Level,
  text: string,
  options: string[],
  answer: number,
  why: string,
): Question => ({
  id,
  topicId: id.replace(/-\d+$/, ""),
  level,
  text,
  options,
  answer,
  why,
  revisada: false,
});

export const NEW_QUESTIONS: Question[] = [
  // ---------- Razão, proporção e escala ----------
  nova(
    "mat-razao-5",
    "facil",
    "Em um mapa na escala 1 : 500 000, duas cidades estão a 6 cm de distância. Qual é a distância real entre elas?",
    ["0,3 km", "3 km", "30 km", "300 km", "3 000 km"],
    2,
    "Cada 1 cm no mapa vale 500 000 cm na realidade. 6 × 500 000 = 3 000 000 cm = 30 000 m = 30 km.",
  ),
  nova(
    "mat-razao-6",
    "media",
    "Em uma turma, a razão entre o número de meninas e o de meninos é 3 : 2. Depois que 4 meninos novos entram na turma, a razão passa a ser 1 : 1. Quantos alunos a turma tinha antes da chegada dos novos?",
    ["16", "20", "24", "28", "30"],
    1,
    "Meninas = 3k e meninos = 2k. Com 4 meninos a mais, 3k = 2k + 4, então k = 4. Antes: 12 meninas e 8 meninos, 20 alunos (12 : 8 = 3 : 2; depois, 12 : 12 = 1 : 1).",
  ),
  nova(
    "mat-razao-7",
    "media",
    "A planta de um apartamento está na escala 1 : 50. Na planta, uma sala retangular mede 8 cm por 10 cm. Qual é a área real da sala?",
    ["0,8 m²", "2 m²", "20 m²", "40 m²", "200 m²"],
    2,
    "Converta cada medida antes de multiplicar: 8 cm × 50 = 400 cm = 4 m e 10 cm × 50 = 500 cm = 5 m. Área: 4 × 5 = 20 m². (A escala vale para comprimentos; para áreas, o fator é 50².)",
  ),
  nova(
    "mat-razao-8",
    "media",
    "O rótulo de um suco concentrado indica a diluição de 1 parte de suco para 4 partes de água. Para preparar 3 litros de bebida pronta, quantos mililitros de suco concentrado são necessários?",
    ["500 mL", "600 mL", "750 mL", "800 mL", "1 200 mL"],
    1,
    "1 parte de suco + 4 de água = 5 partes de bebida. 3 L = 3 000 mL; 3 000 ÷ 5 = 600 mL de suco (e 2 400 mL de água). Dividir por 4 (750 mL) esquece que o suco também faz parte do total.",
  ),
  nova(
    "mat-razao-9",
    "media",
    "Um carro percorre 12 km com 1 litro de gasolina, que custa R$ 6,00. Quanto se gasta de combustível em uma viagem de 270 km?",
    ["R$ 112,50", "R$ 120,00", "R$ 135,00", "R$ 145,00", "R$ 162,00"],
    2,
    "Litros usados: 270 ÷ 12 = 22,5 L. Custo: 22,5 × 6 = R$ 135,00.",
  ),
  nova(
    "mat-razao-10",
    "dificil",
    "Três sócios abriram um negócio: A investiu R$ 20 000 por 6 meses, B investiu R$ 30 000 por 4 meses e C investiu R$ 10 000 por 12 meses. O lucro de R$ 36 000 será dividido em partes diretamente proporcionais ao produto do capital pelo tempo. Quanto recebe o sócio B?",
    ["R$ 9 000", "R$ 10 800", "R$ 12 000", "R$ 15 000", "R$ 18 000"],
    2,
    "Capital × tempo: A = 20 000 × 6 = 120 000; B = 30 000 × 4 = 120 000; C = 10 000 × 12 = 120 000. As três partes são iguais, então cada sócio recebe 36 000 ÷ 3 = R$ 12 000. Dividir só pelo capital daria R$ 18 000 a B, ignorando o tempo.",
  ),

  // ---------- Probabilidade e análise combinatória ----------
  nova(
    "mat-prob-7",
    "facil",
    "Uma urna tem 4 bolas vermelhas, 5 azuis e 1 verde, todas iguais ao toque. Sorteando uma bola, qual é a probabilidade de ela ser azul?",
    ["5%", "10%", "25%", "40%", "50%"],
    4,
    "Casos favoráveis: 5 bolas azuis. Casos possíveis: 4 + 5 + 1 = 10 bolas. Probabilidade: 5/10 = 1/2 = 50%.",
  ),
  nova(
    "mat-prob-8",
    "facil",
    "Um dado comum, de seis faces numeradas de 1 a 6, é lançado uma vez. Qual é a probabilidade de sair um número maior que 4?",
    ["1/6", "1/3", "1/2", "2/3", "5/6"],
    1,
    "Números maiores que 4: 5 e 6, ou seja, 2 casos em 6. Probabilidade: 2/6 = 1/3.",
  ),
  nova(
    "mat-prob-9",
    "media",
    "Duas moedas honestas são lançadas ao mesmo tempo. Qual é a probabilidade de sair pelo menos uma cara?",
    ["1/4", "1/3", "1/2", "2/3", "3/4"],
    4,
    'Os resultados igualmente prováveis são (cara, cara), (cara, coroa), (coroa, cara) e (coroa, coroa). Só o último não tem cara: 1 − 1/4 = 3/4. Contar só "0, 1 ou 2 caras" (dando 2/3) erra porque esses três casos não têm a mesma chance.',
  ),
  nova(
    "mat-prob-10",
    "media",
    "De um grupo de 5 alunos, serão escolhidos 2 para representar a turma, sem distinção de cargo. Quantas duplas diferentes podem ser formadas?",
    ["5", "10", "20", "25", "120"],
    1,
    "A ordem não importa (a dupla Ana–Bia é a mesma que Bia–Ana): combinação C(5, 2) = (5 × 4) ÷ 2 = 10. Sem dividir por 2, a conta (20) contaria cada dupla duas vezes.",
  ),

  // ---------- Geometria plana ----------
  nova(
    "mat-geop-7",
    "facil",
    "Um terreno retangular mede 12 m de frente por 25 m de fundo. Qual é a área do terreno?",
    ["37 m²", "74 m²", "150 m²", "300 m²", "600 m²"],
    3,
    "Área do retângulo = base × altura = 12 × 25 = 300 m². (74 m é o perímetro: 2 × 12 + 2 × 25.)",
  ),
  nova(
    "mat-geop-8",
    "facil",
    "Um quadrado tem área de 49 cm². Qual é o seu perímetro?",
    ["7 cm", "14 cm", "28 cm", "49 cm", "196 cm"],
    2,
    "Lado do quadrado: √49 = 7 cm. Perímetro: 4 × 7 = 28 cm.",
  ),
  nova(
    "mat-geop-9",
    "facil",
    "Dois ângulos internos de um triângulo medem 50° e 60°. Quanto mede o terceiro ângulo?",
    ["60°", "70°", "80°", "110°", "250°"],
    1,
    "A soma dos ângulos internos de um triângulo é 180°: 180 − 50 − 60 = 70°.",
  ),
  nova(
    "mat-geop-10",
    "media",
    "Uma escada de 5 m está apoiada em uma parede vertical, com o pé a 3 m da base da parede, sobre um chão plano. A que altura do chão a escada toca a parede?",
    ["2 m", "3 m", "4 m", "5 m", "8 m"],
    2,
    "Parede, chão e escada formam um triângulo retângulo cuja hipotenusa é a escada. Pelo teorema de Pitágoras: h² + 3² = 5², h² = 25 − 9 = 16, h = 4 m.",
  ),

  // ---------- Funções ----------
  nova(
    "mat-func-7",
    "facil",
    "Uma corrida de táxi custa R$ 5,00 de bandeirada mais R$ 3,00 por quilômetro rodado. Quanto custa uma corrida de 8 km?",
    ["R$ 24,00", "R$ 29,00", "R$ 32,00", "R$ 40,00", "R$ 43,00"],
    1,
    "Preço = 5 + 3 × km = 5 + 3 × 8 = 5 + 24 = R$ 29,00. A bandeirada é cobrada uma vez só, não por quilômetro.",
  ),
  nova(
    "mat-func-8",
    "facil",
    "Dada a função f(x) = 2x − 3, qual é o valor de f(5)?",
    ["−1", "2", "7", "10", "13"],
    2,
    "Substitua x por 5: f(5) = 2 × 5 − 3 = 10 − 3 = 7.",
  ),
  nova(
    "mat-func-9",
    "media",
    "O gráfico de uma função do 1º grau passa pelos pontos (0, 4) e (2, 10). Qual é a lei dessa função?",
    ["f(x) = 2x + 4", "f(x) = 3x + 4", "f(x) = 4x + 3", "f(x) = 5x", "f(x) = 6x + 4"],
    1,
    "Em f(x) = ax + b, o ponto (0, 4) dá b = 4. A taxa de variação é a = (10 − 4) ÷ (2 − 0) = 3. Logo f(x) = 3x + 4 (confira: f(2) = 6 + 4 = 10).",
  ),
  nova(
    "mat-func-10",
    "media",
    "A altura de um objeto lançado para cima é dada por h(t) = −5t² + 20t, com h em metros e t em segundos. Qual é a altura máxima atingida?",
    ["10 m", "15 m", "20 m", "25 m", "40 m"],
    2,
    "O máximo está no vértice da parábola: t = −b ÷ (2a) = −20 ÷ (−10) = 2 s. Então h(2) = −5 × 4 + 20 × 2 = −20 + 40 = 20 m.",
  ),

  // ---------- Estatística ----------
  nova(
    "mat-estat-6",
    "facil",
    "As notas de um aluno em seis atividades foram 6, 7, 7, 8, 9 e 5. Qual é a moda dessas notas?",
    ["5", "6", "7", "7,5", "9"],
    2,
    "Moda é o valor que mais se repete. A nota 7 aparece duas vezes; as outras, uma vez cada.",
  ),
  nova(
    "mat-estat-7",
    "facil",
    "Qual é a média aritmética dos números 4, 8, 10 e 14?",
    ["8", "9", "10", "12", "36"],
    1,
    "Some e divida pela quantidade: (4 + 8 + 10 + 14) ÷ 4 = 36 ÷ 4 = 9.",
  ),
  nova(
    "mat-estat-8",
    "media",
    "Qual é a mediana do conjunto de dados 5, 9, 2, 12, 7 e 10?",
    ["7", "7,5", "8", "9", "9,5"],
    2,
    "Primeiro ordene: 2, 5, 7, 9, 10, 12. Com seis valores, a mediana é a média dos dois centrais: (7 + 9) ÷ 2 = 8. Sem ordenar, os do meio seriam 2 e 12; 7,5 é a média, não a mediana.",
  ),
  nova(
    "mat-estat-9",
    "media",
    "A média de um aluno em 5 provas é 6,0. Que nota ele precisa tirar na 6ª prova para que a média das 6 provas seja 6,5?",
    ["6,5", "7,0", "8,0", "9,0", "9,5"],
    3,
    "Soma atual: 5 × 6 = 30. Para média 6,5 em 6 provas, a soma precisa ser 6 × 6,5 = 39. Nota necessária: 39 − 30 = 9,0.",
  ),
  nova(
    "mat-estat-10",
    "dificil",
    "Em uma disciplina, a nota final é a média ponderada da prova (peso 3) e do trabalho (peso 2), e é preciso média 7,0 para passar. As notas têm uma casa decimal. Um aluno tirou 5,0 no trabalho. Qual é a menor nota na prova que garante a aprovação?",
    ["7,0", "8,0", "8,4", "9,0", "10,0"],
    2,
    "Média = (3p + 2 × 5) ÷ 5 ≥ 7, então 3p + 10 ≥ 35 e p ≥ 25/3 ≈ 8,33. Com uma casa decimal, 8,3 dá média 6,98 (reprova) e 8,4 dá 7,04. A menor nota é 8,4. Fazer a média simples (p + 5) ÷ 2 = 7 daria 9,0, ignorando os pesos.",
  ),
];
