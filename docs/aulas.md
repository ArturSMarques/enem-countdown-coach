# Aulas selecionadas pelo professor

O app continua com os links de busca e de canal, e passa a mostrar também **aulas específicas escolhidas pelo professor**. Elas ficam em `src/lib/lessons.ts`, por tópico e por nível: base, intermediário, aprofundamento e resolução de questões.

**Regra de ouro:** nenhum ID de vídeo é inventado. O ID só entra quando vem de uma busca real na YouTube Data API ou de um link colado pelo professor.

## 1. Gerar as candidatas (no computador da equipe)

1. Entre em https://console.cloud.google.com com uma conta Google e crie um projeto, por exemplo "reta-enem".
2. Em **APIs e serviços → Biblioteca**, ative a **YouTube Data API v3**.
3. Em **APIs e serviços → Credenciais**, clique em **Criar credenciais → Chave de API**.
   - Depois, em "Restrições de API", deixe a chave liberada só para a YouTube Data API v3.
4. Na pasta do projeto, crie um arquivo `.env` com uma linha: `YOUTUBE_API_KEY=sua-chave`.
   - O `.env` está no `.gitignore`, então **nunca** vai para o GitHub. Não escreva a chave em nenhum outro arquivo.
5. Rode `bun run aulas:candidatas`. Para escolher tópicos, rode por exemplo `bun run aulas:candidatas mat-porc mat-prob`.
   - Sem argumentos, o script busca os tópicos de incidência alta, cerca de 40 buscas.
   - A cota grátis da API dá para rodar duas vezes por dia.
6. O resultado sai em `docs/aulas-candidatas.md`.

## 2. O professor escolhe

Em `docs/aulas-candidatas.md`, o professor assiste, marca as aulas escolhidas e anota o nível de cada uma. A meta é de 2 a 4 aulas por tópico, com no máximo uma recomendada.

Critérios: didática e correção, alinhamento ao Enem, qualidade de áudio e imagem, material atual e canal reconhecido. As visualizações só ajudam a encontrar candidatas; não decidem qual é a melhor. O site nunca diz "melhor aula", e sim "Selecionada por Prof. Nome".

## 3. Entrar no app

Copie o modelo do começo de `src/lib/lessons.ts` no fim da lista `LESSONS`.
- O título e o canal são exatamente os do YouTube.
- Em `selecionadaPor`, use o nome como deve aparecer no site, com o título ("Prof. Nome" ou "Profa. Nome").

Os testes conferem o formato de cada aula.

## 4. Conferir de tempos em tempos

`bun run check:lessons` verifica se cada vídeo ainda existe (não precisa de chave).
- Vídeo que sumiu aparece em `docs/aulas-substituir.md`, e o comando termina com erro.
- Tire esse vídeo de `LESSONS` e escolha um substituto.

Esse comando fica fora dos testes unitários, que funcionam sem internet.

## No app

- **Aulas:** as aulas aparecem por nível dentro de cada tópico, com título, canal e "Selecionada por …", sempre abrindo pelo `ExternalResourceLink`, com o "Copiar link".
- **Tela do tópico:** mostra a aula recomendada.
- **Desempenho:** as "Pendências a melhorar" sugerem a aula do tópico.
- **Domínio:** assistir a uma aula **não conta** para o domínio, que vem só das questões.
- **Vídeos:** o app não baixa nem hospeda vídeos; abre sempre o player oficial do YouTube.
