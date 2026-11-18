import type { Figure } from "./question-types";

/**
 * Gerador de figuras (SVG) para as questões. As imagens são embutidas como data URI e exibidas
 * em <img>, então não executam script. Fundo branco fixo para ficar legível nos temas claro e escuro.
 */
const FONT = "Arial, Helvetica, sans-serif";
const INK = "#1f2937";
const MUTED = "#6b7280";
const GRID = "#e1e5ea";
const PALETTE = ["#2f6fb3", "#e08a1e", "#2e8b57", "#c0392b", "#7b5ea7", "#6b7280"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Número no formato brasileiro (vírgula decimal). */
const num = (n: number) => (Math.round(n * 100) / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

type TextOpts = { anchor?: "start" | "middle" | "end"; size?: number; weight?: "bold"; fill?: string; rotate?: number };
const txt = (x: number, y: number, s: string, o: TextOpts = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${o.anchor ?? "start"}" font-size="${o.size ?? 12}"${o.weight ? ` font-weight="${o.weight}"` : ""} fill="${o.fill ?? INK}"${o.rotate ? ` transform="rotate(${o.rotate} ${x} ${y})"` : ""}>${esc(s)}</text>`;
const line = (x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 1.5, dash?: string) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

const svgDoc = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="${FONT}"><rect width="${w}" height="${h}" fill="#ffffff"/>${body}</svg>`;

export const toFigure = (svg: string, alt: string, caption?: string): Figure => ({
  src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  alt,
  ...(caption ? { caption } : {}),
});

type Axis = { min: number; max: number; step: number; label?: string };
const ticks = (a: Axis) => {
  const n = Math.round((a.max - a.min) / a.step);
  return Array.from({ length: n + 1 }, (_, i) => a.min + i * a.step);
};

type Series = { name: string; color?: string; dashed?: boolean };
const legend = (series: Series[], x: number, y: number) =>
  series.length < 2
    ? ""
    : series
        .map((s, i) => {
          const lx = x + i * 118;
          return `<rect x="${lx}" y="${y - 9}" width="12" height="12" fill="${s.color ?? PALETTE[i % PALETTE.length]}"/>${txt(lx + 17, y + 2, s.name, { size: 12 })}`;
        })
        .join("");

/** Gráfico de linhas com eixos numéricos (ex.: velocidade × tempo, lucro × quantidade). */
export function xyChart(o: {
  title: string;
  x: Axis;
  y: Axis;
  series: (Series & { points: [number, number][]; markers?: boolean })[];
  w?: number;
  h?: number;
}) {
  const w = o.w ?? 420;
  const h = o.h ?? 300;
  const m = { l: 56, r: 18, t: 56, b: 52 };
  const pw = w - m.l - m.r;
  const ph = h - m.t - m.b;
  const sx = (v: number) => m.l + ((v - o.x.min) / (o.x.max - o.x.min)) * pw;
  const sy = (v: number) => m.t + ph - ((v - o.y.min) / (o.y.max - o.y.min)) * ph;
  let b = txt(w / 2, 22, o.title, { anchor: "middle", size: 14, weight: "bold" });
  b += legend(o.series, m.l, 42);
  for (const v of ticks(o.y)) {
    b += line(m.l, sy(v), w - m.r, sy(v), v === 0 ? INK : GRID, v === 0 ? 1.2 : 1);
    b += txt(m.l - 7, sy(v) + 4, num(v), { anchor: "end", fill: MUTED });
  }
  for (const v of ticks(o.x)) {
    b += line(sx(v), m.t, sx(v), m.t + ph, GRID, 1);
    b += txt(sx(v), m.t + ph + 17, num(v), { anchor: "middle", fill: MUTED });
  }
  b += line(m.l, m.t, m.l, m.t + ph) + line(m.l, m.t + ph, w - m.r, m.t + ph);
  if (o.x.label) b += txt(m.l + pw / 2, h - 10, o.x.label, { anchor: "middle", fill: MUTED });
  if (o.y.label) b += txt(14, m.t + ph / 2, o.y.label, { anchor: "middle", fill: MUTED, rotate: -90 });
  o.series.forEach((s, i) => {
    const color = s.color ?? PALETTE[i % PALETTE.length];
    const pts = s.points.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ");
    b += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"${s.dashed ? ' stroke-dasharray="6 4"' : ""}/>`;
    if (s.markers) for (const [x, y] of s.points) b += `<circle cx="${sx(x).toFixed(1)}" cy="${sy(y).toFixed(1)}" r="3.5" fill="${color}"/>`;
  });
  return svgDoc(w, h, b);
}

