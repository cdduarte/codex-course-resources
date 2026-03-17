import { PageShell, SectionPlaceholder } from "@/src/components";

export default function HomePage() {
  return (
    <PageShell
      eyebrow="Route: /"
      title="TinyNotes Entry Page"
      description="This is a static placeholder for the root route. Redirect logic is intentionally omitted in this scaffold."
    >
      <SectionPlaceholder
        title="Entry Routing Placeholder"
        description="This block represents future logic that decides whether to route users to login or notes."
        note="No authentication or redirect behavior is implemented."
      />
      <SectionPlaceholder
        title="Marketing/Intro Placeholder"
        description="This area can later host product messaging for unauthenticated visitors."
        note="Dummy content only."
      />
    </PageShell>
  );
}
