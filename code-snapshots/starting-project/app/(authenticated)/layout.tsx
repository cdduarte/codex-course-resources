import type { ReactNode } from "react";
import { RouteLayoutShell } from "@/src/components";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <RouteLayoutShell
      area="Authenticated Area"
      description="Protected notes surface scaffold. Access-control checks are intentionally not implemented in this step."
    >
      {children}
    </RouteLayoutShell>
  );
}