/** Gráfico de barras (agrupadas, quando há mais de uma série). */
export function barChart(o: {
  title: string;
  labels: string[];
  series: (Series & { values: number[] })[];
  y: Axis;
  w?: number;
  h?: number;
}) {
  const w = o.w ?? 420;
  const h = o.h ?? 300;
  const m = { l: 56, r: 18, t: 56, b: 52 };
  const pw = w - m.l - m.r;
  const ph = h - m.t - m.b;
  const sy = (v: number) => m.t + ph - ((v - o.y.min) / (o.y.max - o.y.min)) * ph;
  let b = txt(w / 2, 22, o.title, { anchor: "middle", size: 14, weight: "bold" });
  b += legend(o.series, m.l, 42);
  for (const v of ticks(o.y)) {
    b += line(m.l, sy(v), w - m.r, sy(v), v === o.y.min ? INK : GRID, v === o.y.min ? 1.2 : 1);
    b += txt(m.l - 7, sy(v) + 4, num(v), { anchor: "end", fill: MUTED });
  }
  if (o.y.label) b += txt(14, m.t + ph / 2, o.y.label, { anchor: "middle", fill: MUTED, rotate: -90 });
  const gw = pw / o.labels.length;
  const bw = Math.min(46, (gw * 0.72) / o.series.length);
  o.labels.forEach((label, gi) => {
    const gx = m.l + gi * gw + gw / 2;
    b += txt(gx, m.t + ph + 17, label, { anchor: "middle" });
    o.series.forEach((s, si) => {
      const v = s.values[gi] ?? 0;
      const x = gx - (bw * o.series.length) / 2 + si * bw;
      b += `<rect x="${x.toFixed(1)}" y="${sy(v).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(m.t + ph - sy(v)).toFixed(1)}" fill="${s.color ?? PALETTE[si % PALETTE.length]}"/>`;
      b += txt(x + (bw - 2) / 2, sy(v) - 5, num(v), { anchor: "middle", size: 11 });
    });
  });
  return svgDoc(w, h, b);
}

