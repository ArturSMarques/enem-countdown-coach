<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Plan logic lives in src/lib/planner.ts (pure, tested); persisted state + actions in src/lib/store.ts (localStorage, no backend) — keeps scheduling testable and the app offline-first. The plan is rolling (HORIZON_DAYS ahead, extended on load) with phases (base, aprofundamento, revisão, semana final), spaced reviews and Sunday mock tests.
- ENEM dates come from src/lib/editions.ts: official editions (dates and exam-day rules from Inep editais) plus an estimate for years without an edital. The target edition follows today's date; never hard-code a year. When a new edital comes out, add it to OFFICIAL.
- The saved state is versioned (`version` inside the "reta-final-enem-v1" key). Any format change needs a step in migrate() and a test in src/test/state-migration.test.ts; users must never lose data.
- Keep YouTube parsing and launching in src/lib/youtube.ts and route external study links through ExternalResourceLink — one validation path, always a plain https link in a new tab (never intent:// or youtube:// schemes, which leave a blank tab or do nothing on phones; the OS opens the YouTube app by itself). This is a web app, not a Capacitor/Cordova package; add a native external-launch adapter only if a wrapper is introduced.
- Topic depth lives in src/lib/content/<area>.ts (TopicContent: resumo, base, intermediario, avancado, armadilhas, exercicios), shown at /conteudos/$topicId (file routes/conteudos_.$topicId.tsx, not nested). Accuracy first: anything uncertain goes in `aConfirmar`, never stated as fact.
- Topic priorities follow src/lib/incidence.ts (own classification of the official 2024–2026 exams, method in docs/incidencia-enem.md): alta ≥ 6 questions in the three exams, média 3–5, baixa ≤ 2. A test enforces this; update both together. The planner weights topics by that count.
- Daily questions: short ones in src/lib/questions.ts, ENEM-style ones (texts, tables, SVG figures from src/lib/figures.ts) in src/lib/questions-enem.ts, in-depth ones with an explanation for every alternative (`porQue`) in src/lib/questions-depth.ts. Both are append-only because ids are saved in localStorage. Every question has a level (facil/media/dificil); selection logic is pure in src/lib/quiz.ts. Answers by level per area (src/lib/mastery.ts) set a stage (base/regular/avancado) that the planner and the daily selection use.
- Build for Cloudflare inside Lovable and for a Node server (nitro preset node-server) when RENDER=true, gated in vite.config.ts — so the same repo publishes on Lovable and runs on Render with `node .output/server/index.mjs`.
- Personalized plan (state version 3): `Config` has `shifts` (manhã/tarde/noite), `hours` as a number (1,5 h from older versions stays valid), difficulty 1–10 (planner uses `0.6 + diff * 0.1`, equivalent to the old 1–5 scale doubled) and optional `goals` per area. Area weights are adjusted by goals and course weights only within 0.8×–1.3× (`areaFactors`), and no shift gets less than 25 min (`shiftsForDay`). Course weights live in src/lib/course-weights.ts and only with an official source, year and link; anything unconfirmed goes to docs/pesos-pendentes.md, never estimated.
