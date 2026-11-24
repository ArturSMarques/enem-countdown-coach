# Reta Enem — Prompt de melhorias (v2, ajustado ao repositório)

> Prompt para o Claude trabalhar dentro do repositório `ArturSMarques/enem-countdown-coach`.
> Ele **substitui** os arquivos `PROMPT-RETA-ENEM-COMPLETO*.md` desta pasta, que foram escritos antes de alguém ler o código e supunham coisas que o projeto não tem.

---

## 0. Como trabalhar

Você vai evoluir o **Reta Enem** (retaenem.com.br), um site feito por estudantes do ensino médio como TCC. Objetivo do site: melhorar a educação no ensino médio, aprofundando o que os alunos sabem nas matérias que mais caem no Enem. No código e nos títulos das páginas o app aparece como **"Reta Final ENEM"**; a equipe o chama de **Reta Enem**. Não renomeie nada sem a equipe pedir.

**Antes de qualquer mudança**
1. Leia `AGENTS.md`, `roadmap.md` e `docs/incidencia-enem.md`. As regras do `AGENTS.md` valem acima deste texto.
2. Rode os testes e o build como estão (`test`, `lint` e `build` do `package.json`) e anote o resultado. Isso é a linha de base: você não pode deixar nada pior do que encontrou.
3. Escreva um plano curto da primeira fase e mostre antes de codar.

**Regras do projeto (resumo do que o `AGENTS.md` exige)**
- O projeto é conectado ao **Lovable**: commits na branch conectada (`main`) aparecem lá. Nunca reescreva histórico já publicado (sem force push, rebase, amend ou squash do que já subiu). Trabalhe em uma branch por fase, abra um pull request e só faça o merge quando a fase estiver funcionando. Antes de começar cada fase, atualize a partir da `main`, porque o Lovable também pode ter alterado arquivos.
- O estado do aluno fica **no navegador** (`localStorage`, chave `reta-final-enem-v1`) e é versionado (`STATE_VERSION`, hoje **2**). **Toda mudança no formato salvo precisa de um passo em `migrate()` (`src/lib/store.ts`) e de um teste em `src/test/state-migration.test.ts`.** O aluno nunca pode perder dados.
- A lógica do plano é pura e testada (`src/lib/planner.ts`). Mantenha assim: regra nova entra como função pura com teste.
- Datas do Enem vêm de `src/lib/editions.ts`. Nunca escreva um ano fixo no código.
- Os ids das questões são **append-only**: nunca reordene nem mude um id existente.
- Links externos passam por `src/lib/youtube.ts` e `ExternalResourceLink`, sempre como link `https` simples em nova aba.
- Conteúdo de estudo: precisão primeiro. O que for incerto vai em `aConfirmar`, nunca como fato.
- O build precisa continuar funcionando nos **dois alvos**: Lovable/Cloudflare e Render/Node (`RENDER=true`, ver `vite.config.ts` e `render.yaml`).

**Regras gerais**
- Textos para o aluno em português do Brasil. Comentários de código seguem o idioma do arquivo.
- Nunca coloque chaves de API, senhas ou segredos no código, no chat ou no navegador. Use variáveis de ambiente (no Render).
- Não invente dados. Onde faltar uma fonte oficial, deixe o campo vazio, registre a pendência e avise.
- Quando uma decisão não estiver clara e for pequena, escolha a opção mais simples e deixe um comentário. Quando for grande ou irreversível (lista na seção 2), pare e pergunte.
- Ao fim de cada fase entregue: o que mudou, arquivos alterados, como testar à mão e o resultado dos testes.

---

## 1. O que o projeto é hoje

Leia esta seção como o mapa do que **já existe**. Estenda o que existe; não reescreva.