/** Gráfico de rosca com legenda em porcentagem. */
export function donut(o: { title: string; slices: { label: string; value: number }[] }) {
  const w = 420;
  const h = 300;
  const cx = 120;
  const cy = 168;
  const R = 92;
  const r = 52;
  const total = o.slices.reduce((s, x) => s + x.value, 0);
  let b = txt(w / 2, 22, o.title, { anchor: "middle", size: 14, weight: "bold" });
  let a0 = -Math.PI / 2;
  o.slices.forEach((s, i) => {
    const a1 = a0 + (s.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rad: number, a: number) => `${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
    b += `<path d="M ${p(R, a0)} A ${R} ${R} 0 ${large} 1 ${p(R, a1)} L ${p(r, a1)} A ${r} ${r} 0 ${large} 0 ${p(r, a0)} Z" fill="${PALETTE[i % PALETTE.length]}" stroke="#fff" stroke-width="2"/>`;
    const ly = 80 + i * 28;
    b += `<rect x="248" y="${ly - 11}" width="14" height="14" fill="${PALETTE[i % PALETTE.length]}"/>` + txt(270, ly + 1, `${s.label}: ${num((s.value / total) * 100)}%`, { size: 13 });
    a0 = a1;
  });
  return svgDoc(w, h, b);
}

/** Climograma: precipitação (barras, eixo esquerdo) e temperatura média (linha, eixo direito). */
export function climograph(o: { title: string; rain: number[]; temp: number[] }) {
  const w = 420;
  const h = 300;
  const m = { l: 52, r: 46, t: 60, b: 44 };
  const pw = w - m.l - m.r;
  const ph = h - m.t - m.b;
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const gw = pw / 12;
  const sr = (v: number) => m.t + ph - (v / 300) * ph;
  const st = (v: number) => m.t + ph - (v / 30) * ph;
  let b = txt(w / 2, 22, o.title, { anchor: "middle", size: 14, weight: "bold" });
  b += `<rect x="${m.l}" y="34" width="12" height="12" fill="#2f6fb3"/>` + txt(m.l + 17, 45, "Chuva (mm)");
  b += `<rect x="${m.l + 118}" y="38" width="16" height="4" fill="#c0392b"/>` + txt(m.l + 140, 45, "Temperatura (°C)");
  for (const v of [0, 100, 200, 300]) {
    b += line(m.l, sr(v), w - m.r, sr(v), v === 0 ? INK : GRID, 1) + txt(m.l - 7, sr(v) + 4, String(v), { anchor: "end", fill: "#2f6fb3" });
  }
  for (const v of [0, 10, 20, 30]) b += txt(w - m.r + 7, st(v) + 4, String(v), { fill: "#c0392b" });
  o.rain.forEach((v, i) => {
    b += `<rect x="${(m.l + i * gw + 4).toFixed(1)}" y="${sr(v).toFixed(1)}" width="${(gw - 8).toFixed(1)}" height="${(m.t + ph - sr(v)).toFixed(1)}" fill="#2f6fb3"/>`;
    b += txt(m.l + i * gw + gw / 2, m.t + ph + 16, months[i] ?? "", { anchor: "middle" });
  });
  const pts = o.temp.map((v, i) => `${(m.l + i * gw + gw / 2).toFixed(1)},${st(v).toFixed(1)}`).join(" ");
  b += `<polyline points="${pts}" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-linejoin="round"/>`;
  b += line(m.l, m.t, m.l, m.t + ph) + line(w - m.r, m.t, w - m.r, m.t + ph);
  return svgDoc(w, h, b);
}

/** Pirâmide de energia entre níveis tróficos. */
export function energyPyramid(levels: { name: string; kcal: string }[]) {
  const w = 420;
  const rowH = 54;
  const h = 40 + levels.length * rowH;
  let b = txt(w / 2, 22, "Energia disponível em cada nível trófico (kcal)", { anchor: "middle", size: 14, weight: "bold" });
  levels.forEach((lv, i) => {
    const width = 380 - i * (160 / Math.max(levels.length - 1, 1));
    const y = 38 + (levels.length - 1 - i) * rowH;
    b += `<rect x="${(w - width) / 2}" y="${y}" width="${width}" height="${rowH - 6}" rx="4" fill="${PALETTE[i % PALETTE.length]}" opacity="0.92"/>`;
    b += txt(w / 2, y + 22, lv.name, { anchor: "middle", fill: "#fff", weight: "bold", size: 13 });
    b += txt(w / 2, y + 40, `${lv.kcal} kcal`, { anchor: "middle", fill: "#fff", size: 13 });
  });
  return svgDoc(w, h, b);
}

/** Recipiente cilíndrico com água e esfera maciça ao lado. */
export function cylinderAndSphere() {
  const b =
    txt(210, 22, "Recipiente e esfera (fora de escala)", { anchor: "middle", size: 14, weight: "bold" }) +
    `<rect x="90" y="130" width="130" height="130" fill="#bfdcf5"/>` +
    line(90, 60, 90, 260, INK, 3) + line(220, 60, 220, 260, INK, 3) + line(90, 260, 220, 260, INK, 3) +
    line(90, 130, 220, 130, "#2f6fb3", 2, "5 3") +
    line(66, 130, 66, 260, MUTED, 1.5) + line(60, 130, 72, 130, MUTED, 1.5) + line(60, 260, 72, 260, MUTED, 1.5) + txt(58, 200, "12 cm", { anchor: "end", size: 12 }) +
    line(90, 285, 220, 285, MUTED, 1.5) + txt(155, 302, "raio = 10 cm", { anchor: "middle", size: 12 }) +
    txt(155, 120, "nível da água", { anchor: "middle", size: 11, fill: "#2f6fb3" }) +
    `<circle cx="340" cy="150" r="46" fill="#9aa5b1" stroke="${INK}" stroke-width="2"/>` +
    line(340, 150, 386, 150, "#fff", 2) + txt(363, 143, "r = 5 cm", { anchor: "middle", size: 11, fill: "#fff" }) +
    txt(340, 222, "esfera maciça de aço", { anchor: "middle", size: 12 }) +
    txt(340, 238, "(será mergulhada)", { anchor: "middle", size: 12, fill: MUTED });
  return svgDoc(420, 312, b);
}

/** Terreno em formato de L, com medidas. */
export function lShapedLot() {
  const b =
    txt(210, 22, "Planta do terreno (medidas em metros)", { anchor: "middle", size: 14, weight: "bold" }) +
    `<polygon points="50,66 250,66 250,146 350,146 350,266 50,266" fill="#d9ead3" stroke="${INK}" stroke-width="2.5"/>` +
    txt(150, 58, "20 m", { anchor: "middle" }) +
    txt(262, 110, "8 m") +
    txt(300, 138, "10 m", { anchor: "middle" }) +
    txt(360, 210, "12 m") +
    txt(200, 288, "30 m", { anchor: "middle" }) +
    txt(40, 170, "20 m", { anchor: "end" }) +
    txt(150, 170, "terreno", { anchor: "middle", fill: MUTED });
  return svgDoc(420, 300, b);
}

/** Pessoa sobre uma balança dentro de um elevador que sobe acelerando. */
export function elevator() {
  const b =
    txt(210, 22, "Elevador subindo com aceleração constante", { anchor: "middle", size: 14, weight: "bold" }) +
    `<rect x="120" y="50" width="150" height="190" fill="#f3f4f6" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="195" cy="100" r="16" fill="#e0b48a" stroke="${INK}" stroke-width="2"/>` +
    line(195, 116, 195, 180, INK, 4) + line(195, 180, 178, 214, INK, 4) + line(195, 180, 212, 214, INK, 4) +
    line(195, 134, 172, 160, INK, 4) + line(195, 134, 218, 160, INK, 4) +
    `<rect x="160" y="214" width="70" height="18" rx="3" fill="#6b7280"/>` + txt(195, 227, "balança", { anchor: "middle", size: 10, fill: "#fff" }) +
    line(320, 200, 320, 90, "#c0392b", 4) + `<polygon points="310,96 320,70 330,96" fill="#c0392b"/>` +
    txt(332, 140, "a = 2 m/s²", { fill: "#c0392b", weight: "bold" }) +
    txt(195, 266, "massa da pessoa: 60 kg   |   g = 10 m/s²", { anchor: "middle", size: 12 });
  return svgDoc(420, 285, b);
}

/** Trilho de montanha-russa sem atrito com alturas marcadas. */
export function rollerCoaster() {
  const g = 250; // chão (y), 4 px por metro
  const b =
    txt(210, 22, "Carrinho em trilho sem atrito (g = 10 m/s²)", { anchor: "middle", size: 14, weight: "bold" }) +
    line(50, g, 400, g, INK, 2) +
    `<path d="M 80 70 C 135 70, 155 ${g}, 220 ${g} C 285 ${g}, 305 150, 360 150" fill="none" stroke="#2f6fb3" stroke-width="4"/>` +
    `<circle cx="80" cy="70" r="7" fill="#c0392b"/>` + txt(80, 56, "A (repouso)", { anchor: "middle", size: 12 }) +
    `<circle cx="220" cy="${g}" r="5" fill="${INK}"/>` + txt(220, g + 18, "B", { anchor: "middle", size: 12 }) +
    `<circle cx="360" cy="150" r="5" fill="${INK}"/>` + txt(360, 140, "C", { anchor: "middle", size: 12 }) +
    line(46, 70, 46, g, MUTED, 1.2) + line(40, 70, 52, 70, MUTED, 1.2) + txt(40, 164, "45 m", { anchor: "end", size: 12 }) +
    line(386, 150, 386, g, MUTED, 1.2) + line(380, 150, 392, 150, MUTED, 1.2) + txt(392, 205, "25 m", { size: 12 }) +
    line(80, 70, 46, 70, MUTED, 1, "3 3");
  return svgDoc(430, 280, b);
}

/** Heredograma: casal sem a doença com uma filha afetada e outros dois filhos sem a doença. */
export function pedigree() {
  const sq = (x: number, y: number, fill = "#fff") => `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" fill="${fill}" stroke="${INK}" stroke-width="2.5"/>`;
  const ci = (x: number, y: number, fill = "#fff") => `<circle cx="${x}" cy="${y}" r="16" fill="${fill}" stroke="${INK}" stroke-width="2.5"/>`;
  const b =
    txt(210, 22, "Heredograma de uma família", { anchor: "middle", size: 14, weight: "bold" }) +
    sq(150, 68) + ci(270, 68) + line(165, 68, 254, 68, INK, 2.5) +
    txt(150, 104, "I-1", { anchor: "middle", size: 11, fill: MUTED }) + txt(270, 104, "I-2", { anchor: "middle", size: 11, fill: MUTED }) +
    line(210, 68, 210, 130, INK, 2.5) + line(90, 130, 330, 130, INK, 2.5) +
    line(90, 130, 90, 160, INK, 2.5) + line(210, 130, 210, 160, INK, 2.5) + line(330, 130, 330, 160, INK, 2.5) +
    ci(90, 178, INK) + sq(210, 178) + ci(330, 178) +
    txt(90, 214, "II-1", { anchor: "middle", size: 11, fill: MUTED }) + txt(210, 214, "II-2", { anchor: "middle", size: 11, fill: MUTED }) + txt(330, 214, "II-3", { anchor: "middle", size: 11, fill: MUTED }) +
    sq(60, 252) + txt(80, 257, "homem", { size: 11 }) + ci(150, 252) + txt(172, 257, "mulher", { size: 11 }) +
    ci(246, 252, INK) + txt(268, 257, "com a doença", { size: 11 });
  return svgDoc(420, 275, b);
}

/** Cartaz de campanha (usado em questão de linguagem). */
export function ambulancePoster() {
  const b =
    `<rect x="12" y="12" width="396" height="296" rx="10" fill="#b3261e"/>` +
    `<circle cx="52" cy="50" r="22" fill="#fff"/>` + line(52, 50, 52, 36, "#b3261e", 3.5) + line(52, 50, 63, 56, "#b3261e", 3.5) +
    txt(210, 108, "SUA PRESSA", { anchor: "middle", size: 32, weight: "bold", fill: "#fff" }) +
    txt(210, 146, "PODE ESPERAR.", { anchor: "middle", size: 32, weight: "bold", fill: "#fff" }) +
    txt(210, 208, "A VIDA DELE,", { anchor: "middle", size: 32, weight: "bold", fill: "#ffd54f" }) +
    txt(210, 246, "NÃO.", { anchor: "middle", size: 32, weight: "bold", fill: "#ffd54f" }) +
    line(40, 264, 380, 264, "#fff", 1.5) +
    txt(210, 290, "Ouviu a sirene? Dê passagem à ambulância.", { anchor: "middle", size: 14, fill: "#fff" });
  return svgDoc(420, 320, b);
}

/** Travessia de rio: semelhança de triângulos. */
export function riverCrossing() {
  const b =
    txt(210, 20, "Medindo a largura de um rio (fora de escala)", { anchor: "middle", size: 14, weight: "bold" }) +
    `<rect x="20" y="56" width="380" height="144" fill="#cfe6f7"/>` +
    txt(330, 120, "rio", { fill: "#2f6fb3", size: 14 }) +
    line(20, 56, 400, 56, "#6b7280", 2) + line(20, 200, 400, 200, "#6b7280", 2) +
    line(100, 56, 100, 200, INK, 2, "5 3") + line(100, 56, 260, 248, "#c0392b", 2.2) + line(100, 200, 260, 200, INK, 2) + line(260, 200, 260, 248, INK, 2) +
    `<circle cx="100" cy="56" r="5" fill="${INK}"/><circle cx="100" cy="200" r="5" fill="${INK}"/><circle cx="220" cy="200" r="5" fill="${INK}"/><circle cx="260" cy="200" r="5" fill="${INK}"/><circle cx="260" cy="248" r="5" fill="${INK}"/>` +
    txt(88, 52, "A", { anchor: "end", weight: "bold" }) + txt(88, 218, "B", { anchor: "end", weight: "bold" }) + txt(220, 218, "C", { anchor: "middle", weight: "bold" }) + txt(264, 218, "D", { weight: "bold" }) + txt(268, 252, "E", { weight: "bold" }) +
    txt(110, 135, "AB = ?", { fill: "#c0392b", weight: "bold" }) +
    txt(160, 192, "BC = 30 m", { anchor: "middle", size: 12 }) + txt(240, 192, "10 m", { anchor: "middle", size: 12 }) +
    txt(272, 228, "DE = 12 m", { size: 12 });
  return svgDoc(420, 275, b);
}

/** Circuito com dois resistores em paralelo ligados a uma fonte. */
export function parallelCircuit() {
  const zig = (x: number, y1: number, y2: number) => {
    const pts = [[x, y1]];
    const n = 6;
    for (let i = 1; i <= n; i++) pts.push([x + (i % 2 ? -9 : 9), y1 + ((y2 - y1) * i) / (n + 1)]);
    pts.push([x, y2]);
    return `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  };
  const b =
    txt(210, 22, "Circuito elétrico", { anchor: "middle", size: 14, weight: "bold" }) +
    line(70, 60, 290, 60, INK, 2.5) + line(70, 220, 290, 220, INK, 2.5) + line(70, 60, 70, 110, INK, 2.5) + line(70, 170, 70, 220, INK, 2.5) +
    line(52, 110, 88, 110, INK, 2.5) + line(60, 124, 80, 124, INK, 5) + line(52, 138, 88, 138, INK, 2.5) + line(60, 152, 80, 152, INK, 5) + line(70, 152, 70, 170, INK, 2.5) +
    txt(100, 134, "12 V", { size: 13, weight: "bold" }) +
    line(180, 60, 180, 100, INK, 2.5) + zig(180, 100, 180) + line(180, 180, 180, 220, INK, 2.5) +
    txt(200, 142, "R₁ = 6 Ω", { size: 13 }) +
    line(290, 60, 290, 100, INK, 2.5) + zig(290, 100, 180) + line(290, 180, 290, 220, INK, 2.5) +
    txt(310, 142, "R₂ = 3 Ω", { size: 13 });
  return svgDoc(420, 245, b);
}
