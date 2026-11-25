/**
 * Gera docs/revisao-questoes-novas.md a partir de src/lib/questions-novas.ts: a lista que os alunos
 * e o professor usam para revisar as questões novas. Rode com `bun run revisao` depois de mudar o
 * arquivo de questões novas.
 */
import { writeFileSync } from "node:fs";
import { TOPIC_BY_ID } from "../src/lib/data";
import { LEVEL_LABEL } from "../src/lib/question-types";
import { NEW_QUESTIONS } from "../src/lib/questions-novas";

const L = ["A", "B", "C", "D", "E"];
const pending = NEW_QUESTIONS.filter((q) => !q.revisada);
const out: string[] = [
  "# Revisão das questões novas",
  "",
  "Gerado por `bun run revisao` a partir de `src/lib/questions-novas.ts`. Não edite à mão: corrija a questão no arquivo e gere de novo.",
  "",
  "**Como revisar**",
  "",
  "1. Um aluno resolve a questão **sem olhar o gabarito** e anota a resposta.",
  "2. Confere com o gabarito e a explicação. Se discordar, ou se achar o texto confuso, anota o problema.",
  "3. O professor lê as anotações e decide: aprovar, corrigir ou descartar.",
  "4. Aprovada, a questão recebe `revisada: true` no arquivo e passa a aparecer no app.",
  "",
  `Aguardando revisão: **${pending.length}** questões.`,
  "",
];
for (const q of pending) {
  const t = TOPIC_BY_ID[q.topicId];
  out.push(`## ${q.id} · ${t?.name ?? q.topicId} · ${LEVEL_LABEL[q.level]}`, "");
  out.push(q.text, "");
  q.options.forEach((o, i) => out.push(`- ${L[i]}) ${o}`));
  out.push("", `**Gabarito:** ${L[q.answer]}`, "", `**Explicação:** ${q.why}`, "");
  out.push("- [ ] Aluno resolveu e o gabarito confere (nome: ______)");
  out.push("- [ ] Professor aprovou");
  out.push("- Observações: ", "");
}
writeFileSync(new URL("../docs/revisao-questoes-novas.md", import.meta.url), out.join("\n"));
console.log(`docs/revisao-questoes-novas.md: ${pending.length} questões`);