| Área | Estado atual | Onde |
|---|---|---|
| Plataforma | TanStack Start (React 19, Vite), componentes shadcn em `src/components/ui`, `recharts` já instalado, testes com Vitest em `src/test` | `package.json` |
| Dados do aluno | Só no navegador. **Não existe servidor de dados, login nem banco.** Há um servidor de renderização (`src/server.ts`), mas sem persistência | `src/lib/store.ts` |
| Plano | Rolante (`HORIZON_DAYS` = 56 dias), com fases Base, Aprofundamento, Revisão intensiva e Semana final; revisões espaçadas em D+3, D+10 e D+30 (`REVIEW_GAPS`); redação às quartas e sábados; simulado aos domingos | `src/lib/planner.ts` |
| Onboarding | Data da prova (automática, escolher edição ou manual), horas por dia (`1 \| 1.5 \| 2`), turno (`manha \| noite \| ambos`), dificuldade de 1 a 5 em 4 áreas (Mat, Nat, Ling, Hum), meta de nota geral opcional. Título "Vamos montar seu plano em 1 minuto." | `src/routes/onboarding.tsx` |
| Conteúdos | 72 tópicos (`TOPICS`). O **aluno marca sozinho** Dominado / Revisar / Não vi (`TopicStatus`) | `src/routes/conteudos.tsx`, `src/lib/data.ts` |
| Questões | **198** questões: 95 curtas, 43 no estilo Enem, 60 de aprofundamento com `porQue` por alternativa. **Todas autorais.** Média de **2,8 por tópico**, máximo 7, nenhum tópico com 10. Cada questão tem nível fácil, média ou difícil | `src/lib/questions*.ts`, `src/lib/question-types.ts` |
| Respostas | `state.quiz[id]` guarda **uma** resposta por questão (`{ choice, day }`). Não há histórico de tentativas nem tempo gasto | `src/lib/store.ts` |
| Nível por área | `stageOf()` classifica cada área em base, regular ou avançado, com ≥ 3 respostas por nível. Alimenta o plano e a escolha das questões do dia | `src/lib/mastery.ts`, `src/lib/quiz.ts` |
| Desempenho | Formulário manual "Registrar questões"; acertos por área em %; nível por área; "Pontos fracos" (matérias abaixo de 60% com ≥ 5 questões, em vermelho) | `src/routes/desempenho.tsx` |
| Aulas | Por tópico: canais recomendados com link de **busca** no YouTube, link do canal, Toda Matéria e Brasil Escola, e "Meus links". **Não há vídeo embutido** nem ID de vídeo escolhido | `src/routes/aulas.tsx`, `src/lib/data.ts` |
| Não existe | Login, ranking, avatar, perfil, XP, conquistas, painel de professor, simulado com cronômetro, correção de redação, PWA | — |

---

## 2. Decisões que dependem de pessoas

Não decida estas sozinho. Quando chegar nelas, apresente 2 opções curtas (prós e contras) e espere a resposta da equipe e do professor.

1. **Servidor de dados e login** (seção 13): onde guardar contas, progresso e ranking. Exemplos: Supabase (que o Lovable integra) ou um banco no Render. Envolve custo, conta e segurança.
2. **Consentimento dos responsáveis**: muitos alunos são menores de idade. Como a escola quer tratar isso antes de abrir contas ao público.
3. **Fonte e licença das questões reais** de Enem, ITA e Fuvest (seção 7).
4. **Fonte dos pesos dos cursos** (seção 4.5): qual edital ou tabela do SiSU usar.
5. **Quem é o professor curador** das videoaulas e quem revisa as questões novas.
6. **Orçamento e fornecedor de IA** para explicações e correção de redação (seção 11).
7. **Valores iniciais** das regras de domínio e de XP (seções 6 e 8): proponha, a equipe ajusta.

---

## 3. Direção visual (vale para o site inteiro)

Referência de **estilo**: o Brilliant (site de matemática e programação). A ideia é a mesma, **não é cópia**: não reproduzir logo, ilustrações, textos ou assets deles. Use a identidade do Reta Enem.

**Tom:** moderno e bonito, mas **sério**, de quem estuda para o Enem. Visual limpo e focado; sem mascotes, sem excesso de emojis, nada infantil. Cores vivas só com intenção (progresso, destaque, botão principal) sobre uma base calma. Gamificação discreta, que motiva sem distrair. **Textos para serem lidos**: frases claras e úteis, nada de rótulos soltos que ninguém lê.

**Estilo:** bastante espaço em branco; cartões arredondados com sombra suave (já existe `card-soft`); botões grandes com leve elevação; tipografia legível e consistente; barras de progresso bem visíveis; animações curtas e sutis; conteúdo de estudo com leitura confortável (largura de texto, espaçamento, destaque para fórmulas e resumos).

**Como aplicar sem retrabalho**
- Reaproveite o que existe: `src/styles.css` (variáveis de tema, modo claro e escuro), `src/components/ui-bits.tsx` (`Chip`, `PageHeader`, `Progress`, `Loading`), `BlockCard`, `BottomNav` e os componentes shadcn.
- Centralize cores, espaçamentos, raios e sombras em variáveis. Não crie um segundo sistema ao lado do atual.
- **Toda tela que você criar ou alterar nas fases já sai no novo visual.** A fase final de interface (seção 16) só uniformiza o que sobrou.
- Prioridade para o **celular** (o app já é pensado assim, com `BottomNav`). Acessibilidade: contraste, foco visível, teclado, `aria-label` e texto alternativo.

---

## 4. Plano personalizado (onboarding)

Arquivo principal: `src/routes/onboarding.tsx`. Tipo: `Config` em `src/lib/planner.ts`.

### 4.1 Título e textos
- Título: **"Vamos montar seu plano personalizado"**. Tire toda menção a "1 minuto" (título, `description`, `og:description`).

