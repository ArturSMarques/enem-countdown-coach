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
- Build for Cloudflare inside Lovable and for a Node server (nitro preset node-server) when RENDER=true, gated in vite.config.ts — so the same repo publishes on Lovable and runs on Render with `node .output/server/index.mjs`.
