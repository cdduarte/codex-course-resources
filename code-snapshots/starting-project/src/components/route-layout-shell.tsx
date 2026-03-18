import type { ReactNode } from "react";

type RouteLayoutShellProps = {
  area: string;
  description: string;
  children: ReactNode;
};

export function RouteLayoutShell({ area, description, children }: RouteLayoutShellProps) {
  return (
    <div className="min-h-screen bg-(image:--shell-gradient) px-4 py-8 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-sm shadow-black/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--accent)">{area}</p>
          <p className="mt-2 text-sm text-(--text-muted)">{description}</p>
        </header>
        {children}
      </div>
    </div>
  );
}
