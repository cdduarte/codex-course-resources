"use client";

import { PageShell } from "@/src/components";

type NotesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NotesError({ error, reset }: NotesErrorProps) {
  console.error(error);

  return (
    <PageShell
      eyebrow="Notes"
      title="We hit a problem"
      description="Something went wrong while loading your notes."
    >
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          Please try again. If this keeps happening, refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110"
        >
          Retry
        </button>
      </div>
    </PageShell>
  );
}
