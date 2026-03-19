import type { ReactNode } from "react";
import { requireServerSession } from "@/src/lib/auth-session";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  await requireServerSession();
  return <>{children}</>;
}
