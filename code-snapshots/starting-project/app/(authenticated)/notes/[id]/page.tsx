import { EditNoteEditor, PageShell } from "@/src/components";
import { requireServerSession } from "@/src/lib/auth-session";
import { getUserNoteById } from "@/src/lib/notes";
import { notFound } from "next/navigation";
import { updateNoteAction } from "../actions";

type NoteDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const session = await requireServerSession();
  const { id } = await params;
  const note = getUserNoteById(id, session.user.id);

  if (!note) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Notes"
      title={note.title || "Untitled note"}
      description="Edit your note content with autosave enabled."
    >
      <EditNoteEditor
        noteId={note.id}
        initialTitle={note.title}
        initialContentJson={note.contentJson}
        initialUpdatedAt={note.updatedAt}
        saveAction={updateNoteAction}
      />
    </PageShell>
  );
}
