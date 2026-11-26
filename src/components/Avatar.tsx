import { AVATAR_BY_ID, AVATARS, avatarSvg, DEFAULT_AVATAR } from "@/lib/avatars";

/** One of the ten avatars, as an image with a text description. */
export function Avatar({
  id,
  size = 40,
  label,
}: {
  id: string | undefined;
  size?: number;
  label?: string;
}) {
  const a = AVATAR_BY_ID[id ?? DEFAULT_AVATAR] ?? AVATAR_BY_ID[DEFAULT_AVATAR]!;
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg(a.id))}`}
      width={size}
      height={size}
      alt={label ?? `Avatar ${a.nome}`}
      className="shrink-0 rounded-full"
    />
  );
}

/** Grid to choose an avatar. */
export function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Escolha um avatar" className="grid grid-cols-5 gap-2">
      {AVATARS.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={value === a.id}
          aria-label={a.nome}
          onClick={() => onChange(a.id)}
          className={`rounded-full p-0.5 transition-shadow ${value === a.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
        >
          <Avatar id={a.id} size={48} label={a.nome} />
        </button>
      ))}
    </div>
  );
}