### 4.2 Data da prova
- Mantenha **Automática (recomendado)** e **Escolher edição**. **Remova "Data manual"**.
- Migração: quem já estava em `dateMode: "manual"` não pode quebrar. Converta para `"edicao"` na edição que contém a data salva; se não houver edição correspondente, use `"auto"`. Teste os dois casos.
- Continua valendo a regra de `editions.ts`: passou a prova, o app muda sozinho para a edição seguinte.

### 4.3 Horas por dia
- Opções: **1 h, 2 h, 3 h e "4 h ou mais"**. ("4 h" e "4 h ou mais" são a mesma opção; "4 h ou mais" é planejada com 4 h.)
- `Config.hours` deixa de ser `1 | 1.5 | 2` e passa a `number`. Um valor salvo de **1,5 continua válido** no planner (sem perda); na tela, mostre a opção mais próxima selecionada.

### 4.4 Horário de estudo
- Opções com **seleção múltipla**: **Manhã, Tarde, Noite** e **Todos os horários** (marca as três). Remova "ambos", "até 12h" e "após 22h30".
- `Config.shift` (`"manha" | "noite" | "ambos"`) vira `shifts: Shift[]`, e `Shift` ganha `"tarde"` (`planner.ts`). Migração: `manha` → `["manha"]`, `noite` → `["noite"]`, `ambos` → `["manha","noite"]`.
- Atualize quem usa o turno: `buildPlan`, `BlockCard`, `src/routes/index.tsx` (a lista fixa `["manha","noite"]` e os ícones) e o cronograma. Blocos antigos já salvos continuam válidos.
- **Risco real a tratar:** `buildPlan` divide as horas igualmente entre os turnos e `splitMinutes()` descarta o que for menor que 25 min. Com 1 h e 3 turnos sobram 20 min por turno, e **o dia ficaria sem nenhum bloco**. Regra: nunca dar menos de 25 min a um turno; se não couber em todos, use menos turnos no dia, alternando quais ao longo da semana. Cubra com testes em `src/test/planner.test.ts` (1 h com 3 turnos, 2 h com 3 turnos, 4 h com 1 turno).

### 4.5 Dificuldade de 1 a 10
- A pergunta existente ("Quanta dificuldade você sente em cada área?") passa de **1–5 para 1–10**, mantendo o sentido atual (**maior = mais difícil**). Use um controle agradável (slider ou seletor).
- Migração: valor salvo × 2 (1→2, 3→6, 5→10).
- No planner, a fórmula `(0.6 + diff * 0.2)` em `topicScore` precisa acompanhar a nova escala: use `0.6 + diff * 0.1`, que **mantém exatamente o mesmo resultado** para quem migrou (× 2). Atenção a `Math.max(cfg.difficulty.ling, 3)` (usado para Redação): vira `Math.max(..., 6)`. Teste a equivalência antes/depois.

### 4.6 Meta de nota por área (no lugar da meta geral)
- Hoje existe só `Config.goal` (um número de 0 a 1000) e a home mostra "Meta no ENEM: X pontos (nota geral)". Substitua por **metas por área**: Linguagens, Humanas, Natureza, Matemática e Redação, cada uma de 0 a 1000.
- O aluno **pode escolher um curso** (opcional). Ao escolher, o app **sugere a meta de cada área** conforme o peso dela naquele curso, e o aluno edita à vontade. Sem curso, ele digita livremente.
- **Tabela de pesos** (arquivo de dados novo, por exemplo `src/lib/course-weights.ts`): curso, instituição, peso de cada área, **fonte, ano e link**. **Não invente pesos.** Preencha só o que você conseguir confirmar em fonte oficial (SiSU, editais). O que não confirmar fica de fora e entra numa lista de pendências em `docs/pesos-pendentes.md`. Curso sem pesos: usar pesos iguais e avisar discretamente.
- Regra de sugestão (arquivo de configuração, ajustável): a meta sugerida cresce com o peso. Proponha uma fórmula simples e transparente e explique no PR.
- Migração: se existir `goal`, copie o valor para as cinco metas como ponto de partida editável. Não perder o dado.

### 4.7 Como o plano se adapta
- `AREA_W` hoje é fixo (`mat 1.4, nat 1.3, red 1.3, ling 1, hum 0.9`). Passe a multiplicá-lo por fatores **limitados** (por exemplo entre 0,8 e 1,3) derivados do peso do curso e da meta de cada área, para nenhuma área sumir do plano.
- Áreas com meta mais alta e/ou maior peso ganham mais tempo; áreas já perto da meta, menos. Mudou meta, horas, turnos ou dificuldade: o plano é recalculado (já existe `regenerate`).
- Mostre ao aluno **por que** o plano está assim, em uma frase (ex.: "Matemática tem prioridade: pesa muito no seu curso e sua meta é 800").
- Tudo em funções puras com testes em `src/test/planner.test.ts`.

