import { TOPIC_BY_ID } from "./data";
import type { Level, Question } from "./question-types";
import { ENEM_QUESTIONS } from "./questions-enem";

export type { Question } from "./question-types";

/**
 * Banco de questões. Este arquivo reúne as questões curtas (fáceis e algumas médias); as
 * questões no estilo ENEM, com textos, tabelas e imagens, ficam em questions-enem.ts.
 *
 * Para adicionar questões novas: acrescente uma entrada no FIM de uma das listas com um id inédito
 * ("<id-do-tópico>-<número>"). Nunca reordene nem mude ids antigos: o progresso salvo no
 * navegador usa o id da questão. O app sorteia as novas automaticamente nos próximos dias.
 */
const q = (id: string, text: string, options: string[], answer: number, why: string, level: Level = "facil"): Question => ({
  id,
  topicId: id.replace(/-\d+$/, ""),
  level,
  text,
  options,
  answer,
  why,
});

/** Questões curtas que exigem mais de uma etapa de raciocínio. */
const MEDIA = new Set([
  "mat-porc-1", "mat-regra3-2", "mat-estat-2", "mat-prob-2", "mat-graf-1", "mat-geop-1", "mat-geop-2", "mat-func-2",
  "fis-ener-2", "fis-elet-1", "fis-elet-3", "fis-termo-1", "qui-esteq-1", "qui-sol-2", "bio-gen-3", "bio-eco-3",
  "his-br-2", "geo-geopol-2", "filo-1", "lin-interp-1", "lin-interp-2", "red-int-2", "red-comp-2",
]);

