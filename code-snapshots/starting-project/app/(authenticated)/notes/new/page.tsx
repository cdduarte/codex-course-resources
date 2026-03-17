import { PageShell, SectionPlaceholder } from "@/src/components";

export default function NewNotePage() {
  return (
    <PageShell
      eyebrow="Route: /notes/new"
      title="New Note Scaffold"
      description="Static page scaffold for creating a new note."
    >
      <SectionPlaceholder
        title="Title Input Area"
        description="Future note title input will be placed here."
      />
      <SectionPlaceholder
        title="Editor Area"
        description="Future rich text editor UI will be attached in this section."
        note="No editor integration in this scaffold."
      />
      <SectionPlaceholder
        title="Save Status Area"
        description="Reserved for future save-state and error messaging."
      />
    </PageShell>
  );
}
