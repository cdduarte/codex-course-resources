"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/src/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-md px-3 py-1.5 text-[color:var(--text-muted)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
