Reta Enem — Prompt completo de melhorias

Prompt para o Claude trabalhar dentro do repositório do GitHub do projeto. Este documento reúne e reorganiza, na ordem do fluxo do aluno, todas as melhorias planejadas. Ele substitui os prompts das Partes 1, 2 e 3.

0. Como trabalhar neste projeto

Você é o desenvolvedor responsável por evoluir o Reta Enem (retaenem.com.br), um site feito por estudantes do ensino médio como TCC. O objetivo do site é melhorar a educação no ensino médio, ampliando o que os alunos sabem e aprofundando o conhecimento nas matérias que mais caem no Enem.

Antes de escrever código:

Leia o repositório inteiro e identifique a stack, a estrutura de pastas, o banco de dados e os padrões de código atuais.
Escreva um plano curto de implementação em fases (ver seção 14) e siga-o.
Mantenha a stack e os padrões existentes. Não troque de tecnologia sem necessidade.

Regras durante o trabalho:

Não quebre nenhuma funcionalidade existente. Se precisar alterar algo que já funciona, preserve o comportamento ou migre os dados.
Trabalhe em uma branch própria, com um commit por fase, mensagens de commit claras em português.
Teste cada fase antes de seguir para a próxima (testes automatizados quando o projeto já tiver, e teste manual descrito no final de cada fase).
Quando uma decisão técnica não estiver clara, escolha a opção mais simples e compatível com a stack atual e deixe um comentário curto explicando.
Nunca coloque chaves de API, senhas ou segredos no código nem no front-end. Use variáveis de ambiente.
Ao terminar cada fase, liste os arquivos criados/alterados e como testar.
1. Direção visual (vale para o site inteiro)

Referência de estilo: o Brilliant (site de matemática e programação). Quero a mesma ideia: interface moderna, limpa, dinâmica e muito fácil de entender. Não é cópia. Não reproduzir logo, ilustrações, textos ou assets deles. Usar só as características gerais de estilo e acrescentar a identidade própria do Reta Enem (paleta e logo atuais como base).

Tom: bonita e moderna, mas sem perder o ar sério de quem estuda para o Enem.

Visual limpo e focado, que ajude a concentração.
Sem excesso de cores, enfeites, mascotes ou emojis. Nada infantil.
Cores vivas só com intenção (destaques, progresso, botão principal), sobre uma base neutra e calma.
Gamificação discreta (progresso, conquistas, ranking), que motive sem distrair.
Textos feitos para serem lidos: frases claras e úteis, nada de palavras soltas que a pessoa só passa o olho.

Características:

Bastante espaço em branco e hierarquia visual clara.
Cartões com cantos arredondados, sombras suaves e bordas sutis.
Botões grandes, com leve efeito de elevação ao passar o mouse e ao clicar.
Tipografia moderna, legível e consistente, com bom contraste.
Barras e indicadores de progresso bem visíveis.
Microinterações e animações sutis (transições, feedback ao clicar, animação ao concluir algo).
Conteúdo de estudo com leitura confortável: largura de texto adequada, espaçamento generoso, destaque para fórmulas, exemplos e resumos.

Sistema de design:

Variáveis centralizadas de cor, espaçamento, raio de borda, sombra e tipografia.
Componentes reutilizáveis: botões, cartões, campos, barras de progresso, abas, modais, avisos, selos de conquista, gráfico de radar.
Estados bem definidos (normal, hover, foco, ativo, desabilitado, carregando, erro, vazio).
Aplicar em todas as telas, substituindo estilos soltos e repetidos.

Qualidade: totalmente responsivo, com prioridade para o celular; boa acessibilidade (contraste, foco visível, teclado, labels corretos); carregamento rápido.

