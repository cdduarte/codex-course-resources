import type { ReactNode } from "react";

type RouteLayoutShellProps = {
  area: string;
  description: string;
  children: ReactNode;
};

export function RouteLayoutShell({ area, description, children }: RouteLayoutShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-sky-100 px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border border-sky-200/70 bg-white/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{area}</p>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </header>
        {children}
      </div>
    </div>
  );
}
