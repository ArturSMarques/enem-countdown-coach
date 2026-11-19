import type { TopicContent } from "./types";

/**
 * Temas oficiais conferidos nos cadernos de prova do Inep (aplicação regular). Os de 2019 e 2021
 * ficaram de fora porque não foi possível conferir o texto do caderno.
 */
export const REDACAO_TEMAS: { ano: number; tema: string }[] = [
  { ano: 2026, tema: "A valorização do Sistema Único de Saúde (SUS) como direito universal" },
  { ano: 2025, tema: "Perspectivas acerca do envelhecimento na sociedade brasileira" },
  { ano: 2024, tema: "Desafios para a valorização da herança africana no Brasil" },
  {
    ano: 2023,
    tema: "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil",
  },
  { ano: 2022, tema: "Desafios para a valorização de comunidades e povos tradicionais no Brasil" },
  { ano: 2020, tema: "O estigma associado às doenças mentais na sociedade brasileira" },
];

export const CONTENT_RED: TopicContent[] = [
  {
    topicId: "red-comp",
    resumo: [
      "C1: domínio da escrita formal. C2: compreender o tema, usar o tipo dissertativo-argumentativo e repertório. C3: selecionar e organizar argumentos (projeto de texto). C4: coesão. C5: proposta de intervenção que respeite os direitos humanos.",
      "Cada competência vale de 0 a 200 pontos; total de 1.000.",
      "Zeram a redação, entre outros casos: fuga total ao tema, não seguir o tipo dissertativo-argumentativo e texto com até 7 linhas. A lista completa está na Cartilha do Participante de cada ano.",
    ],
    base: {
      texto: [
        "A redação do ENEM é um texto dissertativo-argumentativo: você defende um ponto de vista (tese) sobre o tema, com argumentos, e termina com uma proposta para enfrentar o problema.",
        "O tema vem acompanhado de textos motivadores, que ajudam a entender o recorte, mas não podem ser copiados: trechos copiados são desconsiderados na contagem de linhas.",
        'Fuga total ao tema zera a redação; tangenciar (tratar do assunto geral sem o recorte específico) derruba a nota de várias competências. Ex.: o tema de 2025 não era "os idosos" em geral, mas "perspectivas acerca do envelhecimento na sociedade brasileira".',
      ],
      exemplos: [
        {
          enunciado:
            'Qual é o recorte do tema "A valorização do Sistema Único de Saúde (SUS) como direito universal" (2026)?',
          passos: [
            "Assunto: saúde pública.",
            "Recorte: valorizar o SUS e entendê-lo como direito de todos.",
            'Um texto só sobre "filas nos hospitais" ficaria no assunto geral, sem o recorte.',
          ],
          resposta:
            "Discutir por que e como valorizar o SUS enquanto direito universal, não apenas falar dos problemas da saúde.",
        },
      ],
    },
    intermediario: {
      texto: [
        'C1: evite desvios de ortografia, concordância, regência, pontuação e informalidade (gírias, "tipo assim"). Releia buscando períodos longos demais.',
        "C3: cada parágrafo de desenvolvimento deve ter uma ideia central ligada à tese, desenvolvida com explicação e repertório, não só citado. Um bom teste: se você tirar a citação, o argumento continua de pé?",
        'C4: use conectivos variados entre parágrafos e dentro deles ("Em primeiro lugar", "Além disso", "Nesse sentido", "Portanto") e retome termos com pronomes e sinônimos, sem repetir a mesma palavra.',
      ],
    },
    avancado: {
      texto: [
        "Para chegar perto de 1.000, os corretores procuram um projeto de texto claro: a introdução anuncia a tese e os dois argumentos; cada desenvolvimento cumpre o que foi anunciado; a conclusão retoma e propõe a intervenção ligada aos problemas discutidos.",
        "A proposta de intervenção precisa estar articulada à discussão: se o texto discutiu falta de financiamento e desinformação, a proposta deve atacar essas causas, não outras.",
        'Repertório produtivo é aquele usado para sustentar o argumento, com explicação do vínculo com o tema; repertório "de bolso" colado sem relação vale pouco.',
      ],
    },
    armadilhas: [
      {
        erro: "Tangenciar o tema (falar do assunto geral sem o recorte).",
        comoEvitar: "Sublinhe as palavras-chave do tema e use-as na tese.",
      },
      {
        erro: "Copiar trechos dos textos motivadores.",
        comoEvitar: "Use-os para entender o tema; escreva com suas palavras.",
      },
      {
        erro: 'Usar conectivos com sentido errado ("portanto" para introduzir causa).',
        comoEvitar: "Confira a relação lógica de cada conectivo.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "A Competência 4 avalia principalmente:",
        opcoes: [
          "a proposta de intervenção",
          "o uso de mecanismos de coesão",
          "o repertório sociocultural",
          "a ortografia",
        ],
        resposta: 1,
        explicacao: "C4 é coesão: conectivos, retomadas e articulação entre as partes do texto.",
      },
    ],
    conexoes: ["red-estr", "red-rep", "red-int", "lin-gram"],
  },
  {
    topicId: "red-rep",
    resumo: [
      "Repertório sociocultural deve ser legitimado (fonte confiável), pertinente ao tema e produtivo (ligado ao argumento).",
      "Coringas confiáveis: Constituição de 1988 (art. 5º, 6º, 196, 205, 225, 230), leis (ECA, Estatuto da Pessoa Idosa, Lei 10.639/2003, Lei Brasileira de Inclusão), pensadores e dados de órgãos oficiais (IBGE).",
      "Temas reais recentes giram em torno de direitos e grupos invisibilizados: saúde pública, envelhecimento, herança africana, trabalho de cuidado, povos tradicionais, saúde mental.",
    ],
    base: {
      texto: [
        'Tenha 3 ou 4 repertórios que você domina bem e saiba adaptar. A Constituição é o coringa mais seguro: o art. 6º lista os direitos sociais (educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência, proteção à maternidade e à infância, assistência aos desamparados); o art. 196 diz que "a saúde é direito de todos e dever do Estado"; o art. 205 trata da educação; o art. 225, do meio ambiente; o art. 230, do dever de amparar as pessoas idosas.',
        "Leis úteis: Estatuto da Criança e do Adolescente (Lei 8.069/1990), Estatuto da Pessoa Idosa (Lei 10.741/2003), Lei 10.639/2003 (ensino de história e cultura afro-brasileira, ampliada para a indígena pela Lei 11.645/2008), Lei Maria da Penha (Lei 11.340/2006), Lei Brasileira de Inclusão (Lei 13.146/2015), Marco Civil da Internet (Lei 12.965/2014) e LGPD (Lei 13.709/2018).",
      ],
    },
    intermediario: {
      texto: [
        'Pensadores frequentes, com a ideia que você pode usar: Zygmunt Bauman (relações frágeis na "modernidade líquida"); Hannah Arendt ("banalidade do mal": violência cometida por obediência sem reflexão); Paulo Freire (educação como prática da liberdade); Milton Santos (globalização desigual e cidadania incompleta); Sérgio Buarque de Holanda ("homem cordial": mistura entre público e privado); Silvio Almeida (racismo estrutural); Djamila Ribeiro (lugar de fala e antirracismo); Ailton Krenak (crítica à separação entre humanidade e natureza); Byung-Chul Han (sociedade do cansaço e do desempenho).',
        "Use o repertório assim: apresente (quem e o quê), explique (o que a ideia significa) e conecte (como ela ajuda a entender o problema do tema).",
      ],
      exemplos: [
        {
          titulo: "Repertório produtivo",
          enunciado:
            "Tema: valorização do SUS como direito universal. Como usar o art. 196 da Constituição de forma produtiva?",
          passos: [
            "Apresentar: o art. 196 estabelece a saúde como direito de todos e dever do Estado.",
            "Explicar: a universalidade significa acesso sem exigência de renda ou contribuição.",
            "Conectar: argumentar que o subfinanciamento e a desinformação sobre o que o SUS oferece (vacinação, vigilância sanitária, transplantes) enfraquecem esse direito na prática.",
          ],
          resposta:
            "O artigo deixa de ser citação solta e vira base para um argumento sobre a distância entre o direito garantido e a realidade.",
        },
      ],
    },
    avancado: {
      texto: [
        'Temas oficiais recentes (conferidos nos cadernos do Inep): 2026 – "A valorização do Sistema Único de Saúde (SUS) como direito universal"; 2025 – "Perspectivas acerca do envelhecimento na sociedade brasileira"; 2024 – "Desafios para a valorização da herança africana no Brasil"; 2023 – "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil"; 2022 – "Desafios para a valorização de comunidades e povos tradicionais no Brasil"; 2020 – "O estigma associado às doenças mentais na sociedade brasileira".',
        "Padrão observado: temas sociais brasileiros, com foco em direitos, valorização e grupos ou questões invisibilizadas. Eixos para treinar (sugestões de estudo, não previsão do tema): direitos sociais e serviços públicos; desigualdades raciais e de gênero; povos indígenas e quilombolas; infância, juventude e envelhecimento; saúde mental; educação e acesso à cultura; tecnologia, inteligência artificial e desinformação; meio ambiente e mudanças climáticas; trabalho e renda; mobilidade e direito à cidade.",
        "Para cada eixo, prepare: uma lei ou artigo da Constituição, um pensador ou obra, um dado de fonte oficial e um exemplo histórico ou atual.",
      ],
    },
    armadilhas: [
      {
        erro: "Usar repertório sem explicar sua relação com o tema.",
        comoEvitar: "Apresente, explique e conecte.",
      },
      {
        erro: "Citar dados ou frases sem ter certeza da fonte.",
        comoEvitar: "Prefira referências que você domina; um repertório errado prejudica a nota.",
      },
      {
        erro: 'Usar o mesmo repertório "pronto" para qualquer tema.',
        comoEvitar: "Adapte a ideia ao recorte específico.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "Qual repertório é mais adequado para um tema sobre o envelhecimento da população brasileira?",
        opcoes: [
          "Um provérbio genérico sobre a sabedoria",
          "O art. 230 da Constituição, que atribui à família, à sociedade e ao Estado o dever de amparar as pessoas idosas, relacionado à falta de políticas de cuidado",
          "A opinião de um parente sobre a velhice",
          "Uma letra de música sem relação com o tema",
        ],
        resposta: 1,
        explicacao:
          "É legitimado (Constituição), pertinente (idosos) e produtivo (ligado a um argumento sobre políticas de cuidado).",
      },
    ],
    aConfirmar: [
      "Os temas de 2019 e 2021 não foram incluídos porque o texto desses cadernos não pôde ser conferido nesta análise.",
    ],
    conexoes: ["red-comp", "red-int", "socio", "his-br"],
  },
  {
    topicId: "red-int",
    resumo: [
      "Proposta completa: agente (quem), ação (o quê), meio/modo (como), finalidade (para quê) e detalhamento de um desses elementos.",
      "A proposta precisa resolver os problemas discutidos no texto.",
      "Respeite os direitos humanos: propostas violentas ou discriminatórias são penalizadas.",
    ],
    base: {
      texto: [
        "A Competência 5 avalia a proposta de intervenção. Ela costuma aparecer na conclusão, mas pode ser desenvolvida ao longo do texto.",
        'Agentes possíveis: Ministérios, governos estaduais e municipais, escolas, mídia, ONGs, empresas, família. Evite "o governo" genérico: escolha um agente com competência real para a ação.',
      ],
      exemplos: [
        {
          enunciado: "Monte uma proposta completa para um tema sobre a valorização do SUS.",
          passos: [
            "Agente: o Ministério da Saúde, em parceria com as secretarias municipais.",
            "Ação: ampliar campanhas que mostrem os serviços oferecidos pelo SUS.",
            "Meio: por meio de propagandas em redes sociais, escolas e unidades básicas de saúde.",
            "Finalidade: a fim de fortalecer o reconhecimento da saúde pública como direito universal.",
            "Detalhamento: com foco em serviços pouco conhecidos, como vacinação, vigilância sanitária e transplantes.",
          ],
          resposta:
            '"Cabe ao Ministério da Saúde, em parceria com as secretarias municipais, ampliar campanhas sobre os serviços do SUS, por meio de propagandas em redes sociais, escolas e unidades básicas de saúde, com foco em serviços pouco conhecidos, como vacinação e transplantes, a fim de fortalecer o reconhecimento da saúde pública como direito universal."',
        },
      ],
    },
    armadilhas: [
      {
        erro: 'Proposta vaga ("o governo deve tomar providências").',
        comoEvitar: "Inclua os cinco elementos.",
      },
      {
        erro: "Proposta desconectada dos argumentos.",
        comoEvitar: "Ataque as causas que você discutiu.",
      },
    ],
    conexoes: ["red-comp", "red-rep"],
  },
  {
    topicId: "red-estr",
    resumo: [
      "Estrutura segura: introdução (contexto + tese + anúncio dos argumentos), dois desenvolvimentos e conclusão com proposta.",
      "Cerca de 30 linhas; parágrafos equilibrados.",
      "Cada desenvolvimento: tópico frasal, explicação, repertório e fechamento ligado à tese.",
    ],
    base: {
      texto: [
        "A introdução contextualiza o tema (pode usar um repertório), apresenta a tese e anuncia os dois argumentos. Cada desenvolvimento aprofunda um argumento. A conclusão retoma a tese e traz a proposta de intervenção.",
        "Planeje antes de escrever: anote a tese, os dois argumentos, um repertório para cada e a proposta. Esse planejamento garante o projeto de texto avaliado na Competência 3.",
      ],
    },
    armadilhas: [
      {
        erro: "Começar a escrever sem planejar.",
        comoEvitar: "Gaste alguns minutos montando o esqueleto.",
      },
      {
        erro: "Apresentar argumentos na introdução que não aparecem depois.",
        comoEvitar: "Cumpra o que foi anunciado.",
      },
    ],
    conexoes: ["red-comp", "red-int"],
  },
];