---

## 5. Página principal e cronograma

Arquivos: `src/routes/index.tsx`, `src/routes/cronograma.tsx`, `src/components/BlockCard.tsx`.

- **Manter** o que o aluno aprovou: contagem regressiva de dias para o Enem (com a edição e a data), a mensagem do dia (`MOTIVATION` em `data.ts`), o progresso de hoje, os dias seguidos (`streakOf`) e a parte das matérias. Só polir o visual (seção 3) e deixar os textos mais **úteis de ler**.
- Trocar a linha "Meta no ENEM: X pontos (nota geral)" por um resumo das **metas por área**.
- **Cronograma:** leia `cronograma.tsx` primeiro e **preserve o comportamento atual** (mover bloco, redistribuir, repriorizar). Melhore só a estrutura e a leitura: agrupar por dia, destacar o dia de hoje, mostrar tempo e atividade de cada bloco com clareza.
- Interface polida e mais dinâmica (animações curtas, transições), sem perder o ar sério.

---

## 6. Domínio dos conteúdos: o site avalia, o aluno não se autoavalia

Hoje `src/routes/conteudos.tsx` tem botões Dominado / Revisar / Não vi que o aluno marca sozinho, e `planner.ts` usa esse valor (`ST_W`). Isso muda.

- **Remover os botões de marcação manual** e o contador "X de 72 tópicos dominados" baseado neles.
- O domínio de cada tópico passa a ser **calculado pelas respostas do aluno às questões do app** (`state.quiz`), nunca por marcação própria. O formulário manual "Registrar questões" em `desempenho.tsx` continua existindo para o plano, mas **não conta para domínio** (é autodeclarado).
- Níveis (nomes sugeridos): **Não iniciado, Básico, Desenvolvendo, Avançado, Dominado**.
- A promoção considera: quantidade de respostas, percentual de acerto **ponderado pela dificuldade da questão** (fácil 1, média 2, difícil 3), pelo menos uma média ou difícil acertada nos níveis altos e **consistência recente** (desempenho antigo não vale para sempre; o nível pode cair).
- **Realidade do banco:** com média de 2,8 questões por tópico, ninguém "domina" um tópico respondendo 100 questões. Regra: **um tópico só pode chegar a "Dominado" se tiver pelo menos 8 questões no banco**; com menos, o teto é "Avançado" e a tela diz "faltam questões novas neste tópico". Isso evita falso domínio e orienta o crescimento do banco (seção 7).
- Valores iniciais sugeridos (num arquivo de configuração, por exemplo `src/lib/mastery-config.ts`, para a equipe ajustar): Básico ≥ 1 resposta; Desenvolvendo ≥ 3 respostas e ≥ 50%; Avançado ≥ 5 respostas, ≥ 70% e ≥ 1 média acertada; Dominado ≥ 8 respostas, ≥ 85%, ≥ 1 difícil acertada e últimas 3 sem erro grave.
- Mostre o que falta para subir ("Faltam 3 questões com bom desempenho para chegar a Avançado").
- **Planner:** substitua `status[topicId]` por esse nível calculado. Mantenha as âncoras atuais (`dominado` 0,35 · `revisar` 1 · `nao` 1,2) e interpole os níveis do meio. Os valores manuais antigos continuam guardados em `state.status` (sem perda), mas **deixam de ser lidos**.
- **Histórico de tentativas (formato novo, versão 3):** para "consistência recente", revisão espaçada de questões e tempo gasto, `state.quiz` (uma resposta por questão) precisa virar um histórico. Crie `attempts` (`id da questão`, escolha, acerto, dia, tempo em ms) **mantendo** `quiz` como está e preenchendo `attempts` a partir dele na migração. Um passo em `migrate()` e um teste, como manda o `AGENTS.md`. Esta é a mesma mudança de versão do onboarding (seção 4): faça **uma** versão 3, não duas.

---

## 7. Banco de questões

Arquivos: `src/lib/questions.ts`, `questions-enem.ts`, `questions-depth.ts`, `question-types.ts`.

### 7.1 Organização
- Estenda o tipo `Question` com campos **opcionais** (assim as 198 existentes continuam válidas, sem migração): `source` (banca, ano, dia ou fase, número original, link oficial), `uso` (`liberada`, `em-verificacao` ou `somente-link`) e `revisada` (verdadeiro/falso). Já existem matéria (pelo `topicId`), nível e gabarito.
- O `topicId` continua derivado do id (`id.replace(/-\d+$/, "")`). Respeite o padrão de ids.
- Adicione testes de integridade do banco: cinco alternativas, `answer` válido, `why` preenchido, id único, tópico existente.

