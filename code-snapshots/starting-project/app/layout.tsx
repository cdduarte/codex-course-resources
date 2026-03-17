import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TinyNotes",
  description: "TinyNotes app shell and routing scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--surface-strong),_var(--background)_65%)] text-[color:var(--foreground)]">
          <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
              <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]"
              >
                TinyNotes
              </Link>
              <nav className="flex items-center gap-2 text-sm font-medium">
                {/* TODO: Replace with auth-aware nav links once sessions are wired. */}
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-[color:var(--text-muted)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md px-3 py-1.5 text-[color:var(--text-muted)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                >
                  Register
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
