import { describe, expect, it } from "vitest";
import {
  candidatesMarkdown,
  filterCandidates,
  isoDurationSeconds,
  oembedVerdict,
  shortDuration,
  type Candidate,
} from "../../scripts/lib/aulas";

const c = (videoId: string, segundos: number): Candidate => ({
  videoId,
  titulo: `Aula ${videoId}`,
  canal: "Canal",
  publicadoEm: "2025-03-01",
  segundos,
  views: 12345,
});

describe("lesson scripts helpers (offline)", () => {
  it("reads YouTube durations", () => {
    expect(isoDurationSeconds("PT18M30S")).toBe(1110);
    expect(isoDurationSeconds("PT1H2M3S")).toBe(3723);
    expect(isoDurationSeconds("PT45S")).toBe(45);
    expect(isoDurationSeconds("P0D")).toBe(0);
    expect(isoDurationSeconds("abc")).toBeNull();
    expect(shortDuration(1110)).toBe("19 min");
    expect(shortDuration(3723)).toBe("1 h 02 min");
    expect(shortDuration(45)).toBe("45 s");
  });

  it("keeps public lessons between 5 and 90 minutes, without repeats, up to 6 per topic", () => {
    const list = [
      c("A", 200),
      c("B", 600),
      c("B", 600),
      c("C", 6000),
      ...["D", "E", "F", "G", "H", "I"].map((x) => c(x, 900)),
    ];
    expect(filterCandidates(list).map((x) => x.videoId)).toEqual(["B", "D", "E", "F", "G", "H"]);
  });

  it("writes a review block with link, duration and fields for the teacher", () => {
    const md = candidatesMarkdown({ id: "mat-porc", name: "Porcentagem" }, [
      c("ABCDEFGHIJK", 1110),
    ]);
    expect(md).toContain("## Porcentagem (`mat-porc`)");
    expect(md).toContain("https://www.youtube.com/watch?v=ABCDEFGHIJK");
    expect(md).toContain("19 min");
    expect(md).toContain("Nível (base / intermediário / aprofundamento / resolução)");
    expect(candidatesMarkdown({ id: "x", name: "X" }, [])).toContain("Nenhuma candidata");
  });

  it("tells a removed video from one that still exists", () => {
    expect(oembedVerdict(200)).toBe("ok");
    expect(oembedVerdict(401)).toBe("ok");
    expect(oembedVerdict(404)).toBe("removido");
    expect(oembedVerdict(400)).toBe("removido");
    expect(oembedVerdict(500)).toBe("erro");
  });
});