### 7.2 Crescer o banco
- Meta: **pelo menos 10 questões por tópico**, começando pelos tópicos de incidência **alta** (`src/lib/incidence.ts`), com mistura de níveis (por exemplo 4 fáceis, 4 médias, 2 difíceis).
- Questões novas escritas por IA ficam em um arquivo à parte (por exemplo `src/lib/questions-novas.ts`) com `revisada: false` e **não entram em `QUESTIONS` até o professor revisar** e a flag virar `true`. Cada uma com `why` e, nas de aprofundamento, `porQue` por alternativa. **Gabarito errado é pior que falta de questão.** Confira cada conta e cada fato; o incerto vai para `aConfirmar`.
- Questões de apoio com texto, tabela ou figura usam os tipos que já existem (`passages`, `table`, `figure`; `figures.ts` gera SVG).

### 7.3 Questões reais de Enem, ITA e Fuvest
- Hoje **nenhuma** questão do banco é de prova real; todas são autorais. A equipe quer questões reais, principalmente nos níveis altos.
- Toda questão real mostra, de forma visível, a origem completa (ex.: "Enem 2023, 1º dia, questão 45", "ITA 2022, 1ª fase", "Fuvest 2021, 1ª fase") **com link para a fonte oficial**.
- **Citar a fonte não substitui a licença.** A equipe deve conferir os termos de uso de **cada** instituição (inclusive o INEP) e dos textos e imagens de terceiros dentro das provas. O app **só exibe o conteúdo** das questões com `uso: "liberada"`; as demais mostram só a referência e o link. Sem poder indicar a fonte, a questão não entra.
- Página **"Créditos e fontes"** com as bancas, os links oficiais e o aviso de que as questões pertencem às respectivas instituições e são usadas para fins educacionais. O link para as provas do INEP já existe (`INEP_PROVAS`).

---

## 8. Níveis (XP e ligas) e dificuldade das questões

Funciona **só no aparelho**, sem servidor. O placar compartilhado vem depois (seção 13).

- **XP:** ganhe pontos por questão respondida (mais por acerto e por dificuldade), por bloco concluído e por dia seguido. Regras num arquivo de configuração.
- **Ligas** (nomes sugeridos, sóbrios): Fundamentos, Básico, Intermediário, Avançado, Elite. Limites em configuração. Descer de liga só de forma suave, por longa inatividade.
- **Dificuldade por liga** (`src/lib/quiz.ts`, `pickQuestions`; passe a liga como parâmetro novo):
  - Liga baixa: **só questões fáceis**, para entender o básico.
  - Liga média: **fáceis e médias**.
  - Ao subir: entram as **difíceis**, com **tempo registrado** por questão (guarde em `attempts`; no começo só informe o tempo, sem punir), exigindo mais prática e desempenho.
  - Ligas altas: priorizar as **questões reais** (Enem, ITA, Fuvest) com `uso: "liberada"`.
  - A liga define o **teto** de dificuldade; o `stageOf` por área (`mastery.ts`) continua ajustando **dentro** desse teto. Mantenha `pickQuestions` puro e os testes de `quiz.test.ts` passando.

---

## 9. Desempenho

Arquivo: `src/routes/desempenho.tsx`.

- **Não mostrar só porcentagem** como "seu nível está 40% em matemática". Mostre **o que melhorar, com orientação concreta**.
- Troque **"Pontos fracos"** (lista vermelha com %) por **"Pendências a melhorar"**, em tom positivo e com ação: o tópico, uma dica do que fazer e atalhos para estudar (`/conteudos/$topicId`) e para as aulas. Para as dicas, reaproveite `tip` de `TOPICS` e `armadilhas` de `src/lib/content/<area>.ts`.
- **Tipo de erro:** nas questões de aprofundamento, que já têm `porQue` por alternativa, acrescente um campo opcional que classifica cada alternativa errada (fórmula, interpretação do enunciado, conta, conteúdo que falta, desatenção). Quando o aluno errar, o app identifica o tipo e a pendência diz, por exemplo: "em porcentagem, você errou na fórmula: veja como montar o fator de aumento". Comece pelas questões que já têm `porQue`; as outras seguem sem tipo.
- **Nível por área em pentágono** (gráfico de radar, com `recharts`, usando `src/components/ui/chart.tsx`): cinco pontas (Linguagens, Humanas, Natureza, Matemática, Redação) que **crescem conforme os acertos**. Valor de cada ponta = acerto ponderado pela dificuldade, com mínimo de respostas; abaixo do mínimo, "sem dados suficientes". **Redação não tem questões de múltipla escolha**: enquanto não houver correção de redação (seção 11), essa ponta mostra "sem dados".
- Mantenha "Acertos por área" e "Seu nível por área" (que já existem), integrando o pentágono sem poluir a tela.

