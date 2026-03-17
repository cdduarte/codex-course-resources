import { PageShell, SectionPlaceholder } from "@/src/components";

export default function NotesIndexPage() {
  return (
    <PageShell
      eyebrow="Route: /notes"
      title="Notes List Scaffold"
      description="Static placeholder for the authenticated notes index."
    >
      <SectionPlaceholder
        title="Notes List Area"
        description="Future list rendering for user notes will live in this section."
        note="No data fetching or sorting is wired yet."
      />
      <SectionPlaceholder
        title="Empty State Area"
        description="Reserved placeholder for the future empty-notes UI state."
      />
    </PageShell>
  );
}
