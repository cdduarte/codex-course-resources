import { PageShell, SectionPlaceholder } from "@/src/components";
import { requireServerSession } from "@/src/lib/auth-session";

type NoteDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  await requireServerSession();
  const { id } = await params;

  return (
    <PageShell
      eyebrow="Route: /notes/[id]"
      title="Note Detail/Edit Scaffold"
      description={`Static scaffold for note id "${id}". Real note lookup and authorization are intentionally omitted.`}
    >
      <SectionPlaceholder
        title="Editable Title + Content Area"
        description="Future note content editing experience will be introduced here."
      />
      <SectionPlaceholder
        title="Share Controls Area"
        description="Reserved for enable/disable share controls and share-link details."
      />
      <SectionPlaceholder
        title="Danger Zone Area"
        description="Placeholder for future delete-note controls."
      />
    </PageShell>
  );
}
