import type { TopicContent } from "./types";

export const CONTENT_LING: TopicContent[] = [
  {
    topicId: "lin-gen",
    resumo: [
      "Gênero textual = forma que o texto assume para cumprir uma função social (notícia, resenha, campanha, verbete, lei, quarta capa...).",
      "Funções da linguagem: referencial (informar), emotiva (expressar), conativa (convencer, orientar o leitor), fática (manter contato), metalinguística (falar da própria linguagem) e poética (trabalhar a forma).",
      "Pergunte sempre: quem fala, para quem, com que objetivo e em que suporte?",
      "Textos multimodais combinam verbal e não verbal; a resposta costuma estar na relação entre os dois.",
    ],
    base: {
      texto: [
        "A maior parte das questões de Linguagens pergunta a finalidade de um texto. Uma campanha quer mudar um comportamento (conativa); uma notícia quer informar (referencial); uma resenha avalia uma obra (por isso tem marcas de opinião, como adjetivos avaliativos); uma quarta capa apresenta e valoriza o livro para atrair o leitor.",
        'Verbos no imperativo, pronomes de segunda pessoa ("você") e chamadas para ação ("assine", "dê passagem") indicam a função conativa.',
      ],
      exemplos: [
        {
          enunciado:
            'Em uma resenha, qual trecho mostra a avaliação do autor: "a série estreou em 2021" ou "com humor ferino, a autora retrata o confinamento"?',
          passos: [
            "O primeiro apenas informa um dado.",
            'O segundo traz um julgamento ("humor ferino").',
          ],
          resposta: "O segundo, que tem marca de avaliação.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Intergenericidade: um gênero assume a forma de outro para produzir efeito (um poema escrito como lei, uma receita escrita como carta). A pergunta costuma ser: qual é a função real do texto, apesar da forma emprestada?",
        "Infográficos e postagens institucionais combinam dados e imagens para orientar o público; o objetivo pode ser informar e, ao mesmo tempo, conscientizar.",
        "Textos legais têm função referencial e linguagem impessoal; eles determinam princípios e regras.",
      ],
      exemplos: [
        {
          titulo: "Forma emprestada",
          enunciado:
            'Um poema imita a estrutura de um artigo de lei para declarar que "a literatura de Brasília não existe". Qual é o efeito?',
          passos: [
            "A forma legal dá tom de imposição oficial.",
            "Aplicada à literatura, ela gera ironia e provoca reflexão sobre quem decide o que é literatura.",
          ],
          resposta:
            "Criar ironia e levar o leitor a refletir sobre a valorização da produção literária local.",
        },
      ],
    },
    avancado: {
      texto: [
        "As alternativas erradas costumam descrever uma função secundária ou um detalhe do texto. Uma campanha também informa, mas sua função principal é mudar comportamento; uma reportagem pode emocionar, mas sua função principal é informar com profundidade.",
        "Quando o texto mistura gêneros e linguagens, procure a alternativa que explica a relação entre os elementos (por exemplo, a imagem que reforça a frase), e não a que descreve apenas um deles.",
      ],
    },
    armadilhas: [
      {
        erro: "Escolher a função secundária como principal.",
        comoEvitar: "Pergunte qual é o objetivo final do texto para o leitor.",
      },
      {
        erro: "Classificar o gênero pela forma emprestada.",
        comoEvitar: "Veja a função real: um poema em forma de lei continua sendo poema.",
      },
      {
        erro: "Ignorar a parte não verbal de cartazes e tirinhas.",
        comoEvitar: "Leia imagem e texto juntos; o sentido nasce da combinação.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          '"Ouviu a sirene? Dê passagem à ambulância." A função de linguagem predominante é:',
        opcoes: ["referencial", "emotiva", "conativa", "metalinguística"],
        resposta: 2,
        explicacao: "O texto se dirige ao leitor com verbo no imperativo para orientar sua ação.",
      },
    ],
    conexoes: ["lin-interp", "lin-tic", "lin-lit"],
  },
  {
    topicId: "lin-lit",
    resumo: [
      "Romantismo (a partir de 1836): idealização, nacionalismo e indianismo (José de Alencar), sentimentalismo.",
      "Realismo (a partir de 1881): crítica social e psicológica; Machado de Assis. Simbolismo: musicalidade, subjetividade, sinestesias (Cruz e Sousa).",
      "Modernismo: Semana de 1922 (ruptura); romance de 30 (regionalismo crítico: Graciliano Ramos, Rachel de Queiroz, José Lins do Rego); depois Clarice Lispector e Guimarães Rosa.",
      'Literatura contemporânea: vozes negras, indígenas e femininas; "escrevivência" (Conceição Evaristo).',
    ],
    base: {
      texto: [
        "O ENEM não pede datas de cor: pede para reconhecer, em um trecho, as marcas de uma estética ou de um contexto. Idealização da mulher e do amor? Romantismo. Ironia, análise de interesses e crítica à sociedade burguesa? Realismo. Seca, latifúndio e desigualdade no Nordeste em linguagem direta? Romance de 30.",
        "Muitas questões ligam o texto ao seu contexto histórico: uma narradora do pós-abolição, um drama ambientado no século XVII que fala da ditadura dos anos 1970, um romance de 1930 sobre o engenho de açúcar.",
      ],
      exemplos: [
        {
          enunciado:
            "Um trecho mostra o neto do senhor de engenho acompanhando o avô pelos campos, com trabalhadores submissos e mulheres em condição subalterna. A que estética ele se liga?",
          passos: [
            "Cenário rural nordestino, latifúndio e relações de dependência.",
            "Narrativa memorialista com denúncia social.",
          ],
          resposta: "Ao romance regionalista de 30 (ex.: Menino de engenho, de José Lins do Rego).",
        },
      ],
    },
    intermediario: {
      texto: [
        'Romantismo com crítica: em Senhora, de José de Alencar, a heroína "compra" o marido, expondo o casamento por interesse, ainda dentro de uma resolução amorosa romântica. Em Inocência, de Taunay, o sertão e o pai autoritário reproduzem valores patriarcais.',
        "Machado de Assis (Memórias póstumas de Brás Cubas, Dom Casmurro, Esaú e Jacó) usa narradores irônicos e pouco confiáveis para expor a hipocrisia da elite.",
        "Graciliano Ramos (São Bernardo, Vidas secas): linguagem seca, personagens embrutecidas pelas relações de poder e pela miséria.",
        "Clarice Lispector: foco na experiência interior, epifanias e questionamento da linguagem; o leitor é convidado a participar da construção do sentido.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis cobram o recurso que produz o efeito: o tempo verbal (pretérito imperfeito cria a imagem memorialista de hábitos do passado), o foco narrativo (primeira pessoa e parcialidade), a intertextualidade (reescritas de Capitu, paródias, releituras de mitos) e a relação entre forma e contexto político (metáforas para driblar a censura nos anos 1970).",
        "Literatura contemporânea aparece com frequência: autoras e autores negros e indígenas, temas como racismo, migração, memória familiar e identidade. A resposta liga a experiência individual narrada a uma questão social mais ampla.",
      ],
      exemplos: [
        {
          titulo: "Recurso e efeito",
          enunciado:
            'Em "Meu avô me levava sempre... gostava de percorrer... acudia...", qual é o efeito do pretérito imperfeito?',
          passos: [
            "O imperfeito indica ações habituais e contínuas no passado.",
            "O narrador relembra uma rotina.",
          ],
          resposta: "Construir uma imagem memorialista, de recordação de hábitos da infância.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Classificar qualquer texto com amor como romântico.",
        comoEvitar: "Veja se há idealização (Romantismo) ou análise crítica e irônica (Realismo).",
      },
      {
        erro: "Tratar o narrador em primeira pessoa como neutro.",
        comoEvitar: "Ele interpreta os fatos a seu favor; desconfie.",
      },
      {
        erro: "Escolher a alternativa que fala só do enredo quando a pergunta é sobre recurso de linguagem.",
        comoEvitar: "Procure o mecanismo (tempo verbal, ponto de vista, metáfora).",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "A linguagem enxuta, o sertão nordestino e personagens oprimidos pela seca e pelo latifúndio caracterizam:",
        opcoes: ["o Arcadismo", "o Romantismo indianista", "o romance de 30", "o Parnasianismo"],
        resposta: 2,
        explicacao:
          "São marcas do regionalismo crítico da segunda fase modernista (romance de 30).",
      },
    ],
    conexoes: ["lin-interp", "lin-fig", "lin-arte", "his-br"],
  },
  {
    topicId: "lin-gram",
    resumo: [
      "Variação linguística: regional, social, situacional (formal × informal) e histórica. Toda variedade é legítima; o critério é a adequação ao contexto.",
      "Preconceito linguístico: julgar a pessoa pela forma como fala.",
      "Coesão: retomar termos (pronomes, sinônimos) e ligar ideias (conectivos com valor de causa, oposição, conclusão...).",
      "Gramática no ENEM é sempre efeito de sentido: o que aquela escolha (tempo verbal, pontuação, palavra) produz no texto.",
    ],
    base: {
      texto: [
        'O ENEM trata a língua como prática social: expressões regionais ("maranhês", "amazonês"), falares de comunidades (a Língua da Tabatinga, a "língua de santo" dos candomblés) e marcas da oralidade são patrimônio linguístico, não erro.',
        "A norma-padrão é adequada a situações formais (leis, textos acadêmicos, a própria redação do ENEM); usá-la nesses contextos não torna as outras variedades inferiores.",
      ],
      exemplos: [
        {
          enunciado: "Em um texto de lei, o uso da norma-padrão se justifica por quê?",
          passos: [
            "A lei é um texto oficial, formal e de alcance nacional.",
            "Precisa ser precisa e impessoal.",
          ],
          resposta: "Pela adequação ao gênero e à situação formal de comunicação.",
        },
      ],
    },
    intermediario: {
      texto: [
        'Conectivos e sentidos: "portanto", "logo" (conclusão); "porque", "pois" (causa); "consequentemente", "por isso" (consequência); "mas", "entretanto" (oposição); "embora", "ainda que" (concessão); "caso", "se" (condição).',
        'Pontuação muda sentido: "Vamos comer, Pedro" (vocativo) × "Vamos comer Pedro". Repetições e marcadores da fala ("daí", "aí", "né") organizam a narrativa oral.',
        "Empréstimos e neologismos mostram que a língua muda com o contato entre culturas e com a tecnologia.",
      ],
    },
    avancado: {
      texto: [
        'Questões difíceis pedem a função de um recurso específico em um texto longo: a quem um pronome se refere (coesão referencial), que relação um conectivo estabelece, por que uma palavra genérica ("coisa") é usada para garantir a progressão sem repetir.',
        'Também cobram atitudes diante da variação: textos que discutem o uso do feminino em nomes de eventos, a "tradução" do juridiquês ou a escrita de línguas indígenas em teclados digitais. A resposta certa reconhece a dimensão social e política dessas escolhas, sem tratá-las como simples erro ou acerto.',
      ],
      exemplos: [
        {
          titulo: "Coesão referencial",
          enunciado:
            '"O meteoro chegou sem aviso. Ele explodiu no ar como várias bombas." A que se refere "Ele"?',
          passos: [
            "O pronome retoma o termo anterior mais próximo compatível em gênero e número.",
            'Só "meteoro" é masculino singular e faz sentido com "explodiu".',
          ],
          resposta: "Ao meteoro.",
        },
      ],
    },
    armadilhas: [
      {
        erro: 'Escolher a alternativa que chama a variedade popular de "errada".',
        comoEvitar: "No ENEM, variedades são legítimas; avalia-se a adequação.",
      },
      {
        erro: "Confundir causa com consequência nos conectivos.",
        comoEvitar: "Causa vem antes no tempo; consequência é o resultado.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: 'No período "Embora chovesse, o jogo continuou", o conectivo "embora" expressa:',
        opcoes: ["causa", "conclusão", "concessão", "condição"],
        resposta: 2,
        explicacao: "Concessão: um fato contrário que não impede o outro.",
      },
    ],
    conexoes: ["lin-interp", "lin-gen", "red-comp"],
  },
  // ---------- Linguagens: revisão rápida e armadilhas ----------
  {
    topicId: "lin-interp",
    resumo: [
      "Localize a tese (o que o autor defende) e os argumentos (dados, exemplos, autoridade).",
      "Inferência é o que o texto permite concluir, não o que você acha.",
      'Desconfie de alternativas com "sempre", "nunca", "todos" e de afirmações além do texto.',
    ],
    base: {
      texto: [
        "Nas questões de interpretação, a resposta é sustentada por um trecho. Estratégias argumentativas frequentes: dados estatísticos (para comprovar), argumento de autoridade, exemplificação, comparação, perguntas retóricas (para levar o leitor a refletir). Em comparações entre textos, procure o ponto em comum e a divergência.",
      ],
    },
    intermediario: {
      texto: [
        "Em questões com dois textos, faça uma pequena tabela mental: tema de cada um, posição de cada autor, ponto em comum e divergência. As alternativas erradas costumam inverter os textos ou atribuir a um deles a ideia do outro.",
        "Estratégias argumentativas e seus efeitos: dado estatístico comprova e dá objetividade; argumento de autoridade empresta credibilidade; exemplo concretiza; pergunta retórica leva o leitor a refletir; comparação aproxima ideias diferentes.",
      ],
      exemplos: [
        {
          titulo: "Dois textos",
          enunciado:
            "Texto I critica o uso de telas durante as refeições em família. Texto II conta como uma videochamada aproximou uma avó e um neto que moram em países diferentes. O que os aproxima?",
          passos: [
            "Tema comum: tecnologia nas relações.",
            "Divergência: o primeiro mostra o isolamento de quem está perto; o segundo, a aproximação de quem está longe.",
          ],
          resposta:
            "Ambos tratam a tecnologia como mediadora das relações; o efeito depende do uso.",
        },
      ],
    },
    avancado: {
      texto: [
        'Questões difíceis pedem a estratégia usada para sustentar uma tese específica ("para comprovar que há desigualdade de gênero na ciência, a autora..."). A resposta é o recurso que de fato aparece no texto e que serve àquela tese, não qualquer recurso presente.',
        'Inferência: a conclusão precisa decorrer do texto. Se o texto fala de um caso, a alternativa que generaliza para "todos" ou "sempre" extrapola.',
        "Intertextualidade: reconheça quando um texto retoma outro (mito, conto, obra clássica) para reinterpretá-lo, parodiá-lo ou atualizá-lo.",
      ],
    },
    armadilhas: [
      {
        erro: "Escolher a alternativa verdadeira no mundo, mas que não está no texto.",
        comoEvitar: "Aponte o trecho que comprova a resposta.",
      },
      {
        erro: "Generalizar o que o texto diz sobre um caso específico.",
        comoEvitar: "Mantenha o alcance da afirmação do autor.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          'Um artigo termina com o dado "apenas 3% dos influenciadores mais pagos são negros". Esse recurso serve para:',
        opcoes: [
          "ilustrar com um caso pessoal",
          "comprovar a tese com um dado objetivo",
          "apelar à emoção do leitor",
          "mudar de assunto",
        ],
        resposta: 1,
        explicacao: "Dados estatísticos dão objetividade e comprovam a tese de desigualdade.",
      },
    ],
    conexoes: ["lin-gen", "lin-gram", "red-rep"],
  },
  {
    topicId: "lin-fig",
    resumo: [
      "Metáfora: comparação implícita. Personificação: características humanas a seres não humanos.",
      "Ironia: dizer o contrário do que se pensa, com intenção crítica.",
      "Metonímia: substituição por proximidade (autor pela obra, parte pelo todo).",
    ],
    base: {
      texto: [
        'Figuras de linguagem aparecem em poemas, crônicas, charges e anúncios. A pergunta costuma ser sobre o efeito: a ironia de uma charge critica um comportamento; a metáfora de uma crônica traduz um sentimento difícil de explicar; a polissemia (palavra com vários sentidos, como "rede") cria jogos de sentido.',
      ],
    },
    armadilhas: [
      {
        erro: "Confundir metáfora com comparação explícita.",
        comoEvitar: 'Com "como" ou "tal qual", é comparação; sem conectivo, metáfora.',
      },
      {
        erro: "Ler a ironia ao pé da letra.",
        comoEvitar: "Contraste o que é dito com o contexto.",
      },
    ],
    conexoes: ["lin-lit", "lin-interp"],
  },
  {
    topicId: "lin-arte",
    resumo: [
      "Arte contemporânea valoriza o processo, o conceito e objetos do cotidiano ressignificados.",
      "Arte afro-brasileira e indígena: afirmação de identidades e de saberes historicamente invisibilizados.",
      "Patrimônio cultural inclui o imaterial (festas, saberes, músicas, feiras).",
    ],
    base: {
      texto: [
        "As questões de Artes pedem a relação entre a obra e o que ela propõe: retratos de pessoas negras que questionam o retrato das elites, objetos do cotidiano usados como suporte, performances e danças que incorporam corpos diversos. Não é preciso decorar estilos; é preciso ler a obra no seu contexto.",
      ],
    },
    intermediario: {
      texto: [
        "Arte contemporânea: o artista pode usar objetos do cotidiano retirados de sua função (cartelas de remédio, resíduos, fotografias), o próprio corpo (performance) ou a participação do público. A pergunta costuma ser: qual ideia a obra coloca em discussão?",
        "Representatividade: obras que dão protagonismo a pessoas negras, indígenas ou populares questionam a história da arte centrada nas elites (o retrato pintado era privilégio de quem podia pagar).",
        "Dança e música: incorporação de movimentos do cotidiano, diversidade de corpos, cultura regional (como a música paraense de Dona Onete) e manifestações populares (como o festival de Parintins) aparecem como expressões de identidade.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis comparam obras de épocas distantes (uma escultura de 2500 a.C. e uma moderna) ou de um mesmo artista em fases diferentes, pedindo o elemento comum. Observe forma (cores, traços, materiais), tema e contexto.",
        "A presença de artistas indígenas em grandes exposições internacionais é lida como afirmação de outros saberes e cosmologias no circuito da arte, e não apenas como pauta ambiental.",
        "Patrimônio cultural: o registro de bens imateriais (feiras, festas, saberes, modos de fazer) reconhece práticas vivas, ligadas à memória e à identidade de grupos.",
      ],
    },
    armadilhas: [
      {
        erro: "Julgar a obra contemporânea pela técnica tradicional.",
        comoEvitar: "Pergunte qual ideia a obra coloca em discussão.",
      },
      {
        erro: 'Tratar a produção indígena como apenas "artesanato".',
        comoEvitar: "O ENEM a reconhece como arte e como expressão cultural e política.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "Um artista estampa fotos de cidades sobre cartelas de remédio vazias. Na arte contemporânea, esse procedimento:",
        opcoes: [
          "segue as regras da pintura acadêmica",
          "retira objetos do cotidiano de sua função para criar novos sentidos",
          "busca apenas a reprodução fiel da paisagem",
          "rejeita qualquer relação com a sociedade",
        ],
        resposta: 1,
        explicacao:
          "Ressignificar objetos do cotidiano é um procedimento central da arte contemporânea.",
      },
    ],
    conexoes: ["lin-lit", "lin-ef", "his-br"],
  },
  {
    topicId: "lin-estr",
    resumo: [
      "São 5 questões (inglês ou espanhol); o comando vem em português: leia-o primeiro.",
      "Use cognatos e o contexto; cuidado com falsos cognatos (actually = na verdade; pretend = fingir; embarazada = grávida; exquisito = delicioso).",
      "As perguntas são de interpretação: tema, objetivo, efeito de uma expressão.",
    ],
    base: {
      texto: [
        "As questões de língua estrangeira são de compreensão de textos variados (poemas, canções, charges, reportagens). Leia o enunciado em português, volte ao texto procurando as palavras-chave e não traduza tudo: o sentido geral e o trecho certo bastam.",
      ],
    },
    intermediario: {
      texto: [
        "Tipos de texto frequentes: poemas e letras de canção (pergunta sobre o que o eu lírico ressalta), charges e tirinhas (crítica ou ironia), reportagens e artigos (objetivo, posição do autor) e anúncios (efeito de uma expressão).",
        'Em espanhol, cuidado com heterossemânticos (palavras parecidas com sentido diferente): "oficina" = escritório; "rato" = momento; "polvo" = pó; "cena" = jantar. Em inglês: "actually" = na verdade; "eventually" = finalmente; "pretend" = fingir; "library" = biblioteca.',
      ],
    },
    avancado: {
      texto: [
        'Questões difíceis pedem o efeito de um recurso: a repetição de uma palavra ("one", "Remember"), o diminutivo que marca memória afetiva, uma expressão idiomática, um empréstimo entre línguas. Procure a alternativa que explica a função do recurso no texto inteiro.',
        "Temas recorrentes: identidade e migração, diversidade linguística e cultural das Américas, tecnologia e gerações, crítica social em charges.",
      ],
    },
    armadilhas: [
      {
        erro: "Confiar em falsos cognatos.",
        comoEvitar: 'Confira se o sentido "traduzido" combina com o contexto.',
      },
      {
        erro: "Gastar tempo traduzindo o texto inteiro.",
        comoEvitar: "Leia o comando e as alternativas antes.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: 'Em espanhol, a palavra "embarazada" significa:',
        opcoes: ["envergonhada", "grávida", "embaraçada", "atrasada"],
        resposta: 1,
        explicacao: 'É um falso cognato clássico: "embarazada" = grávida.',
      },
    ],
    conexoes: ["lin-interp", "lin-gen"],
  },
  {
    topicId: "lin-ef",
    resumo: [
      "Esporte como fenômeno social: mídia, mercado, gênero, raça e inclusão.",
      "Saúde em perspectiva ampliada: corpo, mente e condições sociais.",
      "Capacidades físicas: força, velocidade, resistência, flexibilidade, coordenação e equilíbrio.",
    ],
    base: {
      texto: [
        "Educação física no ENEM é lida a partir de textos: o futebol regido pelo capital e pela mídia, mulheres em lutas e no esporte de alto rendimento, programas de inclusão paralímpica, a motivação para um estilo de vida ativo. A pergunta liga a prática corporal a questões sociais.",
      ],
    },
    intermediario: {
      texto: [
        "O esporte de alto rendimento é atravessado por mídia e mercado: horários de jogos, regras e até o estilo de jogo podem mudar para atender a patrocinadores e transmissões.",
        "Gênero e esporte: barreiras sócio-históricas excluíram mulheres de competições e de modalidades (como lutas e futebol); hoje há avanços, mas persistem desigualdades de salário, visibilidade e estrutura.",
        "Inclusão: programas e modalidades paralímpicas ampliam o acesso, e minibiografias de atletas mostram trajetórias de superação e de mudança de modalidade.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis ligam capacidades físicas a necessidades concretas: um atleta de salto com vara que precisa ganhar centímetros depende de potência (força aplicada com velocidade); um maratonista, de resistência aeróbia.",
        "Saúde ampliada: a motivação para um estilo de vida ativo depende de vivências variadas, prazer e acesso, e não só de obrigação individual. Textos sobre pandemia e saúde mental cobram essa visão.",
        "Distinção entre briga e luta: a luta tem regras, respeito ao outro e finalidade esportiva; a briga desumaniza o adversário.",
      ],
    },
    armadilhas: [
      {
        erro: "Reduzir a saúde à ausência de doença.",
        comoEvitar: "Considere fatores sociais, emocionais e de acesso.",
      },
      {
        erro: "Escolher a capacidade física pela modalidade, sem ler a necessidade descrita.",
        comoEvitar:
          "Relacione a dificuldade do atleta (por exemplo, potência no salto) à capacidade.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "A mudança de regras de um esporte para caber em transmissões de TV mostra principalmente a influência:",
        opcoes: ["dos atletas", "da mídia e do mercado", "das torcidas", "dos árbitros"],
        resposta: 1,
        explicacao: "O esporte-espetáculo se adapta às exigências comerciais das transmissões.",
      },
    ],
    conexoes: ["lin-arte", "socio"],
  },
  {
    topicId: "lin-tic",
    resumo: [
      "Tecnologias digitais mudam a escrita, a leitura, o trabalho e as relações.",
      "Temas frequentes: inteligência artificial, desinformação, uso de telas, algoritmos e inclusão digital.",
      "A resposta costuma equilibrar benefícios e riscos, sem tecnofobia nem entusiasmo cego.",
    ],
    base: {
      texto: [
        "Os textos sobre tecnologia discutem impactos: aplicativos que ajudam em problemas de saúde, consumo de energia e água por data centers, detecção de textos feitos por IA (por padrões de escrita), memes e fake news na educação, telas e saúde mental. A posição do autor geralmente defende o uso equilibrado e crítico.",
      ],
    },
    intermediario: {
      texto: [
        "Inteligência artificial: ferramentas de detecção reconhecem padrões de escrita; o uso de IA levanta questões de autoria, autenticidade e consumo de energia e água em data centers.",
        "Desinformação e memes: circulam rápido porque são curtos, emocionais e compartilháveis; a educação midiática ensina a checar fonte e contexto.",
        "Acessibilidade e inclusão: aplicativos que adaptam teclados a línguas indígenas ou ajudam pessoas com doenças crônicas mostram a tecnologia a serviço de necessidades específicas.",
      ],
    },
    avancado: {
      texto: [
        'Questões difíceis pedem o raciocínio do autor sobre o futuro de uma tecnologia (a televisão que "nos vê" em vez de só ser vista), ou a característica inovadora de um projeto. A resposta costuma estar no impacto social, e não na descrição técnica.',
        "Novos gêneros digitais (podcast, postagem, thread) têm características próprias; comparar com gêneros antigos (rádio, carta) é um tipo frequente de questão.",
      ],
    },
    armadilhas: [
      {
        erro: 'Escolher alternativas extremas ("a tecnologia é a causa de todos os males").',
        comoEvitar: "Procure a que reconhece uso, contexto e equilíbrio.",
      },
      {
        erro: "Ignorar o impacto ambiental e social das tecnologias digitais.",
        comoEvitar: "Lembre de energia, água, trabalho e desigualdade de acesso.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "Um texto afirma que usar telas para videochamadas e estudo tem efeitos diferentes de rolar redes sociais por horas. A posição defendida é:",
        opcoes: [
          "proibir as telas",
          "o uso equilibrado e consciente das tecnologias",
          "o uso ilimitado das redes",
          "a substituição da escola pela internet",
        ],
        resposta: 1,
        explicacao:
          "O texto distingue usos, o que leva à defesa do equilíbrio, não da proibição nem do excesso.",
      },
    ],
    conexoes: ["lin-gen", "lin-interp", "red-rep"],
  },
];
