# YouTube opening
- [x] Audit every YouTube entry point and report findings.
- [x] Centralize URL validation and open links as plain https links (no intent:// or youtube:// launch, which broke mobile).
- [x] Diagnose "www.youtube.com está bloqueado" (ERR_BLOCKED_BY_RESPONSE): YouTube refuses to load inside a frame; happens when the site runs inside an iframe (editor preview, masked domain). Documented in README.
- [x] Safe exit: "Copiar link" next to lesson links and a clear message on /aulas (extra warning when the site is framed).
- [ ] Republish the Lovable site (the published build is from early October) and confirm how retaenem.com.br is connected (Custom domain, not masked forwarding).
- [x] Test URL formats and real browser clicks (desktop, Android and iPhone emulation); a check on a physical phone is still recommended.

# Questions
- [x] Daily questions page (/questoes) with an ENEM-style bank, explanations and automatic performance records.
- [ ] Grow the bank over time (src/lib/questions.ts).

# Personalized plan (phase 2)
- [x] Onboarding: new title, automatic or chosen edition (no manual date), 1–4+ h, morning/afternoon/evening shifts, difficulty 1–10, goals per area.
- [x] State version 3 with migration and tests (manual date, 1,5 h, "ambos", difficulty 1–5, overall goal).
- [x] Planner: no shift under 25 min (fewer shifts, rotating), goals adjust area time within 0.8×–1.3×, one-sentence explanation.
- [ ] Course weights from official sources for the approved course list (docs/pesos-pendentes.md).

# Computed mastery (phase 3)
- [x] Attempts history (state version 3) filled from the old answers.
- [x] Mastery levels computed from answers (stricter initial values chosen by the team), with what is missing to go up; manual marks removed from the screen and no longer read by the planner.
- [ ] No topic has 8 questions yet, so "Dominado" is not reachable: grow the bank (phase 4).

# Question bank (phase 4)
- [x] Optional source/uso/revisada fields, integrity tests, "Créditos e fontes" page.
- [x] Real questions: structure only (origin + official link, statement only when released). None added until the team checks each institution's terms of use.
- [x] Batch 1 for review: 23 math questions (razão, probabilidade, geometria plana, funções, estatística), bringing those topics to 10 each.
- [ ] Review batch 1 (students check, teacher approves) — docs/revisao-questoes-novas.md.
- [ ] Next batches: other high-incidence topics (Linguagens, Humanas, Natureza), then the rest, up to 10 per topic.

# Performance (phase 5)
- [x] Pentagon by area (weighted hit rate, 30 days, minimum 5 answers; Redação "sem dados" until essay correction).
- [x] "Pendências a melhorar" with tip, trap and shortcuts, replacing "Pontos fracos".
- [x] Error type for every wrong alternative of the 60 in-depth questions (teacher may review src/lib/error-types.ts).
- [ ] Error types for the other questions (they need `porQue` first).

# Leagues and XP (phase 6)
- [x] XP from answers, blocks and streaks; five leagues ("moderado"); gentle drop after 21 days away.
- [x] Question difficulty ceiling by league; time per question shown from Intermediário; real released questions first from Avançado.
- [x] Shared ranking (phase 12): see "Ranking" below.

# Selected lessons (phase 7)
- [x] Lessons data by topic and level, shown in Aulas, on the topic page and in "Pendências a melhorar".
- [x] Candidates script (YouTube Data API, key only in env) and check:lessons (oEmbed) with docs/aulas.md.
- [ ] Team creates the API key and runs `bun run aulas:candidatas`; the teacher picks 2–4 lessons per topic, starting with high-incidence topics.

# Study (phase 8)
- [x] Adaptive spaced review from answers, "Revisão de hoje" on the home page and review on the topic page.
- [x] Explanation after every answer (also in the mini-simulado correction, including blanks).
- [x] Mini-simulados by area with timer, exam mode and correction; results feed pentagon, mastery, XP and plan.
- [ ] Full ENEM mock (2 days × 90 questions) once the bank grows.
- [ ] AI essay correction (decision 6) after privacy/terms (phase 10) and parental consent (decision 2).

# Home, schedule, visual polish and PWA (phase 9)
- [x] Home: goals as chips, minutes of the day, league and review side by side on wide screens, minutes per shift.
- [x] Schedule: today highlighted, total time and done count per day, shift labels; move/redistribute/reprioritize unchanged.
- [x] Visible keyboard focus, reduced motion, "Economia de dados" in Ajustes.
- [x] PWA: manifest, icons, service worker; main tabs open offline; offline page for screens never opened.
- [ ] Topic pages (/conteudos/<tópico>) are cached only after being opened once.

# Terms and privacy (phase 10)
- [x] Visible disclaimer (no score guarantee), /termos and /privacidade in plain language, acceptance on the first plan and notice for existing users.
- [x] LGPD on the device: download all data (JSON) and delete all data from Ajustes.
- [ ] Before accounts: parental consent with the school (decision 2), contact e-mail, legal review — docs/privacidade-pendencias.md.

# Accounts (phase 11)
- [x] Optional accounts with Supabase (nickname, e-mail, password), forgot password, sign out, delete account.
- [x] Minors: guardian e-mail and authorization link; nothing goes to the server before it.
- [x] First login imports the device's progress (merge without duplicates); automatic saving afterwards.
- [x] Ten original avatars, profile with summary, pentagon, pending topics and achievements.
- [ ] Team runs the SQL and sets the Render variables (docs/supabase.md).
- [ ] Custom SMTP (e.g. Resend with retaenem.com.br) so e-mails reach students and guardians outside the team.

# Ranking (phase 12)
- [x] Points computed by the server (registrar_respostas) from its own copy of the answer key; nothing the browser says about points is accepted.
- [x] Anti-cheat: 0 points for answers under 3 s, without time, repeated within 24 h or above 30/min, 600/h, 2,000/day; suspicious cases logged for the team; flagged accounts out of the ranking.
- [x] /ranking: week, month and all-time; nickname, avatar, points; top 3 and own place highlighted; opt-out; minors only after authorization.
- [x] Terms version 4 (ranking section); revoking authorization also deletes ranking answers.
- [ ] Team runs 0003_ranking.sql and gabarito.sql on Supabase (and gabarito.sql again whenever questions enter the bank).
- [ ] Optional later: ranking by class (turmas, phase 13).