2. Conta: cadastro, login e avatar
Cadastro e login
Cadastro com apelido, e-mail e senha; login com e-mail e senha.
Validação clara, com mensagens amigáveis em português (e-mail válido, senha com no mínimo 8 caracteres, confirmação de senha).
Botão de mostrar/ocultar senha e fluxo de "Esqueci minha senha" por e-mail.
Sessão persistente, para o aluno salvar o progresso e voltar depois de onde parou, e botão de sair.
Segurança: senha sempre com hash seguro (nunca em texto puro; usar o que o provedor de autenticação do projeto oferecer, ou bcrypt/argon2). Rotas de perfil, plano, ranking e progresso só com login. Limite de tentativas de login.
Ao concluir o cadastro, o aluno escolhe o avatar e segue para "Vamos montar seu plano personalizado".
Tela de login
Interface polida no estilo da seção 1: duas colunas no desktop (formulário e mensagem motivacional curta), coluna única no celular.
Avatares
Galeria de 8 a 12 avatares originais, com estilo visual consistente e sóbrio.
O aluno troca o avatar a qualquer momento no perfil.
O avatar aparece no cabeçalho, no perfil e no ranking. Avatar padrão se ainda não escolheu.
3. "Vamos montar seu plano personalizado" (onboarding)

Este é o começo do fluxo. O título deve ser "Vamos montar seu plano personalizado", sem mencionar "um minuto" ou tempo para concluir.

3.1 Data da prova
Manter as duas opções que já existem e agradam: automática (o site escolhe a próxima edição do Enem) e escolher edição (o aluno escolhe o ano).
Remover a opção manual.
A data deve acompanhar o ano do aluno: se o Enem do ano atual já passou, mostrar o do ano seguinte (ex.: em novembro de 2026, com o Enem 2026 já realizado, mostrar 2027), e assim por diante.
O conteúdo prioriza o que mais cai e usa como referência o nível do Enem recente (provas consideradas difíceis e conteudistas), para o aluno ter base em questões fáceis e difíceis.
3.2 Horas de estudo por dia
Opções: 1 hora, 2 horas, 3 horas, 4 horas e "4 horas ou mais".
O plano respeita o tempo escolhido (mais horas, mais conteúdo por dia, com pausas sugeridas em sessões longas).
Migrar quem já escolheu 1h30 ou 2h para a opção mais próxima, sem erro.
3.3 Horário de estudo
Opções: Manhã, Tarde, Noite e Todos os horários, com seleção múltipla ("Todos os horários" marca tudo).
Remover as opções antigas ("até 12h", "após 22h30", "ambos").
Atende também quem estuda de manhã e não é do ensino integral.
Migrar valores antigos (até 12h vira Manhã; após 22h30 vira Noite; ambos vira Manhã e Noite).
O plano só distribui sessões nos turnos escolhidos.
3.4 Dificuldade
Escala de 1 a 10 (antes era 1 a 5), para o site escolher melhor quais conteúdos passar ao aluno.
Controle agradável (slider ou seletor numérico) com textos de apoio nas pontas. Confirmar no código atual qual ponta significa mais dificuldade e manter o mesmo sentido.
A lógica do plano usa a escala completa: conteúdos de dificuldade mais alta ganham mais prioridade e tempo, com distinção mais fina do que antes.
Migração: respostas antigas de 1 a 5 viram o dobro (1→2, 2→4, 3→6, 4→8, 5→10).
3.5 Meta de nota por área (substitui a meta de nota geral)

A meta geral não ajuda, porque todo mundo quer 1000. O aluno define uma meta por área, de acordo com o que importa para o curso que quer fazer.

