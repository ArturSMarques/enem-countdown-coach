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
- Plan logic lives in src/lib/planner.ts (pure, tested); persisted state + actions in src/lib/store.ts (localStorage, no backend) — keeps scheduling testable and the app offline-first.
- Keep YouTube parsing and launching in src/lib/youtube.ts and route external study links through ExternalResourceLink — one validation path, always a plain https link in a new tab (never intent:// or youtube:// schemes, which leave a blank tab or do nothing on phones; the OS opens the YouTube app by itself). This is a web app, not a Capacitor/Cordova package; add a native external-launch adapter only if a wrapper is introduced.
- Daily questions: short ones in src/lib/questions.ts, ENEM-style ones (texts, tables, SVG figures from src/lib/figures.ts) in src/lib/questions-enem.ts. Both are append-only because ids are saved in localStorage. Every question has a level (facil/media/dificil); selection logic is pure in src/lib/quiz.ts.
- Build for Cloudflare inside Lovable and for a Node server (nitro preset node-server) when RENDER=true, gated in vite.config.ts — so the same repo publishes on Lovable and runs on Render with `node .output/server/index.mjs`.