---

## 10. Aulas e YouTube

Arquivos: `src/routes/aulas.tsx`, `src/lib/youtube.ts`, `src/components/ExternalResourceLink.tsx`, `src/lib/data.ts`.

### 10.1 Diagnóstico primeiro (não adivinhe a causa)
Relato da equipe: **"não dá para entrar no YouTube direto do site"**. A causa é desconhecida. O código **já** abre link `https` simples em nova aba (decisão registrada no `roadmap.md`, com testes em `external-link.test.tsx` e `youtube.test.ts`), e o próprio `roadmap.md` diz que falta testar num celular de verdade. Portanto **não troque para iframe** por reflexo. Investigue nesta ordem e registre o que achar:

1. **Reproduzir no site publicado** (retaenem.com.br), no celular (Android e iPhone) e no computador. Clicar em "Buscar aula", "Canal" e em um link de "Meus links". Anotar o que acontece: nada, aba em branco, erro, abre mas não carrega, ou a mensagem "Este link não é válido".
2. **Comparar** com o preview do Lovable (dentro de um iframe, abrir nova aba pode ser bloqueado) e com o domínio direto.
3. **Conferir o deploy:** o Render está rodando a versão mais recente da `main`? (O commit "Added YouTube link API" é de 19/11.) O problema pode ser um build antigo.
4. **Rede:** testar com dados móveis e com a rede da escola. Se a escola bloqueia `youtube.com`, **isso não se resolve no código**.
5. **Navegadores embutidos** (dentro de outros apps) às vezes se comportam diferente. Testar abrindo no navegador normal.
6. Escreva no PR **qual era a causa** e o que foi feito. Se for externa, explique no `README.md`.

**Em qualquer caso**, adicione uma saída segura: um botão **"Copiar link"** ao lado dos links de aula e uma mensagem clara quando o link não abrir. Se, e só se, o diagnóstico mostrar que um **player embutido** resolve algo que o link não resolve, trate-o como recurso novo e opcional, com `youtube-nocookie.com`, `referrerpolicy="strict-origin-when-cross-origin"` e **sempre** com o link como alternativa.

### 10.2 Aulas melhores e mais profundas
Hoje o app recomenda **canais e buscas**, de propósito ("não quebram com o tempo"). Para aprofundar, passe a ter também **aulas específicas escolhidas por um professor**, sem perder as buscas:

- Arquivo de dados (por exemplo `src/lib/lessons.ts`), por tópico e por nível (**base, intermediário, aprofundamento, resolução de questões**): `videoId`, título, canal, duração, `selecionadaPor` (nome do professor) e `selecionadaEm`, e uma marca de "aula recomendada" por tópico. Meta: 2 a 4 aulas por tópico, começando pelos de incidência alta.
- **Regra de ouro (do `AGENTS.md`): nunca invente um ID de vídeo.** IDs só entram quando vierem de uma busca real na API do YouTube ou de um link colado pelo professor. Nunca escreva um ID de memória.
- **Candidatas:** gere uma lista de candidatas por tópico com a **YouTube Data API v3**, rodada **localmente pela equipe** por um script (chave em variável de ambiente, nunca no app), olhando duração, data, canal e se o vídeo ainda existe. Salve em `docs/aulas-candidatas.md` para o professor revisar. Critérios: didática e correção, alinhamento ao Enem, qualidade de áudio e imagem, material atual, canal reconhecido.
- **A escolha final é do professor.** Métrica ajuda a achar candidatas, não decide qual é "a melhor". Não escreva "melhor aula da internet" na tela; use "Selecionada pelo professor [nome]".
- **Verificação:** um script (`check:lessons`, rodado à mão ou na CI, **fora** dos testes unitários, que devem rodar sem internet) confere se cada vídeo ainda existe. Vídeo que sumir sai da lista e vai para uma lista de substituição.
- Mostre as aulas por nível dentro de cada tópico, sugira a aula certa nas "Pendências a melhorar" (seção 9) e abra tudo por `ExternalResourceLink`. **Assistir a uma aula não conta como domínio** (seção 6).
- Só o player oficial: não baixar nem hospedar vídeos. Sempre mostrar título e canal como crédito.

---

## 11. Estudo: revisão, explicações, simulados e redação

