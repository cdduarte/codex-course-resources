import { CreateNoteEditor, PageShell } from "@/src/components";
import { createNoteFormAction } from "../actions";

export default function NewNotePage() {
  return (
    <PageShell
      eyebrow="Notes"
      title="Create Note"
      description="Draft your note and submit when you're ready."
    >
      <CreateNoteEditor createAction={createNoteFormAction} />
    </PageShell>
  );
}
