# Reta Final ENEM

Crie um aplicativo web chamado "Reta Final ENEM": um cronograma de estudos dinâmico para os últimos dias antes da prova. ## Objetivo Ajudar um estudante autodidata a aproveitar pouco tempo (1 a 2 horas por dia) nos conteúdos que mais caem no ENEM, com um plano claro do que estudar hoje, sem sobrecarga de informação. ## Perfil do usuário - Estuda por conta própria, em período integral na escola. - Tempo livre: manhã (antes das 12h) e noite (depois das 22h30). - Quer entrar em Engenharia de Software ou área de tecnologia, então Matemática, Ciências da Natureza (principalmente Física) e Redação têm prioridade. ## Telas e funcionalidades 1. **Configuração inicial (onboarding de 1 minuto)** - Data da prova (editável, para o app calcular a contagem regressiva). - Horas disponíveis por dia (1, 1,5 ou 2) e turno preferido (manhã, noite ou ambos). - Nível de dificuldade por área (1 a 5) para Linguagens, Matemática, Natureza e Humanas. - Meta de nota (opcional). 2. **Tela "Hoje" (a principal)** - Contagem regressiva em destaque (dias restantes). - Plano do dia dividido em blocos curtos de 25 a 50 minutos, por turno (manhã/noite). - Cada bloco mostra: matéria, tópico, tipo de atividade (videoaula, questões, revisão, redação), duração e botão "Concluir". - Barra de progresso do dia e sequência de dias seguidos (streak). - Botão "Não consegui estudar hoje" que redistribui automaticamente o conteúdo nos dias seguintes. 3. **Tela "Cronograma"** - Visão semanal e visão até o dia da prova. - Código de cores por área do conhecimento. - Arrastar e soltar para mover blocos de um dia para outro. - Priorização automática: tópicos de maior incidência no ENEM aparecem primeiro, e o app ajusta conforme o nível de dificuldade informado. 4. **Tela "Conteúdos prioritários"** - Lista por matéria dos tópicos que mais caem, com marcador de prioridade (alta, média, baixa) e checkbox de "dominado / precisa revisar / não vi ainda". - Matemática: porcentagem, razão e proporção, regra de três, estatística e probabilidade, geometria plana e espacial, funções, análise de gráficos e tabelas. - Natureza: Física (cinemática, dinâmica, energia, eletricidade, termologia, ondas), Química (estequiometria, soluções, termoquímica, química orgânica, eletroquímica), Biologia (ecologia, genética, citologia, fisiologia). - Humanas: História do Brasil, Geografia (meio ambiente, geopolítica), Filosofia e Sociologia. - Linguagens: interpretação de texto, gêneros textuais, figuras de linguagem, gramática aplicada. - Redação: estrutura dissertativo-argumentativa, as 5 competências, repertório sociocultural, proposta de intervenção. 5. **Tela "Aulas e criadores de conteúdo"** - Para cada tópico, recomendações de canais gratuitos de qualidade, com link para a busca ou canal no YouTube (use links de canal ou de busca, não de vídeos específicos, para não quebrarem). - Sugestões de canais: Professor Ferretto e Equaciona (Matemática), Me Salva! e Descomplica (várias matérias), Biologia Total (Biologia), Professor Boaro (Português e redação), Brasil Escola e Toda Matéria (resumos). - Possibilidade de o usuário adicionar seus próprios links e canais. 6. **Tela "Questões e simulados"** - Registrar quantas questões fez e quantas acertou por matéria. - Gráfico simples de desempenho por área e lista de "pontos fracos" que alimenta o cronograma. - Atalho para provas anteriores do ENEM (link para o portal oficial do INEP). 7. **Modo Semana Final (últimos 7 dias)** - O plano muda para só revisão, resumos, simulados e redação. - Checklist do dia da prova: documentos, material, horário, trajeto, alimentação e sono. ## Design e usabilidade - Layout limpo, mobile first, com navegação inferior de 4 abas: Hoje, Cronograma, Conteúdos, Desempenho. - Cores suaves, boa legibilidade, cartões com cantos arredondados, tema claro e escuro. - Rico em informação, mas com revelação progressiva: mostrar o essencial e expandir detalhes ao toque. - Microinterações leves (animação ao concluir um bloco, confete ao fechar o dia). - Mensagens curtas de motivação, sem exagero. ## Aspectos técnicos - Salvar tudo no armazenamento local do navegador (sem necessidade de login). - Dados iniciais pré-carregados (tópicos, prioridades e canais) para o app já funcionar ao abrir. - Responsivo e rápido, em português do Brasil. Comece pelo onboarding e pela tela "Hoje", depois monte as demais telas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://enem-countdown-coach.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6c9c7635-1c75-5ed5-b559-fc9eb3619253).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
