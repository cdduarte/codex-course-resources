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
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-sky-100 text-slate-900">
          <header className="border-b border-sky-200/70 bg-white/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
                TinyNotes
              </Link>
              <nav className="flex items-center gap-2 text-sm font-medium">
                {/* TODO: Replace with auth-aware nav links once sessions are wired. */}
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-slate-700 transition hover:bg-sky-100 hover:text-sky-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md px-3 py-1.5 text-slate-700 transition hover:bg-sky-100 hover:text-sky-800"
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
