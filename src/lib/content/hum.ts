import type { TopicContent } from "./types";

export const CONTENT_HUM: TopicContent[] = [
  {
    topicId: "his-br",
    resumo: [
      "Colônia: açúcar e depois mineração, trabalho escravizado e sociedade patriarcal.",
      "Império (1822–1889): leis abolicionistas graduais até a Lei Áurea (1888), sem política de integração dos libertos.",
      "Primeira República: coronelismo, voto de cabresto e conflitos como Canudos e Contestado. Era Vargas: CLT e direitos trabalhistas com sindicatos controlados pelo Estado.",
      'Ditadura (1964–1985): censura, AI-5 (1968), "milagre" econômico e depois crise; redemocratização e Constituição de 1988.',
    ],
    base: {
      texto: [
        "O ENEM cobra História do Brasil a partir de documentos: trechos de leis, crônicas, canções, propagandas e relatos. A pergunta quase sempre é: o que esse documento revela sobre a sociedade da época?",
        'Linha mestra: uma economia agroexportadora baseada no trabalho escravizado (Colônia e Império); uma república controlada por oligarquias (Primeira República); a centralização e a industrialização com controle dos trabalhadores (Era Vargas); a democracia de 1946 a 1964; a ditadura militar; e a democracia da Constituição de 1988, chamada de "Constituição Cidadã".',
      ],
      exemplos: [
        {
          enunciado:
            "Por que a abolição de 1888 não significou plena cidadania para a população negra?",
          passos: [
            "A Lei Áurea extinguiu a escravidão, mas não previu terra, educação ou trabalho para os libertos.",
            "A exclusão social e o racismo persistiram, e seus efeitos chegam ao presente.",
          ],
          resposta:
            "Porque foi uma abolição sem políticas de integração; a desigualdade racial se manteve.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Cidadania e voto: a Lei Saraiva (1881) instituiu eleições diretas, mas excluiu os analfabetos, o que fez o número de votantes despencar. O voto feminino veio com o Código Eleitoral de 1932; os analfabetos só voltaram a votar na redemocratização (1985), e a Constituição de 1988 tornou o voto deles facultativo.",
        "Trabalho: na Primeira República, operários fizeram greves (como a de 1917) e eram reprimidos. Na Era Vargas, o Estado concedeu direitos (salário mínimo, férias, CLT em 1943), mas atrelou os sindicatos ao Ministério do Trabalho: direitos com controle.",
        "Povos indígenas e quilombolas: a Constituição de 1988 reconheceu o direito dos indígenas às terras que tradicionalmente ocupam e a propriedade das terras das comunidades remanescentes de quilombos.",
      ],
      exemplos: [
        {
          titulo: "Lendo uma fonte",
          enunciado:
            'Uma propaganda oficial da década de 1940 apresenta o presidente como "amigo dos trabalhadores". Que cuidado o historiador deve ter ao usar essa fonte?',
          passos: [
            "Propaganda tem um autor (o Estado) e uma intenção (legitimar o governo).",
            "Ela mostra o discurso oficial, não necessariamente a experiência dos trabalhadores.",
            "É preciso cruzá-la com outras fontes (relatos operários, leis, dados).",
          ],
          resposta: "Considerar quem produziu, com que intenção, e confrontar com outras fontes.",
        },
      ],
    },
    avancado: {
      texto: [
        'As questões difíceis pedem a relação entre um documento e um processo mais amplo, sem dizer o nome do processo. Ex.: canções do fim dos anos 1970 que falam do "irmão do Henfil" e de quem "partiu num rabo de foguete" remetem à luta pela anistia e ao retorno dos exilados; uma companhia ferroviária estrangeira recebendo terras no Sul remete às disputas que levaram à Guerra do Contestado.',
        'Conceitos de interpretação do Brasil aparecem com frequência: patrimonialismo (o governante trata o público como privado, em Raymundo Faoro), coronelismo (troca de favores entre chefes locais e governo), "homem cordial" (Sérgio Buarque de Holanda: a dificuldade de separar o público do privado), e a crítica de Florestan Fernandes ao "mito da democracia racial".',
        "Cuidado com o anacronismo: julgar o passado com categorias de hoje sem considerar o contexto é um erro que as alternativas exploram.",
      ],
      exemplos: [
        {
          titulo: "Contexto sem nome",
          enunciado:
            "Um texto de 1711 critica senhores que não permitiam o casamento de escravizados, mas toleravam suas uniões informais. O que ele revela sobre a sociedade colonial?",
          passos: [
            "O autor fala do ponto de vista da moral católica.",
            "A crítica mostra o controle dos senhores sobre a vida familiar dos escravizados, que eram tratados como propriedade.",
          ],
          resposta:
            "A interferência dos senhores na vida pessoal dos escravizados, em conflito com a própria norma religiosa da época.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir Era Vargas (1930–1945) com Estado Novo (1937–1945).",
        comoEvitar: "O Estado Novo é a fase ditatorial, a partir do golpe de 1937.",
      },
      {
        erro: "Dizer que a Lei Áurea garantiu direitos e integração aos libertos.",
        comoEvitar: "Ela só extinguiu a escravidão; não houve reparação nem política de inclusão.",
      },
      {
        erro: "Escolher a alternativa que julga o passado com valores atuais.",
        comoEvitar: "Prefira a que explica o fato no contexto da época.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "A política trabalhista da Era Vargas pode ser resumida como:",
        opcoes: [
          "ausência do Estado nas relações de trabalho",
          "concessão de direitos combinada com controle dos sindicatos",
          "proibição de qualquer legislação trabalhista",
          "autonomia total dos sindicatos",
        ],
        resposta: 1,
        explicacao:
          "Vargas ampliou direitos (CLT, salário mínimo) e atrelou os sindicatos ao Estado.",
      },
      {
        tipo: "opcoes",
        pergunta: "O AI-5 (1968) é lembrado por:",
        opcoes: [
          "convocar eleições diretas",
          "ampliar a censura e suspender garantias constitucionais",
          "conceder anistia aos exilados",
          "criar a CLT",
        ],
        resposta: 1,
        explicacao: "Foi o ato mais duro do regime militar, abrindo o período de maior repressão.",
      },
    ],
    conexoes: ["his-cont", "socio", "his-geral"],
  },
  {
    topicId: "socio",
    resumo: [
      "Durkheim: fatos sociais (exteriores, coercitivos, gerais); solidariedade mecânica (semelhança) e orgânica (divisão do trabalho); anomia.",
      "Weber: ação social com sentido; tipos de dominação (tradicional, carismática, racional-legal).",
      "Marx: luta de classes, exploração do trabalho e alienação.",
      "Escola de Frankfurt: a indústria cultural transforma a cultura em mercadoria padronizada.",
    ],
    base: {
      texto: [
        "A Sociologia estuda como a vida em sociedade molda comportamentos, valores e desigualdades. No ENEM, aparece em temas como trabalho, cultura, identidade, cidadania, racismo, gênero e movimentos sociais, quase sempre a partir de um texto de um autor.",
        "Cidadania envolve direitos civis (liberdades), políticos (votar e ser votado) e sociais (saúde, educação, trabalho). Ela não é só votar: inclui acesso real a esses direitos.",
      ],
      exemplos: [
        {
          enunciado:
            "Em uma comunidade tradicional, todos fazem tarefas parecidas e compartilham crenças; em uma metrópole, as pessoas têm funções diferentes e dependem umas das outras. Que conceitos de Durkheim descrevem essas situações?",
          passos: [
            "Coesão pela semelhança: solidariedade mecânica.",
            "Coesão pela interdependência das funções: solidariedade orgânica.",
          ],
          resposta: "Solidariedade mecânica (comunidade) e orgânica (metrópole).",
        },
      ],
    },
    intermediario: {
      texto: [
        "Indústria cultural (Adorno e Horkheimer): produtos culturais feitos em série para o mercado tendem a padronizar gostos e substituir a reflexão pelo entretenimento.",
        "Identidade na globalização (Stuart Hall): o contato intenso entre culturas desloca identidades antes vistas como fixas, gerando identidades múltiplas e híbridas, mas também reações de fechamento.",
        "Movimentos sociais (feminista, negro, indígena, sem-terra, das pessoas com deficiência) lutam por reconhecimento e por direitos; muitas conquistas viraram leis e políticas públicas.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis trazem um conceito aplicado ao Brasil: racismo estrutural (o racismo está nas instituições e na organização social, não só em atitudes individuais); patrimonialismo; meritocracia em contextos desiguais; políticas de permanência para estudantes indígenas e cotistas; inclusão de grupos historicamente excluídos (ciganos, pessoas com deficiência).",
        "A estratégia é identificar o que o autor critica e qual seria a consequência lógica: um texto que critica a desigualdade de acesso não vai defender uma solução puramente individual.",
      ],
      exemplos: [
        {
          titulo: "Weber e dominação",
          enunciado:
            "Um líder religioso conquista seguidores pela devoção à sua figura extraordinária. Que tipo de dominação é essa, segundo Weber?",
          passos: [
            "Não se baseia em tradição herdada nem em regras impessoais.",
            "Baseia-se nas qualidades excepcionais atribuídas ao líder.",
          ],
          resposta: "Dominação carismática.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Confundir indústria cultural com cultura popular.",
        comoEvitar: "Indústria cultural é a produção em série para o mercado.",
      },
      { erro: "Reduzir cidadania ao voto.", comoEvitar: "Inclua direitos civis e sociais." },
      {
        erro: "Tratar racismo apenas como atitude individual em um texto que fala de estruturas.",
        comoEvitar: "Procure a alternativa que menciona instituições, acesso e história.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Para Durkheim, um fato social é:",
        opcoes: [
          "um comportamento individual e espontâneo",
          "uma maneira de agir exterior, coercitiva e geral",
          "a vontade dos governantes",
          "uma característica biológica",
        ],
        resposta: 1,
        explicacao:
          "Fatos sociais existem fora do indivíduo, exercem pressão sobre ele e são compartilhados pela coletividade.",
      },
    ],
    conexoes: ["filo-cont", "his-br", "geo-urb"],
  },
  {
    topicId: "his-geral",
    resumo: [
      "Grécia: democracia ateniense direta, mas restrita (excluía mulheres, escravizados e estrangeiros).",
      "Roma: conflitos entre patrícios e plebeus geraram leis escritas, como a Lei das Doze Tábuas.",
      "Idade Média: Igreja como eixo cultural; mosteiros, ordens mendicantes (século XIII) e universidades.",
      "Idade Moderna: Renascimento, Reformas, expansão marítima e colonização; Iluminismo e a circulação de ideias em salões, cafés e na imprensa.",
    ],
    base: {
      texto: [
        "O ENEM usa a história geral para discutir permanências e rupturas: como certas instituições (universidade, direito escrito, democracia) surgiram e se transformaram, e como grupos foram incluídos ou excluídos delas.",
        "Na Antiguidade, a cidadania era um privilégio. Em Roma, a falta de leis escritas favorecia os patrícios, que interpretavam o costume; os plebeus pressionaram por leis públicas e escritas.",
      ],
      exemplos: [
        {
          enunciado: "Por que os plebeus romanos reivindicavam leis escritas?",
          passos: [
            "As leis eram transmitidas oralmente e interpretadas pelos patrícios.",
            "Leis escritas e públicas limitariam a arbitrariedade.",
          ],
          resposta:
            "Para ter regras conhecidas por todos e reduzir o poder de interpretação dos patrícios.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Na Idade Média, a pregação das ordens mendicantes (franciscanos e dominicanos) difundia valores cristãos e também discursos sobre o pecado e sobre a mulher associados à desordem moral. Os mosteiros reuniam quem buscava a vida religiosa, mas também reproduziam hierarquias da sociedade.",
        "Na colonização da América, a exploração do trabalho indígena gerou críticas internas, como as do frei Bartolomeu de Las Casas, defensor dos indígenas. As missões jesuíticas reuniam indígenas em reduções, com catequese e trabalho que também serviam aos interesses coloniais.",
        "No Iluminismo, as ideias circulavam em salões, cafés, academias e pela imprensa, com projetos de reforma pela educação e pela razão.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis comparam temporalidades: textos sagrados de épocas diferentes, uma dança condenada no cristianismo antigo e retomada hoje, um museu do século XIX que classificava povos de forma etnocêntrica. A resposta liga o documento à mentalidade da época.",
        'Atenção ao vocabulário de historiadores: "mentalidades", "imaginário", "longa duração" indicam análise de crenças e sentimentos coletivos (como o medo), não de eventos políticos.',
      ],
      exemplos: [
        {
          titulo: "Universidades medievais",
          enunciado: "Por que as universidades medievais são consideradas um legado importante?",
          passos: [
            "Surgiram entre os séculos XII e XIII como corporações de mestres e estudantes.",
            "Organizaram o ensino superior com graus, disciplinas e debate, modelo que chega até hoje.",
          ],
          resposta:
            "Porque criaram uma instituição de produção e transmissão do saber que permanece.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Tratar a democracia ateniense como universal.",
        comoEvitar: "Lembre quem estava excluído da cidadania.",
      },
      {
        erro: 'Ver a Idade Média apenas como "idade das trevas".',
        comoEvitar: "O ENEM valoriza seus legados (universidades, direito, arte).",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Na Atenas clássica, podiam participar da assembleia:",
        opcoes: [
          "todos os habitantes",
          "homens adultos livres, filhos de atenienses",
          "mulheres e estrangeiros ricos",
          "apenas os reis",
        ],
        resposta: 1,
        explicacao: "A cidadania excluía mulheres, escravizados e estrangeiros.",
      },
    ],
    conexoes: ["his-cont", "filo-ant", "his-br"],
  },
  {
    topicId: "filo-cont",
    resumo: [
      "Racionalismo (Descartes): o conhecimento seguro vem da razão. Empirismo (Locke, Hume): vem da experiência; Hume questiona a indução.",
      "Kant: ética do dever; age como se tua máxima pudesse ser lei universal.",
      "Escola de Frankfurt: crítica à razão instrumental e à indústria cultural (Adorno, Horkheimer, Marcuse).",
      "Foucault: poder disciplinar que vigia e normaliza corpos (escolas, prisões, quartéis).",
    ],
    base: {
      texto: [
        'A filosofia moderna discute de onde vem o conhecimento. Para os racionalistas, a razão tem ideias claras e seguras; para os empiristas, tudo vem dos sentidos. Hume mostra que esperar que o futuro repita o passado (indução) é hábito, não certeza lógica, ideia ilustrada pelo "peru indutivista", que conclui que sempre será alimentado até o dia em que é abatido.',
        "Na filosofia contemporânea, o ENEM cobra muito a crítica à sociedade: tecnologia, consumo, poder, linguagem e justiça.",
      ],
      exemplos: [
        {
          enunciado:
            "Um peru é alimentado todas as manhãs e conclui que sempre será. Que tipo de raciocínio ele usa e qual é o seu problema?",
          passos: [
            "Generaliza a partir de casos observados: indução.",
            "Muitos casos não garantem o próximo.",
          ],
          resposta: "Raciocínio indutivo, que não garante a verdade da conclusão.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Existencialismo (Sartre): a existência precede a essência; somos livres e responsáveis pelo que fazemos de nós.",
        'Hannah Arendt: a "banalidade do mal" mostra que grandes crimes podem ser cometidos por pessoas comuns que obedecem sem pensar.',
        "Marcuse: a sociedade industrial avançada integra as pessoas ao sistema e enfraquece o pensamento crítico (o homem unidimensional).",
        'Foucault: o poder não está só no Estado; ele circula em instituições que vigiam, examinam e corrigem, produzindo corpos "dóceis".',
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis trazem trechos densos (Derrida, Deleuze, Bachelard, Fricker) e pedem o conceito central. Derrida distingue o direito (calculável, regra) da justiça (que exige ir além da regra); daí exemplos como a desobediência civil. Deleuze e Guattari descrevem o rizoma, uma rede sem centro, em que qualquer ponto se liga a qualquer outro (como a internet). Miranda Fricker fala da injustiça epistêmica: quando o preconceito retira credibilidade de quem fala.",
        "Epistemologia da ciência: Popper (uma teoria científica precisa ser falseável) e Kuhn (a ciência muda por revoluções de paradigmas).",
      ],
      exemplos: [
        {
          titulo: "Direito e justiça",
          enunciado:
            'Para Derrida, "o direito não é a justiça". Que situação ilustra uma ação considerada justa embora contrária ao ordenamento jurídico?',
          passos: [
            "O direito é um conjunto de regras calculáveis.",
            "A justiça pode exigir agir contra uma regra injusta.",
          ],
          resposta: "A desobediência civil contra uma lei considerada injusta.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Atribuir ao empirismo a ideia de ideias inatas.",
        comoEvitar:
          'Ideias inatas são do racionalismo; empiristas dizem que a mente começa como "tábula rasa".',
      },
      {
        erro: "Reduzir o poder, em Foucault, ao governo.",
        comoEvitar: "Para ele, o poder está espalhado em instituições e práticas.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "Para Kant, uma ação tem valor moral quando:",
        opcoes: [
          "traz a maior felicidade ao maior número",
          "é feita por dever, segundo uma máxima universalizável",
          "segue os costumes da comunidade",
          "gera lucro",
        ],
        resposta: 1,
        explicacao: "A ética kantiana é deontológica: vale a intenção de agir por dever.",
      },
    ],
    conexoes: ["filo-ant", "filo", "socio"],
  },
  {
    topicId: "geo-amb",
    resumo: [
      "Desenvolvimento sustentável: atender às necessidades atuais sem comprometer as gerações futuras (Relatório Brundtland, 1987).",
      "Mudanças climáticas: Acordo de Paris (2015) e metas nacionais de redução de emissões; COPs anuais.",
      "Biomas brasileiros: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pantanal e Pampa, cada um com pressões próprias.",
      'Contradições: soluções "verdes" também têm impactos (mineração para baterias, descarte de painéis solares).',
    ],
    base: {
      texto: [
        "A Geografia ambiental estuda a relação entre sociedade e natureza. No ENEM, os temas mais frequentes são desmatamento e queimadas, recursos hídricos, energia, resíduos sólidos, mudanças climáticas e o papel de povos tradicionais na conservação.",
        "A matriz elétrica brasileira é majoritariamente renovável, com grande peso das hidrelétricas; por isso secas prolongadas afetam a geração de energia e aumentam o uso de termelétricas.",
      ],
      exemplos: [
        {
          enunciado: "Por que uma estiagem prolongada pode encarecer a conta de luz no Brasil?",
          passos: [
            "Com menos chuva, os reservatórios das hidrelétricas baixam.",
            "É preciso acionar termelétricas, mais caras e poluentes.",
          ],
          resposta: "Porque reduz a geração hidrelétrica e exige fontes mais caras.",
        },
      ],
    },
    intermediario: {
      texto: [
        "A Política Nacional de Resíduos Sólidos (Lei 12.305/2010) prevê o fim dos lixões, a coleta seletiva, a logística reversa e a responsabilidade compartilhada pelo ciclo de vida dos produtos.",
        "Terras indígenas e unidades de conservação funcionam como barreiras ao desmatamento; os saberes tradicionais estão associados à conservação da biodiversidade.",
        "Problemas de uso do solo: a irrigação mal manejada em regiões secas causa salinização; o uso intenso de agrotóxicos reduz polinizadores; a monocultura empobrece o solo.",
      ],
    },
    avancado: {
      texto: [
        'Questões difíceis cobram contradições: o carro elétrico reduz emissões no uso, mas depende da mineração de lítio, cobalto e terras-raras; placas solares geram resíduos ao fim da vida útil; hidrelétricas são renováveis, mas alagam áreas e afetam povos e espécies. A resposta certa costuma reconhecer o custo ambiental da alternativa "limpa".',
        "Também cobram a crítica à relação capitalista com a natureza: a natureza transformada em mercadoria e recurso para a acumulação (Neil Smith, Milton Santos).",
      ],
      exemplos: [
        {
          titulo: "Economia circular",
          enunciado:
            "Países que adotaram cedo a energia solar enfrentam agora o descarte de painéis. Qual contradição isso revela?",
          passos: [
            "A energia solar é renovável na geração.",
            "Os equipamentos têm vida útil limitada e contêm materiais que precisam de reciclagem.",
          ],
          resposta:
            "A tensão entre uma fonte limpa na operação e os resíduos que ela gera, que exigem logística reversa e reciclagem.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Escolher a alternativa que trata uma fonte renovável como livre de impactos.",
        comoEvitar: "Toda fonte tem impactos; compare quais são.",
      },
      {
        erro: "Confundir aquecimento global com destruição da camada de ozônio.",
        comoEvitar: "São problemas diferentes, com causas diferentes.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "A irrigação em excesso em regiões semiáridas, com evaporação intensa, pode causar no solo:",
        opcoes: ["arenização", "salinização", "laterização", "voçorocas por geada"],
        resposta: 1,
        explicacao: "A água evapora e deixa os sais na superfície do solo.",
      },
    ],
    conexoes: ["qui-amb", "bio-eco", "geo-agr", "geo-nat"],
  },
  {
    topicId: "geo-urb",
    resumo: [
      "O Brasil se urbanizou rapidamente a partir de 1950; a população urbana passou de 50% no Censo de 1970.",
      "Segregação socioespacial: os mais pobres vão para periferias e áreas de risco, longe dos empregos e serviços.",
      "Impermeabilização do solo causa enchentes; concreto e asfalto, ilhas de calor.",
      "Estatuto da Cidade (Lei 10.257/2001): função social da propriedade urbana e planos diretores.",
    ],
    base: {
      texto: [
        "A industrialização concentrada nas cidades e a modernização do campo provocaram um grande êxodo rural, especialmente entre as décadas de 1950 e 1980. As cidades cresceram mais rápido que a oferta de moradia e infraestrutura.",
        "Metrópoles formam manchas urbanas contínuas (conurbação) e polarizam uma rede de cidades menores.",
      ],
      exemplos: [
        {
          enunciado:
            "Por que bairros com muito asfalto e pouca vegetação sofrem mais com enchentes?",
          passos: [
            "O solo impermeabilizado não absorve a chuva.",
            "A água escoa rapidamente para ruas e rios canalizados, que transbordam.",
          ],
          resposta: "Pela impermeabilização do solo, que aumenta e acelera o escoamento.",
        },
      ],
    },
    intermediario: {
      texto: [
        "Gentrificação: a valorização de uma área (reformas, novos empreendimentos) expulsa moradores antigos de menor renda.",
        "Mobilidade urbana: longos deslocamentos diários aprofundam a desigualdade; o transporte coletivo e cicloviário reduz congestionamentos e emissões.",
        "Medidas de adaptação às mudanças climáticas nas cidades: áreas verdes, telhados verdes, pavimentos permeáveis, parques que alagam de forma controlada.",
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis tratam do espaço como produto social: os espaços públicos são lugares de encontro e também de disputa; feiras e mercados tradicionais são patrimônio e resistência à homogeneização da cidade; a ideia de direito à cidade (Henri Lefebvre) defende o acesso de todos aos benefícios urbanos.",
        "Também pedem a relação entre campo e cidade: hoje há fluxos e modos de vida urbanos no campo e práticas rurais nas cidades, o que torna a fronteira entre os dois menos nítida.",
      ],
      exemplos: [
        {
          titulo: "Contradição urbana",
          enunciado:
            "Uma prefeitura propõe canalizar e cobrir um córrego urbano. Por que essa medida contradiz o modelo de cidade sustentável?",
          passos: [
            "Canalizar acelera o escoamento e reduz a infiltração.",
            "Elimina a vegetação de margem e o espaço de lazer.",
            "Transfere o problema de enchente para áreas abaixo.",
          ],
          resposta:
            "Porque impermeabiliza, elimina áreas verdes e tende a agravar as enchentes em outros pontos.",
        },
      ],
    },
    armadilhas: [
      {
        erro: "Tratar a favela como problema individual dos moradores.",
        comoEvitar: "Relacione com o preço da terra, a renda e a falta de política habitacional.",
      },
      {
        erro: "Achar que mais obras de canalização sempre resolvem enchentes.",
        comoEvitar: "Soluções sustentáveis aumentam a infiltração e a vegetação.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta:
          "A valorização de um bairro que leva à saída dos moradores antigos de menor renda é chamada de:",
        opcoes: ["conurbação", "gentrificação", "metropolização", "êxodo rural"],
        resposta: 1,
        explicacao:
          "Gentrificação é a substituição da população local por grupos de renda maior após a valorização.",
      },
    ],
    conexoes: ["geo-amb", "socio", "bio-saude"],
  },
  // ---------- Humanas: revisão rápida e armadilhas ----------
  {
    topicId: "his-cont",
    resumo: [
      "Revolução Industrial e movimento operário (séculos XVIII e XIX): coalizões e greves deixaram de ser crime aos poucos.",
      "Século XX: guerras mundiais, totalitarismos, Guerra Fria, descolonização e ditaduras na América Latina.",
      "Memória: lugares e movimentos que lembram violações (Mães da Praça de Maio, Muro de Berlim).",
    ],
    base: {
      texto: [
        "A história contemporânea é cobrada pela relação entre técnica, trabalho e direitos (a pílula anticoncepcional e a mudança no papel social das mulheres, por exemplo) e pela memória de violências políticas. As Mães da Praça de Maio denunciavam os desaparecimentos durante a ditadura argentina (1976–1983).",
      ],
    },
    intermediario: {
      texto: [
        "Trabalho: na Europa do século XIX, as coalizões e greves de trabalhadores eram crime; foram legalizadas aos poucos, como resultado de lutas operárias que também conquistaram limites de jornada e proteção social.",
        "Ciência e poder no século XIX: museus e expedições científicas classificavam povos com base em perspectivas evolucionistas e etnocêntricas, servindo também a projetos nacionalistas e imperialistas.",
        'Século XX: a pandemia de gripe de 1918 recebeu o nome de "espanhola" porque a Espanha, neutra na guerra, noticiava a doença sem censura; o Muro de Berlim (1961–1989) virou símbolo e memória da Guerra Fria.',
      ],
    },
    avancado: {
      texto: [
        "Questões difíceis tratam de memória e reparação: lugares de memória, movimentos de familiares de desaparecidos políticos (como as Mães da Praça de Maio, na Argentina) e o debate sobre preservar ou demolir símbolos históricos.",
        "Também relacionam técnica e transformação social: a pílula anticoncepcional (1960) e a autonomia das mulheres; a imprensa e as novas mídias na circulação de ideias.",
      ],
    },
    armadilhas: [
      {
        erro: "Tratar a Guerra Fria como guerra direta entre EUA e URSS.",
        comoEvitar: "Foi uma disputa de influência com conflitos indiretos.",
      },
      {
        erro: "Separar a história da técnica da história social.",
        comoEvitar: "O ENEM pergunta o efeito social de uma inovação.",
      },
    ],
    exercicios: [
      {
        tipo: "opcoes",
        pergunta: "As Mães da Praça de Maio ficaram conhecidas por denunciar:",
        opcoes: [
          "a crise econômica dos anos 2000",
          "os desaparecimentos durante a ditadura argentina",
          "a Guerra das Malvinas",
          "a independência da Argentina",
        ],
        resposta: 1,
        explicacao:
          "O movimento reivindicava informações sobre filhos desaparecidos pela repressão da ditadura (1976–1983).",
      },
    ],
    conexoes: ["his-geral", "his-br", "geo-geopol"],
  },
  {
    topicId: "geo-geopol",
    resumo: [
      "Globalização: fluxos de mercadorias, capitais, informações e pessoas, com desigualdade entre países.",
      "Organismos internacionais (ONU, Conselho de Segurança com membros permanentes com veto) refletem relações de poder.",
      "Refugiados e migrações forçadas; conflitos por rotas e recursos estratégicos (petróleo, terras-raras).",
    ],
    base: {
      texto: [
        "A geopolítica estuda o poder no espaço mundial. O Conselho de Segurança da ONU tem cinco membros permanentes com poder de veto, o que mostra a assimetria entre países. Países que exportam basicamente produtos primários ficam mais vulneráveis às oscilações dos preços internacionais.",
      ],
    },
    armadilhas: [
      {
        erro: "Achar que a globalização beneficia todos igualmente.",
        comoEvitar: "Procure a alternativa que reconhece desigualdades.",
      },
      {
        erro: "Ignorar o papel de recursos e rotas estratégicas nos conflitos.",
        comoEvitar: "Pergunte quem controla o recurso e por onde ele passa.",
      },
    ],
    conexoes: ["geo-amb", "his-cont"],
  },
  {
    topicId: "filo",
    resumo: [
      "Contratualistas: Hobbes (Estado forte para sair da guerra de todos contra todos), Locke (direitos naturais: vida, liberdade, propriedade), Rousseau (vontade geral).",
      "Utilitarismo (Bentham, Mill): a ação certa é a que gera mais felicidade para mais pessoas.",
      "Democracia e direitos humanos como conquistas históricas (Bobbio).",
    ],
    base: {
      texto: [
        "A filosofia política discute o que torna o poder legítimo. Para os contratualistas, o poder nasce de um acordo entre os indivíduos; eles divergem sobre a natureza humana e sobre o tamanho do Estado. Para Bobbio, os direitos humanos não são naturais e eternos: surgem e se ampliam historicamente, por lutas e convenções.",
      ],
    },
    armadilhas: [
      {
        erro: "Atribuir a Rousseau a defesa de um soberano absoluto.",
        comoEvitar: "Isso é Hobbes; Rousseau fala em vontade geral e soberania do povo.",
      },
      {
        erro: "Confundir utilitarismo com egoísmo.",
        comoEvitar: "O critério é a felicidade do maior número, não a do indivíduo.",
      },
    ],
    conexoes: ["filo-ant", "filo-cont", "socio"],
  },
  {
    topicId: "filo-ant",
    resumo: [
      "Pré-socráticos investigavam a natureza (physis) e o princípio de todas as coisas; Heráclito destacou o devir e a unidade dos contrários.",
      "Platão: mundo sensível × mundo das ideias; a cidade justa governada pelos filósofos.",
      "Aristóteles: virtude como meio-termo e hábito; o ser humano é animal político; felicidade (eudaimonia) como fim.",
    ],
    base: {
      texto: [
        "A filosofia antiga aparece no ENEM em trechos que pedem o conceito central. As escolas helenísticas (estoicos, epicuristas) tinham orientação prática: como viver bem diante do que não controlamos. Para Aristóteles, as formas de governo podem ser de um, de poucos ou de muitos, cada uma com uma versão justa e uma corrompida.",
      ],
    },
    armadilhas: [
      { erro: "Atribuir a Platão a ética do meio-termo.", comoEvitar: "Meio-termo é Aristóteles." },
      {
        erro: "Achar que os pré-socráticos discutiam política e ética como tema central.",
        comoEvitar: "Seu foco era a natureza e o princípio das coisas.",
      },
    ],
    conexoes: ["filo", "filo-cont", "his-geral"],
  },
  {
    topicId: "geo-nat",
    resumo: [
      "Placas tectônicas explicam terremotos e vulcões; o Brasil fica no centro de uma placa e tem poucos tremores fortes.",
      "Erosão costeira e voçorocas são processos naturais intensificados pela ação humana.",
      "Inundações bruscas (rápidas) e graduais dependem do relevo, da chuva e da ocupação do solo.",
    ],
    base: {
      texto: [
        'A geografia física estuda relevo, clima, solos e água. O ENEM liga esses processos à ação humana: a retirada de vegetação e a ocupação de áreas de risco intensificam erosão, deslizamentos e inundações. Na Amazônia, a evapotranspiração da floresta abastece de umidade outras regiões ("rios voadores").',
      ],
    },
    armadilhas: [
      {
        erro: "Atribuir todo desastre só à natureza.",
        comoEvitar: "Procure o fator humano que intensificou o processo.",
      },
      {
        erro: "Confundir clima (padrão de longo prazo) com tempo (condição do momento).",
        comoEvitar: "Climograma mostra médias de vários anos.",
      },
    ],
    conexoes: ["geo-amb", "geo-carto"],
  },
  {
    topicId: "geo-agr",
    resumo: [
      "Agronegócio exportador e agricultura familiar convivem; esta é responsável por parte importante dos alimentos do mercado interno.",
      "Concentração de terras e conflitos no campo; reforma agrária e movimentos como o MST.",
      "Agroecologia combina produção e conservação.",
    ],
    base: {
      texto: [
        "A questão agrária brasileira tem raízes na concentração fundiária desde a colonização. A modernização do campo aumentou a produtividade e as exportações, mas também a expulsão de trabalhadores e os impactos ambientais. A fome em um país grande produtor de alimentos é ligada à desigualdade de acesso, não à falta de produção.",
      ],
    },
    armadilhas: [
      {
        erro: "Tratar fome no Brasil como falta de produção de alimentos.",
        comoEvitar: "O problema central é acesso e renda.",
      },
      {
        erro: "Achar que agronegócio e agricultura familiar produzem as mesmas coisas.",
        comoEvitar:
          "O agronegócio foca commodities de exportação; a familiar, a diversidade para o mercado interno.",
      },
    ],
    conexoes: ["geo-amb", "his-br"],
  },
  {
    topicId: "geo-carto",
    resumo: [
      "Escala: quanto menor o denominador, maior o detalhe (1 : 10.000 mostra mais detalhes que 1 : 1.000.000).",
      "Toda projeção distorce algo (área, forma ou distância).",
      "Sensoriamento remoto (imagens de satélite) monitora queimadas, desmatamento e expansão urbana.",
    ],
    base: {
      texto: [
        "Mapas são representações com escolhas: escala, projeção, legenda e generalização. Mapas esquemáticos, como os de metrô, abrem mão da escala e das distâncias reais para destacar conexões, com uma linguagem visual padronizada.",
      ],
    },
    armadilhas: [
      {
        erro: 'Achar que escala "grande" é a de denominador grande.',
        comoEvitar: "Escala grande = denominador pequeno = mais detalhe.",
      },
      {
        erro: "Supor que um mapa esquemático respeita distâncias reais.",
        comoEvitar: "Ele prioriza a conexão entre pontos.",
      },
    ],
    conexoes: ["mat-razao", "geo-nat"],
  },
];
