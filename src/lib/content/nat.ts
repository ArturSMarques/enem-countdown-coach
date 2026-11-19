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
  {
    topicId: "bio-eco",
    resumo: [
      "A energia flui em um só sentido e se perde a cada nível (cerca de 90% vira calor); a matéria circula nos ciclos.",
      "Produtores fixam energia; consumidores comem outros seres; decompositores devolvem nutrientes ao ambiente.",
      "Ciclo do carbono: fotossíntese retira CO₂; respiração, decomposição e combustão devolvem. Ciclo do nitrogênio depende de bactérias.",
      "Poluentes que não são eliminados se acumulam ao longo da cadeia (bioacumulação ou magnificação trófica).",
    ],
    base: {
      texto: [
        "Uma cadeia alimentar mostra quem serve de alimento a quem; várias cadeias interligadas formam uma teia. Cada passo é um nível trófico: produtores (plantas, algas), consumidores primários (herbívoros), secundários, terciários e decompositores (fungos e bactérias), que atuam em todos os níveis.",
        "Em cada transferência, a maior parte da energia é usada na respiração e perdida como calor. Por isso as pirâmides de energia sempre afinam para cima e as cadeias raramente têm mais de 4 ou 5 níveis.",
        "No ciclo do nitrogênio, o N₂ do ar só é aproveitado pelos seres vivos depois de ser fixado por bactérias (algumas vivem em nódulos nas raízes de leguminosas, como a soja e o feijão), transformado em amônia e depois em nitrato, que as plantas absorvem.",
      ],
      exemplos: [
        {
          enunciado:
            "Em uma cadeia capim → gafanhoto → sapo → cobra, os produtores fixam 50.000 kcal. Pela regra dos 10%, quanta energia chega ao sapo?",
          passos: [
            "Gafanhoto (consumidor primário): 10% de 50.000 = 5.000 kcal.",
            "Sapo (consumidor secundário): 10% de 5.000 = 500 kcal.",
          ],
          resposta: "Cerca de 500 kcal.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Relações ecológicas: mutualismo (as duas espécies ganham e dependem uma da outra, como fungo e alga no líquen), comensalismo (uma ganha, a outra não perde), predação, parasitismo, competição e herbivoria.",
        "Sucessão ecológica: em uma área nua ou degradada, espécies pioneiras resistentes chegam primeiro e modificam o ambiente, permitindo a chegada de outras, até uma comunidade mais estável (clímax). Sistemas agroflorestais e o reflorestamento imitam esse processo.",
        "Eutrofização: excesso de nutrientes (esgoto, fertilizantes) → proliferação de algas → morte das algas → decomposição por bactérias aeróbias → queda do oxigênio dissolvido → morte de peixes.",
      ],
      exemplos: [
        {
          titulo: "Bioacumulação",
          enunciado:
            "Um rio recebe mercúrio de um garimpo. Em qual ser vivo a concentração de mercúrio tende a ser maior: no fitoplâncton, no peixe herbívoro ou no peixe predador?",
          passos: [
            "O mercúrio não é eliminado facilmente e se acumula nos tecidos.",
            "Cada predador come muitas presas, acumulando o mercúrio de todas elas.",
          ],
          resposta:
            "No peixe predador, no topo da cadeia. Por isso organismos filtradores e predadores são usados como indicadores de contaminação.",
        },
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis cobram consequências em cadeia: a retirada de um predador de topo aumenta a população de herbívoros, que reduz a vegetação (cascata trófica); a introdução de espécies exóticas sem predadores naturais desequilibra a comunidade; barragens alteram o habitat e bloqueiam peixes migradores.",
        "Também cobram soluções baseadas em processos biológicos: a fixação biológica do nitrogênio por bactérias associadas à soja reduz a necessidade de fertilizantes nitrogenados; o manejo sustentável (como o do pirarucu na Amazônia, com cotas e tamanho mínimo) permite usar o recurso sem esgotá-lo.",
        "Gráficos de populações: oscilações defasadas de presa e predador; crescimento que estabiliza na capacidade de suporte do ambiente.",
      ],
      exemplos: [
        {
          titulo: "Cascata trófica",
          enunciado:
            "Em uma ilha, a caça eliminou as raposas, predadoras de coelhos. O que se espera, a médio prazo, para a vegetação rasteira da ilha?",
          passos: [
            "Sem predador, a população de coelhos cresce.",
            "Mais coelhos consomem mais vegetação rasteira.",
            "A vegetação diminui, o que depois pode reduzir os próprios coelhos por falta de alimento.",
          ],
          resposta:
            "A vegetação rasteira tende a diminuir. O efeito da retirada do predador passa por dois níveis tróficos.",
        },
      ],
    },
    armadilhas: [
      {
        erro: 'Dizer que a energia "circula" nos ecossistemas.',
        comoEvitar: "Energia flui e se perde; quem circula é a matéria (C, N, água).",
      },
      {
        erro: "Confundir eutrofização com bioacumulação.",
        comoEvitar:
          "Eutrofização é excesso de nutrientes e falta de oxigênio; bioacumulação é concentração de poluente na cadeia.",
      },
      {
        erro: "Atribuir a fixação do nitrogênio à própria planta.",
        comoEvitar: "Quem fixa o N₂ são bactérias (livres ou nos nódulos das raízes).",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Os produtores de um ecossistema fixam 20.000 kcal. Pela regra dos 10%, quantas kcal chegam aos consumidores terciários?",
        resposta: 20,
        unidade: "kcal",
        explicacao: "Primários: 2.000; secundários: 200; terciários: 20 kcal.",
      },
      {
        tipo: "opcoes",
        pergunta:
          "No líquen, a alga faz fotossíntese e o fungo protege e fornece água e sais. Essa relação é:",
        opcoes: ["parasitismo", "comensalismo", "mutualismo", "competição"],
        resposta: 2,
        explicacao: "As duas espécies se beneficiam e dependem uma da outra: mutualismo.",
      },
    ],
    conexoes: ["qui-amb", "geo-amb", "bio-evo"],
  },
  {
    topicId: "fis-elet",
    resumo: [
      "U = R · i (lei de Ohm). Potência: P = U · i = R · i² = U²/R.",
      "Energia consumida: E = P · Δt. Em kWh: potência em kW vezes horas de uso.",
      "Série: mesma corrente, resistências se somam. Paralelo: mesma tensão, correntes se somam.",
      "As tomadas de uma casa estão em paralelo: cada aparelho recebe a tensão da rede.",
    ],
    base: {
      texto: [
        'Corrente elétrica (i, em ampère) é o fluxo de cargas; tensão (U, em volt) é o "empurrão" que a fonte dá; resistência (R, em ohm) é a dificuldade à passagem da corrente.',
        "A conta de luz cobra energia, não potência: um aparelho de 2.000 W (2 kW) ligado 30 minutos por dia durante 30 dias consome 2 × 0,5 × 30 = 30 kWh.",
      ],
      formulas: [
        { expr: "U = R · i   ·   P = U · i", legenda: "lei de Ohm e potência elétrica" },
        { expr: "E = P · Δt", legenda: "kW × h = kWh" },
      ],
      exemplos: [
        {
          enunciado: "Um ferro de passar de 1.100 W é ligado em 220 V. Qual é a corrente?",
          passos: ["i = P ÷ U = 1.100 ÷ 220 = 5 A."],
          resposta: "5 A.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Em série, a resistência equivalente é a soma; em paralelo, 1/Req = 1/R₁ + 1/R₂ (para dois resistores, Req = R₁R₂/(R₁ + R₂)). Dois resistores iguais em paralelo valem metade de um deles.",
        "Amperímetro mede corrente e entra em série; voltímetro mede tensão e entra em paralelo. Fusíveis e disjuntores interrompem o circuito quando a corrente passa do limite.",
        'No chuveiro, a tensão da rede é fixa: pela fórmula P = U²/R, a posição "inverno" usa uma resistência MENOR para ter potência maior.',
      ],
      exemplos: [
        {
          titulo: "Paralelo",
          enunciado:
            "Resistores de 4 Ω e 12 Ω são ligados em paralelo a uma fonte de 12 V. Qual é a corrente total e a potência dissipada?",
          passos: [
            "Correntes: 12/4 = 3 A e 12/12 = 1 A; total 4 A.",
            "Req = 12 ÷ 4 = 3 Ω (confere: 4 × 12 ÷ 16 = 3).",
            "P = U · i = 12 × 4 = 48 W.",
          ],
          resposta: "4 A e 48 W.",
        },
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis pedem para escolher a ligação que faz aparelhos funcionarem nas especificações nominais (tensão e potência), ou para saber se um fusível suporta vários aparelhos ligados juntos. Calcule a corrente de cada um (i = P/U) e some, porque estão em paralelo.",
        "Sensores usam a variação da resistência com a temperatura ou com a luz; em gráficos R × T, o sensor mais sensível é o de maior inclinação (maior variação de R por grau).",
      ],
      exemplos: [
        {
          titulo: "Lâmpadas em série nas condições nominais",
          enunciado:
            "Uma lâmpada L₁ (6 V – 3 W) e uma L₂ (12 V – 6 W) são ligadas em série a uma bateria de 18 V. Elas funcionam nas condições nominais?",
          passos: [
            "Correntes nominais: L₁: 3/6 = 0,5 A; L₂: 6/12 = 0,5 A. São iguais, o que permite a ligação em série.",
            "Resistências: L₁ = 6/0,5 = 12 Ω; L₂ = 12/0,5 = 24 Ω; total 36 Ω.",
            "Corrente com 18 V: 18/36 = 0,5 A; tensões: 6 V e 12 V.",
          ],
          resposta: "Sim: cada uma recebe exatamente sua tensão nominal.",
        },
        {
          titulo: "Fusível",
          enunciado:
            "Uma régua com fusível de 10 A está ligada em 127 V. Um aparelho de 800 W e outro de 500 W podem funcionar juntos?",
          passos: ["Corrente total: (800 + 500) ÷ 127 ≈ 10,2 A.", "É maior que 10 A."],
          resposta: "Não: o fusível queima.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir potência (kW) com energia (kWh).",
        comoEvitar: "Energia = potência × tempo; a conta cobra kWh.",
      },
      {
        erro: "Achar que mais resistência no chuveiro esquenta mais.",
        comoEvitar: "Com U fixo, P = U²/R: menos resistência, mais potência.",
      },
      {
        erro: "Somar resistências em paralelo.",
        comoEvitar: "Em paralelo, a equivalente é menor que a menor delas.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Um aparelho de 1.100 W funciona em 220 V. Qual é a corrente?",
        resposta: 5,
        unidade: "A",
        explicacao: "i = P ÷ U = 1.100 ÷ 220 = 5 A.",
      },
      {
        tipo: "numero",
        pergunta:
          "Um forno de 2.000 W fica ligado 30 min por dia durante 30 dias. Quantos kWh ele consome?",
        resposta: 30,
        unidade: "kWh",
        explicacao: "2 kW × 0,5 h × 30 = 30 kWh.",
      },
      {
        tipo: "opcoes",
        pergunta: "Para o chuveiro aquecer mais (posição inverno), a chave seleciona:",
        opcoes: [
          "uma resistência maior",
          "uma resistência menor",
          "uma tensão menor",
          "uma corrente menor",
        ],
        resposta: 1,
        explicacao: "Com tensão fixa, P = U²/R: menor R, maior potência.",
      },
    ],
    conexoes: ["fis-ener", "fis-mag", "mat-razao"],
  },
  {
    topicId: "fis-ondas",
    resumo: [
      "v = λ · f. A frequência é definida pela fonte e não muda quando a onda passa de um meio para outro.",
      "Som é onda mecânica (precisa de meio); luz e rádio são eletromagnéticas (propagam no vácuo a 3 × 10⁸ m/s).",
      "Fenômenos: reflexão (eco), refração, difração (contornar obstáculos), interferência, ressonância e efeito Doppler.",
      "Decibel é escala logarítmica: +10 dB significa intensidade 10 vezes maior.",
    ],
    base: {
      texto: [
        "Uma onda transporta energia sem transportar matéria. Amplitude está ligada à intensidade (volume, brilho); frequência, à altura do som (grave ou agudo) ou à cor da luz.",
        "Ondas mecânicas (som, ondas na corda) precisam de um meio material; ondas eletromagnéticas (rádio, micro-ondas, luz, raios X) não.",
      ],
      formulas: [
        {
          expr: "v = λ · f   ·   T = 1/f",
          legenda: "velocidade, comprimento de onda, frequência e período",
        },
        { expr: "distância = v · t ÷ 2", legenda: "eco e radar: a onda vai e volta" },
      ],
      exemplos: [
        {
          enunciado: "Um som de 680 Hz se propaga no ar a 340 m/s. Qual é o comprimento de onda?",
          passos: ["λ = v ÷ f = 340 ÷ 680 = 0,5 m."],
          resposta: "0,5 m.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Sonar e radar medem distâncias pelo tempo de ida e volta: divida por 2.",
        "Efeito Doppler: quando a fonte se aproxima, o observador percebe frequência maior (som mais agudo); quando se afasta, menor.",
        "Ressonância: um corpo vibra com grande amplitude quando recebe energia na sua frequência natural (taça que quebra com a voz, ponte que oscila).",
        "Em cordas vibrantes de mesmo material e tensão, a frequência é inversamente proporcional ao comprimento que vibra: apertar a corda mais perto da boca do violão encurta a parte vibrante e deixa o som mais agudo.",
      ],
      exemplos: [
        {
          titulo: "Sonar",
          enunciado:
            "Um sonar emite um pulso que volta após 0,4 s. O som na água viaja a 1.500 m/s. Qual é a profundidade?",
          passos: ["Ida e volta: 1.500 × 0,4 = 600 m.", "Profundidade: 600 ÷ 2 = 300 m."],
          resposta: "300 m.",
        },
      ],
    },
    avancado: {
      texto: [
        "Na refração, a frequência se mantém e a velocidade e o comprimento de onda mudam juntos. Isso explica por que a cor da luz não muda ao entrar na água.",
        "A difração é intensa quando a abertura ou o obstáculo têm tamanho próximo ao comprimento de onda: ouvimos atrás de uma porta (som tem λ de centímetros a metros), mas não vemos (a luz tem λ de centenas de nanômetros).",
        "Nível sonoro: N = 10 · log(I/I₀). Diferença de 20 dB equivale a intensidade 100 vezes maior; duas fontes iguais juntas somam cerca de 3 dB (e não o dobro de decibéis).",
        "Espectro eletromagnético, em ordem de frequência crescente: rádio, micro-ondas, infravermelho, visível, ultravioleta, raios X, raios gama. A energia de cada fóton cresce com a frequência (E = h · f).",
      ],
      exemplos: [
        {
          titulo: "Corda vibrante",
          enunciado:
            "Uma corda de violão com 60 cm de parte vibrante emite 220 Hz. Pressionando-a para que vibrem 40 cm, qual frequência ela emite?",
          passos: [
            "f é inversamente proporcional ao comprimento: f₂ = f₁ × L₁ ÷ L₂.",
            "f₂ = 220 × 60 ÷ 40 = 330 Hz.",
          ],
          resposta: "330 Hz (som mais agudo).",
        },
        {
          titulo: "Decibéis",
          enunciado:
            "Uma rua tem nível sonoro de 80 dB e uma sala, de 60 dB. Quantas vezes a intensidade na rua é maior?",
          passos: [
            "Diferença: 20 dB = 2 × 10 dB.",
            "Cada 10 dB multiplica a intensidade por 10: 10 × 10 = 100.",
          ],
          resposta: "100 vezes.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Achar que a frequência muda na refração.",
        comoEvitar: "Mudam v e λ; f é da fonte.",
      },
      { erro: "Tratar decibéis como escala linear.", comoEvitar: "+10 dB = ×10 na intensidade." },
      {
        erro: "Confundir Doppler (altura do som) com intensidade (volume).",
        comoEvitar: "Aproximação deixa o som mais agudo, não necessariamente mais alto.",
      },
      {
        erro: "Esquecer de dividir por 2 em eco e radar.",
        comoEvitar: "O tempo medido é de ida e volta.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta: "Qual é o comprimento de onda de um som de 170 Hz no ar (340 m/s)?",
        resposta: 2,
        unidade: "m",
        explicacao: "λ = 340 ÷ 170 = 2 m.",
      },
      {
        tipo: "numero",
        pergunta:
          "Um sonar recebe o eco após 2 s. Com o som a 1.500 m/s na água, qual é a profundidade?",
        resposta: 1500,
        unidade: "m",
        explicacao: "1.500 × 2 ÷ 2 = 1.500 m.",
      },
      {
        tipo: "opcoes",
        pergunta: "Quando a luz passa do ar para a água, o que permanece igual?",
        opcoes: ["A velocidade", "O comprimento de onda", "A frequência", "A direção, sempre"],
        resposta: 2,
        explicacao:
          "A frequência é definida pela fonte; velocidade e comprimento de onda diminuem na água.",
      },
    ],
    conexoes: ["fis-opt", "fis-mod", "mat-func"],
  },
  {
    topicId: "qui-org",
    resumo: [
      "Funções: álcool (–OH em carbono saturado), fenol (–OH no anel aromático), aldeído (–CHO na ponta), cetona (C=O no meio), ácido carboxílico (–COOH), éster (–COO–), éter (–O–), amina (–NH₂), amida.",
      "Reações frequentes: combustão, esterificação, saponificação, transesterificação (biodiesel) e polimerização.",
      "Ligações de hidrogênio elevam o ponto de ebulição; cadeias longas e apolares diminuem a solubilidade em água.",
      '"Orgânico" em Química é composto de carbono, não "natural" ou "sem agrotóxico".',
    ],
    base: {
      texto: [
        "O carbono faz quatro ligações e forma cadeias, o que gera a enorme variedade de compostos orgânicos. O que define a função é o grupo funcional, a parte da molécula responsável pelo comportamento químico.",
        "Exemplos do cotidiano: etanol (álcool, combustível), ácido acético (ácido carboxílico, vinagre), acetona (cetona, removedor), ésteres (aromas de frutas), aminas (odor de peixe).",
      ],
      formulas: [{ expr: "ácido carboxílico + álcool → éster + água", legenda: "esterificação" }],
      exemplos: [
        {
          enunciado: "O grupo –COOH do ácido acético caracteriza qual função?",
          passos: ["Carbonila (C=O) e hidroxila (–OH) no mesmo carbono formam a carboxila."],
          resposta: "Ácido carboxílico.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Saponificação: gordura (um triéster de glicerol) + base forte → sabão + glicerol. A molécula de sabão tem uma cauda apolar, que se mistura à gordura, e uma cabeça polar, que interage com a água; juntas formam micelas que arrastam a sujeira.",
        "Transesterificação: óleo vegetal + álcool (metanol ou etanol), com catalisador → ésteres (biodiesel) + glicerol.",
        "Polímeros: de adição (polietileno, PVC, a partir de monômeros com dupla ligação) e de condensação (poliésteres, náilon), que liberam uma molécula pequena, como água, a cada ligação.",
      ],
      exemplos: [
        {
          titulo: "Biodiesel",
          enunciado:
            "Na produção de biodiesel a partir do óleo de soja e metanol, quais são os produtos?",
          passos: [
            "O óleo é um triéster de glicerol.",
            "O metanol troca de lugar com o glicerol (transesterificação).",
          ],
          resposta:
            "Ésteres metílicos (o biodiesel) e glicerol (glicerina), que é separado depois.",
        },
      ],
    },
    avancado: {
      texto: [
        "Isomeria: compostos com a mesma fórmula molecular e estruturas diferentes. Plana: de cadeia, posição, função (álcool e éter, por exemplo). Geométrica (cis-trans): em ligação dupla com ligantes diferentes em cada carbono. Óptica: carbono quiral (quatro ligantes diferentes) gera duas formas espelhadas, que podem ter efeitos biológicos distintos.",
        "Propriedades físicas: com massas parecidas, quem faz ligação de hidrogênio (álcoois, ácidos, aminas) tem ponto de ebulição bem maior. O etanol (C₂H₆O) ferve a cerca de 78 °C; o éter dimetílico, com a mesma fórmula molecular, a cerca de −24 °C.",
        "Questões difíceis trazem a fórmula estrutural de uma molécula desconhecida (fármaco, aroma, pesticida) e pedem para reconhecer os grupos funcionais ou prever uma reação (por exemplo, qual grupo reage com uma base: o ácido).",
      ],
      exemplos: [
        {
          titulo: "Ponto de ebulição de isômeros",
          enunciado:
            "Etanol e éter dimetílico têm a fórmula C₂H₆O. Por que o etanol tem ponto de ebulição muito maior?",
          passos: [
            "O etanol tem –OH, que faz ligações de hidrogênio entre as moléculas.",
            "O éter não tem H ligado a O; suas interações são mais fracas.",
          ],
          resposta: "Por causa das ligações de hidrogênio entre as moléculas de etanol.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir álcool com fenol.",
        comoEvitar: "Fenol: –OH ligado diretamente ao anel aromático.",
      },
      {
        erro: "Confundir aldeído com cetona.",
        comoEvitar: "Aldeído: C=O na ponta da cadeia (–CHO); cetona: C=O entre dois carbonos.",
      },
      {
        erro: "Confundir éster com éter.",
        comoEvitar: "Éster tem C=O junto do O (–COO–); éter só tem –O– entre carbonos.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Na reação de um ácido carboxílico com um álcool, formam-se:",
        opcoes: ["éter e água", "éster e água", "sabão e glicerol", "cetona e hidrogênio"],
        resposta: 1,
        explicacao: "É a esterificação: ácido + álcool → éster + água.",
      },
      {
        tipo: "opcoes",
        pergunta: "Um carbono quiral é aquele que:",
        opcoes: [
          "faz ligação dupla",
          "está em um anel aromático",
          "tem quatro ligantes diferentes",
          "está ligado a oxigênio",
        ],
        resposta: 2,
        explicacao:
          "Quatro ligantes diferentes tornam a molécula não sobreponível à sua imagem no espelho (isomeria óptica).",
      },
    ],
    conexoes: ["qui-atom", "qui-amb", "bio-cito"],
  },
  {
    topicId: "qui-sep",
    resumo: [
      "Filtração: sólido não dissolvido + líquido. Decantação e centrifugação: componentes de densidades diferentes.",
      "Destilação simples: sólido dissolvido em líquido. Destilação fracionada: líquidos miscíveis com pontos de ebulição diferentes.",
      "Substância pura tem ponto de fusão e de ebulição constantes (patamares no gráfico); mistura comum não.",
      "Transformação física não forma nova substância (mudança de estado, dissolução); química forma (combustão, oxidação).",
    ],
    base: {
      texto: [
        "Para escolher o método de separação, pergunte qual propriedade diferencia os componentes: tamanho das partículas (filtração, peneiração), densidade (decantação, centrifugação), ponto de ebulição (destilação), solubilidade (extração), magnetismo (separação magnética).",
        "Mistura homogênea tem uma só fase (água com sal dissolvido); heterogênea tem mais de uma (água e óleo, água e areia).",
      ],
      exemplos: [
        {
          enunciado: "Como separar uma mistura de areia, sal e água?",
          passos: [
            "Filtração retém a areia; a água com sal passa.",
            "Evaporação ou destilação simples separa o sal da água.",
          ],
          resposta: "Filtração, depois evaporação (ou destilação, se quiser recuperar a água).",
        },
      ],
    },
    intermediario: {
      texto: [
        "Na curva de aquecimento, os trechos horizontais são as mudanças de estado: a temperatura fica constante enquanto a substância pura funde ou ferve. Misturas comuns fundem ou fervem em uma faixa de temperatura.",
        "A pressão muda o ponto de ebulição: na panela de pressão a água ferve acima de 100 °C (cozinha mais rápido); em grandes altitudes, abaixo.",
        "Em processos de laboratório com plantas, a sequência típica é extração (com solvente e aquecimento), filtração (remover o bagaço) e centrifugação (acelerar a separação de partículas finas).",
      ],
      exemplos: [
        {
          titulo: "Tratamento de água",
          enunciado: "Em uma estação de tratamento, quais etapas são físicas e quais são químicas?",
          passos: [
            "Coagulação e floculação: um sal (como sulfato de alumínio) reage e forma flocos que agregam a sujeira (química).",
            "Decantação e filtração: separam os flocos e partículas (físicas).",
            "Desinfecção com cloro e fluoretação: adição de substâncias que reagem ou atuam quimicamente.",
          ],
          resposta:
            "Decantação e filtração são físicas; coagulação e desinfecção envolvem transformações químicas.",
        },
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis cobram a distinção entre transformação física e química em processos reais: em um vazamento de petróleo, evaporação, dissolução e dispersão são físicas; foto-oxidação e biodegradação produzem novas substâncias (químicas).",
        "Também cobram propriedades usadas em testes de qualidade: densidade (adulterantes alteram a densidade do leite ou do combustível), temperatura de ebulição e solubilidade.",
        "Água deionizada ou destilada não tem sais: serve para laboratórios e baterias, mas não é adequada para beber como única fonte de água, porque não repõe íons.",
      ],
      exemplos: [
        {
          titulo: "Petróleo destilado",
          enunciado: "Por que o petróleo é separado por destilação fracionada e não por filtração?",
          passos: [
            "O petróleo é uma mistura homogênea de hidrocarbonetos líquidos (e gases dissolvidos).",
            "A filtração só separa sólidos não dissolvidos.",
            "Os componentes têm pontos de ebulição diferentes; a coluna separa as frações por temperatura.",
          ],
          resposta: "Porque é uma mistura homogênea de líquidos com pontos de ebulição diferentes.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar filtração para separar sal dissolvido.",
        comoEvitar: "Sal dissolvido passa pelo filtro; use evaporação ou destilação.",
      },
      {
        erro: "Trocar destilação simples por fracionada.",
        comoEvitar: "Fracionada é para líquidos miscíveis com pontos de ebulição próximos.",
      },
      {
        erro: "Classificar dissolução ou mudança de estado como transformação química.",
        comoEvitar: "Se não surge nova substância, é física.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Qual método separa água e etanol misturados?",
        opcoes: ["Filtração", "Decantação", "Destilação fracionada", "Separação magnética"],
        resposta: 2,
        explicacao: "São líquidos miscíveis (mistura homogênea) com pontos de ebulição diferentes.",
      },
      {
        tipo: "opcoes",
        pergunta: "No gráfico de aquecimento de uma substância pura, o trecho horizontal indica:",
        opcoes: [
          "que ela parou de receber calor",
          "uma mudança de estado físico",
          "uma reação química",
          "que ela é uma mistura",
        ],
        resposta: 1,
        explicacao:
          "Durante a mudança de estado o calor recebido muda o estado, não a temperatura.",
      },
    ],
    conexoes: ["qui-atom", "qui-amb", "fis-termo"],
  },
  {
    topicId: "bio-biotec",
    resumo: [
      "DNA recombinante: enzimas de restrição cortam o DNA, a ligase une, e um vetor (plasmídeo, vírus) leva o gene a outra célula.",
      "Transgênico recebe gene de outra espécie (ex.: bactéria que produz insulina humana; milho Bt).",
      "Clone por transferência nuclear tem o DNA nuclear de quem doou o núcleo.",
      "PCR multiplica um trecho de DNA (cada ciclo dobra); RT-PCR começa a partir do RNA.",
    ],
    base: {
      texto: [
        "A biotecnologia usa seres vivos ou suas moléculas para produzir algo útil. Como o código genético é praticamente universal, um gene humano colocado em uma bactéria pode ser lido por ela e gerar a proteína humana: é assim que se produz insulina para pessoas com diabetes.",
        "Transgênico é o organismo que recebeu um gene de outra espécie. Clone é um indivíduo geneticamente idêntico a outro. Mutação é uma alteração no DNA, que pode ocorrer naturalmente.",
      ],
      exemplos: [
        {
          enunciado: "Bactérias que produzem insulina humana são exemplo de quê?",
          passos: [
            "Receberam o gene humano da insulina.",
            "Passaram a ter um gene de outra espécie.",
          ],
          resposta: "De organismos transgênicos (geneticamente modificados).",
        },
      ],
    },
    intermediario: {
      texto: [
        "Milho Bt: recebeu um gene da bactéria Bacillus thuringiensis que produz uma proteína tóxica para lagartas que atacam a planta, reduzindo o uso de inseticidas. Arroz dourado: produz betacaroteno, precursor da vitamina A, cuja falta causa problemas de visão.",
        "Clonagem reprodutiva (como a da ovelha Dolly): o núcleo de uma célula do corpo do animal A é colocado em um óvulo sem núcleo do animal B, e o embrião se desenvolve no útero do animal C. O clone tem o DNA nuclear de A.",
        "Vacinas podem usar o patógeno inativado ou atenuado, partes dele (proteínas), vetores virais ou RNA mensageiro. As vacinas de RNA mensageiro não alteram o DNA da pessoa: o RNA é usado pelas células para produzir uma proteína do vírus e depois é degradado.",
      ],
      exemplos: [
        {
          titulo: 'Quem é o "pai" genético do clone',
          enunciado:
            "Um clone apresentou uma doença causada por um alelo recessivo em homozigose. De qual animal vieram esses alelos?",
          passos: [
            "O DNA nuclear do clone é o do doador do núcleo.",
            "O óvulo anucleado contribui com quase nada além das mitocôndrias; a barriga de aluguel, com nada.",
          ],
          resposta: "Do animal que doou o núcleo.",
        },
      ],
    },
    avancado: {
      texto: [
        "PCR (reação em cadeia da polimerase) copia um trecho de DNA em ciclos de aquecimento e resfriamento; idealmente, cada ciclo dobra a quantidade: após n ciclos, 2ⁿ cópias por molécula inicial. A RT-PCR, usada para vírus de RNA, primeiro converte RNA em DNA com a enzima transcriptase reversa.",
        "Questões difíceis cobram efeitos de segunda ordem: o plantio contínuo de culturas Bt seleciona insetos resistentes (por isso se recomendam áreas de refúgio sem a planta transgênica); a transferência de genes para espécies silvestres; o uso de microrganismos para produzir materiais (celulose bacteriana, plásticos biodegradáveis) sem precisar de grandes áreas de plantio.",
      ],
      exemplos: [
        {
          titulo: "Ciclos de PCR",
          enunciado:
            "Partindo de uma molécula de DNA, quantas cópias existem, idealmente, após 10 ciclos de PCR?",
          passos: ["Cada ciclo dobra: 2¹⁰.", "2¹⁰ = 1.024."],
          resposta: "1.024 cópias.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir transgênico, clone e mutante.",
        comoEvitar:
          "Transgênico: gene de outra espécie; clone: cópia genética; mutante: DNA alterado.",
      },
      {
        erro: "Achar que o clone herda genes da barriga de aluguel.",
        comoEvitar: "O DNA nuclear vem só do doador do núcleo.",
      },
      {
        erro: "Dizer que a vacina de RNA altera o DNA de quem a recebe.",
        comoEvitar: "O RNA não entra no núcleo nem é integrado ao DNA; é degradado após o uso.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Partindo de 1 molécula de DNA, quantas cópias se obtêm, idealmente, após 10 ciclos de PCR?",
        resposta: 1024,
        unidade: "cópias",
        explicacao: "Cada ciclo dobra a quantidade: 2¹⁰ = 1.024.",
      },
      {
        tipo: "opcoes",
        pergunta: "Uma bactéria que recebeu o gene humano da insulina é um organismo:",
        opcoes: ["clonado", "transgênico", "mutante natural", "híbrido"],
        resposta: 1,
        explicacao: "Recebeu um gene de outra espécie: é transgênico.",
      },
    ],
    conexoes: ["bio-gen", "bio-fisio", "bio-saude"],
  },
  {
    topicId: "bio-fisio",
    resumo: [
      "Vacina: antígeno → o corpo produz anticorpos e memória (imunidade ativa, duradoura). Soro: anticorpos prontos (passiva, imediata e temporária).",
      "A resposta imune secundária é mais rápida e intensa graças às células de memória.",
      "Insulina baixa a glicose no sangue; glucagon aumenta.",
      "Absorção de nutrientes: intestino delgado. Trocas gasosas: alvéolos. Filtração do sangue: néfrons.",
    ],
    base: {
      texto: [
        "Os sistemas do corpo trabalham integrados: o digestório quebra os alimentos, o circulatório distribui nutrientes e oxigênio, o respiratório faz as trocas gasosas, o excretor elimina resíduos e o nervoso e o endócrino coordenam tudo.",
        "O sistema imunológico tem uma defesa inata (inespecífica, como a fagocitose por macrófagos) e uma adaptativa (específica, com linfócitos e anticorpos). Os linfócitos T auxiliares reconhecem o invasor e coordenam a resposta.",
      ],
      exemplos: [
        {
          enunciado: "Uma pessoa picada por cobra peçonhenta deve receber vacina ou soro?",
          passos: [
            "É preciso neutralizar o veneno imediatamente.",
            "A vacina levaria dias para gerar anticorpos.",
          ],
          resposta: "Soro antiofídico, que já contém anticorpos prontos.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Artéria leva sangue para fora do coração; veia traz de volta. A artéria pulmonar leva sangue pobre em oxigênio (venoso) aos pulmões, e as veias pulmonares trazem sangue oxigenado.",
        "Gêmeos: dizigóticos vêm de dois óvulos fecundados por dois espermatozoides (podem ter sexos diferentes); monozigóticos vêm de um único zigoto que se divide (mesmo sexo e mesmo DNA).",
        "No exercício intenso, quando falta oxigênio, o músculo faz fermentação e produz lactato; o treinamento aumenta a capacidade aeróbia (mais mitocôndrias e capilares), e o mesmo esforço gera menos lactato.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis usam dados de exames ou gráficos: interpretar hemogramas (hemácias baixas sugerem anemia; leucócitos altos, infecção; plaquetas baixas, risco de sangramento), curvas de glicemia após uma refeição ou gráficos de anticorpos ao longo do tempo (pico maior e mais rápido na segunda exposição).",
        "Também cobram a ligação entre órgão e substância: compostos nitrosos formados no estômago ácido, por exemplo, ou a ação de hormônios como o antidiurético (ADH), que faz os rins reabsorverem mais água.",
      ],
      exemplos: [
        {
          titulo: "Resposta secundária",
          enunciado:
            "Em um gráfico de anticorpos, uma pessoa recebe a primeira dose de uma vacina no dia 0 e a segunda no dia 30. O que se espera depois da segunda dose?",
          passos: [
            "As células de memória da primeira exposição reconhecem o antígeno rapidamente.",
            "A produção de anticorpos começa mais cedo e atinge nível mais alto.",
          ],
          resposta: "Uma resposta mais rápida e mais intensa (resposta secundária).",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Trocar vacina por soro.",
        comoEvitar: "Vacina previne (o corpo produz); soro trata na hora (anticorpos prontos).",
      },
      {
        erro: "Achar que toda artéria leva sangue oxigenado.",
        comoEvitar: "Artéria é definida pela direção (sai do coração), não pelo tipo de sangue.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "A imunização obtida com uma vacina é:",
        opcoes: [
          "passiva e temporária",
          "ativa e duradoura",
          "passiva e imediata",
          "inata e inespecífica",
        ],
        resposta: 1,
        explicacao:
          "O próprio organismo produz anticorpos e células de memória: imunidade ativa e duradoura.",
      },
    ],
    conexoes: ["bio-saude", "bio-cito", "bio-biotec"],
  },
  {
    topicId: "fis-termo",
    resumo: [
      "Temperatura mede a agitação das partículas; calor é energia em trânsito por diferença de temperatura.",
      "Calor sensível: Q = m · c · ΔT. Calor latente (mudança de estado): Q = m · L, com temperatura constante.",
      "Propagação: condução (sólidos), convecção (fluidos, por correntes) e radiação (ondas eletromagnéticas, inclusive no vácuo).",
      "Máquinas térmicas nunca têm rendimento de 100%; o máximo teórico (Carnot) é 1 − T_fria/T_quente, em kelvin.",
    ],
    base: {
      texto: [
        "Para aquecer uma substância sem mudar de estado, a energia necessária depende da massa, do calor específico (a água tem 1 cal/g·°C, valor alto) e da variação de temperatura.",
        "Em trocas de calor em sistema isolado, o calor cedido pelos corpos quentes é igual ao recebido pelos frios.",
      ],
      formulas: [
        { expr: "Q = m · c · ΔT   ·   Q = m · L", legenda: "calor sensível e calor latente" },
        { expr: "1 cal ≈ 4,2 J", legenda: "conversão usada no ENEM" },
      ],
      exemplos: [
        {
          enunciado: "Quanto calor é preciso para aquecer 500 g de água de 20 °C a 100 °C?",
          passos: ["Q = 500 × 1 × 80 = 40.000 cal."],
          resposta: "40.000 cal (40 kcal).",
        },
      ],
    },
    intermediario: {
      texto: [
        "Misturando água quente e fria, a temperatura final é uma média ponderada pelas massas (se a substância é a mesma).",
        "O congelador fica em cima na geladeira porque o ar frio, mais denso, desce e cria correntes de convecção. A garrafa térmica usa vácuo entre as paredes (impede condução e convecção) e paredes espelhadas (reduzem a radiação).",
        "Potência térmica: P = Q/Δt. Eficiência de um aquecedor = energia útil ÷ energia consumida.",
      ],
      exemplos: [
        {
          titulo: "Equilíbrio térmico",
          enunciado:
            "Mistura-se 200 g de água a 80 °C com 300 g de água a 20 °C. Qual é a temperatura final?",
          passos: [
            "200 · (80 − T) = 300 · (T − 20).",
            "16.000 − 200T = 300T − 6.000 → 500T = 22.000 → T = 44 °C.",
          ],
          resposta: "44 °C.",
        },
      ],
    },
    avancado: {
      texto: [
        "Curvas de aquecimento com mudança de estado exigem somar etapas: aquecer o sólido, fundir (patamar), aquecer o líquido. Cada etapa usa sua fórmula e, às vezes, um calor específico diferente (gelo: 0,5 cal/g·°C).",
        "Em máquinas térmicas, parte do calor da fonte quente é sempre rejeitada à fonte fria. O rendimento real é menor que o de Carnot; as temperaturas da fórmula de Carnot devem estar em kelvin.",
      ],
      exemplos: [
        {
          titulo: "Eficiência de uma cafeteira",
          enunciado:
            "Uma cafeteira de 700 W aquece 500 g de água de 20 °C a 100 °C em 5 minutos. Qual é a sua eficiência? (1 cal = 4,2 J)",
          passos: [
            "Energia útil: 500 × 1 × 80 = 40.000 cal = 168.000 J.",
            "Energia consumida: 700 W × 300 s = 210.000 J.",
            "Eficiência: 168.000 ÷ 210.000 = 0,8.",
          ],
          resposta: "80%.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar graus Celsius na fórmula de Carnot.",
        comoEvitar: "Converta para kelvin: T(K) = T(°C) + 273.",
      },
      {
        erro: "Achar que a temperatura sobe durante a fusão ou a ebulição de uma substância pura.",
        comoEvitar: "No patamar, o calor muda o estado; a temperatura fica constante.",
      },
      {
        erro: "Confundir calor com temperatura.",
        comoEvitar:
          "Um iceberg tem mais energia térmica que uma xícara de café, mas temperatura menor.",
      },
    ],
    exercicios: [
      {
        tipo: "numero",
        pergunta:
          "Misturam-se 100 g de água a 90 °C com 100 g de água a 10 °C. Qual é a temperatura final?",
        resposta: 50,
        unidade: "°C",
        explicacao: "Massas iguais: média simples (90 + 10) ÷ 2 = 50 °C.",
      },
      {
        tipo: "numero",
        pergunta:
          "Qual é o rendimento máximo teórico (Carnot) de uma máquina que opera entre 600 K e 300 K, em porcentagem?",
        resposta: 50,
        unidade: "%",
        explicacao: "1 − 300/600 = 0,5 = 50%.",
      },
    ],
    conexoes: ["fis-ener", "qui-termoq", "qui-sep"],
  },
  {
    topicId: "qui-amb",
    resumo: [
      "Efeito estufa (CO₂, CH₄, N₂O) aquece o planeta; o problema é a intensificação pela queima de combustíveis fósseis e pelo desmatamento.",
      "Chuva ácida: SO₂ e NOₓ formam ácido sulfúrico e nítrico; a chuva natural já é levemente ácida (pH ≈ 5,6).",
      "Camada de ozônio (destruída por CFCs) é outro problema: filtra o ultravioleta, não tem relação direta com o efeito estufa.",
      "Biocombustíveis emitem CO₂ ao queimar, mas parte dele foi retirada da atmosfera pela fotossíntese das plantas usadas.",
    ],
    base: {
      texto: [
        "Grande parte das questões de Química no ENEM tem contexto ambiental: combustíveis, poluição do ar e da água, resíduos sólidos e reciclagem.",
        "Aterro sanitário tem impermeabilização do solo, drenagem e tratamento do chorume e dos gases; lixão é descarte a céu aberto, que contamina solo e lençol freático.",
      ],
      formulas: [
        {
          expr: "SO₂ + ½ O₂ → SO₃   ·   SO₃ + H₂O → H₂SO₄",
          legenda: "formação do ácido sulfúrico na chuva ácida",
        },
      ],
      exemplos: [
        {
          enunciado:
            "Qual gás, liberado na queima de combustíveis com enxofre, é o principal responsável pela chuva ácida?",
          passos: ["O enxofre queima formando SO₂, que se oxida a SO₃ e reage com a água."],
          resposta: "O dióxido de enxofre (SO₂).",
        },
      ],
    },
    intermediario: {
      texto: [
        "Catalisadores automotivos convertem CO, hidrocarbonetos não queimados e NOₓ em CO₂, H₂O e N₂, gases menos nocivos (o CO₂ continua contribuindo para o efeito estufa).",
        "Calagem: adicionar calcário (CaCO₃) ao solo neutraliza a acidez.",
        "Microplásticos e metais pesados são absorvidos pelos seres vivos e se acumulam ao longo da cadeia alimentar.",
      ],
    },
    avancado: {
      texto: [
        "Comparar combustíveis pelo impacto climático exige uma razão: energia liberada por mol de CO₂ emitido (ou CO₂ emitido por energia). Com valores aproximados de calor de combustão, o metano (CH₄, cerca de 890 kJ/mol, 1 CO₂ por molécula) libera cerca de 890 kJ por mol de CO₂; o etanol (cerca de 1.370 kJ/mol, 2 CO₂), cerca de 685 kJ por mol de CO₂. Para a mesma energia, o metano emite menos CO₂.",
        "Questões de fontes de energia pedem prós e contras: hidrelétricas alagam áreas e alteram ecossistemas; usinas nucleares não emitem CO₂ na operação, mas geram rejeitos radioativos e aquecem a água de refrigeração; solar e eólica dependem das condições do tempo.",
      ],
      exemplos: [
        {
          titulo: "Biocombustível",
          enunciado:
            "Por que se diz que o etanol de cana tem balanço de carbono mais favorável que a gasolina, se os dois liberam CO₂ na queima?",
          passos: [
            "A cana retira CO₂ da atmosfera pela fotossíntese enquanto cresce.",
            "Parte do CO₂ emitido na queima volta a ser absorvida no ciclo seguinte de plantio.",
            "A gasolina libera carbono que estava armazenado no subsolo há milhões de anos.",
          ],
          resposta:
            "Porque o carbono do etanol participa do ciclo atual; o balanço não é zero (há emissões na produção e no transporte), mas é menor.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir efeito estufa com buraco na camada de ozônio.",
        comoEvitar:
          "Estufa: aquecimento por CO₂ e outros gases; ozônio: filtro de UV destruído por CFCs.",
      },
      {
        erro: "Dizer que biocombustíveis não emitem CO₂.",
        comoEvitar: "Emitem; a diferença é que parte foi absorvida na fotossíntese.",
      },
      {
        erro: "Tratar aterro sanitário e lixão como a mesma coisa.",
        comoEvitar: "O aterro sanitário tem impermeabilização e tratamento do chorume.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Os CFCs, usados antigamente em sprays e geladeiras, causam principalmente:",
        opcoes: [
          "chuva ácida",
          "destruição da camada de ozônio",
          "eutrofização",
          "inversão térmica",
        ],
        resposta: 1,
        explicacao: "Os CFCs liberam cloro na estratosfera, que destrói o ozônio.",
      },
    ],
    conexoes: ["bio-eco", "geo-amb", "qui-org", "qui-termoq"],
  },
  // ---------- Natureza: revisão rápida e armadilhas (aprofundamento em construção) ----------
  {
    topicId: "fis-cine",
    resumo: [
      "Velocidade média = distância total ÷ tempo total.",
      "Em gráfico v × t, a área sob a curva é o deslocamento.",
      "Para converter km/h em m/s, divida por 3,6.",
    ],
    base: {
      texto: [
        "Cinemática descreve o movimento sem tratar das causas. No movimento uniforme a velocidade é constante; no uniformemente variado, a aceleração é constante (v = v₀ + a·t).",
      ],
      formulas: [
        {
          expr: "v_m = Δs ÷ Δt   ·   v = v₀ + a·t",
          legenda: "velocidade média e velocidade no MUV",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Calcular a velocidade média como média das velocidades dos trechos.",
        comoEvitar: "Divida a distância total pelo tempo total.",
      },
      { erro: "Esquecer de converter km/h e m/s.", comoEvitar: "km/h ÷ 3,6 = m/s." },
    ],
    conexoes: ["fis-din", "mat-razao"],
  },
  {
    topicId: "fis-din",
    resumo: [
      "F_resultante = m · a (2ª lei de Newton).",
      "Ação e reação têm mesmo módulo, sentidos opostos e atuam em corpos diferentes.",
      "Em colisões, a quantidade de movimento total (m·v) se conserva.",
    ],
    base: {
      texto: [
        "Desenhe todas as forças antes de calcular: peso, normal, atrito, tração. Em um elevador que sobe acelerando, a normal é maior que o peso: N = m(g + a).",
        "Zonas de deformação dos carros aumentam o tempo da colisão e, para a mesma variação de quantidade de movimento, diminuem a força média sobre os passageiros (impulso = F · Δt).",
      ],
      formulas: [
        {
          expr: "F = m · a   ·   Q = m · v   ·   I = F · Δt = ΔQ",
          legenda: "2ª lei, quantidade de movimento e impulso",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Achar que ação e reação se anulam.",
        comoEvitar: "Atuam em corpos diferentes, então não se cancelam.",
      },
      {
        erro: "Supor que precisa haver força para manter velocidade constante.",
        comoEvitar: "Velocidade constante significa força resultante nula (1ª lei).",
      },
    ],
    conexoes: ["fis-cine", "fis-ener"],
  },
  {
    topicId: "fis-ener",
    resumo: [
      "Ec = m·v²/2; Ep = m·g·h; sem atrito, a energia mecânica se conserva.",
      "Potência = energia ÷ tempo; rendimento = útil ÷ total.",
      "Fontes renováveis e não renováveis: compare emissões, custos e dependência do clima.",
    ],
    base: {
      texto: [
        "A conservação da energia resolve a maioria das questões de mecânica: a energia potencial perdida na descida vira cinética (v = √(2gh) para quem parte do repouso). Em equipamentos, parte da energia sempre vira calor, por isso o rendimento é menor que 100%.",
      ],
      formulas: [
        {
          expr: "m·g·h = m·v²/2  →  v = √(2·g·h)",
          legenda: "queda a partir do repouso, sem atrito",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Achar que a velocidade final depende da forma do trilho.",
        comoEvitar: "Sem atrito, só a diferença de altura importa.",
      },
      {
        erro: "Confundir energia (J, kWh) com potência (W, kW).",
        comoEvitar: "Potência é energia por tempo.",
      },
    ],
    conexoes: ["fis-elet", "fis-termo", "qui-amb"],
  },
  {
    topicId: "fis-opt",
    resumo: [
      "Reflexão: ângulo de incidência = ângulo de reflexão.",
      "Refração: a luz muda de velocidade e pode mudar de direção ao trocar de meio.",
      "Lentes convergentes ampliam ou projetam imagens; divergentes corrigem miopia.",
    ],
    base: {
      texto: [
        "A neblina reduz a visibilidade porque as gotículas espalham (dispersam) a luz dos faróis em todas as direções.",
        'O efeito "olho vermelho" nas fotos acontece quando a pupila está dilatada (ambiente escuro) e o flash reflete no fundo do olho, rico em vasos sanguíneos.',
      ],
      formulas: [{ expr: "n = c ÷ v", legenda: "índice de refração do meio" }],
    },
    armadilhas: [
      {
        erro: "Dizer que a frequência da luz muda na refração.",
        comoEvitar: "Mudam a velocidade e o comprimento de onda.",
      },
      {
        erro: "Trocar a lente que corrige miopia (divergente) pela da hipermetropia (convergente).",
        comoEvitar:
          "O míope vê mal de longe: a imagem se forma antes da retina e a lente divergente corrige.",
      },
    ],
    conexoes: ["fis-ondas", "bio-fisio"],
  },
  {
    topicId: "fis-hidro",
    resumo: [
      "Pressão = força ÷ área; em líquidos, p = p₀ + d·g·h.",
      "Empuxo = peso do líquido deslocado (Arquimedes).",
      "Vazão = área × velocidade: estreitar a saída aumenta a velocidade do jato.",
    ],
    base: {
      texto: [
        "Em um tubo em U com líquidos imiscíveis em equilíbrio, as pressões na mesma horizontal (no mesmo líquido) são iguais: d₁·h₁ = d₂·h₂.",
        "Ao apertar a ponta de uma mangueira, a vazão é a mesma, mas a área de saída diminui; a velocidade da água aumenta e o jato alcança mais longe.",
      ],
      formulas: [
        { expr: "p = F ÷ A   ·   E = d_líquido · V_deslocado · g", legenda: "pressão e empuxo" },
      ],
    },
    armadilhas: [
      {
        erro: "Achar que a pressão no fundo depende do formato do recipiente.",
        comoEvitar: "Depende só da profundidade e da densidade do líquido.",
      },
      {
        erro: "Confundir vazão com velocidade.",
        comoEvitar: "Vazão é volume por tempo; velocidade é distância por tempo.",
      },
    ],
    conexoes: ["fis-din", "mat-geoe"],
  },
  {
    topicId: "fis-mag",
    resumo: [
      "Corrente elétrica cria campo magnético.",
      "Campo magnético variável induz corrente (indução eletromagnética): base de geradores, transformadores e fogões de indução.",
      "Cargas em movimento em um campo magnético sofrem força perpendicular à velocidade.",
    ],
    base: {
      texto: [
        "No fogão de indução, uma bobina com corrente alternada cria um campo magnético variável, que induz correntes na base metálica da panela; essas correntes aquecem a panela, não o vidro.",
      ],
    },
    armadilhas: [
      {
        erro: "Achar que campo magnético constante gera corrente em uma espira parada.",
        comoEvitar: "É a variação do campo (ou do fluxo) que induz corrente.",
      },
      {
        erro: "Supor que o fogão de indução aquece qualquer recipiente.",
        comoEvitar:
          "A panela precisa ter material adequado (ferromagnético) para as correntes induzidas.",
      },
    ],
    conexoes: ["fis-elet", "fis-ener"],
  },
  {
    topicId: "fis-mod",
    resumo: [
      "A luz é formada por fótons; energia de cada fóton: E = h·f.",
      "Fosforescência: material absorve luz e reemite aos poucos (placas de saída de emergência).",
      "Raios X atravessam tecidos moles e são barrados por materiais densos.",
    ],
    base: {
      texto: [
        "Na física moderna, a energia é trocada em pacotes (quanta). Radiações de maior frequência (ultravioleta, raios X, gama) têm fótons mais energéticos, capazes de ionizar átomos e danificar o DNA.",
      ],
      formulas: [{ expr: "E = h · f", legenda: "h é a constante de Planck" }],
    },
    armadilhas: [
      {
        erro: "Achar que luz mais intensa sempre tem fótons mais energéticos.",
        comoEvitar:
          "Intensidade é a quantidade de fótons; energia de cada um depende da frequência.",
      },
      {
        erro: "Confundir radiação ionizante com radiação de celulares e rádio.",
        comoEvitar: "Rádio e micro-ondas têm frequência baixa e não ionizam.",
      },
    ],
    conexoes: ["fis-ondas", "qui-rad"],
  },
  {
    topicId: "qui-sol",
    resumo: [
      "Concentração comum: C = m/V (g/L). Molar: M = n/V (mol/L).",
      "Na diluição, a quantidade de soluto não muda: C₁V₁ = C₂V₂.",
      "Porcentagem em massa e ppm aparecem em rótulos e em limites ambientais.",
    ],
    base: {
      texto: [
        "Concentração indica quanto soluto há em certa quantidade de solução. Ela é propriedade intensiva: a mesma em uma gota ou em um litro da mesma solução. A água pura, por exemplo, tem cerca de 1.000 g/L ÷ 18 g/mol ≈ 55,6 mol/L.",
      ],
      formulas: [
        {
          expr: "C = m ÷ V   ·   M = n ÷ V   ·   C₁V₁ = C₂V₂",
          legenda: "concentrações e diluição",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Usar o volume de solvente em vez do volume de solução.",
        comoEvitar: "A concentração é sobre o volume final da solução.",
      },
      {
        erro: "Achar que diluir muda a quantidade de soluto.",
        comoEvitar: "Só a água muda; o soluto é o mesmo.",
      },
    ],
    conexoes: ["qui-esteq", "qui-acid"],
  },
  {
    topicId: "qui-termoq",
    resumo: [
      "ΔH < 0: exotérmica (libera calor); ΔH > 0: endotérmica (absorve).",
      "Lei de Hess: o ΔH total é a soma dos ΔH das etapas.",
      "Para comparar combustíveis, olhe a energia por grama, por mol ou por CO₂ emitido, conforme a pergunta.",
    ],
    base: {
      texto: [
        "Em combustões, a energia liberada é proporcional à quantidade de combustível queimado. A pergunta define a base de comparação: por mol, por massa ou por volume dão rankings diferentes.",
      ],
    },
    armadilhas: [
      {
        erro: "Achar que o maior ΔH por mol é sempre o melhor combustível.",
        comoEvitar: "Converta para a base pedida (por grama, por litro, por CO₂).",
      },
      {
        erro: "Inverter o sinal de ΔH ao inverter uma equação na lei de Hess.",
        comoEvitar: "Equação invertida: troque o sinal de ΔH.",
      },
    ],
    conexoes: ["qui-amb", "fis-termo", "qui-esteq"],
  },
  {
    topicId: "qui-eletroq",
    resumo: [
      "Oxidação: perde elétrons (nox aumenta). Redução: ganha elétrons (nox diminui).",
      "Na pilha, o ânodo oxida (polo negativo) e o cátodo reduz (polo positivo).",
      "Metal de sacrifício: tem menor potencial de redução que o metal protegido e oxida no lugar dele.",
    ],
    base: {
      texto: [
        "Pilhas e células a combustível transformam energia química em elétrica com reações de oxirredução. A ddp de uma pilha é a diferença entre os potenciais de redução do cátodo e do ânodo. Na célula a combustível de hidrogênio, a reação global é 2 H₂ + O₂ → 2 H₂O.",
      ],
      formulas: [{ expr: "ΔE = E°red(cátodo) − E°red(ânodo)", legenda: "ddp da pilha" }],
    },
    armadilhas: [
      {
        erro: "Trocar ânodo por cátodo.",
        comoEvitar: "Ânodo e oxidação começam com vogal; cátodo e redução, com consoante.",
      },
      {
        erro: "Escolher o metal mais nobre para proteger o ferro.",
        comoEvitar: "O protetor deve oxidar mais facilmente (menor E° de redução).",
      },
    ],
    conexoes: ["qui-esteq", "fis-elet"],
  },
  {
    topicId: "qui-atom",
    resumo: [
      "Semelhante dissolve semelhante: polar com polar, apolar com apolar.",
      "Ligações de hidrogênio (H ligado a F, O ou N) são as interações intermoleculares mais fortes.",
      "Tensão superficial da água vem das ligações de hidrogênio; detergentes a reduzem.",
    ],
    base: {
      texto: [
        "A polaridade de uma molécula depende da diferença de eletronegatividade e da geometria. Água é polar; óleos e gorduras são apolares, por isso não se misturam.",
        "Aves aquáticas flutuam porque suas penas são impermeabilizadas por óleos; um derramamento de detergente reduz a tensão superficial e permite que a água encharque as penas.",
      ],
    },
    armadilhas: [
      {
        erro: "Confundir ligação química (dentro da molécula) com interação intermolecular (entre moléculas).",
        comoEvitar: "Ferver água separa moléculas; não quebra ligações O–H.",
      },
      {
        erro: "Achar que toda molécula com ligações polares é polar.",
        comoEvitar: "CO₂ tem ligações polares, mas é linear e apolar.",
      },
    ],
    conexoes: ["qui-org", "qui-sep"],
  },
  {
    topicId: "qui-acid",
    resumo: [
      "pH < 7 ácido; pH = 7 neutro (a 25 °C); pH > 7 básico.",
      "Cada unidade de pH muda a concentração de H⁺ em 10 vezes.",
      "Neutralização: ácido + base → sal + água (vinagre neutraliza uma base; bicarbonato, um ácido).",
    ],
    base: {
      texto: [
        "Ácidos liberam H⁺ em água; bases liberam OH⁻. Para neutralizar um vazamento ou uma intoxicação leve, usa-se uma substância de caráter oposto e de preferência fraca (por exemplo, vinagre para uma base volátil como a amônia ou aminas).",
      ],
      formulas: [{ expr: "pH = −log [H⁺]", legenda: "escala logarítmica" }],
    },
    armadilhas: [
      {
        erro: 'Achar que pH 3 é "um pouco" mais ácido que pH 4.',
        comoEvitar: "É 10 vezes mais ácido.",
      },
      {
        erro: "Neutralizar uma base com outra base.",
        comoEvitar: "Base se neutraliza com ácido, e vice-versa.",
      },
    ],
    conexoes: ["qui-sol", "qui-eq", "qui-amb"],
  },
  {
    topicId: "qui-eq",
    resumo: [
      "No equilíbrio, as reações direta e inversa ocorrem com a mesma velocidade.",
      "Le Chatelier: o sistema se desloca para compensar uma perturbação (concentração, pressão, temperatura).",
      "Catalisador acelera a chegada ao equilíbrio, mas não o desloca.",
    ],
    base: {
      texto: [
        "Adicionar um reagente desloca o equilíbrio para os produtos; retirar um produto também. Aumentar a pressão favorece o lado com menos mols de gás. Aquecer favorece o sentido endotérmico. Esse raciocínio explica, por exemplo, a desmineralização dos dentes em meio ácido: o H⁺ consome íons da hidroxiapatita e desloca o equilíbrio para a dissolução.",
      ],
    },
    armadilhas: [
      {
        erro: "Achar que catalisador aumenta o rendimento.",
        comoEvitar: "Ele só acelera; a composição no equilíbrio é a mesma.",
      },
      {
        erro: "Esquecer que só gases contam no efeito da pressão.",
        comoEvitar: "Conte os mols de substâncias gasosas de cada lado.",
      },
    ],
    conexoes: ["qui-acid", "qui-cin"],
  },
  {
    topicId: "qui-cin",
    resumo: [
      "Aumentam a velocidade: temperatura, concentração, superfície de contato e catalisador.",
      "Enzimas são catalisadores biológicos: diminuem a energia de ativação.",
      "Catalisador não muda o ΔH da reação.",
    ],
    base: {
      texto: [
        'Para reagir, as partículas precisam colidir com energia suficiente (energia de ativação) e orientação adequada. Um catalisador oferece um caminho com menor energia de ativação; em um gráfico de energia, a "montanha" fica mais baixa, mas o início e o fim são os mesmos.',
      ],
    },
    armadilhas: [
      {
        erro: "Achar que o catalisador é consumido na reação.",
        comoEvitar: "Ele participa e é regenerado ao final.",
      },
      {
        erro: "Confundir velocidade da reação com quantidade de produto.",
        comoEvitar: "Velocidade é rapidez; quantidade depende da estequiometria e do equilíbrio.",
      },
    ],
    conexoes: ["qui-eq", "bio-cito"],
  },
  {
    topicId: "qui-rad",
    resumo: [
      "Meia-vida: tempo para metade da amostra se desintegrar.",
      "Após n meias-vidas, resta (1/2)ⁿ da amostra inicial.",
      "Fissão divide núcleos pesados (usinas nucleares); fusão une núcleos leves (Sol).",
    ],
    base: {
      texto: [
        "Radioisótopos são usados em medicina (radioterapia com cobalto-60, diagnósticos), datação (carbono-14) e geração de energia. A quantidade restante depende só do número de meias-vidas passadas.",
      ],
      formulas: [{ expr: "m = m₀ ÷ 2ⁿ", legenda: "n = tempo decorrido ÷ meia-vida" }],
    },
    armadilhas: [
      {
        erro: "Achar que após duas meias-vidas a amostra acaba.",
        comoEvitar: "Resta 1/4; após três, 1/8.",
      },
      { erro: "Confundir fissão com fusão.", comoEvitar: "Fissão quebra núcleos; fusão junta." },
    ],
    conexoes: ["fis-mod", "qui-amb"],
  },
  {
    topicId: "bio-gen",
    resumo: [
      "Genótipo é a constituição genética; fenótipo é a característica observada.",
      "Aa × Aa gera 1/4 AA, 1/2 Aa, 1/4 aa.",
      "Pais sem a doença com filho afetado: herança recessiva.",
    ],
    base: {
      texto: [
        "Nos heredogramas, quadrados são homens e círculos, mulheres; símbolos preenchidos indicam a característica. Se um casal sem a característica tem um filho com ela, a característica é recessiva e os pais são heterozigotos.",
        "Epistasia: um gene inibe a expressão de outro (por exemplo, sem um pigmento-base, a cor determinada por outro gene não aparece).",
      ],
    },
    armadilhas: [
      {
        erro: 'Esquecer de multiplicar pela chance do sexo quando a questão pede "menino afetado".',
        comoEvitar: "P(afetado) × P(menino) = P(afetado) × 1/2.",
      },
      {
        erro: "Supor herança ligada ao X quando um pai sem a doença tem filha afetada.",
        comoEvitar: "Na herança recessiva ligada ao X, a filha afetada exige pai afetado.",
      },
    ],
    conexoes: ["mat-prob", "bio-biotec", "bio-evo"],
  },
  {
    topicId: "bio-cito",
    resumo: [
      "Mitocôndria: respiração celular (ATP). Cloroplasto: fotossíntese. Lisossomo: digestão intracelular. Ribossomo: síntese de proteínas.",
      "Respiração aeróbia rende muito mais ATP que a fermentação.",
      "Mitose mantém o número de cromossomos; meiose o reduz à metade e forma gametas.",
    ],
    base: {
      texto: [
        "Doenças de depósito (como a falta de uma enzima lisossômica) fazem a célula acumular substâncias que não consegue degradar. No metabolismo energético, organismos aeróbios usam O₂; anaeróbios obrigatórios morrem na presença dele; facultativos fazem os dois.",
      ],
    },
    armadilhas: [
      {
        erro: "Achar que plantas não fazem respiração.",
        comoEvitar: "Plantas fazem fotossíntese e respiração celular.",
      },
      {
        erro: "Trocar mitose por meiose.",
        comoEvitar: "Meiose: gametas, 4 células haploides diferentes.",
      },
    ],
    conexoes: ["bio-fisio", "bio-bot", "qui-cin"],
  },
  {
    topicId: "bio-saude",
    resumo: [
      "Doenças transmitidas por mosquitos (dengue, zika, chikungunya): combate ao vetor e à água parada.",
      "Verminoses: saneamento básico, higiene e cozimento adequado dos alimentos.",
      "Para cada doença, identifique agente, transmissão e prevenção.",
    ],
    base: {
      texto: [
        "Questões de saúde pública ligam biologia e sociedade: urbanização sem saneamento aumenta criadouros de mosquitos; o controle de larvas (água parada) é mais eficiente que o de adultos. Toxinas de animais (como a do baiacu, armazenada em vísceras e gônadas) exigem cuidado no preparo e não são destruídas pelo cozimento comum.",
      ],
    },
    armadilhas: [
      {
        erro: "Tratar doença viral com antibiótico.",
        comoEvitar: "Antibióticos agem contra bactérias, não vírus.",
      },
      {
        erro: "Confundir o agente da doença com o vetor.",
        comoEvitar: "Na dengue, o agente é o vírus; o Aedes aegypti é o vetor.",
      },
    ],
    conexoes: ["bio-fisio", "bio-eco", "geo-urb"],
  },
  {
    topicId: "bio-evo",
    resumo: [
      "Seleção natural atua sobre a variação que já existe entre os indivíduos.",
      "Características adquiridas durante a vida não são herdadas (crítica ao lamarckismo).",
      "Semelhanças em ambientes parecidos podem surgir por convergência evolutiva.",
    ],
    base: {
      texto: [
        "Na população há variação (mutações, recombinação). Indivíduos com características mais vantajosas no ambiente sobrevivem e se reproduzem mais, e essas características ficam mais frequentes nas gerações seguintes.",
        "Exemplos: a pele queratinizada dos répteis reduz a perda de água, adaptação à vida terrestre; cobras-corais falsas imitam as verdadeiras (mimetismo), o que afasta predadores.",
      ],
    },
    armadilhas: [
      {
        erro: 'Dizer que o indivíduo "se adapta" e passa a característica aos filhos.',
        comoEvitar: "A seleção age sobre a população ao longo das gerações.",
      },
      {
        erro: "Achar que a evolução tem um objetivo.",
        comoEvitar: "Ela favorece o que funciona no ambiente atual.",
      },
    ],
    conexoes: ["bio-gen", "bio-eco", "bio-bot"],
  },
  {
    topicId: "bio-bot",
    resumo: [
      "A gema apical inibe as gemas laterais (dominância apical, ligada à auxina); retirá-la estimula brotações laterais.",
      "Fotossíntese: CO₂ + H₂O + luz → glicose + O₂.",
      "Artrópodes têm exoesqueleto e crescem por mudas.",
    ],
    base: {
      texto: [
        "Plantas e animais têm estruturas adaptadas ao ambiente. Na poda, retirar a ponta do caule faz a planta ramificar. Na fotossíntese oxigênica, a água é a fonte dos elétrons e do O₂ liberado; algumas bactérias usam H₂S no lugar da água e liberam enxofre.",
      ],
    },
    armadilhas: [
      { erro: "Achar que o O₂ da fotossíntese vem do CO₂.", comoEvitar: "Vem da quebra da água." },
      {
        erro: "Supor que artrópodes crescem continuamente.",
        comoEvitar: "O exoesqueleto rígido impõe crescimento por mudas.",
      },
    ],
    conexoes: ["bio-cito", "bio-evo", "bio-eco"],
  },
];
