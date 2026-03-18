import { getServerSession } from "@/src/lib/auth-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession();
  redirect(session ? "/notes" : "/login");
}
