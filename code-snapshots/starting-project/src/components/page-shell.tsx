import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  return (
    <main className="w-full rounded-2xl border border-sky-200/60 bg-white/85 p-6 shadow-sm">
      <header className="border-b border-sky-100 pb-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </header>
      {children ? <section className="mt-5 space-y-4">{children}</section> : null}
    </main>
  );
}
