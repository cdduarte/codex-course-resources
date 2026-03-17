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
      <form method="post" className="rounded-xl border border-sky-100 bg-sky-50/45 p-4">
        <input type="hidden" name="intent" value={mode} />
        <div className="space-y-4">
          <div>
            <label htmlFor={`${mode}-email`} className="text-sm font-semibold text-slate-900">
              Email
            </label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div>
            <label htmlFor={`${mode}-password`} className="text-sm font-semibold text-slate-900">
              Password
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              className="mt-2 block w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {copy.submitLabel}
        </button>
      </form>

      <p className="text-sm text-slate-700">
        {copy.switchPrompt}{" "}
        <Link href={copy.switchHref} className="font-semibold text-sky-700 hover:text-sky-800">
          {copy.switchLabel}
        </Link>
      </p>
    </PageShell>
  );
}
