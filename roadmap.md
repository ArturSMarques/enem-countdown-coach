# YouTube opening
- [x] Audit every YouTube entry point and report findings.
- [x] Centralize URL validation and open links as plain https links (no intent:// or youtube:// launch, which broke mobile).
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