Áreas: Linguagens, Ciências Humanas, Ciências da Natureza, Matemática e Redação.
O aluno pode escolher um curso (campo opcional). Ao escolher, o site sugere a nota de cada área conforme o peso dela naquele curso. O aluno pode ajustar livremente.
O aluno também pode ignorar o curso e digitar a nota que quer em cada área (ex.: Natureza 600, Linguagens 500, Humanas tanto).
Controle simples (campo ou slider de 0 a 1000), com a sugestão visível quando houver curso.
Tabela de pesos por curso: dados editáveis (JSON ou tabela no banco), baseados em fontes oficiais (SiSU e editais das universidades), com fonte e ano em cada registro. Os pesos variam por universidade e ano: não inventar valores; deixar fácil de atualizar sem mexer no código. Sem pesos cadastrados para um curso, usar pesos iguais e avisar discretamente.
3.6 Como o plano se adapta
Áreas com meta mais alta e/ou maior peso no curso ganham mais tempo e prioridade.
Áreas perto da meta recebem menos tempo.
Dentro de cada área, priorizar os conteúdos que mais caem e os de maior dificuldade informada.
Mudou meta, horas, horário ou dificuldade, o plano é recalculado automaticamente.
Mostrar de forma simples por que o plano está assim (ex.: "Matemática tem prioridade porque pesa muito no seu curso e sua meta é 800").
4. Página principal

Interface polida e dinâmica, no estilo da seção 1, mantendo o que já funciona bem:

Contagem regressiva de dias para o Enem (ex.: "348 dias para o Enem"). Manter.
Mensagem atual de boas-vindas/motivação. Manter o estilo, com texto útil e legível.
Progresso de hoje. Manter, com visual mais polido.
Dias seguidos (sequência). Manter.
Matérias. Manter, com cartões bonitos e barras de progresso.
Cronograma: deixar um pouco melhor estruturado e legível, sem mudar o que já está bom (por exemplo, agrupar por dia, destacar o que é de hoje e mostrar tempo estimado de cada atividade).
5. Conteúdos e domínio

Manter o visual atual dos conteúdos (o aluno gosta da forma como estão). Mudar a regra de domínio:

O aluno NÃO marca por conta própria que domina um conteúdo. Remover qualquer botão ou opção de "marcar como dominado" ou autoavaliação.
O site avalia o domínio com base nas questões que o aluno responde. O aluno precisa merecer a promoção de nível.
Exemplo: resolveu 100 questões de porcentagem e acertou todas, então o conteúdo está dominado.
Níveis de domínio (nomes sugeridos, ajustáveis): Iniciando, Básico, Desenvolvendo, Avançado, Dominado.
A promoção considera: quantidade mínima de questões respondidas, percentual de acerto, peso por dificuldade da questão e consistência recente (um bom desempenho antigo não vale para sempre). Se o desempenho cair muito, o nível pode regredir e a revisão espaçada (seção 9) deve sugerir revisão.
Regras e limites de cada nível em um arquivo de configuração (não espalhados no código), com valores iniciais razoáveis que a equipe possa ajustar. Documentar os valores escolhidos.
Mostrar ao aluno o que falta para subir de nível (ex.: "Faltam 12 questões com 80% de acerto para chegar a Dominado").
5.1 Aulas em vídeo (YouTube)

O site já usa aulas do YouTube nos conteúdos. Há duas mudanças: corrigir o player, que hoje não abre dentro do site, e elevar a qualidade e a profundidade das aulas.

A. Corrigir o player do YouTube

Hoje não está funcionando abrir o YouTube direto do site, e a causa ainda é desconhecida (pode ser o próprio YouTube, o código, o servidor ou a rede do aluno). Diagnosticar e corrigir, investigando nesta ordem:

