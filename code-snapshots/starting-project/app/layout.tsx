import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { LogoutButton } from "@/src/components";
import { getServerSession } from "@/src/lib/auth-session";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinyNotes",
  description: "TinyNotes app shell and routing scaffold",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const isLoggedIn = Boolean(session);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-(image:--shell-gradient) text-foreground">
          <header className="border-b border-(--border) bg-(--surface) backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
              <Link
                href={isLoggedIn ? "/notes" : "/"}
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                TinyNotes
              </Link>
              <nav className="flex items-center gap-2 text-sm font-medium">
                {isLoggedIn ? (
                  <LogoutButton />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-md px-3 py-1.5 text-(--text-muted) transition hover:bg-(--surface-muted) hover:text-foreground"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-md px-3 py-1.5 text-(--text-muted) transition hover:bg-(--surface-muted) hover:text-foreground"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
