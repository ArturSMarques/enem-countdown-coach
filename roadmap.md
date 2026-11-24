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
