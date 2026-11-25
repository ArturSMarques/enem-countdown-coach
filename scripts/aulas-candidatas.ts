/**
 * Gera docs/aulas-candidatas.md: aulas candidatas por tópico, vindas de uma busca real na YouTube
 * Data API v3, para o professor revisar. A escolha final é do professor (seção 10.2).
 *
 * Uso (no computador da equipe, nunca no app):
 *   YOUTUBE_API_KEY=sua-chave bun run aulas:candidatas            # tópicos de incidência alta
 *   YOUTUBE_API_KEY=sua-chave bun run aulas:candidatas mat-porc   # só alguns tópicos
 * No Windows (PowerShell):  $env:YOUTUBE_API_KEY="sua-chave"; bun run aulas:candidatas
 * A chave fica só na variável de ambiente: não escreva a chave em nenhum arquivo do projeto.
 * Passo a passo para criar a chave: docs/aulas.md.
 */
import { writeFileSync } from "node:fs";
import { TOPICS } from "../src/lib/data";
import { incidenceTotal } from "../src/lib/incidence";
import {
  candidatesMarkdown,
  filterCandidates,
  isoDurationSeconds,
  type Candidate,
} from "./lib/aulas";

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.error("Defina YOUTUBE_API_KEY (veja docs/aulas.md). Nada foi gerado.");
  process.exit(1);
}
const API = "https://www.googleapis.com/youtube/v3";

/** The fields of the YouTube Data API responses that this script reads. */
type SearchItem = { id: { videoId?: string } };
type VideoItem = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    liveBroadcastContent?: string;
  };
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
  status?: { privacyStatus?: string };
};

async function get<T>(path: string, params: Record<string, string>): Promise<{ items?: T[] }> {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: KEY! })) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ items?: T[] }>;
}

async function candidatesFor(topicName: string): Promise<Candidate[]> {
  const search = await get<SearchItem>("search", {
    part: "snippet",
    type: "video",
    q: `${topicName} ENEM aula`,
    maxResults: "15",
    relevanceLanguage: "pt",
    regionCode: "BR",
    safeSearch: "strict",
  });
  const ids = (search.items ?? []).map((i) => i.id.videoId).filter((x): x is string => Boolean(x));
  if (!ids.length) return [];
  const videos = await get<VideoItem>("videos", {
    part: "snippet,contentDetails,statistics,status",
    id: ids.join(","),
  });
  const list: Candidate[] = [];
  for (const v of videos.items ?? []) {
    if (v.status?.privacyStatus !== "public" || v.snippet?.liveBroadcastContent !== "none")
      continue;
    const segundos = isoDurationSeconds(v.contentDetails?.duration ?? "");
    if (segundos === null) continue;
    list.push({
      videoId: v.id,
      titulo: v.snippet.title,
      canal: v.snippet.channelTitle,
      publicadoEm: String(v.snippet.publishedAt).slice(0, 10),
      segundos,
      views: Number(v.statistics?.viewCount ?? 0),
    });
  }
  return filterCandidates(list);
}

const args = process.argv.slice(2);
const topics = args.length
  ? TOPICS.filter((t) => args.includes(t.id))
  : TOPICS.filter((t) => t.priority === "alta").sort(
      (a, b) => incidenceTotal(b.id) - incidenceTotal(a.id),
    );

const today = new Date().toISOString().slice(0, 10);
const parts = [
  "# Aulas candidatas",
  "",
  `Gerado em ${today} por \`bun run aulas:candidatas\` (YouTube Data API v3). Busca: "<tópico> ENEM aula"; ficam vídeos públicos de 5 a 90 minutos.`,
  "",
  "**Para o professor:** assista e marque as escolhidas, com o nível. Critérios: didática e correção, alinhamento ao Enem, qualidade de áudio e imagem, material atual e canal reconhecido. Métrica (visualizações) só ajuda a achar candidatas; não decide qual é a melhor.",
  "",
];
for (const t of topics) {
  process.stdout.write(`${t.id}… `);
  parts.push(candidatesMarkdown(t, await candidatesFor(t.name)));
}
writeFileSync(new URL("../docs/aulas-candidatas.md", import.meta.url), parts.join("\n"));
console.log(`\ndocs/aulas-candidatas.md: ${topics.length} tópicos`);