Descobrir o erro real: abrir o console do navegador e a aba de rede, e anotar a mensagem ou o código que o player mostra (por exemplo, erros 101, 150, 152 ou 153 indicam, entre outras coisas, vídeo com incorporação bloqueada ou problema de cabeçalho de origem).
URL correta: incorporar sempre com https://www.youtube-nocookie.com/embed/ID_DO_VIDEO (ou youtube.com/embed/). Nunca usar a URL de página watch?v= dentro do iframe.
Atributos do iframe: incluir referrerpolicy="strict-origin-when-cross-origin" (a falta do cabeçalho de origem é uma causa comum de falha), allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" e allowfullscreen. Se houver sandbox, garantir as permissões necessárias ou removê-lo.
Cabeçalhos do servidor e do hospedeiro (Render): conferir se há Content-Security-Policy ou <meta> equivalente bloqueando. Se existir, a diretiva frame-src deve permitir https://www.youtube.com e https://www.youtube-nocookie.com (e, se usar a API do player, script-src para https://www.youtube.com). Revisar também políticas de referrer definidas no servidor.
Vídeos com incorporação desativada pelo dono: alguns vídeos não podem ser exibidos em outros sites. Verificar cada vídeo (ver B) e, quando for o caso, mostrar uma mensagem amigável com o botão "Assistir no YouTube" (abre em nova aba) e substituir o vídeo por equivalente na curadoria.
Testar em produção: alguns bloqueios só aparecem no domínio real (retaenem.com.br) e não em localhost. Testar no celular e no computador, em mais de um navegador, e com e sem bloqueador de anúncios.
Carregamento leve: mostrar uma miniatura clicável e carregar o player somente ao clicar (reduz peso e erros).
Fallback sempre: se o vídeo não carregar por qualquer motivo, nunca deixar a tela quebrada. Mostrar o aviso e o link direto. Se a causa final for externa (por exemplo, a escola bloqueia o YouTube na rede), isso não se resolve no código: documentar no README e manter o fallback.

Ao terminar, escrever no relatório da fase qual era a causa encontrada e o que foi feito.

B. Curadoria das melhores aulas (mais profundidade)

Objetivo: aumentar a profundidade do conhecimento com aulas selecionadas dos melhores professores e canais, em vez de aulas aleatórias.

