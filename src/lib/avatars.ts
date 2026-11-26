/**
 * Ten original avatars: one simple geometric figure on a calm color, consistent and sober. Ids
 * a1..a10 match the check in supabase/migrations/0001_contas.sql.
 */
export type AvatarDef = { id: string; nome: string; fundo: string; figura: string };

const W = "#ffffff";
export const AVATARS: AvatarDef[] = [
  {
    id: "a1",
    nome: "Triângulo",
    fundo: "#007565",
    figura: `<path d="M32 16 50 46H14z" fill="${W}"/>`,
  },
  {
    id: "a2",
    nome: "Anel",
    fundo: "#3b6fb6",
    figura: `<circle cx="32" cy="32" r="15" fill="none" stroke="${W}" stroke-width="7"/>`,
  },
  {
    id: "a3",
    nome: "Losango",
    fundo: "#c8942d",
    figura: `<path d="M32 13 51 32 32 51 13 32z" fill="${W}"/>`,
  },
  {
    id: "a4",
    nome: "Hexágono",
    fundo: "#3a8f62",
    figura: `<path d="M32 14 48 23v18L32 50 16 41V23z" fill="${W}"/>`,
  },
  {
    id: "a5",
    nome: "Barras",
    fundo: "#d56e49",
    figura: `<rect x="15" y="34" width="8" height="15" rx="2" fill="${W}"/><rect x="28" y="24" width="8" height="25" rx="2" fill="${W}"/><rect x="41" y="15" width="8" height="34" rx="2" fill="${W}"/>`,
  },
  {
    id: "a6",
    nome: "Estrela",
    fundo: "#5b5f97",
    figura: `<path d="m32 13 5.6 11.9 13 1.6-9.6 9 2.5 12.9L32 42l-11.5 6.4 2.5-12.9-9.6-9 13-1.6z" fill="${W}"/>`,
  },
  {
    id: "a7",
    nome: "Livro",
    fundo: "#b0506a",
    figura: `<path d="M14 19c6-2 12-1 17 2v26c-5-3-11-4-17-2zM50 19c-6-2-12-1-17 2v26c5-3 11-4 17-2z" fill="${W}"/>`,
  },
  {
    id: "a8",
    nome: "Órbitas",
    fundo: "#2f7f8c",
    figura: `<ellipse cx="32" cy="32" rx="19" ry="8" fill="none" stroke="${W}" stroke-width="4"/><ellipse cx="32" cy="32" rx="19" ry="8" fill="none" stroke="${W}" stroke-width="4" transform="rotate(60 32 32)"/><circle cx="32" cy="32" r="4" fill="${W}"/>`,
  },
  {
    id: "a9",
    nome: "Onda",
    fundo: "#46658a",
    figura: `<path d="M12 36c5-8 10-8 15 0s10 8 15 0 8-6 10-3" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: "a10",
    nome: "Grade",
    fundo: "#8a6a3b",
    figura: `<rect x="16" y="16" width="13" height="13" rx="3" fill="${W}"/><rect x="35" y="16" width="13" height="13" rx="3" fill="${W}" opacity=".7"/><rect x="16" y="35" width="13" height="13" rx="3" fill="${W}" opacity=".7"/><rect x="35" y="35" width="13" height="13" rx="3" fill="${W}"/>`,
  },
];

export const AVATAR_BY_ID: Record<string, AvatarDef> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a]),
);
export const DEFAULT_AVATAR = "a1";

/** Full SVG of an avatar (circle background + figure). */
export const avatarSvg = (id: string) => {
  const a = AVATAR_BY_ID[id] ?? AVATAR_BY_ID[DEFAULT_AVATAR]!;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${a.fundo}"/>${a.figura}</svg>`;
};
