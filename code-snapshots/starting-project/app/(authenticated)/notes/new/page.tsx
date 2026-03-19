import Link from "next/link";
import { CreateNoteEditor, PageShell } from "@/src/components";
import { createNoteFormAction } from "../actions";

export default function NewNotePage() {
  return (
    <PageShell
      eyebrow="Notes"
      title="Create Note"
      description="Draft your note and submit when you're ready."
      headerAction={
        <Link
          href="/notes"
          className="inline-flex rounded-md border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm font-semibold text-foreground transition hover:brightness-105"
        >
          Back to notes
        </Link>
      }
    >
      <CreateNoteEditor createAction={createNoteFormAction} />
    </PageShell>
  );
}
