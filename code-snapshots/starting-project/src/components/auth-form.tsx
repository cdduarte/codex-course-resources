import Link from "next/link";
import { PageShell } from "./page-shell";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

const AUTH_COPY: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    switchPrompt: string;
    switchLabel: string;
    switchHref: "/login" | "/register";
  }
> = {
  login: {
    eyebrow: "Route: /login",
    title: "Welcome Back",
    description: "Sign in with your email and password to continue.",
    submitLabel: "Sign In",
    switchPrompt: "Need an account?",
    switchLabel: "Create one",
    switchHref: "/register",
  },
  register: {
    eyebrow: "Route: /register",
    title: "Create Your Account",
    description: "Register with your email and password to start using TinyNotes.",
    submitLabel: "Create Account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const copy = AUTH_COPY[mode];

  return (
    <PageShell eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <form
        method="post"
        className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4"
      >
        <input type="hidden" name="intent" value={mode} />
        <div className="space-y-4">
          <div>
            <label
              htmlFor={`${mode}-email`}
              className="text-sm font-semibold text-[color:var(--foreground)]"
            >
              Email
            </label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-2 text-sm text-[color:var(--foreground)] shadow-sm shadow-black/10 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/40"
            />
          </div>

          <div>
            <label
              htmlFor={`${mode}-password`}
              className="text-sm font-semibold text-[color:var(--foreground)]"
            >
              Password
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              className="mt-2 block w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-2 text-sm text-[color:var(--foreground)] shadow-sm shadow-black/10 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/40"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
        >
          {copy.submitLabel}
        </button>
      </form>

      <p className="text-sm text-[color:var(--text-muted)]">
        {copy.switchPrompt}{" "}
        <Link
          href={copy.switchHref}
          className="font-semibold text-[color:var(--accent)] transition hover:brightness-125"
        >
          {copy.switchLabel}
        </Link>
      </p>
    </PageShell>
  );
}
