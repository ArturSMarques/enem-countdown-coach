import type { TopicContent } from "./types";

export const CONTENT_MAT: TopicContent[] = [
  {
    topicId: "mat-razao",
    resumo: [
      "Razão compara duas grandezas por divisão (a/b); proporção é a igualdade entre duas razões.",
      "Escala = medida no desenho ÷ medida real, nas MESMAS unidades. 1 : 50.000 significa 1 cm para 50.000 cm (500 m).",
      "Diretamente proporcionais: uma dobra, a outra dobra. Inversamente: uma dobra, a outra cai pela metade.",
      "Divisão proporcional: some os pesos e reparta o total na proporção de cada peso.",
    ],
    base: {
      texto: [
        "Uma razão é uma comparação por divisão. Muitas grandezas do dia a dia são razões com unidade: velocidade (km/h), densidade (g/cm³), consumo (km/L), densidade demográfica (habitantes/km²), preço por unidade (R$/kg).",
        "A escala de um mapa ou planta também é uma razão: quanto do desenho corresponde a quanto da realidade. Como as duas medidas precisam estar na mesma unidade, 1 : 250.000 quer dizer que 1 cm no mapa vale 250.000 cm = 2.500 m = 2,5 km no terreno.",
      ],
      formulas: [
        { expr: "escala = medida no desenho ÷ medida real", legenda: "as duas na mesma unidade" },
        { expr: "v = Δs ÷ Δt   ·   d = m ÷ V", legenda: "velocidade média e densidade são razões" },
        { expr: "densidade demográfica = habitantes ÷ área", legenda: "em hab/km²" },
      ],
      exemplos: [
        {
          enunciado:
            "Em um mapa de escala 1 : 250.000, duas cidades estão a 4 cm uma da outra. Qual é a distância real?",
          passos: ["4 cm × 250.000 = 1.000.000 cm.", "1.000.000 cm = 10.000 m = 10 km."],
          resposta: "10 km.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Para saber se duas grandezas são direta ou inversamente proporcionais, imagine dobrar uma delas e veja o que acontece com a outra. Mais trabalhadores no mesmo ritmo terminam a obra em menos dias: inversa. Mais horas trabalhadas, mais peças: direta.",
        "Na divisão proporcional, cada parte recebe uma fração do total igual ao seu peso dividido pela soma dos pesos. Se a divisão depende de duas coisas ao mesmo tempo (por exemplo, valor investido e tempo de investimento), o peso é o produto delas.",
        "Escala de área não é igual à escala de comprimento: se a escala linear é 1 : k, as áreas ficam na razão 1 : k², e os volumes, 1 : k³.",
      ],
      exemplos: [
        {
          titulo: "Divisão proporcional a valor e tempo",
          enunciado:
            "Dois sócios dividem um lucro de R$ 15.000,00 em partes proporcionais ao valor investido e ao tempo de investimento. A investiu R$ 4.000,00 por 6 meses e B, R$ 3.000,00 por 12 meses. Quanto recebe cada um?",
          passos: [
            "Pesos: A = 4.000 × 6 = 24.000; B = 3.000 × 12 = 36.000. Soma = 60.000.",
            "A recebe 15.000 × 24.000/60.000 = 6.000; B recebe 15.000 × 36.000/60.000 = 9.000.",
          ],
          resposta:
            "A: R$ 6.000,00; B: R$ 9.000,00. Quem investiu menos dinheiro recebe mais, porque deixou o dinheiro o dobro do tempo.",
        },
        {
          titulo: "Escala de área",
          enunciado:
            "Uma maquete está na escala 1 : 200. Um salão tem 400 m² de área real. Qual é a área desse salão na maquete, em cm²?",
          passos: [
            "A razão entre as áreas é 1 : 200² = 1 : 40.000.",
            "400 m² ÷ 40.000 = 0,01 m².",
            "1 m² = 10.000 cm², então 0,01 m² = 100 cm².",
          ],
          resposta: "100 cm² (e não 2 cm², que seria dividir só por 200).",
        },
      ],
    },
    avancado: {
      texto: [
        "As questões difíceis escondem a razão dentro de uma comparação de opções: qual carro gasta menos, qual plano é mais barato, qual embalagem tem melhor preço por unidade. O caminho é calcular a mesma razão para todas as opções, na mesma unidade, e só então comparar.",
        "Quando há mais de uma condição (trechos de cidade e de estrada, por exemplo), calcule cada parte separadamente e some; a média das razões quase nunca é a resposta.",
      ],
      exemplos: [
        {
          titulo: "Comparação com dois regimes",
          enunciado:
            "O carro A consome 15 kWh a cada 100 km na cidade e 12 kWh a cada 100 km na estrada. O carro B consome 13 kWh/100 km na cidade e 14 kWh/100 km na estrada. Em um ano, o dono vai rodar 1.200 km na cidade e 1.800 km na estrada. Qual carro consome menos energia?",
          table: {
            head: ["Carro", "Cidade (kWh/100 km)", "Estrada (kWh/100 km)"],
            rows: [
              ["A", "15", "12"],
              ["B", "13", "14"],
            ],
          },
          passos: [
            "Carro A: cidade 12 × 15 = 180 kWh; estrada 18 × 12 = 216 kWh; total 396 kWh.",
            "Carro B: cidade 12 × 13 = 156 kWh; estrada 18 × 14 = 252 kWh; total 408 kWh.",
            "Como o percurso tem mais estrada, o carro mais econômico na estrada leva vantagem, mesmo gastando mais na cidade.",
          ],
          resposta:
            "O carro A (396 kWh contra 408 kWh). Escolher pela média simples (13,5 contra 13,5) daria empate e não responde à questão.",
        },
        {
          titulo: "Área real a partir do mapa",
          enunciado:
            "Em um mapa de escala 1 : 50.000, um parque ocupa 6 cm². Qual é a área real do parque, em km²?",
          passos: [
            "Área real = 6 × 50.000² cm² = 6 × 2.500.000.000 cm² = 15.000.000.000 cm².",
            "1 km² = 10¹⁰ cm², então a área é 1,5 km².",
          ],
          resposta: "1,5 km².",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar a escala com unidades diferentes (cm no mapa, km no terreno) sem converter.",
        comoEvitar: "Converta as duas medidas para a mesma unidade antes de dividir.",
      },
      {
        erro: "Aplicar a escala linear diretamente a áreas ou volumes.",
        comoEvitar: "Área usa k², volume usa k³.",
      },
      {
        erro: "Tratar grandezas inversas como diretas.",
        comoEvitar: "Pergunte: se uma dobra, a outra dobra ou cai pela metade?",
      },
      {
        erro: "Fazer a média das razões quando os trechos têm tamanhos diferentes.",
        comoEvitar: "Calcule o total de cada parte e some; depois compare.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Em uma planta de escala 1 : 20.000, uma avenida mede 7,5 cm. Qual é o comprimento real, em metros?",
        resposta: 1500,
        tolerancia: 0.5,
        unidade: "m",
        explicacao: "7,5 × 20.000 = 150.000 cm = 1.500 m.",
      },
      {
        tipo: "numero",
        pergunta:
          "Um município tem 120.000 habitantes em 300 km². Qual é a densidade demográfica, em hab/km²?",
        resposta: 400,
        tolerancia: 0.5,
        unidade: "hab/km²",
        explicacao: "120.000 ÷ 300 = 400 habitantes por km².",
      },
      {
        tipo: "opcoes",
        pergunta:
          "Uma torneira enche um tanque em 6 horas. Abrindo três torneiras iguais, o tempo para encher o mesmo tanque será:",
        opcoes: ["18 horas", "6 horas", "2 horas", "3 horas"],
        resposta: 2,
        explicacao:
          "Número de torneiras e tempo são inversamente proporcionais: o triplo de torneiras leva um terço do tempo, 6 ÷ 3 = 2 horas.",
      },
    ],
    conexoes: ["mat-regra3", "mat-medidas", "mat-porc", "geo-carto"],
  },
  {
    topicId: "mat-prob",
    resumo: [
      "Probabilidade = casos favoráveis ÷ casos possíveis (quando todos são igualmente prováveis).",
      '"E" (os dois acontecem) multiplica; "ou" soma, descontando o que foi contado duas vezes.',
      '"Pelo menos um" quase sempre é 1 menos a probabilidade de nenhum.',
      "Contagem: se a ordem importa, é arranjo/permutação; se não importa, é combinação.",
    ],
    base: {
      texto: [
        "Probabilidade mede a chance de um evento entre resultados igualmente prováveis. Ao lançar um dado honesto, cada face tem chance 1/6; sair número par tem chance 3/6 = 1/2.",
        "O princípio multiplicativo conta possibilidades em etapas: se uma escolha tem m opções e a seguinte tem n, as duas juntas têm m × n. Uma senha de 4 dígitos, de 0 a 9, tem 10 × 10 × 10 × 10 = 10.000 possibilidades.",
      ],
      formulas: [
        { expr: "P(A) = n(A) ÷ n(Ω)", legenda: "favoráveis ÷ possíveis" },
        { expr: "P(não A) = 1 − P(A)", legenda: "evento complementar" },
        { expr: "Pₙ = n!   ·   C(n, k) = n! ÷ [k!(n − k)!]", legenda: "permutação e combinação" },
      ],
      exemplos: [
        {
          enunciado:
            "Uma urna tem 3 bolas vermelhas e 7 azuis. Qual é a probabilidade de sortear uma vermelha?",
          passos: ["Favoráveis: 3. Possíveis: 10.", "P = 3/10 = 30%."],
          resposta: "3/10.",
        },
      ],
    },
    intermediario: {
      texto: [
        "A pergunta-chave da contagem é: trocar a ordem gera um resultado diferente? Em uma senha ou em cargos (presidente, vice), sim: use o princípio multiplicativo ou arranjo. Em comissões, grupos ou sorteios de pessoas sem função, não: use combinação.",
        'Para "pelo menos um", contar todos os casos favoráveis é trabalhoso. Calcule o contrário (nenhum) e subtraia de 1, ou do total.',
        "Eventos independentes (um não muda a chance do outro) multiplicam suas probabilidades.",
      ],
      formulas: [
        {
          expr: "P(A ou B) = P(A) + P(B) − P(A e B)",
          legenda: "soma sem contar a interseção duas vezes",
        },
      ],
      exemplos: [
        {
          titulo: "Pelo menos uma mulher",
          enunciado:
            "De um grupo de 5 homens e 4 mulheres, quantas comissões de 3 pessoas têm pelo menos uma mulher?",
          passos: [
            "Total de comissões: C(9, 3) = 84.",
            "Comissões sem nenhuma mulher (só homens): C(5, 3) = 10.",
            "Com pelo menos uma mulher: 84 − 10 = 74.",
          ],
          resposta: "74 comissões.",
        },
        {
          titulo: "Complementar com eventos independentes",
          enunciado: "Lançando um dado três vezes, qual é a probabilidade de sair pelo menos um 6?",
          passos: [
            "Chance de não sair 6 em um lançamento: 5/6.",
            "Nenhum 6 nos três lançamentos: (5/6)³ = 125/216.",
            "Pelo menos um 6: 1 − 125/216 = 91/216 ≈ 42%.",
          ],
          resposta: "91/216 (cerca de 42%), e não 3 × 1/6 = 50%.",
        },
      ],
    },
    avancado: {
      texto: [
        'As questões difíceis combinam várias ideias: sorteio sem reposição (o denominador diminui a cada retirada), probabilidade condicional ("sabendo que...", o universo encolhe), probabilidade geométrica (razão entre áreas) e contagens com restrição (elementos que devem ficar juntos viram um bloco; letras repetidas dividem pelas permutações delas).',
        'Na condicional, monte uma tabela com os grupos: a pergunta "qual a chance de ser X, sabendo que é Y" usa apenas a linha ou coluna de Y como total.',
      ],
      formulas: [
        { expr: "P(A | B) = P(A e B) ÷ P(B)", legenda: "probabilidade de A sabendo que B ocorreu" },
        {
          expr: "anagramas com repetição = n! ÷ (a! · b! · ...)",
          legenda: "a, b: quantas vezes cada letra se repete",
        },
      ],
      exemplos: [
        {
          titulo: "Condicional com tabela",
          enunciado:
            "Em uma escola, 200 alunos foram acompanhados no inverno. Dos 120 vacinados contra a gripe, 10 tiveram gripe; dos 80 não vacinados, 20 tiveram gripe. Sorteando um aluno que teve gripe, qual é a probabilidade de ele ser vacinado?",
          table: {
            head: ["", "Teve gripe", "Não teve", "Total"],
            rows: [
              ["Vacinados", "10", "110", "120"],
              ["Não vacinados", "20", "60", "80"],
            ],
          },
          passos: [
            "O universo agora é só quem teve gripe: 10 + 20 = 30 alunos.",
            "Desses, 10 são vacinados: 10/30 = 1/3.",
          ],
          resposta:
            "1/3. Isso não quer dizer que a vacina não funciona: entre os vacinados, só 10/120 ≈ 8% tiveram gripe, contra 20/80 = 25% dos não vacinados.",
        },
        {
          titulo: "Probabilidade geométrica",
          enunciado:
            "Um alvo quadrado de 20 cm de lado tem um círculo inscrito de raio 10 cm. Um dardo atinge o quadrado em um ponto ao acaso. Qual é a probabilidade de atingir o círculo? (π = 3)",
          passos: [
            "Área do círculo: 3 × 10² = 300 cm². Área do quadrado: 400 cm².",
            "P = 300/400 = 0,75.",
          ],
          resposta: "75%.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Contar ordem quando ela não importa (ou ignorar quando importa).",
        comoEvitar: "Troque dois elementos de lugar: se o resultado muda, a ordem importa.",
      },
      {
        erro: 'Somar probabilidades de "ou" sem tirar a interseção.',
        comoEvitar: "Use P(A ou B) = P(A) + P(B) − P(A e B).",
      },
      {
        erro: "Esquecer que, sem reposição, o total diminui a cada retirada.",
        comoEvitar: "Escreva cada fração com o total do momento: 4/10, depois 3/9...",
      },
      {
        erro: 'Calcular "pelo menos um" multiplicando a chance de um evento pelo número de tentativas.',
        comoEvitar: "Faça 1 − P(nenhum).",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "De um grupo de 6 pessoas, quantas duplas diferentes podem ser formadas?",
        resposta: 15,
        unidade: "duplas",
        explicacao: "A ordem não importa: C(6, 2) = 6 × 5 ÷ 2 = 15.",
      },
      {
        tipo: "numero",
        pergunta:
          "Lançando uma moeda honesta 3 vezes, qual é a probabilidade de sair pelo menos uma cara? Responda em decimal.",
        resposta: 0.875,
        tolerancia: 0.001,
        explicacao: "Nenhuma cara: (1/2)³ = 1/8. Pelo menos uma: 1 − 1/8 = 7/8 = 0,875.",
      },
      {
        tipo: "opcoes",
        pergunta:
          "Para eleger presidente, vice e tesoureiro entre 10 pessoas, a contagem correta é:",
        opcoes: ["C(10, 3) = 120", "10 × 9 × 8 = 720", "10³ = 1.000", "3! = 6"],
        resposta: 1,
        explicacao:
          "Os cargos são diferentes, então a ordem importa e não há repetição de pessoas: 10 × 9 × 8 = 720.",
      },
    ],
    conexoes: ["mat-estat", "mat-geop", "bio-gen"],
  },
  {
    topicId: "mat-geop",
    resumo: [
      "Áreas: retângulo b·h; triângulo b·h/2; trapézio (B + b)·h/2; círculo πr². Circunferência: 2πr.",
      "Pitágoras: a² = b² + c² no triângulo retângulo (a é a hipotenusa).",
      "Figuras semelhantes: lados na razão k, áreas na razão k².",
      "Figuras compostas: divida em partes conhecidas, ou calcule o todo e subtraia o que falta.",
    ],
    base: {
      texto: [
        "Perímetro é o contorno (comprimento); área é a superfície ocupada. Uma cerca usa perímetro; um piso usa área. Lembre que 1 m² = 10.000 cm².",
        "O teorema de Pitágoras vale em qualquer triângulo retângulo e aparece em diagonais de telas, rampas, escadas e distâncias. Triângulos 3-4-5 (e múltiplos, como 6-8-10) e 5-12-13 são muito usados.",
      ],
      formulas: [
        { expr: "A_trapézio = (B + b) · h ÷ 2", legenda: "B e b são as bases paralelas" },
        {
          expr: "A_círculo = π · r²   ·   C = 2 · π · r",
          legenda: "r é o raio (metade do diâmetro)",
        },
        { expr: "A_triângulo equilátero = l² · √3 ÷ 4", legenda: "l é o lado" },
      ],
      exemplos: [
        {
          enunciado:
            "Um terreno tem formato de trapézio com bases de 20 m e 30 m e altura de 12 m. Qual é a sua área?",
          passos: ["(20 + 30) × 12 ÷ 2 = 50 × 6 = 300."],
          resposta: "300 m².",
        },
      ],
    },
    intermediario: {
      texto: [
        "Em figuras compostas, a escolha da decomposição faz diferença: às vezes é mais rápido calcular o retângulo que envolve tudo e subtrair os recortes.",
        "Polígonos regulares podem ser divididos em triângulos: o hexágono regular é formado por 6 triângulos equiláteros. A soma dos ângulos internos de um polígono de n lados é (n − 2) · 180°.",
        "Semelhança aparece em sombras, fotos ampliadas e plantas: se os lados dobram, a área quadruplica.",
      ],
      exemplos: [
        {
          titulo: "Hexágono regular",
          enunciado: "Qual é a área de um hexágono regular de 2 m de lado? (√3 ≈ 1,73)",
          passos: [
            "Cada triângulo equilátero tem área 2² × √3 ÷ 4 = √3.",
            "Hexágono: 6√3 ≈ 6 × 1,73 = 10,38 m².",
          ],
          resposta: "Aproximadamente 10,4 m².",
        },
      ],
    },
    avancado: {
      texto: [
        "Otimização: com o mesmo perímetro, quanto mais lados um polígono regular tem, maior a área (o círculo é o máximo). Entre retângulos de mesmo perímetro, o quadrado tem a maior área.",
        "Comprimentos de rodas e correias: cada volta completa de uma roda percorre o comprimento da circunferência (2πr). Em correias entre polias, somam-se trechos retos e arcos.",
      ],
      exemplos: [
        {
          titulo: "Maior área com a mesma cerca",
          enunciado:
            "Com 24 m de cerca, um jardineiro pode fazer um jardim com forma de triângulo equilátero, quadrado ou hexágono regular. Qual tem maior área? (√3 ≈ 1,7)",
          passos: [
            "Triângulo: lado 8 m; área 64 × √3 ÷ 4 = 16√3 ≈ 27,2 m².",
            "Quadrado: lado 6 m; área 36 m².",
            "Hexágono: lado 4 m; 6 triângulos de área 16√3 ÷ 4 = 4√3; total 24√3 ≈ 40,8 m².",
          ],
          resposta: "O hexágono (cerca de 40,8 m²).",
        },
        {
          titulo: "Voltas de uma roda",
          enunciado:
            "Uma roda com 0,6 m de diâmetro percorre 3.600 m sem deslizar. Quantas voltas completas ela dá? (π = 3)",
          passos: [
            "Comprimento de uma volta: π × d = 3 × 0,6 = 1,8 m.",
            "3.600 ÷ 1,8 = 2.000 voltas.",
          ],
          resposta: "2.000 voltas.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar o diâmetro no lugar do raio em πr².",
        comoEvitar: "Raio é metade do diâmetro. Circule a palavra que o enunciado usa.",
      },
      {
        erro: "Esquecer de dividir por 2 na área do triângulo.",
        comoEvitar: "Triângulo é meio retângulo: b · h ÷ 2.",
      },
      {
        erro: "Achar que dobrar o lado dobra a área.",
        comoEvitar: "Área cresce com o quadrado: lado ×2, área ×4.",
      },
      { erro: "Misturar m² e cm².", comoEvitar: "1 m² = 100 cm × 100 cm = 10.000 cm²." },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Qual é a área de um círculo de raio 5 cm? (π = 3)",
        resposta: 75,
        unidade: "cm²",
        explicacao: "3 × 5² = 75 cm².",
      },
      {
        tipo: "numero",
        pergunta: "Um triângulo retângulo tem catetos de 5 m e 12 m. Quanto mede a hipotenusa?",
        resposta: 13,
        unidade: "m",
        explicacao: "5² + 12² = 25 + 144 = 169; √169 = 13.",
      },
      {
        tipo: "opcoes",
        pergunta: "Se os lados de um quadrado triplicam, a área:",
        opcoes: ["triplica", "fica 6 vezes maior", "fica 9 vezes maior", "não muda"],
        resposta: 2,
        explicacao: "Área cresce com o quadrado da razão de semelhança: 3² = 9.",
      },
    ],
    conexoes: ["mat-geoe", "mat-razao", "mat-trig"],
  },
  {
    topicId: "mat-func",
    resumo: [
      "Função afim f(x) = ax + b: a é a taxa de variação (inclinação); b é o valor inicial.",
      "Função quadrática: gráfico em parábola; o vértice dá o máximo ou o mínimo.",
      "Exponencial: cresce (ou decresce) multiplicando sempre pelo mesmo fator: f(t) = a · bᵗ.",
      "Logaritmo é o expoente: log_b(x) = y significa bʸ = x.",
    ],
    base: {
      texto: [
        "Uma função associa a cada valor de entrada um único valor de saída. No ENEM, ela quase sempre modela uma situação: custo de uma corrida, lucro de uma empresa, altura de um objeto, população ao longo do tempo.",
        "Na função afim, o valor fixo (b) é o que se paga mesmo com x = 0, e a (a taxa) é quanto se acrescenta por unidade. O gráfico é uma reta; a é positivo quando ela sobe.",
      ],
      formulas: [
        {
          expr: "f(x) = a·x + b   ·   a = Δy ÷ Δx",
          legenda: "taxa de variação a partir de dois pontos",
        },
        {
          expr: "x_v = −b ÷ 2a   ·   y_v = f(x_v)",
          legenda: "vértice da parábola f(x) = ax² + bx + c",
        },
      ],
      exemplos: [
        {
          enunciado:
            "Uma corrida custa R$ 6,00 de bandeirada mais R$ 2,50 por quilômetro. Quanto custa uma corrida de 10 km?",
          passos: ["C(x) = 6 + 2,5x.", "C(10) = 6 + 25 = 31."],
          resposta: "R$ 31,00.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Na quadrática, o sinal de a diz se a parábola tem concavidade para cima (mínimo) ou para baixo (máximo). Lucro, área e altura de lançamentos costumam ter máximo; leia se a questão pede o x do vértice (quantidade, tempo) ou o y (o valor máximo).",
        "As raízes (onde f(x) = 0) indicam, por exemplo, quando o lucro deixa de ser prejuízo ou quando o objeto toca o chão.",
      ],
      exemplos: [
        {
          titulo: "Lucro máximo",
          enunciado:
            "O lucro de uma loja é L(x) = −2x² + 80x, com x em unidades vendidas. Qual é o lucro máximo e com quantas unidades ele acontece?",
          passos: [
            "x_v = −80 ÷ (2 × −2) = 20 unidades.",
            "L(20) = −2 × 400 + 80 × 20 = −800 + 1.600 = 800.",
          ],
          resposta: "Lucro máximo de 800, vendendo 20 unidades.",
        },
      ],
    },
    avancado: {
      texto: [
        "Variações percentuais repetidas geram funções exponenciais: um bem que perde 10% ao ano vale V₀ · 0,9ᵗ; uma população que cresce 5% ao ano vale P₀ · 1,05ᵗ. Uma perda inicial (por exemplo, ao sair da loja) entra uma vez só, antes da parte exponencial.",
        "Para descobrir o tempo em uma exponencial, iguale as potências de mesma base, ou use logaritmo quando a questão fornecer os valores (log 2 ≈ 0,30; log 3 ≈ 0,48).",
        "Comparar planos ou modelos lineares é encontrar onde as retas se cruzam: antes do cruzamento vale uma opção; depois, a outra.",
      ],
      formulas: [
        {
          expr: "V(t) = V₀ · (1 − i)ᵗ   ·   P(t) = P₀ · (1 + i)ᵗ",
          legenda: "decrescimento e crescimento a uma taxa fixa",
        },
        {
          expr: "log(a · b) = log a + log b   ·   log(aⁿ) = n · log a",
          legenda: "propriedades mais usadas",
        },
      ],
      exemplos: [
        {
          titulo: "Depreciação",
          enunciado:
            "Um carro custa R$ 60.000,00. Ao sair da loja, perde 15% do valor; depois, perde 10% ao ano. Qual expressão dá o valor V após t anos?",
          passos: [
            "Perda inicial, uma única vez: 60.000 × 0,85 = 51.000.",
            "Depois, a cada ano o valor é multiplicado por 0,9.",
          ],
          resposta: "V(t) = 51.000 · 0,9ᵗ.",
        },
        {
          titulo: "Tempo em uma exponencial",
          enunciado:
            "Uma cultura começa com 1.000 bactérias e dobra a cada 3 horas. Em quanto tempo terá 32.000 bactérias?",
          passos: [
            "P(t) = 1.000 · 2^(t/3).",
            "32.000 ÷ 1.000 = 32 = 2⁵, então t/3 = 5.",
            "t = 15 horas.",
          ],
          resposta: "15 horas.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Trocar a taxa (a) pelo valor inicial (b) da função afim.",
        comoEvitar: "b é o valor com x = 0; a é o quanto muda por unidade.",
      },
      {
        erro: "Responder o x do vértice quando a questão pede o valor máximo (ou o contrário).",
        comoEvitar: 'Releia o comando: "quantas unidades" é x; "qual o lucro máximo" é y.',
      },
      {
        erro: "Modelar uma queda percentual como (1 + i) ou subtrair a taxa todo ano do valor inicial.",
        comoEvitar: "Perda de i% ao ano: multiplique por (1 − i) a cada ano.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Se f(x) = 3x − 5, quanto vale f(4)?",
        resposta: 7,
        explicacao: "3 × 4 − 5 = 12 − 5 = 7.",
      },
      {
        tipo: "numero",
        pergunta: "Qual é o valor máximo de f(x) = −x² + 10x?",
        resposta: 25,
        explicacao: "x_v = −10 ÷ (−2) = 5; f(5) = −25 + 50 = 25.",
      },
      {
        tipo: "opcoes",
        pergunta:
          "Uma cidade cresce 5% ao ano a partir de 100.000 habitantes. Qual expressão dá a população após t anos?",
        opcoes: ["100.000 + 5t", "100.000 · 0,05ᵗ", "100.000 · 1,05ᵗ", "100.000 · 5ᵗ"],
        resposta: 2,
        explicacao: "Crescer 5% é multiplicar por 1,05 a cada ano: 100.000 · 1,05ᵗ.",
      },
    ],
    conexoes: ["mat-graf", "mat-porc", "mat-fin", "mat-alg"],
  },
  {
    topicId: "mat-geoe",
    resumo: [
      "Prisma e cilindro: V = área da base × altura. Pirâmide e cone: um terço disso.",
      "Esfera: V = 4πr³/3. Unidades: 1 L = 1 dm³ = 1.000 cm³; 1 m³ = 1.000 L.",
      "Relação de Euler para poliedros convexos: V − A + F = 2.",
      "Sólidos semelhantes: volumes na razão k³.",
    ],
    base: {
      texto: [
        "Volume é o espaço ocupado: capacidade de caixas, piscinas, embalagens. Para prismas (incluindo cubos e paralelepípedos) e cilindros, multiplique a área da base pela altura.",
        "Para converter em litros, lembre que 1 dm³ (um cubo de 10 cm de lado) é exatamente 1 litro.",
      ],
      formulas: [
        { expr: "V_prisma = A_base · h   ·   V_cilindro = π r² h", legenda: "base vezes altura" },
        {
          expr: "V_pirâmide = A_base · h ÷ 3   ·   V_cone = π r² h ÷ 3",
          legenda: "um terço do prisma/cilindro correspondente",
        },
        { expr: "V − A + F = 2", legenda: "vértices, arestas e faces (poliedro convexo)" },
      ],
      exemplos: [
        {
          enunciado:
            "Um aquário tem 50 cm de comprimento, 30 cm de largura e 40 cm de altura. Quantos litros cabem nele?",
          passos: ["V = 50 × 30 × 40 = 60.000 cm³.", "60.000 cm³ ÷ 1.000 = 60 L."],
          resposta: "60 litros.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Quando um objeto maciço é mergulhado e fica totalmente coberto, o nível da água sobe exatamente o volume do objeto dividido pela área da base do recipiente.",
        "Ao juntar dois poliedros por uma face comum, as duas faces coladas deixam de ser externas: o novo sólido tem as faces dos dois menos 2.",
      ],
      exemplos: [
        {
          titulo: "Junção de poliedros",
          enunciado:
            "Uma pirâmide de base quadrada é colada sobre um cubo, com a base da pirâmide coincidindo com uma face do cubo. Quantas faces tem o sólido formado?",
          passos: [
            "Pirâmide de base quadrada: 5 faces. Cubo: 6 faces.",
            "As duas faces coladas somem: 5 + 6 − 2 = 9.",
          ],
          resposta: "9 faces.",
        },
      ],
    },
    avancado: {
      texto: [
        "Escalas de maquetes e embalagens semelhantes: se as medidas lineares mudam na razão k, as áreas mudam k² e os volumes, k³. Isso explica por que uma embalagem com o dobro de altura e largura tem oito vezes o volume.",
        'Questões de custo comparam área de material (superfície) com volume armazenado: para o mesmo volume, formas mais "compactas" gastam menos material.',
      ],
      exemplos: [
        {
          titulo: "Escala de volume",
          enunciado:
            "Uma maquete na escala 1 : 100 representa um reservatório de 400 m³. Qual é o volume do reservatório na maquete, em cm³?",
          passos: [
            "Razão entre volumes: 1 : 100³ = 1 : 1.000.000.",
            "400 m³ ÷ 1.000.000 = 0,0004 m³.",
            "1 m³ = 1.000.000 cm³, então 0,0004 m³ = 400 cm³.",
          ],
          resposta: "400 cm³.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Esquecer o fator 1/3 em pirâmides e cones.",
        comoEvitar: 'Se a figura "afina" até um ponto, divida por 3.',
      },
      {
        erro: "Trocar diâmetro por raio no cilindro.",
        comoEvitar: "r = d ÷ 2, e o raio entra ao quadrado.",
      },
      {
        erro: "Converter m³ para litros multiplicando por 100.",
        comoEvitar: "1 m³ = 1.000 L; 1 cm³ = 1 mL.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Uma caixa-d'água mede 2 m × 3 m × 4 m. Quantos litros ela comporta?",
        resposta: 24000,
        unidade: "L",
        explicacao: "2 × 3 × 4 = 24 m³ = 24.000 L.",
      },
      {
        tipo: "numero",
        pergunta: "Qual é o volume de um cone com raio 3 cm e altura 4 cm? (π = 3)",
        resposta: 36,
        unidade: "cm³",
        explicacao: "3 × 3² × 4 ÷ 3 = 36 cm³.",
      },
      {
        tipo: "opcoes",
        pergunta: "Um poliedro convexo tem 8 vértices e 12 arestas. Quantas faces ele tem?",
        opcoes: ["4", "6", "8", "20"],
        resposta: 1,
        explicacao: "V − A + F = 2 → 8 − 12 + F = 2 → F = 6 (é o caso do cubo).",
      },
    ],
    conexoes: ["mat-geop", "mat-medidas", "mat-razao"],
  },
  {
    topicId: "mat-graf",
    resumo: [
      "Antes de calcular: título, eixos, unidade (mil? milhão?) e escala.",
      "Variação absoluta = novo − antigo; variação percentual = (novo − antigo) ÷ antigo.",
      "Ponto percentual é diferença entre porcentagens (de 4% para 6% são 2 p.p., um aumento de 50%).",
      "Em gráficos de setores, 100% = 360°, então 1% = 3,6°.",
    ],
    base: {
      texto: [
        "Gráficos de barras comparam categorias; de linhas mostram evolução no tempo; de setores mostram partes de um todo. Tabelas organizam valores exatos.",
        "Muitos erros vêm de não ler a unidade ou a legenda: o eixo pode estar em milhares, ou duas séries podem ter cores parecidas.",
      ],
      exemplos: [
        {
          enunciado:
            "As vendas de uma loja passaram de 40 mil para 50 mil unidades. Qual foi o crescimento percentual?",
          passos: ["Variação absoluta: 10 mil.", "Variação percentual: 10 ÷ 40 = 0,25 = 25%."],
          resposta: "25%.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Um eixo vertical que não começa em zero exagera as diferenças: compare os valores, não a altura visual das barras.",
        "Para achar o período de maior crescimento, calcule a variação de cada intervalo; a maior variação absoluta e a maior variação percentual podem estar em lugares diferentes.",
      ],
      exemplos: [
        {
          titulo: "Ponto percentual × porcentagem",
          enunciado: "A taxa de desemprego passou de 8% para 10%. De quanto foi o aumento?",
          passos: [
            "Em pontos percentuais: 10 − 8 = 2 p.p.",
            "Em porcentagem da taxa: 2 ÷ 8 = 25%.",
          ],
          resposta: "2 pontos percentuais, o que equivale a um aumento de 25% na taxa.",
        },
      ],
    },
    avancado: {
      texto: [
        "Algumas questões pedem uma estimativa a partir do gráfico: identificar o padrão (linear, quadrático) e projetar. Para um modelo linear, use a taxa média entre dois pontos lidos com precisão.",
        "Em gráficos com várias grandezas ligadas (por exemplo, exportações e importações), a pergunta pode exigir combinar as séries (saldo = exportações − importações) antes de comparar.",
      ],
      exemplos: [
        {
          titulo: "Estimativa linear",
          enunciado:
            "Uma receita foi de 20 milhões em 2019 e de 26 milhões em 2021, crescendo de forma linear. Mantido o padrão, qual será a receita em 2025?",
          passos: [
            "Taxa: (26 − 20) ÷ (2021 − 2019) = 3 milhões por ano.",
            "De 2021 a 2025 são 4 anos: 26 + 4 × 3 = 38.",
          ],
          resposta: "38 milhões.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Comparar alturas das barras em um eixo que não começa em zero.",
        comoEvitar: "Leia os números do eixo, não o tamanho visual.",
      },
      {
        erro: "Confundir ponto percentual com variação percentual.",
        comoEvitar: "Diferença entre taxas = p.p.; diferença dividida pela taxa inicial = %.",
      },
      {
        erro: "Ignorar a unidade do eixo (mil, milhão, %).",
        comoEvitar: "Escreva a unidade junto de cada número que você ler.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Em um gráfico de setores, uma categoria representa 30% do total. Qual é o ângulo do setor?",
        resposta: 108,
        unidade: "graus",
        explicacao: "30% de 360° = 0,3 × 360 = 108°.",
      },
      {
        tipo: "opcoes",
        pergunta: "A inflação anual passou de 4% para 6%. É correto dizer que ela aumentou:",
        opcoes: ["2%", "2 pontos percentuais, ou 50%", "6 pontos percentuais", "150%"],
        resposta: 1,
        explicacao: "6 − 4 = 2 p.p.; em relação aos 4% iniciais, 2 ÷ 4 = 50%.",
      },
    ],
    conexoes: ["mat-estat", "mat-porc", "mat-func"],
  },
  {
    topicId: "mat-estat",
    resumo: [
      "Média = soma ÷ quantidade. Mediana = valor do meio, com os dados em ordem. Moda = o que mais aparece.",
      "Média ponderada: multiplique cada valor pelo peso, some e divida pela soma dos pesos.",
      "Valores extremos puxam a média, mas quase não mudam a mediana.",
      "Desvio padrão mede a dispersão: quanto menor, mais regulares os dados.",
    ],
    base: {
      texto: [
        "As medidas de tendência central resumem um conjunto de dados em um número. A mediana só faz sentido com os dados ordenados; com quantidade par, ela é a média dos dois centrais.",
        "Em tabelas de frequência, cada valor aparece tantas vezes quanto indica a frequência: some valor × frequência para achar a média.",
      ],
      formulas: [
        {
          expr: "média ponderada = Σ(valor × peso) ÷ Σ(pesos)",
          legenda: "também vale para tabelas de frequência",
        },
        {
          expr: "posição da mediana = (n + 1) ÷ 2",
          legenda: "com n ímpar; com n par, média dos dois centrais",
        },
      ],
      exemplos: [
        {
          enunciado: "Qual é a mediana de 3, 5, 7 e 9?",
          passos: [
            "Já estão em ordem. São 4 valores (par).",
            "Média dos centrais: (5 + 7) ÷ 2 = 6.",
          ],
          resposta: "6.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Notas com pesos diferentes (como provas de 2 e de 3) pedem média ponderada; usar a média simples dá outro resultado.",
        "Se um salário muito alto entra em um grupo pequeno, a média sobe bastante e deixa de representar a maioria; a mediana é mais resistente.",
      ],
      exemplos: [
        {
          titulo: "Média ponderada",
          enunciado:
            "Um aluno tirou 6 em uma prova de peso 2 e 8 em uma de peso 3. Qual é a média?",
          passos: ["(6 × 2 + 8 × 3) ÷ (2 + 3) = (12 + 24) ÷ 5 = 7,2."],
          resposta: "7,2 (a média simples seria 7).",
        },
      ],
    },
    avancado: {
      texto: [
        "Média de grupos combinados não é a média das médias: cada grupo pesa pelo seu tamanho.",
        "Questões difíceis pedem um dado faltante a partir da média ou da mediana, ou o efeito de corrigir um valor lançado errado (a soma muda, e a média muda essa diferença dividida por n).",
        "Para escolher o mais regular entre candidatos com a mesma média, compare o desvio padrão: menor desvio, menos oscilação.",
      ],
      exemplos: [
        {
          titulo: "Médias de grupos",
          enunciado:
            "A turma A tem 20 alunos com média 6; a turma B tem 30 alunos com média 8. Qual é a média geral?",
          passos: [
            "Somas: A = 20 × 6 = 120; B = 30 × 8 = 240.",
            "Média geral: (120 + 240) ÷ 50 = 7,2.",
          ],
          resposta: "7,2 (e não 7, a média das médias).",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Calcular a mediana sem ordenar os dados.",
        comoEvitar: "Reescreva os dados em ordem crescente primeiro.",
      },
      {
        erro: "Fazer a média das médias de grupos de tamanhos diferentes.",
        comoEvitar: "Volte às somas: média × quantidade de cada grupo.",
      },
      {
        erro: "Achar que um conjunto sempre tem uma única moda.",
        comoEvitar: "Pode haver duas modas (bimodal) ou nenhuma.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Qual é a média de 2, 4, 6, 8 e 10?",
        resposta: 6,
        explicacao: "Soma 30, dividida por 5, dá 6.",
      },
      {
        tipo: "numero",
        pergunta: "Qual é a mediana de 10, 1, 9, 3, 8, 3?",
        resposta: 5.5,
        tolerancia: 0.01,
        explicacao: "Em ordem: 1, 3, 3, 8, 9, 10. Média dos centrais: (3 + 8) ÷ 2 = 5,5.",
      },
      {
        tipo: "opcoes",
        pergunta: "Dois atletas têm a mesma média de tempo. O mais regular é o que tem:",
        opcoes: [
          "a maior moda",
          "a maior mediana",
          "o menor desvio padrão",
          "o maior desvio padrão",
        ],
        resposta: 2,
        explicacao:
          "Desvio padrão mede o quanto os valores se afastam da média; menor desvio, mais regularidade.",
      },
    ],
    conexoes: ["mat-graf", "mat-prob"],
  },
  {
    topicId: "mat-porc",
    resumo: [
      "x% = x ÷ 100. Aumentar i% é multiplicar por (1 + i); descontar i% é multiplicar por (1 − i).",
      "Aumentos e descontos sucessivos se multiplicam, não se somam.",
      "Variação percentual = (novo − antigo) ÷ antigo.",
      "Para achar o valor antes de um aumento, divida pelo fator (não subtraia a porcentagem).",
    ],
    base: {
      texto: [
        "Porcentagem é uma razão com denominador 100. Calcular 15% de 80 é fazer 0,15 × 80 = 12.",
        "Pensar em fatores multiplicativos simplifica tudo: um aumento de 20% transforma o valor em 1,2 vez o original; um desconto de 30% deixa 0,7 do valor.",
      ],
      formulas: [
        { expr: "novo = antigo × (1 ± i)", legenda: "i em decimal: 20% = 0,2" },
        {
          expr: "variação = (novo − antigo) ÷ antigo",
          legenda: "multiplique por 100 para ter em %",
        },
      ],
      exemplos: [
        {
          enunciado: "Um produto de R$ 80,00 tem desconto de 15%. Qual é o novo preço?",
          passos: ["Fator: 1 − 0,15 = 0,85.", "80 × 0,85 = 68."],
          resposta: "R$ 68,00.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Dois aumentos de 10% não são 20%: 1,1 × 1,1 = 1,21, ou seja, 21%. Um desconto de 20% seguido de um aumento de 20% não volta ao preço inicial: 0,8 × 1,2 = 0,96.",
        "Para voltar a um valor depois de uma queda, a porcentagem de aumento precisa ser maior, porque a base ficou menor.",
      ],
      exemplos: [
        {
          titulo: "Desfazer uma queda",
          enunciado:
            "Um preço caiu de R$ 50,00 para R$ 40,00. Qual é a queda percentual e quanto ele precisa subir para voltar a R$ 50,00?",
          passos: ["Queda: 10 ÷ 50 = 20%.", "Aumento necessário: 10 ÷ 40 = 25%."],
          resposta: "Caiu 20% e precisa subir 25%.",
        },
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis trazem composições: um preço formado por partes que sobem em porcentagens diferentes. Calcule a variação de cada parte em reais, some e compare com o total inicial.",
        "Para achar o valor original a partir do valor com aumento, divida pelo fator: se 120 já inclui 20% de aumento, o original é 120 ÷ 1,2 = 100 (e não 120 − 20% de 120 = 96).",
      ],
      exemplos: [
        {
          titulo: "Partes que sobem diferente",
          enunciado:
            "O custo de um produto é de R$ 100,00: R$ 60,00 de insumos e R$ 40,00 de fabricação. Os insumos sobem 10% e a fabricação, 25%. De quanto foi o aumento do custo total?",
          passos: [
            "Insumos: 60 × 1,1 = 66. Fabricação: 40 × 1,25 = 50.",
            "Novo custo: 116. Aumento: 16 ÷ 100 = 16%.",
          ],
          resposta: "16% (não é a média de 10% e 25%).",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Somar porcentagens sucessivas.",
        comoEvitar: "Multiplique os fatores: 1,1 × 0,9 = 0,99 (queda de 1%).",
      },
      {
        erro: "Achar que um desconto de x% se desfaz com um aumento de x%.",
        comoEvitar: "A base mudou; calcule a nova porcentagem sobre o valor reduzido.",
      },
      {
        erro: "Tirar a porcentagem do valor final para achar o original.",
        comoEvitar: "Divida pelo fator: original = final ÷ (1 + i).",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Quanto é 15% de 80?",
        resposta: 12,
        explicacao: "0,15 × 80 = 12.",
      },
      {
        tipo: "numero",
        pergunta: "Um preço sobe 20% e depois mais 10%. Qual é o aumento total, em porcentagem?",
        resposta: 32,
        tolerancia: 0.01,
        unidade: "%",
        explicacao: "1,2 × 1,1 = 1,32, ou seja, 32%.",
      },
      {
        tipo: "opcoes",
        pergunta:
          "Um produto teve desconto de 50% e depois aumento de 50%. Em relação ao preço inicial, ele está:",
        opcoes: ["igual", "25% mais barato", "50% mais barato", "25% mais caro"],
        resposta: 1,
        explicacao: "0,5 × 1,5 = 0,75: o preço final é 75% do inicial, 25% mais barato.",
      },
    ],
    conexoes: ["mat-fin", "mat-graf", "mat-func"],
  },
  {
    topicId: "mat-alg",
    resumo: [
      "Traduza o texto em equação: nomeie a incógnita, escreva a relação e confira a unidade.",
      "Sistemas: duas informações sobre duas incógnitas; resolva por substituição ou por soma.",
      "Verifique a resposta no enunciado original: ela precisa fazer sentido (quantidade inteira, valor positivo).",
    ],
    base: {
      texto: [
        'Muitas questões descrevem uma situação com palavras e pedem um valor desconhecido. O trabalho é transformar cada frase em uma igualdade: "o dobro de um número mais 5 é 21" vira 2x + 5 = 21.',
        "Em sistemas (por exemplo, pizzas de dois sabores e o valor total recebido por duas pessoas), cada informação gera uma equação; com duas equações, achamos as duas incógnitas.",
      ],
      formulas: [{ expr: "ax + b = c  →  x = (c − b) ÷ a", legenda: "isolar a incógnita" }],
      exemplos: [
        {
          enunciado:
            "Ana vendeu 2 pizzas de calabresa e 3 de frango por R$ 190,00. Bruno vendeu 3 de calabresa e 1 de frango por R$ 145,00. Quanto custa cada pizza?",
          passos: [
            "2c + 3f = 190 e 3c + f = 145.",
            "Da segunda: f = 145 − 3c. Substituindo: 2c + 435 − 9c = 190 → −7c = −245 → c = 35.",
            "f = 145 − 105 = 40.",
          ],
          resposta: "Calabresa R$ 35,00 e frango R$ 40,00.",
        },
      ],
    },
    armadilhas: [
      {
        erro: 'Montar a equação com a frase na ordem errada ("3 a menos que x" vira 3 − x).',
        comoEvitar: '"3 a menos que x" é x − 3. Teste com um número.',
      },
      {
        erro: "Parar ao achar uma incógnita quando a questão pede outra combinação.",
        comoEvitar: "Releia o comando: ele pode pedir a soma ou a diferença.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "O dobro de um número mais 5 é 21. Qual é o número?",
        resposta: 8,
        explicacao: "2x + 5 = 21 → 2x = 16 → x = 8.",
      },
    ],
    conexoes: ["mat-func", "mat-razao"],
  },
  {
    topicId: "mat-medidas",
    resumo: [
      "Comprimento: 1 km = 1.000 m; 1 m = 100 cm. Área: 1 m² = 10.000 cm²; 1 ha = 10.000 m².",
      "Volume e capacidade: 1 m³ = 1.000 L; 1 dm³ = 1 L; 1 cm³ = 1 mL.",
      "Tempo: 1 h = 60 min = 3.600 s. Para km/h → m/s, divida por 3,6.",
    ],
    base: {
      texto: [
        "Conversões aparecem em quase toda a prova de Matemática e de Natureza. A estratégia mais segura é converter tudo para a mesma unidade antes de qualquer conta.",
        'Lembre que unidades de área e volume "carregam" o expoente: de m para cm multiplica-se por 100; de m² para cm², por 100² = 10.000; de m³ para cm³, por 100³ = 1.000.000.',
      ],
      formulas: [{ expr: "1 L = 1 dm³ = 1.000 cm³", legenda: "a ponte entre capacidade e volume" }],
      exemplos: [
        {
          enunciado:
            "Um adolescente bebe 7,5 dL de leite por dia. Quantos litros ele consome em 30 dias?",
          passos: ["1 L = 10 dL, então 7,5 dL = 0,75 L.", "0,75 × 30 = 22,5 L."],
          resposta: "22,5 litros.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Converter área ou volume com o fator de comprimento.",
        comoEvitar: "Eleve o fator ao quadrado (área) ou ao cubo (volume).",
      },
      {
        erro: "Somar horas e minutos como números decimais (1h30 = 1,3 h).",
        comoEvitar: "30 min = 0,5 h, então 1h30 = 1,5 h.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Quantos mililitros cabem em um recipiente de 2,5 dm³?",
        resposta: 2500,
        unidade: "mL",
        explicacao: "2,5 dm³ = 2,5 L = 2.500 mL.",
      },
    ],
    conexoes: ["mat-razao", "mat-geoe", "mat-num"],
  },
  {
    topicId: "mat-num",
    resumo: [
      "Notação científica: a × 10ⁿ, com 1 ≤ a < 10. Andar a vírgula para a esquerda aumenta o expoente.",
      "Frações, decimais e porcentagens são formas diferentes do mesmo número: 1/4 = 0,25 = 25%.",
      "Prefixos: mili (10⁻³), micro (10⁻⁶), nano (10⁻⁹); quilo (10³), mega (10⁶), giga (10⁹).",
    ],
    base: {
      texto: [
        "Números muito grandes ou pequenos (tamanho de células, distâncias astronômicas, dados em computadores) são escritos em notação científica. Para multiplicar, multiplique as mantissas e some os expoentes.",
        "Um trilionésimo é 1/1.000.000.000.000 = 10⁻¹²: o denominador tem 12 zeros.",
      ],
      exemplos: [
        {
          enunciado: "Uma organela mede 0,75 micrômetro. Quanto é isso em milímetros?",
          passos: [
            "1 µm = 10⁻⁶ m e 1 mm = 10⁻³ m, então 1 µm = 10⁻³ mm.",
            "0,75 µm = 0,75 × 10⁻³ mm = 7,5 × 10⁻⁴ mm.",
          ],
          resposta: "7,5 × 10⁻⁴ mm.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Errar o sinal do expoente ao converter para uma unidade maior.",
        comoEvitar: "Unidade maior, número menor: o expoente diminui.",
      },
      {
        erro: "Deixar a mantissa fora do intervalo de 1 a 10.",
        comoEvitar: "75 × 10⁻⁵ deve ser reescrito como 7,5 × 10⁻⁴.",
      },
    ],
    conexoes: ["mat-medidas"],
  },
  {
    topicId: "mat-trig",
    resumo: [
      "No triângulo retângulo: sen = oposto/hipotenusa; cos = adjacente/hipotenusa; tg = oposto/adjacente.",
      "Valores notáveis: sen 30° = 1/2; cos 60° = 1/2; tg 45° = 1; sen 60° = cos 30° = √3/2.",
      "Em triângulos quaisquer: lei dos senos e lei dos cossenos.",
    ],
    base: {
      texto: [
        "A trigonometria relaciona ângulos e lados. No ENEM, aparece em rampas, alturas inacessíveis, navegação e movimentos periódicos.",
        "A lei dos cossenos generaliza Pitágoras: a² = b² + c² − 2bc · cos A. Com A = 90°, cos A = 0 e volta-se a Pitágoras.",
      ],
      formulas: [{ expr: "a² = b² + c² − 2·b·c·cos A", legenda: "lei dos cossenos" }],
      exemplos: [
        {
          enunciado:
            "Uma rampa faz 30° com o chão e tem 8 m de comprimento. A que altura ela chega?",
          passos: [
            "A altura é o cateto oposto ao ângulo de 30°; a rampa é a hipotenusa.",
            "h = 8 × sen 30° = 8 × 1/2 = 4 m.",
          ],
          resposta: "4 m.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Trocar seno por cosseno.",
        comoEvitar: "Marque o ângulo e identifique qual cateto é oposto a ele.",
      },
      {
        erro: "Usar razões do triângulo retângulo em um triângulo que não é retângulo.",
        comoEvitar: "Sem ângulo reto, use a lei dos senos ou dos cossenos.",
      },
    ],
    conexoes: ["mat-geop", "mat-geoan"],
  },
  {
    topicId: "mat-geoan",
    resumo: [
      "Distância entre pontos: d = √[(x₂ − x₁)² + (y₂ − y₁)²] (é Pitágoras no plano).",
      "Reta: y = mx + n, com m = Δy/Δx. Circunferência de centro (a, b) e raio r: (x − a)² + (y − b)² = r².",
      "Ponto médio: média das coordenadas.",
    ],
    base: {
      texto: [
        "A geometria analítica descreve figuras com coordenadas. Ela aparece em mapas de cidades com malha quadriculada, trajetórias em jogos e posições de objetos.",
        "Para a equação de uma circunferência, você precisa do centro e do raio; o raio pode ser a distância do centro a qualquer ponto dela.",
      ],
      exemplos: [
        {
          enunciado:
            "Qual é a equação da circunferência de centro (2, −1) que passa pelo ponto (5, 3)?",
          passos: ["r² = (5 − 2)² + (3 − (−1))² = 9 + 16 = 25.", "(x − 2)² + (y + 1)² = 25."],
          resposta: "(x − 2)² + (y + 1)² = 25.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Errar o sinal do centro na equação: (x + 1)² corresponde a a = −1.",
        comoEvitar: "(x − a)²: o centro tem o sinal contrário ao que aparece.",
      },
      {
        erro: "Usar r em vez de r² no lado direito.",
        comoEvitar: "Se r = 5, o lado direito é 25.",
      },
    ],
    conexoes: ["mat-geop", "mat-func"],
  },
  {
    topicId: "mat-seq",
    resumo: [
      "PA: soma-se sempre a mesma razão r; aₙ = a₁ + (n − 1)r; soma Sₙ = (a₁ + aₙ) · n ÷ 2.",
      "PG: multiplica-se sempre pela mesma razão q; aₙ = a₁ · qⁿ⁻¹.",
      "Padrões de figuras costumam esconder uma PA (cresce somando) ou uma PG (cresce multiplicando).",
    ],
    base: {
      texto: [
        "Sequências aparecem em parcelas que diminuem um valor fixo por mês (PA), em padrões de figuras e em crescimentos que dobram (PG).",
        "Antes de usar fórmula, escreva os primeiros termos e descubra se a diferença ou o quociente entre termos vizinhos é constante.",
      ],
      formulas: [
        { expr: "Sₙ = (a₁ + aₙ) · n ÷ 2", legenda: "soma dos n primeiros termos de uma PA" },
      ],
      exemplos: [
        {
          enunciado:
            "Um financiamento tem parcelas que começam em R$ 1.000,00 e diminuem R$ 10,00 por mês. Quanto vale a 20ª parcela?",
          passos: ["É uma PA com a₁ = 1.000 e r = −10.", "a₂₀ = 1.000 + 19 × (−10) = 810."],
          resposta: "R$ 810,00.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar n no lugar de n − 1 na fórmula do termo geral.",
        comoEvitar: "Teste com n = 1: o resultado tem de ser a₁.",
      },
      {
        erro: "Tratar como PA uma sequência que multiplica (PG).",
        comoEvitar:
          "Compare diferenças e quocientes entre termos vizinhos antes de escolher a fórmula.",
      },
    ],
    conexoes: ["mat-func", "mat-fin"],
  },
  {
    topicId: "mat-fin",
    resumo: [
      "Juros simples: J = C · i · t (os juros são sempre sobre o capital inicial).",
      "Juros compostos: M = C · (1 + i)ᵗ (juros sobre juros).",
      "Comparar formas de pagamento: leve tudo para a mesma data, considerando o que o dinheiro renderia.",
    ],
    base: {
      texto: [
        "Na matemática financeira, o tempo muda o valor do dinheiro: pagar à vista com desconto ou parcelar sem juros pode ser melhor ou pior dependendo de quanto o dinheiro guardado renderia.",
        "Nos juros compostos, cada período rende sobre o montante acumulado, o que gera uma função exponencial.",
      ],
      formulas: [{ expr: "M = C · (1 + i)ᵗ", legenda: "i por período, em decimal" }],
      exemplos: [
        {
          enunciado:
            "R$ 1.000,00 ficam aplicados a 1% ao mês, em juros compostos, por 2 meses. Qual é o montante?",
          passos: ["1.000 × 1,01² = 1.000 × 1,0201 = 1.020,10."],
          resposta: "R$ 1.020,10 (em juros simples seriam R$ 1.020,00).",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Somar a taxa mês a mês sobre o capital inicial em juros compostos.",
        comoEvitar: "Multiplique o montante de cada mês por (1 + i).",
      },
      {
        erro: "Comparar formas de pagamento sem considerar o rendimento do dinheiro guardado.",
        comoEvitar:
          "Leve todos os valores para a mesma data (por exemplo, o fim do prazo) antes de comparar.",
      },
    ],
    conexoes: ["mat-porc", "mat-func", "mat-seq"],
  },
  {
    topicId: "mat-regra3",
    resumo: [
      "Regra de três simples: duas grandezas, uma incógnita. Verifique se são direta ou inversamente proporcionais.",
      "Regra de três composta: a incógnita é diretamente proporcional às grandezas diretas e inversamente às inversas.",
      "Ela é mais ferramenta do que assunto: aparece dentro de questões de razão, porcentagem e química.",
    ],
    base: {
      texto: [
        "Monte uma tabela com as grandezas em colunas e analise cada uma em relação à incógnita: se aumentar a grandeza aumenta a incógnita, é direta; se diminui, é inversa.",
        'Na composta, uma forma segura é achar a "taxa unitária" (por exemplo, peças por máquina por hora) e multiplicar pelas novas condições.',
      ],
      exemplos: [
        {
          enunciado:
            "4 pedreiros, trabalhando 6 h por dia, assentam 120 m² de piso em 5 dias. Em quantos dias 5 pedreiros, trabalhando 4 h por dia, assentam 200 m²?",
          passos: [
            "Taxa: 120 m² ÷ (4 × 6 × 5) = 1 m² por pedreiro por hora.",
            "Nova situação: 200 ÷ (5 × 4 × 1) = 10 dias.",
          ],
          resposta: "10 dias.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Montar todas as grandezas como diretas.",
        comoEvitar: "Analise uma de cada vez, sempre em relação à incógnita.",
      },
      {
        erro: "Misturar unidades diferentes na mesma coluna (horas e minutos, kg e g).",
        comoEvitar: "Converta cada coluna para uma única unidade antes de montar a proporção.",
      },
    ],
    conexoes: ["mat-razao", "qui-esteq"],
  },
];
