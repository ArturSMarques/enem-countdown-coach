/**
 * Gera supabase/gabarito.sql a partir das questões do app: o gabarito que o servidor usa para
 * conferir as respostas do ranking. Rode `bun run gabarito` sempre que uma questão entrar no banco
 * (ou uma questão nova for marcada como revisada) e rode o arquivo gerado no SQL Editor do Supabase.
 * Um teste (src/test/ranking.test.ts) falha se o arquivo estiver desatualizado.
 */
import { writeFileSync } from "node:fs";
import { gabaritoSQL } from "../src/lib/gabarito-sql";
import { QUESTIONS } from "../src/lib/questions";

writeFileSync("supabase/gabarito.sql", gabaritoSQL(QUESTIONS));
console.log(`supabase/gabarito.sql: ${QUESTIONS.length} questões.`);
