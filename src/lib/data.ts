export type Area = "mat" | "nat" | "ling" | "hum" | "red";
export type Priority = "alta" | "media" | "baixa";

export const AREAS: Record<Area, { name: string; short: string; color: string; soft: string; dot: string; border: string }> = {
  mat: { name: "Matemática", short: "MAT", color: "text-area-mat", soft: "bg-area-mat/12", dot: "bg-area-mat", border: "border-l-area-mat" },
  nat: { name: "Ciências da Natureza", short: "NAT", color: "text-area-nat", soft: "bg-area-nat/12", dot: "bg-area-nat", border: "border-l-area-nat" },
  ling: { name: "Linguagens", short: "LIN", color: "text-area-ling", soft: "bg-area-ling/12", dot: "bg-area-ling", border: "border-l-area-ling" },
  hum: { name: "Ciências Humanas", short: "HUM", color: "text-area-hum", soft: "bg-area-hum/15", dot: "bg-area-hum", border: "border-l-area-hum" },
  red: { name: "Redação", short: "RED", color: "text-area-red", soft: "bg-area-red/12", dot: "bg-area-red", border: "border-l-area-red" },
};
export const AREA_ORDER: Area[] = ["mat", "nat", "red", "ling", "hum"];

export type Topic = { id: string; area: Area; subject: string; name: string; priority: Priority; tip: string };

const t = (id: string, area: Area, subject: string, name: string, priority: Priority, tip: string): Topic => ({ id, area, subject, name, priority, tip });

export const TOPICS: Topic[] = [
  t("mat-porc", "mat", "Matemática", "Porcentagem", "alta", "Aumentos e descontos sucessivos: multiplique os fatores (1,1 × 0,9)."),
  t("mat-razao", "mat", "Matemática", "Razão e proporção", "alta", "Escalas, velocidades e densidades caem todo ano."),
  t("mat-regra3", "mat", "Matemática", "Regra de três", "alta", "Na composta, verifique se cada grandeza é direta ou inversa."),
  t("mat-estat", "mat", "Matemática", "Estatística (média, moda, mediana)", "alta", "Mediana exige ordenar os dados primeiro."),
  t("mat-prob", "mat", "Matemática", "Probabilidade e análise combinatória", "alta", "Casos favoráveis ÷ casos possíveis. 'E' multiplica, 'ou' soma."),
  t("mat-graf", "mat", "Matemática", "Análise de gráficos e tabelas", "alta", "Leia título, eixos e unidades antes de qualquer conta."),
  t("mat-geop", "mat", "Matemática", "Geometria plana", "alta", "Áreas de figuras compostas e semelhança de triângulos."),
  t("mat-geoe", "mat", "Matemática", "Geometria espacial", "media", "Volume de prismas, cilindros e planificações."),
  t("mat-func", "mat", "Matemática", "Funções (1º e 2º grau, exponencial)", "media", "Interprete o gráfico: coeficiente angular = taxa de variação."),
  t("fis-cine", "nat", "Física", "Cinemática", "alta", "Velocidade média = distância total ÷ tempo total."),
  t("fis-din", "nat", "Física", "Dinâmica (leis de Newton)", "media", "Desenhe as forças antes de aplicar F = m·a."),
  t("fis-ener", "nat", "Física", "Energia e trabalho", "alta", "Conservação de energia resolve a maioria das questões."),
  t("fis-elet", "nat", "Física", "Eletricidade (circuitos, potência)", "alta", "P = U·i e consumo em kWh aparecem com contas de luz."),
  t("fis-termo", "nat", "Física", "Termologia", "media", "Calor sensível Q = m·c·ΔT; mudanças de estado Q = m·L."),
  t("fis-ondas", "nat", "Física", "Ondas e óptica", "media", "v = λ·f. Fenômenos: reflexão, refração, difração."),
  t("qui-esteq", "nat", "Química", "Estequiometria", "alta", "Balanceie, monte a proporção em mols e converta."),
  t("qui-sol", "nat", "Química", "Soluções e concentração", "alta", "C = m/V; diluição: C₁V₁ = C₂V₂."),
  t("qui-termoq", "nat", "Química", "Termoquímica", "media", "ΔH negativo = exotérmica (libera calor)."),
  t("qui-org", "nat", "Química", "Química orgânica", "alta", "Funções orgânicas e reconhecimento de grupos funcionais."),
  t("qui-eletroq", "nat", "Química", "Eletroquímica", "media", "Pilha: ânodo oxida, cátodo reduz."),
  t("bio-eco", "nat", "Biologia", "Ecologia", "alta", "Cadeias alimentares, ciclos biogeoquímicos e impactos ambientais."),
  t("bio-gen", "nat", "Biologia", "Genética", "alta", "Monte o quadro de Punnett e calcule probabilidades."),
  t("bio-cito", "nat", "Biologia", "Citologia", "media", "Organelas e suas funções; mitose x meiose."),
  t("bio-fisio", "nat", "Biologia", "Fisiologia humana", "media", "Sistemas digestório, circulatório e imunológico (vacinas)."),
  t("his-br", "hum", "História", "História do Brasil", "alta", "Era Vargas, Ditadura Militar e escravidão são recorrentes."),
  t("geo-amb", "hum", "Geografia", "Meio ambiente", "alta", "Questões ambientais urbanas e agrárias, clima e solos."),
  t("geo-geopol", "hum", "Geografia", "Geopolítica", "media", "Globalização, blocos econômicos e conflitos atuais."),
  t("filo", "hum", "Filosofia", "Filosofia", "media", "Contratualistas (Hobbes, Locke, Rousseau) e ética."),
  t("socio", "hum", "Sociologia", "Sociologia", "media", "Durkheim, Weber e Marx; movimentos sociais e cidadania."),
  t("lin-interp", "ling", "Português", "Interpretação de texto", "alta", "A resposta está no texto. Desconfie de alternativas extremas."),
  t("lin-gen", "ling", "Português", "Gêneros textuais", "alta", "Identifique função social, público e suporte do texto."),
  t("lin-fig", "ling", "Português", "Figuras de linguagem", "media", "Metáfora, ironia, metonímia e hipérbole são as mais cobradas."),
  t("lin-gram", "ling", "Português", "Gramática aplicada", "baixa", "Foco em variação linguística e efeitos de sentido."),
  t("red-estr", "red", "Redação", "Estrutura dissertativo-argumentativa", "alta", "Introdução, 2 desenvolvimentos e conclusão. ~30 linhas."),
  t("red-comp", "red", "Redação", "As 5 competências", "alta", "Cada competência vale 200 pontos. Conheça os critérios."),
  t("red-rep", "red", "Redação", "Repertório sociocultural", "alta", "Tenha 3 a 4 repertórios coringas e saiba conectá-los ao tema."),
  t("red-int", "red", "Redação", "Proposta de intervenção", "alta", "Agente, ação, meio, finalidade e detalhamento."),
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((x) => [x.id, x])) as Record<string, Topic>;

