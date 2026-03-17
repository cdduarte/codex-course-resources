import type { ReactNode } from "react";

type RouteLayoutShellProps = {
  area: string;
  description: string;
  children: ReactNode;
};

export function RouteLayoutShell({ area, description, children }: RouteLayoutShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--surface-strong),_var(--background)_65%)] px-4 py-8 text-[color:var(--foreground)]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm shadow-black/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
            {area}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">{description}</p>
        </header>
        {children}
      </div>
    </div>
  );
}
