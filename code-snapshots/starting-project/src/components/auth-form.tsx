"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn, signUp } from "@/src/lib/auth-client";
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

const AUTH_ERROR_MESSAGE = "We couldn't complete that request. Please try again.";
const AUTH_FIELD_LABEL_CLASS = "text-sm font-semibold text-foreground";
const AUTH_FIELD_INPUT_CLASS =
  "mt-2 block w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm text-foreground shadow-sm shadow-black/10 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/40";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const copy = AUTH_COPY[mode];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const result = await signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (result.error) {
          setErrorMessage(AUTH_ERROR_MESSAGE);
          return;
        }
      } else {
        const result = await signIn.email({
          email: email.trim(),
          password,
        });

        if (result.error) {
          setErrorMessage(AUTH_ERROR_MESSAGE);
          return;
        }
      }

      router.replace("/notes");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(AUTH_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-(--border) bg-(--surface-muted) p-4"
      >
        <div className="space-y-4">
          {mode === "register" ? (
            <div>
              <label htmlFor={`${mode}-name`} className={AUTH_FIELD_LABEL_CLASS}>
                Name
              </label>
              <input
                id={`${mode}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={AUTH_FIELD_INPUT_CLASS}
              />
            </div>
          ) : null}

          <div>
            <label htmlFor={`${mode}-email`} className={AUTH_FIELD_LABEL_CLASS}>
              Email
            </label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={AUTH_FIELD_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor={`${mode}-password`} className={AUTH_FIELD_LABEL_CLASS}>
              Password
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={AUTH_FIELD_INPUT_CLASS}
            />
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40"
        >
          {isSubmitting ? "Please wait..." : copy.submitLabel}
        </button>
      </form>

      <p className="text-sm text-(--text-muted)">
        {copy.switchPrompt}{" "}
        <Link
          href={copy.switchHref}
          className="font-semibold text-(--accent) transition hover:brightness-125"
        >
          {copy.switchLabel}
        </Link>
      </p>
    </PageShell>
  );
}
