import { PageShell, SectionPlaceholder } from "@/src/components";

type NoteDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
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
