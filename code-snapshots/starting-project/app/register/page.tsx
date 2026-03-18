import { AuthForm } from "@/src/components";
import { getServerSession } from "@/src/lib/auth-session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/notes");
  }

  return <AuthForm mode="register" />;
}
