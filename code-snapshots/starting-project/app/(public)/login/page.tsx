import { PageShell, SectionPlaceholder } from "@/src/components";

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Route: /login"
      title="Login Page Scaffold"
      description="Static scaffold for credentials-based sign-in. Form behavior and auth integration are intentionally excluded."
    >
      <SectionPlaceholder
        title="Credentials Form Area"
        description="Future login fields and submit flow will be placed here."
        note="No concrete form logic in this stage."
      />
      <SectionPlaceholder
        title="Inline Error/Hint Area"
        description="Reserved placeholder for generic login guidance and validation messages."
      />
    </PageShell>
  );
}