const SHORT_QUESTIONS: Question[] = [
  // ---------- Matemática ----------
  q("mat-porc-1", "Um produto custava R$ 200,00. Ele sofreu um aumento de 20% e, em seguida, um desconto de 20% sobre o novo preço. Qual é o preço final?",
    ["R$ 200,00", "R$ 196,00", "R$ 192,00", "R$ 188,00", "R$ 180,00"], 2,
    "Aumento e desconto sucessivos se multiplicam: 200 × 1,2 × 0,8 = 192. Os 20% não se anulam porque incidem sobre bases diferentes."),
  q("mat-porc-2", "Um trabalhador que ganha R$ 2.500,00 recebeu reajuste de 8%. Qual é o novo salário?",
    ["R$ 2.580,00", "R$ 2.600,00", "R$ 2.650,00", "R$ 2.700,00", "R$ 2.750,00"], 3,
    "8% de 2.500 = 200, então o novo salário é 2.500 + 200 = R$ 2.700,00 (ou 2.500 × 1,08)."),
  q("mat-porc-3", "Uma camisa que custava R$ 80,00 passou a custar R$ 68,00. Qual foi o desconto percentual?",
    ["10%", "12%", "15%", "17%", "20%"], 2,
    "O desconto foi de 80 − 68 = 12 reais. Em relação ao preço original: 12 ÷ 80 = 0,15 = 15%."),

  q("mat-razao-1", "Em um mapa, a escala é 1 : 500.000. Duas cidades estão a 6 cm uma da outra no mapa. Qual é a distância real entre elas?",
    ["3 km", "6 km", "30 km", "60 km", "300 km"], 2,
    "6 cm × 500.000 = 3.000.000 cm = 30.000 m = 30 km."),
  q("mat-razao-2", "Um carro percorreu 150 km gastando 12 litros de combustível. Qual é o consumo médio, em km por litro?",
    ["10", "11", "12", "12,5", "13"], 3,
    "Razão entre distância e combustível: 150 ÷ 12 = 12,5 km/L."),
  q("mat-razao-3", "Uma amostra de 500 g de um material ocupa 250 cm³. Qual é a densidade desse material?",
    ["0,5 g/cm³", "1 g/cm³", "2 g/cm³", "2,5 g/cm³", "250 g/cm³"], 2,
    "Densidade é a razão massa ÷ volume: 500 ÷ 250 = 2 g/cm³."),

  q("mat-regra3-1", "Quatro operários constroem um muro em 12 dias. Mantido o mesmo ritmo, em quantos dias seis operários construiriam o mesmo muro?",
    ["6 dias", "7 dias", "8 dias", "9 dias", "18 dias"], 2,
    "Mais operários, menos dias: grandezas inversamente proporcionais. 4 × 12 = 6 × x, logo x = 8."),
  q("mat-regra3-2", "Três máquinas iguais produzem 180 peças em 2 horas. Quantas peças cinco dessas máquinas produzem em 4 horas?",
    ["300", "400", "500", "600", "900"], 3,
    "Cada máquina faz 180 ÷ (3 × 2) = 30 peças por hora. Então 5 × 4 × 30 = 600."),

  q("mat-estat-1", "As notas de sete alunos foram: 6, 8, 5, 9, 7, 8 e 5. Qual é a mediana dessas notas?",
    ["5", "6", "7", "8", "9"], 2,
    "Em ordem: 5, 5, 6, 7, 8, 8, 9. A mediana é o valor central (4º), que é 7."),
  q("mat-estat-2", "A média de cinco números é 8. Quando um sexto número é incluído, a média passa a ser 9. Qual é o sexto número?",
    ["9", "10", "12", "14", "18"], 3,
    "A soma inicial é 5 × 8 = 40. A nova soma é 6 × 9 = 54. O número incluído é 54 − 40 = 14."),
  q("mat-estat-3", "Em uma pesquisa, os números de irmãos de oito alunos foram: 2, 3, 3, 4, 4, 4, 5, 5. Qual é a moda?",
    ["3", "3,5", "4", "4,5", "5"], 2,
    "Moda é o valor que mais se repete. O 4 aparece três vezes, mais que qualquer outro."),

  q("mat-prob-1", "Ao lançar um dado comum e honesto uma vez, qual é a probabilidade de sair um número maior que 4?",
    ["1/6", "1/3", "1/2", "2/3", "5/6"], 1,
    "Casos favoráveis: 5 e 6 (2 casos). Casos possíveis: 6. Então 2/6 = 1/3."),
  q("mat-prob-2", "Uma moeda honesta é lançada três vezes. Qual é a probabilidade de saírem exatamente duas caras?",
    ["1/8", "1/4", "3/8", "1/2", "5/8"], 2,
    "Há 8 resultados possíveis e 3 com exatamente duas caras (CCK, CKC, KCC). Probabilidade = 3/8."),
  q("mat-prob-3", "De um grupo de 6 pessoas, deseja-se formar uma comissão de 2 membros. Quantas comissões diferentes são possíveis?",
    ["12", "15", "30", "36", "720"], 1,
    "A ordem não importa: C(6,2) = (6 × 5) ÷ 2 = 15."),

  q("mat-graf-1", "A tabela mostra as vendas anuais de uma loja, em milhares de unidades: 2021 = 40; 2022 = 50; 2023 = 45; 2024 = 63. Em qual passagem de um ano para o seguinte houve o maior crescimento percentual?",
    ["De 2021 para 2022", "De 2022 para 2023", "De 2023 para 2024", "As três passagens tiveram crescimento igual", "Em nenhuma passagem houve crescimento"], 2,
    "2021→2022: +25%. 2022→2023: queda de 10%. 2023→2024: 18 ÷ 45 = +40%, o maior."),
  q("mat-graf-2", "Um gráfico de barras mostra a temperatura média mensal de uma cidade: janeiro 30 °C, fevereiro 31 °C, março 29 °C, abril 26 °C, maio 22 °C e junho 19 °C. Qual é a diferença entre a maior e a menor temperatura média?",
    ["9 °C", "10 °C", "11 °C", "12 °C", "13 °C"], 3,
    "Maior valor: 31 °C (fevereiro). Menor valor: 19 °C (junho). Diferença: 31 − 19 = 12 °C."),

  q("mat-geop-1", "De um quadrado de lado 6 cm foi retirado um triângulo retângulo de catetos 6 cm e 4 cm. Qual é a área da figura que sobrou?",
    ["12 cm²", "20 cm²", "24 cm²", "30 cm²", "36 cm²"], 2,
    "Área do quadrado: 36. Área do triângulo: (6 × 4) ÷ 2 = 12. Sobra 36 − 12 = 24 cm²."),
  q("mat-geop-2", "No mesmo instante, um poste de 2 m projeta uma sombra de 3 m e um prédio projeta uma sombra de 45 m. Qual é a altura do prédio?",
    ["25 m", "27 m", "30 m", "35 m", "90 m"], 2,
    "Os triângulos são semelhantes: 2/3 = h/45, então h = 30 m."),
  q("mat-geop-3", "Um terreno tem a forma de um triângulo retângulo com catetos de 6 m e 8 m. Quantos metros de cerca são necessários para contornar todo o terreno?",
    ["14 m", "20 m", "24 m", "28 m", "48 m"], 2,
    "Pelo teorema de Pitágoras, a hipotenusa mede 10 m (6² + 8² = 10²). Perímetro: 6 + 8 + 10 = 24 m."),

  q("mat-geoe-1", "Um reservatório cilíndrico tem raio da base de 5 cm e altura de 10 cm. Adotando π = 3, qual é o seu volume?",
    ["150 cm³", "250 cm³", "500 cm³", "750 cm³", "1.500 cm³"], 3,
    "V = π · r² · h = 3 × 25 × 10 = 750 cm³."),
  q("mat-geoe-2", "Uma caixa-d'água tem formato de paralelepípedo com 2 m de comprimento, 3 m de largura e 1,5 m de altura. Sabendo que 1 m³ equivale a 1.000 litros, qual é a sua capacidade?",
    ["900 L", "6.500 L", "9.000 L", "9.500 L", "90.000 L"], 2,
    "V = 2 × 3 × 1,5 = 9 m³ = 9.000 litros."),

  q("mat-func-1", "Uma corrida de táxi custa uma bandeirada fixa de R$ 5,00 mais R$ 2,00 por quilômetro rodado. Quanto custa uma corrida de 12 km?",
    ["R$ 24,00", "R$ 26,00", "R$ 29,00", "R$ 31,00", "R$ 34,00"], 2,
    "Função do 1º grau: C(x) = 5 + 2x. Para x = 12: 5 + 24 = R$ 29,00."),
  q("mat-func-2", "A altura, em metros, de uma bola lançada para cima é dada por h(t) = −t² + 6t, com t em segundos. Qual é a altura máxima atingida?",
    ["6 m", "8 m", "9 m", "12 m", "18 m"], 2,
    "O máximo está no vértice: t = −b ÷ 2a = 3 s. Então h(3) = −9 + 18 = 9 m."),
  q("mat-func-3", "Uma população de bactérias dobra a cada hora. Se começa com 100 bactérias, quantas haverá após 3 horas?",
    ["300", "400", "600", "800", "1.000"], 3,
    "Crescimento exponencial: 100 × 2³ = 800."),

  // ---------- Física ----------
  q("fis-cine-1", "Um carro percorre 120 km na primeira hora de viagem e mais 60 km nas duas horas seguintes. Qual é a sua velocidade média no percurso total?",
    ["40 km/h", "50 km/h", "60 km/h", "70 km/h", "90 km/h"], 2,
    "Velocidade média = distância total ÷ tempo total = 180 ÷ 3 = 60 km/h (não é a média das velocidades)."),
  q("fis-cine-2", "Um ciclista se move a 72 km/h em linha reta e com velocidade constante. Qual é essa velocidade em m/s?",
    ["10 m/s", "15 m/s", "20 m/s", "36 m/s", "72 m/s"], 2,
    "Para converter km/h em m/s, divida por 3,6: 72 ÷ 3,6 = 20 m/s."),
  q("fis-cine-3", "Um carro parte do repouso com aceleração constante de 2 m/s². Qual é a sua velocidade após 5 s?",
    ["5 m/s", "7 m/s", "10 m/s", "25 m/s", "50 m/s"], 2,
    "v = v₀ + a·t = 0 + 2 × 5 = 10 m/s."),

  q("fis-din-1", "Uma força resultante de 20 N atua sobre um corpo de 4 kg. Qual é a aceleração adquirida por ele?",
    ["2 m/s²", "4 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"], 2,
    "Segunda lei de Newton: a = F ÷ m = 20 ÷ 4 = 5 m/s²."),
  q("fis-din-2", "Uma pessoa empurra uma parede com uma força de 50 N. Segundo a terceira lei de Newton, a parede exerce sobre a pessoa uma força:",
    ["nula, porque a parede está parada", "de 50 N, no mesmo sentido do empurrão", "de 50 N, em sentido oposto ao empurrão", "de 25 N, em sentido oposto ao empurrão", "de 100 N, em sentido oposto ao empurrão"], 2,
    "Ação e reação têm mesmo módulo e sentidos opostos, aplicadas em corpos diferentes."),

  q("fis-ener-1", "Qual é a energia cinética de um corpo de 2 kg que se move com velocidade de 3 m/s?",
    ["3 J", "6 J", "9 J", "12 J", "18 J"], 2,
    "Ec = m·v² ÷ 2 = 2 × 9 ÷ 2 = 9 J."),
  q("fis-ener-2", "Um objeto de 1 kg é solto do repouso de uma altura de 5 m. Desprezando a resistência do ar e adotando g = 10 m/s², com que velocidade ele atinge o solo?",
    ["5 m/s", "10 m/s", "20 m/s", "50 m/s", "100 m/s"], 1,
    "Conservação de energia: m·g·h = m·v² ÷ 2, logo v = √(2·g·h) = √100 = 10 m/s."),
  q("fis-ener-3", "Um motor realiza um trabalho de 6.000 J em 20 s. Qual é a sua potência média?",
    ["30 W", "120 W", "300 W", "600 W", "3.000 W"], 2,
    "Potência = trabalho ÷ tempo = 6.000 ÷ 20 = 300 W."),

  q("fis-elet-1", "Um chuveiro de 5.500 W é usado 30 minutos por dia durante 30 dias. Qual é o consumo de energia elétrica no período?",
    ["27,5 kWh", "55 kWh", "82,5 kWh", "165 kWh", "330 kWh"], 2,
    "Energia = potência × tempo = 5,5 kW × 0,5 h × 30 dias = 82,5 kWh."),
  q("fis-elet-2", "Um resistor de 20 Ω é ligado a uma tomada de 120 V. Qual é a corrente elétrica que passa por ele?",
    ["0,17 A", "6 A", "12 A", "100 A", "2.400 A"], 1,
    "Primeira lei de Ohm: i = U ÷ R = 120 ÷ 20 = 6 A."),
  q("fis-elet-3", "Dois resistores, de 10 Ω e 15 Ω, são ligados em série a uma fonte de 50 V. Qual é a corrente no circuito?",
    ["1 A", "2 A", "5 A", "10 A", "25 A"], 1,
    "Em série as resistências se somam: 25 Ω. Corrente: 50 ÷ 25 = 2 A."),

  q("fis-termo-1", "Qual é a quantidade de calor necessária para aquecer 200 g de água de 20 °C até 70 °C? (calor específico da água: 1 cal/g·°C)",
    ["1.000 cal", "4.000 cal", "10.000 cal", "14.000 cal", "20.000 cal"], 2,
    "Q = m·c·ΔT = 200 × 1 × 50 = 10.000 cal."),
  q("fis-termo-2", "Um bloco de gelo a 0 °C recebe calor e começa a derreter. Durante a fusão, a temperatura da mistura de gelo e água:",
    ["aumenta continuamente", "diminui continuamente", "permanece constante", "oscila entre 0 °C e 100 °C", "torna-se negativa"], 2,
    "Durante a mudança de estado, o calor recebido (calor latente) altera o estado físico, não a temperatura."),

  q("fis-ondas-1", "Uma onda tem frequência de 5 Hz e comprimento de onda de 2 m. Qual é a sua velocidade de propagação?",
    ["0,4 m/s", "3 m/s", "7 m/s", "10 m/s", "25 m/s"], 3,
    "Equação fundamental da ondulatória: v = λ · f = 2 × 5 = 10 m/s."),
  q("fis-ondas-2", "Uma pessoa consegue ouvir uma conversa vinda de um cômodo vizinho mesmo com a porta apenas entreaberta, sem ver os interlocutores. O fenômeno que explica essa situação é a:",
    ["reflexão", "refração", "difração", "polarização", "ressonância"], 2,
    "Difração é o contorno de obstáculos e aberturas pelas ondas, ocorrendo quando o tamanho da abertura é comparável ao comprimento de onda do som."),

  // ---------- Química ----------
  q("qui-esteq-1", "A síntese da água ocorre pela reação 2 H₂ + O₂ → 2 H₂O. Que massa de água se forma a partir de 4 g de H₂? (H = 1; O = 16)",
    ["18 g", "32 g", "36 g", "40 g", "72 g"], 2,
    "4 g de H₂ são 2 mol (M = 2 g/mol). A proporção 2 : 2 gera 2 mol de H₂O, ou 2 × 18 = 36 g."),
  q("qui-esteq-2", "Na combustão do metano, CH₄ + 2 O₂ → CO₂ + 2 H₂O, quantos mols de O₂ são consumidos na queima completa de 2 mol de CH₄?",
    ["2 mol", "3 mol", "4 mol", "6 mol", "8 mol"], 2,
    "A proporção é 1 mol de CH₄ para 2 mol de O₂. Para 2 mol de CH₄ são necessários 4 mol de O₂."),
  q("qui-esteq-3", "A massa molar do CO₂ é 44 g/mol (C = 12; O = 16). Quantos mols de CO₂ há em 88 g dessa substância?",
    ["1 mol", "2 mol", "4 mol", "44 mol", "88 mol"], 1,
    "n = massa ÷ massa molar = 88 ÷ 44 = 2 mol."),

  q("qui-sol-1", "Dissolvendo-se 40 g de NaOH em água até completar 2 L de solução, qual é a concentração comum, em g/L?",
    ["5 g/L", "10 g/L", "20 g/L", "40 g/L", "80 g/L"], 2,
    "C = m ÷ V = 40 g ÷ 2 L = 20 g/L."),
  q("qui-sol-2", "100 mL de uma solução 0,5 mol/L são diluídos com água até o volume de 250 mL. Qual é a nova concentração?",
    ["0,1 mol/L", "0,2 mol/L", "0,25 mol/L", "0,5 mol/L", "1,25 mol/L"], 1,
    "Na diluição a quantidade de soluto se mantém: M₁V₁ = M₂V₂ → 0,5 × 100 = M₂ × 250, logo M₂ = 0,2 mol/L."),
  q("qui-sol-3", "O soro fisiológico contém 0,9 g de sal para cada 100 mL de solução. Quantos gramas de sal há em um frasco de 500 mL?",
    ["0,9 g", "4,5 g", "9 g", "45 g", "450 g"], 1,
    "Regra de três: 0,9 g está para 100 mL assim como x está para 500 mL, então x = 4,5 g."),

  q("qui-termoq-1", "Uma reação química tem variação de entalpia ΔH = −200 kJ. Isso indica que a reação é:",
    ["endotérmica, pois absorve calor", "exotérmica, pois libera calor", "endotérmica, pois ΔH é negativo", "impossível de ocorrer", "isotérmica, pois não troca calor"], 1,
    "ΔH negativo significa que os produtos têm menos energia que os reagentes: o calor é liberado (exotérmica)."),
  q("qui-termoq-2", "A queima de 1 mol de etanol libera cerca de 1.400 kJ. Qual é a energia liberada na queima completa de 2 mol de etanol?",
    ["700 kJ", "1.400 kJ", "2.100 kJ", "2.800 kJ", "5.600 kJ"], 3,
    "A energia é proporcional à quantidade de matéria: 2 × 1.400 = 2.800 kJ."),

  q("qui-org-1", "O etanol (CH₃CH₂OH), usado como combustível, pertence a qual função orgânica?",
    ["Aldeído", "Cetona", "Álcool", "Ácido carboxílico", "Éter"], 2,
    "A hidroxila (–OH) ligada a carbono saturado caracteriza os álcoois."),
  q("qui-org-2", "O vinagre contém ácido acético, CH₃COOH. Que grupo funcional é responsável pelo caráter ácido dessa substância?",
    ["Hidroxila de álcool", "Carbonila de cetona", "Carboxila", "Grupo amino", "Ligação éter"], 2,
    "O grupo –COOH (carboxila) caracteriza os ácidos carboxílicos."),
  q("qui-org-3", "O eteno (C₂H₄), usado no amadurecimento de frutas, é um hidrocarboneto que possui uma ligação dupla entre carbonos. Ele pertence à classe dos:",
    ["alcanos", "alcenos", "alcinos", "aromáticos", "ciclanos"], 1,
    "Hidrocarbonetos de cadeia aberta com uma dupla ligação são alcenos."),

  q("qui-eletroq-1", "Em uma pilha, o eletrodo em que ocorre a oxidação (perda de elétrons) é chamado de:",
    ["cátodo, polo positivo", "ânodo, polo negativo", "cátodo, polo negativo", "ânodo, polo positivo", "ponte salina"], 1,
    "Na pilha, o ânodo é onde ocorre a oxidação e é o polo negativo. O cátodo é onde ocorre a redução."),
  q("qui-eletroq-2", "Na pilha de Daniell (Zn | Cu), o zinco é oxidado e o cobre é reduzido. Nesse sistema, os elétrons fluem pelo fio externo:",
    ["do cobre para o zinco", "do zinco para o cobre", "da ponte salina para o zinco", "do cobre para a ponte salina", "em sentido alternado"], 1,
    "Os elétrons liberados na oxidação do zinco (ânodo) vão pelo fio até o cobre (cátodo), onde ocorre a redução."),

  // ---------- Biologia ----------
  q("bio-eco-1", "Considere a cadeia alimentar: capim → gafanhoto → sapo → cobra. O sapo ocupa, nessa cadeia, o nível trófico de:",
    ["produtor", "consumidor primário", "consumidor secundário", "consumidor terciário", "decompositor"], 2,
    "O capim é produtor, o gafanhoto é consumidor primário e o sapo, que come o gafanhoto, é consumidor secundário."),
  q("bio-eco-2", "O aumento da concentração de gás carbônico na atmosfera, causado principalmente pela queima de combustíveis fósseis e pelo desmatamento, intensifica:",
    ["a camada de ozônio", "o efeito estufa", "a chuva ácida por completo", "a eutrofização", "a inversão térmica"], 1,
    "O CO₂ retém calor na atmosfera e intensifica o efeito estufa, contribuindo para o aquecimento global."),
  q("bio-eco-3", "O despejo de esgoto e de fertilizantes em lagos provoca excesso de nutrientes, proliferação de algas e queda do oxigênio dissolvido, levando à morte de peixes. Esse processo é chamado de:",
    ["bioacumulação", "eutrofização", "magnificação trófica", "inversão térmica", "sucessão primária"], 1,
    "Eutrofização é o enriquecimento excessivo de nutrientes na água, que reduz o oxigênio disponível."),

  q("bio-gen-1", "No cruzamento entre dois indivíduos heterozigotos (Aa × Aa), qual é a probabilidade de nascer um descendente com genótipo aa?",
    ["0", "1/4", "1/2", "3/4", "1"], 1,
    "O quadro de Punnett dá AA, Aa, Aa e aa: a probabilidade de aa é 1/4."),
  q("bio-gen-2", "Um casal sem determinada doença genética tem um filho afetado. Sabendo que a doença é recessiva, qual é o genótipo dos pais?",
    ["AA × AA", "AA × Aa", "Aa × Aa", "aa × aa", "AA × aa"], 2,
    "O filho aa recebeu um alelo a de cada genitor. Como os pais não têm a doença, ambos são Aa (portadores)."),
  q("bio-gen-3", "Um homem de sangue AB e uma mulher de sangue O têm filhos. Quais tipos sanguíneos esses filhos podem ter?",
    ["Apenas A ou B", "Apenas AB ou O", "Apenas O", "Apenas AB", "A, B, AB ou O"], 0,
    "O pai doa Iᴬ ou Iᴮ; a mãe doa i. Os filhos são Iᴬi (tipo A) ou Iᴮi (tipo B)."),

  q("bio-cito-1", "Qual organela celular é responsável pela respiração celular, produzindo a maior parte do ATP da célula?",
    ["Ribossomo", "Lisossomo", "Mitocôndria", "Complexo golgiense", "Vacúolo"], 2,
    "A mitocôndria realiza a respiração celular aeróbica, liberando energia na forma de ATP."),
  q("bio-cito-2", "O tipo de divisão celular que origina gametas, reduzindo à metade o número de cromossomos, é a:",
    ["mitose", "meiose", "fagocitose", "fissão binária", "pinocitose"], 1,
    "A meiose origina quatro células haploides (n), geneticamente diferentes, que formam os gametas."),

  q("bio-fisio-1", "As vacinas protegem contra doenças porque:",
    ["fornecem anticorpos prontos de outro organismo", "estimulam o sistema imunológico a produzir anticorpos e células de memória", "eliminam os agentes infecciosos já presentes no corpo", "substituem as células de defesa por novas", "impedem que o agente infeccioso entre no corpo"], 1,
    "A vacina apresenta o antígeno (inativado ou enfraquecido) sem causar a doença, gerando imunidade ativa e memória imunológica."),
  q("bio-fisio-2", "No sistema digestório humano, a maior parte da absorção dos nutrientes ocorre no:",
    ["estômago", "esôfago", "intestino delgado", "intestino grosso", "fígado"], 2,
    "As vilosidades do intestino delgado ampliam a superfície de absorção dos nutrientes."),

  // ---------- Humanas ----------
  q("his-br-1", "Durante a Era Vargas (1930–1945), foi criada a Consolidação das Leis do Trabalho (CLT), em 1943. Essa medida:",
    ["aboliu a escravidão no país", "reuniu e organizou a legislação trabalhista, ampliando direitos como salário mínimo e férias", "proibiu a criação de sindicatos", "garantiu o voto às mulheres pela primeira vez", "instituiu o regime parlamentarista"], 1,
    "A CLT reuniu leis trabalhistas e marcou a política de regulação das relações de trabalho do período."),
  q("his-br-2", "O Ato Institucional nº 5 (AI-5), de 1968, é um marco da Ditadura Militar brasileira porque:",
    ["restabeleceu eleições diretas para presidente", "restringiu liberdades, ampliou a censura e suspendeu garantias constitucionais", "convocou uma Assembleia Constituinte", "concedeu anistia aos opositores do regime", "extinguiu o Congresso para sempre"], 1,
    "O AI-5 deu poderes extraordinários ao governo e inaugurou o período mais repressivo do regime."),
  q("his-br-3", "A abolição formal da escravidão no Brasil ocorreu com a assinatura da Lei Áurea, em:",
    ["1850", "1871", "1885", "1888", "1889"], 3,
    "Lei Áurea: 13 de maio de 1888. Sem políticas de inclusão, a população negra libertada ficou marginalizada."),

  q("geo-amb-1", "A expansão da fronteira agropecuária e a extração ilegal de madeira estão entre as principais causas do desmatamento em qual bioma brasileiro, cuja floresta tem papel importante na regulação do clima?",
    ["Pampa", "Caatinga", "Amazônia", "Pantanal", "Mata de Araucárias apenas"], 2,
    "O desmatamento na Amazônia está ligado principalmente à pecuária, à agricultura e à exploração ilegal de madeira."),
  q("geo-amb-2", "As chamadas ilhas de calor urbanas, em que o centro da cidade é mais quente que as áreas ao redor, estão relacionadas principalmente a:",
    ["excesso de áreas verdes", "impermeabilização do solo, concentração de edificações e pouca vegetação", "proximidade de grandes florestas", "ventilação intensa entre os prédios", "ausência de atividade humana"], 1,
    "Asfalto e concreto absorvem e retêm calor, e a falta de vegetação reduz o resfriamento natural."),
  q("geo-amb-3", "A Mata Atlântica é um dos biomas mais devastados do Brasil. Uma das razões é que:",
    ["está localizada em regiões de baixa densidade populacional", "ocupa áreas onde se concentra a maior parte da população e das cidades do país", "possui solo impróprio para qualquer uso humano", "foi preservada por completo desde o período colonial", "fica restrita ao interior do Nordeste"], 1,
    "A Mata Atlântica cobria a faixa litorânea onde se instalaram cidades, indústrias e lavouras, sofrendo desmatamento histórico."),

  q("geo-geopol-1", "Os blocos econômicos, como o Mercosul, caracterizam-se por:",
    ["isolar completamente as economias dos países membros", "reduzir barreiras comerciais e promover integração econômica entre os países membros", "unir países apenas por critérios religiosos", "eliminar todas as moedas nacionais", "substituir os governos dos países membros"], 1,
    "Blocos econômicos reduzem tarifas e facilitam a circulação de mercadorias e, em alguns casos, de pessoas e capitais."),
  q("geo-geopol-2", "A Guerra Fria (1947–1991) foi marcada por:",
    ["conflito militar direto e declarado entre Estados Unidos e União Soviética", "disputa de influência entre dois blocos, capitalista e socialista, sem confronto militar direto entre as superpotências", "domínio absoluto da União Soviética sobre a Europa Ocidental", "ausência de corrida armamentista", "unificação política do mundo sob a ONU"], 1,
    "A rivalidade entre EUA e URSS envolveu corrida armamentista, espacial e conflitos indiretos, sem guerra direta entre eles."),

  q("filo-1", "Para Thomas Hobbes, no estado de natureza, sem um poder que imponha ordem, os seres humanos vivem em permanente conflito. Por isso, ele defende:",
    ["a abolição de qualquer governo", "a criação de um Estado forte, a que os indivíduos cedem parte de sua liberdade em troca de segurança", "que a propriedade privada deve ser extinta", "que a natureza humana é essencialmente boa", "o retorno ao estado de natureza"], 1,
    "Em \"Leviatã\", Hobbes sustenta que o contrato social cria um soberano capaz de garantir a paz e evitar a \"guerra de todos contra todos\"."),
  q("filo-2", "Na alegoria da caverna, de Platão, a saída do prisioneiro da caverna em direção à luz simboliza:",
    ["a perda da razão", "a passagem do mundo das aparências (sensível) ao conhecimento verdadeiro (inteligível)", "a vitória sobre inimigos políticos", "o retorno à ignorância", "a rejeição de toda filosofia"], 1,
    "A alegoria representa o processo de saída da ignorância e das opiniões em direção ao conhecimento das ideias."),

  q("socio-1", "Para Émile Durkheim, os \"fatos sociais\" são formas de agir, pensar e sentir que apresentam três características. Quais são elas?",
    ["Individualidade, liberdade e espontaneidade", "Exterioridade, coercitividade e generalidade", "Subjetividade, raridade e mudança", "Hereditariedade, biologia e instinto", "Lucro, concorrência e propriedade"], 1,
    "Os fatos sociais existem fora do indivíduo (exterioridade), exercem pressão sobre ele (coercitividade) e são comuns à coletividade (generalidade)."),
  q("socio-2", "Segundo Karl Marx, a história das sociedades é marcada, sobretudo, pela:",
    ["harmonia permanente entre as classes", "luta de classes", "ausência de conflitos econômicos", "vontade individual dos governantes apenas", "evolução biológica da espécie"], 1,
    "Para Marx, os conflitos entre grupos com interesses opostos (como burguesia e proletariado) impulsionam as transformações históricas."),

  // ---------- Linguagens ----------
  q("lin-interp-1", "\"A cidade que nunca dorme também nunca escuta: todos falam ao mesmo tempo, nas telas, nas ruas, nos corredores, e ninguém espera a vez de ser ouvido.\" A ideia central do trecho é que:",
    ["as cidades grandes são silenciosas", "o excesso de comunicação não garante diálogo, pois falta escuta", "as pessoas dormem pouco por causa do barulho", "os corredores são os locais mais barulhentos", "a tecnologia eliminou a comunicação"], 1,
    "O texto contrapõe o excesso de falas à ausência de escuta: há muita comunicação, mas pouco diálogo."),
  q("lin-interp-2", "\"Pesquisa mostra que 7 em cada 10 jovens usam o celular até pegar no sono. Especialistas alertam que o hábito prejudica o descanso, mas ressaltam que o problema não é a tecnologia em si, e sim o horário de uso.\" Segundo o texto, os especialistas consideram que:",
    ["o celular deve ser abolido", "a tecnologia é a única culpada pela perda de sono", "o prejuízo está no uso do aparelho em horários inadequados", "os jovens não sofrem efeito algum", "o sono não depende de hábitos"], 2,
    "O trecho \"não é a tecnologia em si, e sim o horário de uso\" localiza o problema no horário, não no aparelho."),
  q("lin-interp-3", "\"A biblioteca do bairro, que fechava às 17h, passou a abrir também aos sábados, e a frequência de crianças triplicou.\" O que se pode inferir do trecho?",
    ["A biblioteca deixou de funcionar à tarde", "A ampliação do horário de funcionamento favoreceu a frequência de crianças", "As crianças preferem frequentar a biblioteca à noite", "A biblioteca fechou aos domingos", "A frequência diminuiu depois da mudança"], 1,
    "O texto associa a abertura aos sábados ao aumento da frequência infantil: a ampliação do horário teve efeito positivo."),

  q("lin-gen-1", "\"Misture a farinha com o açúcar. Acrescente os ovos aos poucos e mexa até obter massa homogênea. Leve ao forno por 40 minutos.\" A predominância de verbos no imperativo mostra que a função principal desse texto é:",
    ["narrar um acontecimento", "instruir o leitor sobre como realizar uma tarefa", "expressar sentimentos do autor", "convencer o leitor a mudar de opinião", "descrever um ambiente"], 1,
    "Verbos no imperativo e sequência de passos caracterizam textos instrucionais, como as receitas."),
  q("lin-gen-2", "O gênero textual cujo objetivo principal é defender um ponto de vista com argumentos, buscando convencer o leitor, é o(a):",
    ["notícia", "bula de remédio", "artigo de opinião", "receita culinária", "relatório técnico de manutenção"], 2,
    "O artigo de opinião apresenta tese e argumentos, com o propósito de persuadir."),
  q("lin-gen-3", "Em um aviso afixado em um condomínio lê-se: \"Prezados moradores, informamos que a água será interrompida no sábado, das 8h às 12h, para manutenção da caixa-d'água.\" Qual é a função principal do texto?",
    ["Divertir o leitor", "Informar os moradores sobre um fato que lhes afeta", "Pedir votos para uma eleição", "Contar uma história fictícia", "Criticar a administração"], 1,
    "O aviso comunica um fato (interrupção da água, dia e horário), cumprindo função informativa."),

  q("lin-fig-1", "Em \"Meu quarto é um forno em dezembro\", a figura de linguagem empregada é:",
    ["metonímia", "ironia", "metáfora", "eufemismo", "antítese"], 2,
    "Há comparação implícita, sem conectivo: o quarto é identificado ao forno para indicar calor intenso."),
  q("lin-fig-2", "Alguém comenta, sob chuva forte, no dia do piquenique: \"Que ótimo! Choveu justo hoje.\" A expressão \"Que ótimo!\" exprime:",
    ["hipérbole", "ironia", "eufemismo", "pleonasmo", "antítese"], 1,
    "Na ironia, diz-se o contrário do que se pensa: \"ótimo\" expressa, na verdade, contrariedade."),
  q("lin-fig-3", "Na frase \"Li Machado de Assis durante as férias\", ocorre metonímia porque:",
    ["o autor foi usado no lugar de suas obras", "há comparação com conectivo", "o sentido é o oposto do literal", "ideias opostas aparecem juntas", "o sentido é exagerado propositalmente"], 0,
    "Metonímia é a substituição de um termo por outro com relação de proximidade; aqui, o autor é usado pela obra."),

  q("lin-gram-1", "Em uma entrevista de emprego, o candidato escolhe palavras e construções formais, e em uma conversa com amigos usa gírias. Essa adaptação da linguagem ao contexto é chamada de:",
    ["erro gramatical", "adequação linguística", "plágio", "neologismo", "arcaísmo"], 1,
    "Variação linguística: o falante ajusta registro e vocabulário à situação de comunicação e ao interlocutor."),
  q("lin-gram-2", "Em \"Vamos comer, Pedro\", a vírgula é usada para separar:",
    ["um aposto", "um vocativo", "um adjunto adverbial deslocado", "uma oração subordinada", "o sujeito do verbo"], 1,
    "Pedro é o interlocutor chamado, isto é, vocativo. Sem vírgula (\"Vamos comer Pedro\"), o sentido muda totalmente."),

  // ---------- Redação ----------
  q("red-estr-1", "Em uma redação dissertativo-argumentativa nos moldes do ENEM, a tese (ponto de vista do autor) deve ser apresentada, preferencialmente:",
    ["na conclusão apenas", "na introdução", "no título, sem ser retomada", "somente no último parágrafo", "no meio do segundo desenvolvimento"], 1,
    "A introdução contextualiza o tema e apresenta a tese, que será defendida nos parágrafos de desenvolvimento."),
  q("red-estr-2", "A estrutura mais recomendada para a redação do ENEM, com cerca de 30 linhas, é:",
    ["um parágrafo único", "introdução, dois parágrafos de desenvolvimento e conclusão", "apenas dois parágrafos", "oito parágrafos curtos", "uma lista de tópicos"], 1,
    "O modelo mais seguro é: introdução + dois desenvolvimentos (argumentos) + conclusão com proposta de intervenção."),
  q("red-estr-3", "O texto \"dissertativo-argumentativo\" exigido no ENEM caracteriza-se por:",
    ["narrar uma história com personagens", "defender uma tese com argumentos, em linguagem formal", "descrever uma cena com adjetivos", "dar instruções sobre como fazer algo", "reproduzir fielmente os textos motivadores"], 1,
    "É o texto em que se defende uma ideia com argumentos organizados, em norma-padrão e impessoalidade."),

  q("red-comp-1", "A Competência 5 da redação do ENEM avalia:",
    ["o domínio da norma-padrão", "a compreensão do tema", "a coesão entre as partes do texto", "a elaboração de uma proposta de intervenção que respeite os direitos humanos", "a organização das ideias em até cinco parágrafos"], 3,
    "C1: norma-padrão. C2: tema e tipo textual. C3: argumentação. C4: coesão. C5: proposta de intervenção respeitando direitos humanos."),
  q("red-comp-2", "Qual das situações leva a redação do ENEM à nota zero?",
    ["Um erro de vírgula isolado", "Ausência de título", "Fuga total ao tema", "Uso de repertório sociocultural pouco conhecido", "Mais de 25 linhas escritas"], 2,
    "Fuga total ao tema resulta em nota zero, assim como texto com até 7 linhas e texto que não seja dissertativo-argumentativo."),
  q("red-comp-3", "A Competência 4 avalia o uso dos mecanismos linguísticos que garantem a articulação das partes do texto. Entre eles estão:",
    ["conjunções e outros conectivos", "o tamanho da letra", "a quantidade de adjetivos", "o uso de gírias", "o número de citações"], 0,
    "Coesão depende de conectivos, pronomes, repetições e outros recursos que ligam frases e parágrafos."),

  q("red-rep-1", "Para valer pontos na Competência 2, o repertório sociocultural deve ser:",
    ["qualquer citação, ainda que não tenha relação com o tema", "legitimado, pertinente ao tema e usado de forma produtiva no argumento", "copiado dos textos motivadores sem alteração", "sempre uma frase famosa de autor estrangeiro", "baseado em boatos de redes sociais"], 1,
    "O repertório precisa ser confiável (legitimado), relacionado ao tema (pertinente) e integrado à argumentação (produtivo)."),
  q("red-rep-2", "Para um tema sobre desigualdade social, qual das opções abaixo é um repertório sociocultural legitimado?",
    ["Uma opinião de um conhecido, sem fonte", "Dados do IBGE sobre a distribuição de renda no Brasil", "Um boato de aplicativo de mensagens", "A frase \"todo mundo sabe que é assim\"", "Um trecho copiado integralmente da prova"], 1,
    "Dados de órgãos oficiais, obras, leis e filósofos são repertórios legitimados; boatos e opiniões sem fonte, não."),

  q("red-int-1", "Qual das opções NÃO é um dos elementos esperados em uma proposta de intervenção completa no ENEM?",
    ["Agente", "Ação", "Finalidade", "Citação de um filósofo famoso", "Meio ou modo de execução"], 3,
    "Os elementos são: agente, ação, meio/modo, finalidade e detalhamento. A citação de repertório pertence à argumentação."),
  q("red-int-2", "Qual das propostas de intervenção abaixo está mais completa?",
    ["\"O governo deve resolver o problema.\"", "\"É preciso que todos pensem melhor sobre o assunto.\"", "\"O Ministério da Educação deve ampliar bibliotecas públicas, por meio de verbas federais, a fim de ampliar o acesso à leitura.\"", "\"Algo precisa ser feito urgentemente.\"", "\"A sociedade tem de mudar.\""], 2,
    "Só a proposta do Ministério da Educação traz agente, ação (ampliar bibliotecas), meio (verbas federais) e finalidade (ampliar o acesso à leitura)."),
];

export const QUESTIONS: Question[] = [
  ...SHORT_QUESTIONS.map((x) => (MEDIA.has(x.id) ? { ...x, level: "media" as const } : x)),
  ...ENEM_QUESTIONS,
];

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((x) => [x.id, x])) as Record<string, Question>;

/** Matéria (Matemática, Física, ...) de uma questão, usada nos registros de desempenho. */
export const questionSubject = (question: Question) => TOPIC_BY_ID[question.topicId]?.subject ?? "";