Cada conteúdo passa a ter de 2 a 4 aulas, organizadas por nível: base (do zero), intermediário, aprofundamento (inclusive para questões de nível ITA/Fuvest, nos rankings altos) e resolução de questões.
Critérios de seleção: professor com domínio e boa didática; conteúdo correto e alinhado à matriz de referência do Enem; qualidade de áudio e imagem; duração adequada; material atual (conferir ano e mudanças de conteúdo); canal reconhecido; incorporação permitida; preferência por aulas que resolvem questões reais. Evitar vídeos com erros, clickbait ou muito desatualizados.
Como montar a lista: usar a YouTube Data API v3, chamada pelo servidor, com a chave em variável de ambiente (nunca no front-end), para buscar candidatos por conteúdo e checar status.embeddable, duração, data de publicação e estatísticas. Gerar um ranking preliminar por critérios objetivos.
A escolha final deve ser validada pela equipe e pelo professor. Métricas e IA ajudam a achar candidatos, mas não substituem a avaliação pedagógica. Marcar na tabela quem validou e quando. Não afirmar ao aluno que uma aula é "a melhor da internet" sem essa validação.
Direitos e créditos: usar somente o player oficial incorporado. Não baixar nem re-hospedar vídeos. Sempre mostrar título e nome do canal como crédito.
Verificação periódica: rotina (script ou tarefa agendada) que confere se cada vídeo ainda existe e continua incorporável. Aulas que falharem ficam inativas automaticamente e entram numa lista para a equipe substituir.
Integração com o resto do site: mostrar as aulas na ordem dos níveis dentro de cada conteúdo; sugerir a aula certa nas "Pendências a melhorar" (por exemplo, errou porcentagem, o site recomenda a aula de porcentagem do nível adequado); incluir aulas na revisão espaçada. Assistir uma aula não conta como domínio: o domínio continua dependendo somente das questões (seção 5).
6. Questões e ranking por nível
6.1 Níveis do ranking
Criar níveis de ranking (ligas) que o aluno alcança conforme pontuação e desempenho. Sugestão de nomes sóbrios, ajustáveis: Fundamentos, Básico, Intermediário, Avançado, Elite. (Pode criar outros, mantendo o tom sério.)
O aluno sobe de nível ao acumular pontos (XP) e manter bom desempenho; pode ser rebaixado se ficar muito tempo sem estudar, de forma suave e justa.
6.2 Dificuldade das questões conforme o nível
Nível baixo: só questões fáceis, para entender o básico e começar com segurança.
Nível médio: questões fáceis e médias.
Ao subir: entram questões mais difíceis, com tempo para resolver e mais exigência de prática e desempenho.
Níveis mais altos: questões reais de Enem e, se possível, de ITA e Fuvest, além de outros vestibulares/simulados de boa qualidade.
6.3 Placar (leaderboard)
Página de ranking com abas Semanal, Mensal e Geral.
Cada linha: posição, avatar, apelido, nível e pontuação; destaque para o top 3.
Destacar a posição do aluno logado (linha fixa no final se estiver fora do topo).
Mostrar somente apelido, nunca nome completo ou e-mail.
Estado vazio amigável quando ainda não houver dados.
6.4 Proteção contra trapaça e privacidade
Pontuação calculada no servidor, nunca confiando em valores enviados pelo navegador.
Limitar pontos por tempo e por repetição (não dar XP infinito por refazer a mesma questão); detectar respostas rápidas demais ou padrões suspeitos e não contá-los no ranking.
Embaralhar alternativas e não entregar o gabarito ao navegador antes da resposta.
Registrar ações suspeitas para a equipe revisar; contas sinalizadas podem sair do ranking.
Ver a seção 12 para privacidade e menores de idade.
7. Desempenho
Não mostrar apenas porcentagem por matéria (ex.: "seu nível está 40% em matemática").
Mostrar o que melhorar, com orientação concreta. Exemplo: o aluno errou em porcentagem. O site identifica onde foi o erro (fórmula, interpretação, conta, atenção) e sugere formas de melhorar em porcentagem, com os conteúdos e questões certos.
Nível por área em gráfico de pentágono (radar): cinco pontas (Linguagens, Humanas, Natureza, Matemática, Redação) que crescem conforme os acertos, para o aluno ver rapidamente no que é bom.
Pontos fracos com linguagem positiva: não escrever "você é ruim em...". Usar algo como "Pendências a melhorar" ou "Próximos passos", com tom encorajador e ação clara.
Evolução ao longo do tempo (gráfico simples semanal) e comparação com as metas por área definidas no plano.
8. Perfil e conquistas

Página de perfil organizada em seções:

Cabeçalho: avatar, apelido, data de entrada, botão para editar.
Resumo: XP total, nível do ranking, posição, sequência atual e maior sequência, horas estudadas, questões respondidas, taxa de acerto.
Desempenho: pentágono, pendências a melhorar e progresso em relação às metas (seção 7).
Conquistas: grade de medalhas (desbloqueadas coloridas, bloqueadas em cinza com a condição visível), por exemplo "Estude 7 dias seguidos", "Acerte 50 questões de matemática", "Primeiro lugar da semana". Animação discreta ao desbloquear.
Configurações: alterar apelido, e-mail, senha e avatar; refazer o plano; preferências de lembretes (seção 10); excluir a conta (apagando os dados pessoais).
9. Qualidade do estudo
9.1 Banco de questões organizado
Estruturar o banco com cada questão marcada por: matéria/área, assunto, subassunto, dificuldade (1 a 10), banca (Enem, ITA, Fuvest, outra), ano, fase ou dia de prova, número original da questão, link para a fonte oficial, status de uso (ver abaixo), gabarito e explicação.
Permitir filtrar e selecionar questões por esses campos, que é a base do plano, do domínio e do ranking.
Questões do Enem, ITA e Fuvest, sempre com a origem identificada: o site passa a usar questões reais dessas provas, principalmente nos rankings mais altos. Toda questão mostra, de forma visível, o crédito completo, por exemplo: "Enem 2023, 1º dia, questão 45", "ITA 2022, 1ª fase" ou "Fuvest 2021, 1ª fase", com link para a fonte oficial. Nunca apresentar uma questão sem indicar de qual prova ela veio.
Atenção aos direitos autorais (importante): citar a fonte é necessário, mas não substitui a verificação das condições de uso de cada banca. As provas do Enem são divulgadas publicamente pelo INEP; para ITA, Fuvest e outras bancas, a equipe deve conferir os termos de uso (ou pedir autorização) antes de publicar o texto da questão. Se houver dúvida, não copiar o conteúdo: exibir apenas a referência e o link oficial para a prova.
Status de uso por questão: cada questão tem um campo com o estado: liberada (uso confirmado), em verificação ou somente link. O site só exibe o conteúdo das questões marcadas como liberadas; as demais mostram apenas a referência.
Textos de apoio e imagens: trechos de obras, imagens e gráficos dentro das questões podem ter direitos de terceiros. Manter os créditos originais que acompanham a questão e não removê-los.
Página "Créditos e fontes": listar as bancas e provas usadas, com links oficiais, e incluir o aviso de que as questões pertencem às respectivas instituições e são usadas para fins educacionais, sem fins comerciais.
Não incluir questões sem poder indicar a fonte.
Criar uma forma simples de a equipe cadastrar e revisar questões (por exemplo, importação por planilha/JSON e uma tela administrativa protegida).
9.2 Revisão espaçada
O site traz de volta conteúdos e questões já estudados perto do momento em que o aluno tende a esquecer (intervalos crescentes: por exemplo 1, 3, 7, 14, 30 dias, ajustados pelo desempenho).
Acertou fácil, o intervalo cresce; errou, o intervalo diminui e o conteúdo volta mais cedo.
Mostrar na página principal uma seção simples de "Revisão de hoje", integrada ao tempo diário escolhido no plano.
9.3 Explicação passo a passo após cada erro
Depois de cada resposta (principalmente erradas), mostrar a resolução passo a passo, em linguagem clara.
Identificar o tipo de erro (fórmula, interpretação do enunciado, cálculo, conteúdo que falta, desatenção) e usar isso para alimentar as "pendências a melhorar".
Usar IA para gerar/explicar quando a questão não tiver resolução cadastrada, sempre chamando a API pelo servidor (nunca expor chave no navegador), com limite de uso por aluno e cache das explicações geradas. Deixar claro ao aluno que a explicação foi gerada por IA e permitir reportar erro (seção 10.4).
9.4 Simulado e redação
Simulado completo no formato do Enem: dois dias de prova, quantidade de questões e cronômetro reais, com resultado por área, comparação com as metas e atualização do pentágono e do plano.
Permitir também mini-simulados por área, com tempo menor.
Redação com correção por IA nas cinco competências do Enem: o aluno escreve (ou cola) o texto e recebe nota estimada de 0 a 200 em cada competência, nota total, comentários específicos e sugestões de melhoria. Deixar claro que a nota é uma estimativa de apoio, não oficial. Chamar a IA pelo servidor, com limite de uso, e não guardar mais dados do que o necessário. Guardar o histórico para o aluno ver a evolução.
10. Recursos adicionais
10.1 Modo leve / offline
Tornar o site instalável no celular (PWA), com cache dos conteúdos já abertos para estudar com internet fraca.
Sincronizar o progresso quando a conexão voltar, sem perder respostas e sem duplicar pontos.
Evitar imagens e animações pesadas; modo "economia de dados" opcional.
10.2 Lembretes de estudo
Lembretes por e-mail e/ou notificação, no horário que o aluno escolheu no plano, para manter a sequência de dias.
Preferências no perfil (ligar/desligar, escolher canal). Respeitar descadastro com um clique. Mensagens curtas, úteis e sem insistência.
10.3 Painel para professores e escola
Perfil de professor que cria turmas e acompanha o desempenho (progresso, áreas fortes e pendências, frequência de estudo).
O aluno entra na turma por código e vê claramente que o professor terá acesso ao seu desempenho.
O professor vê apenas dados de estudo dos alunos da própria turma, nunca senhas ou dados sensíveis. Controle de acesso rigoroso por papel (aluno, professor, administrador).
Isso reforça o objetivo do site de melhorar o ensino nas escolas.
Professor escolhe a melhor videoaula (curadoria)
Criar o papel professor curador, concedido pelo administrador (a equipe do projeto) a professores de confiança. Quem não tiver esse papel não escolhe aulas.
Tela protegida em que o professor curador vê, por conteúdo e por nível (base, intermediário, aprofundamento, resolução de questões), as aulas candidatas geradas pela busca da seção 5.1-B, com pré-visualização do vídeo dentro da própria tela.
O professor pode aprovar, recusar e reordenar as aulas, marcar uma como "aula recomendada" do conteúdo e sugerir um vídeo novo colando o link do YouTube. Ao colar, o sistema extrai o ID, verifica automaticamente se o vídeo existe e pode ser incorporado e só então o inclui como candidato.
Cada aula tem um status: candidata, aprovada ou recusada. Só aulas aprovadas aparecem para os alunos. A aula recomendada aparece em destaque, com o selo "Selecionada pelo professor [nome]", junto com o crédito do canal.
Registrar quem aprovou e quando (histórico de alterações), para a equipe conseguir auditar e desfazer.
Se um vídeo aprovado sair do ar ou deixar de ser incorporável (seção 5.1-B), avisar o professor curador para escolher a substituta.
10.4 Feedback dentro do site
Botão discreto em cada questão e em cada tela: "Reportar erro" e "Dar sugestão".
Reporte de questão com categorias (gabarito errado, enunciado confuso, explicação errada, outro) e campo livre.
As mensagens vão para uma lista que a equipe consegue revisar e marcar como resolvida, ajudando a melhorar o banco de questões ao longo do tempo.
11. Estrutura de dados (sugestão)

