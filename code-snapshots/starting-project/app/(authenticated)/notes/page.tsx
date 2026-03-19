import Link from "next/link";
import { PageShell } from "@/src/components";
import { requireServerSession } from "@/src/lib/auth-session";
import { listUserNotes } from "@/src/lib/notes";

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default async function NotesIndexPage() {
  const session = await requireServerSession();
  const notes = listUserNotes(session.user.id);

  return (
    <PageShell
      eyebrow="Notes"
      title="Your Notes"
      description="Create, browse, and continue editing your notes."
    >
      <div className="flex items-center justify-end">
        <Link
          href="/notes/new"
          className="rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110"
        >
          New note
        </Link>
      </div>

      {notes.length === 0 ? (
        <section className="rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-12 text-center">
          <p className="text-lg font-semibold text-foreground">No notes yet</p>
          <p className="mt-2 text-sm text-(--text-muted)">
            Start writing your first note with the rich text editor.
          </p>
          <Link
            href="/notes/new"
            className="mt-5 inline-flex rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110"
          >
            Create your first note
          </Link>
        </section>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className="block rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-3 transition hover:border-(--accent)/60 hover:bg-(--surface-strong)"
              >
                <p className="text-base font-semibold text-foreground">
                  {note.title || "Untitled note"}
                </p>
                <p className="mt-1 text-xs text-(--text-muted)">
                  Updated {formatTimestamp(note.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