- **Revisão espaçada:** já existe por tópico (`REVIEW_GAPS` = 3, 10 e 30 dias, só nas duas primeiras vezes). Evolua para **ajustar pelo desempenho**: acertou fácil, o intervalo cresce; errou, o conteúdo volta antes. Use o `attempts` (seção 6). Deixe a "Revisão de hoje" visível na página principal.
- **Explicação após cada resposta:** as questões já têm `why`, e as de aprofundamento têm `porQue` por alternativa. Garanta que o `QuestionCard` mostre isso depois de **toda** resposta, em linguagem clara. Para questões sem `porQue`, **não** gere explicação por IA por padrão: comece completando as explicações no banco (seção 7). Explicação por IA em tempo real é opcional, só com a decisão 6 da seção 2.
- **Simulado:** hoje "Simulado" é só um tipo de bloco no plano (domingos). Crie **mini-simulados por área, com cronômetro**, usando o banco, em uma rota nova. Um **simulado completo no formato do Enem** (dois dias, 90 questões cada) **não é viável com 198 questões**; deixe para quando o banco crescer. Resultado por área atualiza o pentágono e o plano.
- **Redação com correção por IA nas cinco competências do Enem** (0 a 200 cada, nota total, comentários e sugestões). Só com a decisão 6 da seção 2. Regras: chamada **sempre pelo servidor** (funções de servidor do TanStack Start; confirme em `vite.config.ts` que funcionam no alvo Render, e deixe claro se não funcionam no alvo Lovable/Cloudflare), chave em variável de ambiente, **limite de uso por aluno**, aviso visível de que a nota é **uma estimativa de apoio, não oficial**, e o texto do aluno (que pode ser de um menor) tratado conforme a seção 14. Guarde o histórico para o aluno ver a evolução; ele alimenta a ponta de Redação do pentágono.

---

## 12. Instalável e uso com internet fraca

O app já é "offline-first" no estado. Falta ficar instalável e abrir sem rede.

- Torne o site um **PWA** (manifest, ícones, service worker) com cache do que o aluno já abriu. Confirme que isso funciona nos **dois alvos** de build; se um deles não permitir, implemente no que permitir e documente.
- Modo "economia de dados" opcional (sem animações pesadas).
- Quando surgirem contas (seção 13), o progresso feito offline deve sincronizar sem perder respostas nem duplicar pontos.

---

## 13. O que precisa de servidor (só depois da decisão 1)

**Não comece esta seção antes de a equipe decidir onde ficam os dados** (seção 2) e **antes de a seção 14 estar publicada.** Tudo daqui exige banco de dados e login:

- **Contas:** cadastro (apelido, e-mail, senha), login, "Esqueci minha senha", sessão persistente e sair. Senha **sempre com hash seguro** (use o que o provedor escolhido oferecer, nunca texto puro), limite de tentativas, e acesso a cada tabela restrito ao dono dos dados (regras por linha ou equivalente).
- **Importar o que já existe:** no primeiro login, **importar o `localStorage`** do aluno para a conta. Ninguém recomeça do zero.
- **Avatares:** galeria de 8 a 12 avatares originais, de estilo consistente e sóbrio; trocar a qualquer momento; aparece no cabeçalho, no perfil e no ranking.
- **Perfil e conquistas:** cabeçalho com avatar e apelido; resumo (XP, liga, sequência, horas, questões, acerto); desempenho (pentágono e pendências, da seção 9); **conquistas** em grade (desbloqueadas coloridas, bloqueadas em cinza com a condição visível; ex.: "7 dias seguidos", "50 questões de Matemática"); configurações (apelido, e-mail, senha, avatar, refazer o plano, **excluir a conta e os dados**).
- **Ranking compartilhado:** semanal, mensal e geral; posição, avatar, apelido, liga e pontuação; destaque para o top 3 e para a posição do aluno logado. **Só apelido**, nunca nome ou e-mail. Estado vazio amigável.
- **Proteção contra trapaça:** **pontuação calculada no servidor**, nunca aceitando valor enviado pelo navegador; limite de XP por tempo e por repetição; ignorar respostas rápidas demais; não entregar o gabarito ao navegador antes da resposta (a ordem das alternativas já é estável por questão em `optionOrder`); registrar ações suspeitas para revisão; contas sinalizadas saem do ranking.
- **Professores e escola:** papéis aluno, professor e administrador, com controle de acesso rigoroso. O professor cria **turmas** e acompanha o desempenho (progresso, áreas fortes, pendências, frequência). O aluno entra por **código** e vê claramente que o professor terá acesso ao seu desempenho. O professor vê **só** os dados de estudo da própria turma.
- **Professor curador de aulas:** papel concedido pelo administrador. Tela protegida onde ele vê as candidatas por tópico e nível (com pré-visualização), **aprova, recusa, reordena**, marca a recomendada e **sugere um vídeo colando o link** (o sistema extrai o ID e confere se existe). Só aulas aprovadas aparecem aos alunos, com o selo "Selecionada pelo professor [nome]". Registrar quem aprovou e quando. Isso substitui o arquivo `lessons.ts` da seção 10, importando o que já existir.
- **Feedback no site:** botão "Reportar erro" e "Dar sugestão" em cada questão e tela (gabarito errado, enunciado confuso, explicação errada, outro), com uma lista para a equipe revisar e marcar como resolvida.
- **Lembretes de estudo** por e-mail, no horário que o aluno escolheu, com descadastro em um clique e mensagens curtas.