Seguir o padrão do projeto. Entidades principais:

usuarios (papel: aluno, professor, administrador; apelido, e-mail, avatar, criado em)
planos (data/edição da prova, horas por dia, horários, dificuldade, curso opcional, metas por área)
cursos_pesos (curso, instituição, peso por área, fonte, ano)
questoes (matéria, assunto, subassunto, dificuldade, banca, ano, fase/dia, número original, link da fonte, status de uso, gabarito, explicação, ativa)
respostas (aluno, questão, resposta, acerto, tempo gasto, data, tipo de erro)
dominio_conteudo (aluno, conteúdo, nível, métricas de apoio)
aulas (conteúdo, título, canal, ID do vídeo, duração, nível, incorporável, status: candidata/aprovada/recusada, recomendada, aprovada por (professor curador), aprovada em, última verificação)
revisoes (aluno, conteúdo/questão ou aula, próxima revisão, intervalo)
pontuacao / ranking (aluno, XP, nível, semana/mês)
conquistas (catálogo) e conquistas_usuario
simulados e redacoes (texto, notas por competência, comentários)
turmas e turma_alunos
feedbacks (tipo, mensagem, questão relacionada, status)

Cada usuário só lê e altera os próprios dados privados. O ranking expõe apenas apelido, avatar, nível e pontuação.

