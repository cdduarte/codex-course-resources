import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  return (
    <main className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm shadow-black/10">
      <header className="border-b border-[color:var(--border)] pb-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-muted)]">
          {description}
        </p>
      </header>
      {children ? <section className="mt-5 space-y-4">{children}</section> : null}
    </main>
  );
}