---

## 14. Privacidade, termos e avisos (antes de abrir contas)

Hoje o app não coleta dados pessoais (tudo fica no aparelho). Isso muda com contas.

- Aviso visível de que o **Reta Enem é um apoio aos estudos e não garante nota** nem aprovação.
- Páginas simples de **Termos de Uso** e **Política de Privacidade**, em linguagem clara, aceitas no cadastro.
- **LGPD:** coletar o mínimo necessário, explicar para quê, e permitir ver, corrigir e **excluir** a conta e os dados. Nunca vender nem compartilhar dados de alunos.
- **Menores de idade:** ranking só com apelido, nenhum contato público. Antes de abrir o site ao público, a equipe deve **validar com a escola ou o orientador** como será o consentimento dos responsáveis (decisão 2 da seção 2). Deixe isso sinalizado na documentação.
- Se houver IA externa (explicações ou correção de redação), a política deve dizer que o texto do aluno é enviado a esse fornecedor.

---

## 15. Critérios de aceite

- [ ] Testes, lint e build passam nos dois alvos, e nada que funcionava deixou de funcionar.
- [ ] Todo formato novo de dado tem passo em `migrate()` e teste em `state-migration.test.ts`; quem já tinha dados salvos não perdeu nada (inclusive `manual`, `1,5 h`, `ambos`, dificuldade 1–5 e `goal`).
- [ ] Onboarding com o título novo (sem "1 minuto"), data automática ou por edição, horas até "4 h ou mais", turnos manhã/tarde/noite/todos, dificuldade 1–10 e metas por área com sugestão por curso.
- [ ] Nenhum dia do plano fica sem blocos por causa da divisão de horas entre turnos.
- [ ] A tabela de pesos cita fonte, ano e link; nenhum peso foi inventado.
- [ ] O aluno **não consegue** marcar domínio sozinho; o site calcula; nenhum tópico com menos de 8 questões chega a "Dominado".
- [ ] "Pendências a melhorar" (tom positivo, com dicas) e pentágono de 5 áreas na tela de desempenho.
- [ ] O banco tem testes de integridade; questões novas só entram revisadas; toda questão real mostra origem e link e só exibe conteúdo quando `liberada`; existe "Créditos e fontes".
- [ ] Ligas e XP funcionam no aparelho; a dificuldade das questões respeita a liga.
- [ ] A causa do problema do YouTube foi **identificada e registrada**; existe "Copiar link" e mensagem clara; nenhum ID de vídeo foi inventado; as aulas escolhidas mostram o professor.
- [ ] Visual novo, moderno e sério, coerente em todas as telas, sem copiar elementos do Brilliant; bom no celular; acessível.
- [ ] (Depois da decisão sobre servidor) contas, ranking, professores e feedback funcionando, com pontuação validada no servidor e importação do `localStorage`.
- [ ] Aviso, termos e privacidade publicados **antes** de abrir as contas.

---

## 16. Fases (uma por vez; um PR por fase)

Faça **uma fase, teste, mostre o resultado e espere a confirmação** antes da próxima.

**Sem servidor (valor imediato)**
1. **Diagnóstico do YouTube e linha de base:** seção 10.1, mais testes e build rodando limpos.
2. **Plano personalizado:** seção 4 inteira, com a versão 3 do estado (migrações e testes) e os ajustes do planner.
3. **Domínio calculado e histórico de tentativas:** seção 6.
4. **Banco de questões:** metadados, testes de integridade, "Créditos e fontes" e as primeiras questões novas para revisão (seção 7).
5. **Desempenho:** pendências a melhorar, tipo de erro e pentágono (seção 9).
6. **Ligas e XP**, dificuldade das questões por liga (seção 8).
7. **Aulas selecionadas:** estrutura de dados, candidatas e verificação (seção 10.2), com o professor curador.
8. **Estudo:** revisão adaptativa, explicações e mini-simulados com cronômetro (seção 11).
9. **Página principal, cronograma e polimento visual geral** (seções 3 e 5); **PWA** (seção 12).
10. **Aviso, termos e privacidade** (seção 14).

**Só depois da decisão sobre servidor e consentimento**
11. **Contas, importação do `localStorage`, avatares, perfil e conquistas.**
12. **Ranking compartilhado e proteção contra trapaça.**
13. **Professores, turmas e curadoria de aulas pelo painel.**
14. **Feedback no site, lembretes por e-mail e, se aprovada a decisão 6, correção de redação por IA.**

Ao fim de cada fase, descreva o que foi feito, os arquivos alterados, como testar e o que ficou pendente de decisão humana.
