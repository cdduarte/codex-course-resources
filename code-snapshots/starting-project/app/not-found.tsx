import { PageShell, SectionPlaceholder } from "@/src/components";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(image:--shell-gradient) px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <PageShell
          eyebrow="404"
          title="Page Not Found"
          description="The requested route or resource does not exist in this scaffolded project."
        >
          <SectionPlaceholder
            title="Custom 404 Placeholder"
            description="This static page is the custom not-found boundary required by the spec."
          />
        </PageShell>
      </div>
    </div>
  );
}
