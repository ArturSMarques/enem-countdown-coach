/**
 * Confere se cada aula de src/lib/lessons.ts ainda existe no YouTube, pelo oEmbed público (não
 * precisa de chave). Vídeo que sumiu vai para docs/aulas-substituir.md e o comando termina com
 * erro, para ser tirado de LESSONS e substituído. Roda à mão ou na CI: `bun run check:lessons`.
 * Fica fora dos testes unitários, que funcionam sem internet.
 */
import { writeFileSync } from "node:fs";
import { LESSONS, lessonURL } from "../src/lib/lessons";
import { oembedVerdict } from "./lib/aulas";

if (!LESSONS.length) {
  console.log("Nenhuma aula cadastrada em src/lib/lessons.ts ainda.");
  process.exit(0);
}
const removed: string[] = [];
let errors = 0;
for (const l of LESSONS) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(lessonURL(l))}`;
  let verdict: "ok" | "removido" | "erro" = "erro";
  try {
    verdict = oembedVerdict((await fetch(url)).status);
  } catch {
    verdict = "erro";
  }
  console.log(`${verdict.padEnd(8)} ${l.topicId} · ${l.titulo}`);
  if (verdict === "removido")
    removed.push(
      `- [ ] \`${l.topicId}\` · ${l.nivel} · **${l.titulo}** (${l.canal}) · ${lessonURL(l)}`,
    );
  if (verdict === "erro") errors++;
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  new URL("../docs/aulas-substituir.md", import.meta.url),
  [
    "# Aulas para substituir",
    "",
    `Verificado em ${today} por \`bun run check:lessons\`.`,
    "",
    removed.length
      ? "Estes vídeos não existem mais (ou ficaram privados). Tire-os de `LESSONS` e escolha substitutos:"
      : "Todas as aulas cadastradas continuam disponíveis.",
    "",
    ...removed,
    "",
  ].join("\n"),
);
if (errors)
  console.log(`${errors} aula(s) não puderam ser verificadas (rede). Rode de novo mais tarde.`);
process.exit(removed.length ? 1 : 0);
