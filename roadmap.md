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
