import type { ReactNode } from "react";
import { RouteLayoutShell } from "@/src/components";

type ShareLayoutProps = {
  children: ReactNode;
};

export default function ShareLayout({ children }: ShareLayoutProps) {
  return (
    <RouteLayoutShell
      area="Public Share Area"
      description="Scaffold for token-based shared note viewing. Token validation and content rendering are not implemented yet."
    >
      {children}
    </RouteLayoutShell>
  );
}
