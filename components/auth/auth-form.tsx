"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/lib/auth/actions";

/**
 * Shared email + password form used by both /sign-in and /sign-up.
 *
 * `useActionState` (React 19) keeps the server's validation result and
 * preserves what the user typed across a failed submit.
 */

const FIELD =
  "w-full rounded-[0.3rem] border border-bone-100/15 bg-baize-950 px-3.5 py-2.5 text-[0.95rem] " +
  "text-bone-50 placeholder:text-bone-400/60 transition-colors " +
  "focus:border-brass-500 focus:outline-none focus:ring-1 focus:ring-brass-500";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[0.82rem] text-bone-300"
    >
      {children}
    </label>
  );
}

export function AuthForm({
  mode,
  action,
}: {
  mode: "sign-in" | "sign-up";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

  const isSignUp = mode === "sign-up";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && (
        <p
          role="alert"
          className="rounded-[0.3rem] border border-oxide-500/40 bg-oxide-500/10 px-3.5 py-2.5 text-[0.88rem] text-oxide-400"
        >
          {state.error}
        </p>
      )}

      {state.notice && (
        <p
          role="status"
          className="rounded-[0.3rem] border border-felt-400/40 bg-felt-400/10 px-3.5 py-2.5 text-[0.88rem] text-felt-400"
        >
          {state.notice}
        </p>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue=""
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className={FIELD}
          placeholder="you@example.com"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="mt-1.5 text-[0.8rem] text-oxide-400">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
          className={FIELD}
          placeholder={isSignUp ? "At least 8 characters" : "••••••••"}
        />
        {state.fieldErrors?.password && (
          <p id="password-error" className="mt-1.5 text-[0.8rem] text-oxide-400">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      {isSignUp && (
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
            className={FIELD}
            placeholder="••••••••"
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1.5 text-[0.8rem] text-oxide-400">
              {state.fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-[0.3rem] bg-brass-500 text-[0.95rem] font-medium text-baize-950 transition-colors hover:bg-brass-400 disabled:opacity-50"
      >
        {pending
          ? isSignUp
            ? "Creating account…"
            : "Signing in…"
          : isSignUp
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-center text-[0.85rem] text-bone-400">
        {isSignUp ? "Already have an account? " : "No account yet? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="text-brass-400 hover:text-brass-300"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}