12. Privacidade, termos e avisos
Incluir um aviso visível de que o Reta Enem é um apoio aos estudos e não garante nota nem aprovação.
Criar páginas simples de Termos de Uso e Política de Privacidade, em linguagem clara, aceitas no cadastro.
LGPD: coletar o mínimo de dados necessário, explicar para que servem, permitir ver, corrigir e excluir a conta e os dados.
Menores de idade: muitos usuários são adolescentes. Tratar com cuidado extra: ranking só com apelido, nenhum dado de contato público, e deixar sinalizado no código/documentação que a equipe deve validar com a escola/orientador o procedimento de consentimento dos responsáveis antes de abrir o site ao público em geral.
Nunca vender nem compartilhar dados dos alunos com terceiros.
13. Critérios de aceite gerais
[ ] Visual moderno, polido e coerente em todo o site, mas sério e focado no Enem; nenhum elemento protegido do Brilliant copiado.
[ ] Cadastro, login, recuperação de senha e sessão funcionam, com senhas protegidas por hash.
[ ] Onboarding com o título novo, data de prova automática ou por edição (sem manual), horas até "4 ou mais", horários manhã/tarde/noite/todos, dificuldade de 1 a 10 e metas por área com sugestão por curso.
[ ] O plano se adapta a metas, dificuldade, horas e horários, e explica por quê.
[ ] Página principal mantém contagem regressiva, mensagem, progresso de hoje, dias seguidos e matérias, com cronograma melhor estruturado.
[ ] Não existe autoavaliação de domínio; o site promove o nível com base nas questões.
[ ] O player do YouTube abre dentro do site em produção (celular e computador), e a causa do problema anterior foi identificada e documentada.
[ ] Quando um vídeo não pode ser incorporado, o aluno vê um aviso e o botão "Assistir no YouTube", sem tela quebrada.
[ ] Cada conteúdo tem aulas selecionadas por nível, aprovadas por um professor curador, com crédito ao canal, e existe verificação periódica dos vídeos.
[ ] O professor curador consegue aprovar, recusar, reordenar, sugerir por link e marcar a aula recomendada; só aulas aprovadas aparecem para os alunos, com o selo do professor.
[ ] Toda questão de Enem, ITA ou Fuvest mostra a origem (banca, ano, fase/dia, número) e o link oficial, e só exibe o conteúdo quando o status de uso é "liberada".
[ ] Existe a página "Créditos e fontes" com o aviso de uso educacional.
[ ] Ranking por nível controla a dificuldade das questões, com Enem/ITA/Fuvest nos níveis altos (respeitando as fontes).
[ ] Desempenho mostra pendências a melhorar com dicas concretas e o pentágono por área.
[ ] Banco de questões organizado, revisão espaçada, explicação passo a passo, simulado com cronômetro e redação com correção por IA funcionando.
[ ] Pontuação validada no servidor, com proteção contra trapaça.
[ ] Modo leve/PWA, lembretes, painel de professores e botão de feedback funcionando.
[ ] Aviso de que o site não garante nota, termos de uso e privacidade publicados.
[ ] Tudo funciona bem no celular e no computador, com acessibilidade básica.
[ ] Nenhuma funcionalidade existente foi quebrada.
14. Ordem sugerida de implementação (fases)
Base: sistema de design e componentes reutilizáveis; reorganização visual geral; diagnóstico e correção do player do YouTube (seção 5.1-A).
Conta: cadastro, login, recuperação de senha, avatares.
Onboarding e plano: novas opções, migração de dados antigos, tabela de pesos, lógica de adaptação do plano.
Página principal: novo visual, cronograma melhor estruturado.
Banco de questões e tela de cadastro/revisão de questões; curadoria das aulas em vídeo (seção 5.1-B).
Domínio e ranking: níveis de domínio calculados pelo site, níveis de ranking, dificuldade por nível, placar, proteção contra trapaça.
Desempenho e perfil: pentágono, pendências a melhorar, conquistas.
Qualidade do estudo: revisão espaçada, explicações passo a passo, simulado e redação com IA.
Extras: PWA/modo leve, lembretes, painel de professores, feedback.
Fechamento: aviso, termos e privacidade, revisão de acessibilidade e desempenho, testes finais.

Ao final de cada fase, descreva o que foi feito, os arquivos alterados e como testar.