export const SUBJECTS: { name: string; area: Area }[] = [
  { name: "Matemática", area: "mat" },
  { name: "Física", area: "nat" },
  { name: "Química", area: "nat" },
  { name: "Biologia", area: "nat" },
  { name: "História", area: "hum" },
  { name: "Geografia", area: "hum" },
  { name: "Filosofia", area: "hum" },
  { name: "Sociologia", area: "hum" },
  { name: "Português", area: "ling" },
];

export type Channel = { name: string; desc: string; url?: string };
const CH: Record<string, Channel> = {
  ferretto: { name: "Professor Ferretto", desc: "Matemática e Física direto ao ponto" },
  equaciona: { name: "Equaciona Matemática", desc: "Matemática com resolução de questões" },
  mesalva: { name: "Me Salva!", desc: "Aulas curtas de várias matérias" },
  descomplica: { name: "Descomplica", desc: "Todas as matérias do ENEM" },
  biototal: { name: "Biologia Total", desc: "Biologia com o Prof. Jubilut" },
  boaro: { name: "Professor Boaro", desc: "Português e redação" },
};

export const CHANNELS_BY_SUBJECT: Record<string, Channel[]> = {
  "Matemática": [CH.ferretto, CH.equaciona, CH.mesalva, CH.descomplica],
  "Física": [CH.ferretto, CH.mesalva, CH.descomplica],
  "Química": [CH.mesalva, CH.descomplica],
  "Biologia": [CH.biototal, CH.descomplica],
  "História": [CH.descomplica, CH.mesalva],
  "Geografia": [CH.descomplica, CH.mesalva],
  "Filosofia": [CH.descomplica, CH.mesalva],
  "Sociologia": [CH.descomplica, CH.mesalva],
  "Português": [CH.boaro, CH.descomplica],
  "Redação": [CH.boaro, CH.descomplica, CH.mesalva],
};

export const ytSearch = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
export const ytChannel = (name: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(name)}&sp=EgIQAg%253D%253D`;
export const todaMateria = (q: string) => `https://www.todamateria.com.br/?s=${encodeURIComponent(q)}`;
export const brasilEscola = (q: string) => `https://www.google.com/search?q=${encodeURIComponent("site:brasilescola.uol.com.br " + q)}`;
export const INEP_PROVAS = "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos";

export const CHECKLIST = [
  { id: "doc", group: "Documentos", label: "Documento oficial com foto (original)" },
  { id: "cartao", group: "Documentos", label: "Cartão de confirmação impresso (recomendado)" },
  { id: "caneta", group: "Material", label: "Caneta esferográfica preta de tubo transparente (leve 2)" },
  { id: "garrafa", group: "Material", label: "Garrafa de água transparente, sem rótulo" },
  { id: "horario", group: "Horário", label: "Portões fecham 13h (horário de Brasília). Chegue até 12h" },
  { id: "trajeto", group: "Trajeto", label: "Conferi o local de prova e o tempo de deslocamento" },
  { id: "alim", group: "Alimentação", label: "Lanche leve separado (frutas, castanhas, chocolate)" },
  { id: "almoco", group: "Alimentação", label: "Almoço leve e conhecido antes da prova" },
  { id: "sono", group: "Sono", label: "Dormir pelo menos 7h nas duas noites anteriores" },
  { id: "celular", group: "Material", label: "Celular desligado será lacrado no envelope porta-objetos" },
];

export const MOTIVATION = [
  "Pouco por dia, todo dia. É assim que se chega lá.",
  "Uma questão a mais hoje é um ponto a mais na prova.",
  "Foco no que mais cai. O resto é bônus.",
  "Consistência vence intensidade.",
  "Você não precisa saber tudo. Precisa acertar o essencial.",
  "Respira, abre o caderno e começa pelo primeiro bloco.",
  "Cada bloco concluído é progresso real.",
];
