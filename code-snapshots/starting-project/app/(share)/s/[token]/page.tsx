import { PageShell, SectionPlaceholder } from "@/src/components";

type SharedNotePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharedNotePage({ params }: SharedNotePageProps) {
  const { token } = await params;

  return (
    <PageShell
      eyebrow="Route: /s/[token]"
      title="Shared Note View Scaffold"
      description={`Static placeholder for share token "${token}". Public token resolution is intentionally not wired.`}
    >
      <SectionPlaceholder
        title="Shared Content Area"
        description="Future sanitized HTML note rendering will appear in this section."
      />
      <SectionPlaceholder
        title="Missing/Invalid Share Handling"
        description="Reserved placeholder for future 404 integration for invalid or revoked tokens."
      />
    </PageShell>
  );
}
