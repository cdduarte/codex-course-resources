import type { ReactNode } from "react";
import { RouteLayoutShell } from "@/src/components";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <RouteLayoutShell
      area="Public Area"
      description="Public-facing placeholders for sign in, registration, and entry routing."
    >
      {children}
    </RouteLayoutShell>
  );
}
