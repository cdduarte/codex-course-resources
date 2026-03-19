import { PageShell } from "@/src/components";

export default function NotesLoading() {
  return (
    <PageShell eyebrow="Notes" title="Loading notes" description="Fetching your latest content...">
      <div className="space-y-3">
        <div className="h-16 animate-pulse rounded-xl border border-(--border) bg-(--surface-muted)" />
        <div className="h-16 animate-pulse rounded-xl border border-(--border) bg-(--surface-muted)" />
        <div className="h-16 animate-pulse rounded-xl border border-(--border) bg-(--surface-muted)" />
      </div>
    </PageShell>
  );
}
