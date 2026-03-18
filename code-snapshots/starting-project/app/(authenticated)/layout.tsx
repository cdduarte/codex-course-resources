import type { ReactNode } from "react";
import { RouteLayoutShell } from "@/src/components";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <RouteLayoutShell
      area="Authenticated Area"
      description="Protected notes surface scaffold. Access checks are enforced per route page."
    >
      {children}
    </RouteLayoutShell>
  );
}
