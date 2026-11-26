import type { ReactNode } from "react";

/** One titled block of the Terms and Privacy pages. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-soft p-4">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="mt-1 space-y-2 text-muted-foreground">{children}</div>
    </section>
  );
}
