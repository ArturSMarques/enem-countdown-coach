/** Pure helpers for the lesson scripts (tested offline in src/test/lesson-scripts.test.ts). */

/** ISO 8601 duration from the YouTube API ("PT1H2M3S") in seconds. */
export function isoDurationSeconds(iso: string): number | null {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m || iso === "P" || iso === "PT") return null;
  const [, d = "0", h = "0", min = "0", s = "0"] = m;
  return Number(d) * 86400 + Number(h) * 3600 + Number(min) * 60 + Number(s);
}

/** "1 h 05 min", "18 min", "45 s". */
export function shortDuration(sec: number): string {
  if (sec < 60) return `${sec} s`;
  const h = Math.floor(sec / 3600);
  const min = Math.round((sec % 3600) / 60);
  return h ? `${h} h ${String(min).padStart(2, "0")} min` : `${min} min`;
}

export type Candidate = {
  videoId: string;
  titulo: string;
  canal: string;
  publicadoEm: string;
  segundos: number;
  views: number;
};

/** Keeps lessons that fit studying: between 5 and 90 minutes, public, not a live stream. */
export const CANDIDATE_RULES = { minSeconds: 5 * 60, maxSeconds: 90 * 60, perTopic: 6 };

export function filterCandidates(list: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return list
    .filter(
      (c) => c.segundos >= CANDIDATE_RULES.minSeconds && c.segundos <= CANDIDATE_RULES.maxSeconds,
    )
    .filter((c) => (seen.has(c.videoId) ? false : (seen.add(c.videoId), true)))
    .slice(0, CANDIDATE_RULES.perTopic);
}

/** Markdown block for one topic, for the teacher to review. */
export function candidatesMarkdown(topic: { id: string; name: string }, list: Candidate[]): string {
  const out = [`## ${topic.name} (\`${topic.id}\`)`, ""];
  if (!list.length) out.push("Nenhuma candidata encontrada com os critérios atuais.", "");
  for (const c of list) {
    out.push(
      `- [ ] **${c.titulo}** · ${c.canal} · ${shortDuration(c.segundos)} · publicado em ${c.publicadoEm} · ${c.views.toLocaleString("pt-BR")} visualizações`,
      `  - https://www.youtube.com/watch?v=${c.videoId}`,
      "  - Nível (base / intermediário / aprofundamento / resolução): ____ · Recomendada? ____",
    );
  }
  out.push("");
  return out.join("\n");
}

/** What a YouTube oEmbed status means for a lesson that is already in the list. */
export function oembedVerdict(status: number): "ok" | "removido" | "erro" {
  if (status === 200) return "ok";
  // 401/403: the video exists but embedding is restricted; the plain link still works.
  if (status === 401 || status === 403) return "ok";
  if (status === 400 || status === 404) return "removido";
  return "erro";
}
