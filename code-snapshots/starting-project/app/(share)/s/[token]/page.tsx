import { PageShell, SectionPlaceholder } from "@/src/components";
import { getPublicSharedNoteByToken } from "@/src/lib/share-notes";
import { notFound } from "next/navigation";

type SharedNotePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharedNotePage({ params }: SharedNotePageProps) {
  const { token } = await params;
  const sharedNote = getPublicSharedNoteByToken(token);

  if (!sharedNote) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Route: /s/[token]"
      title="Shared Note View Scaffold"
      description={`Validated placeholder for shared note "${sharedNote.title || sharedNote.id}". Rich content rendering is intentionally not wired.`}
    >
      <SectionPlaceholder
        title="Shared Content Area"
        description="Future sanitized HTML note rendering will appear in this section."
      />
      <SectionPlaceholder
        title="Missing/Invalid Share Handling"
        description="Invalid, disabled, and revoked tokens now resolve through the app's 404 boundary."
      />
    </PageShell>
  );
}
