import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

/**
 * Authorization guards.
 *
 * `proxy.ts` is deliberately a session refresher with no authorization in it.
 * Every page, Route Handler, and Server Function calls one of these instead,
 * because a path that a URL matcher misses is an unprotected path.
 *
 * Identity comes from `auth.getClaims()`, NOT `auth.getSession()`. The session
 * is read out of a cookie, which is an untrusted storage medium — getClaims()
 * verifies the JWT signature and expiry against Supabase Auth's signing keys.
 * Treating getSession() output as identity is a real session-forgery bug.
 *
 * None of this may run inside a `use cache` function: `cookies()` is a dynamic
 * API and is banned in cached scopes. Read the session here, then pass plain
 * values into cached functions as arguments.
 */

export type Role = "player" | "admin";

export type SessionUser = {
  userId: string;
  email: string | null;
  role: Role | null;
  isAdmin: boolean;
};

/**
 * Reads the current session. Returns null when signed out.
 *
 * The role comes from the `profiles` table, not a JWT claim, and Row Level
 * Security enforces it independently in Postgres — so even a forged or stale
 * claim cannot grant admin. App-level checks are the friendly layer over the
 * database-level truth.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  // Fail closed: with no database connected, nobody is signed in. Not an
  // exception — a 500 here would take the whole marketing site down.
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase.auth.getClaims();

  const claims = data?.claims;

  if (error || !claims?.sub) return null;

  const userId = claims.sub;

  // Fail closed: if the role cannot be read, the user is nobody, not admin.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    // Expected until the schema is applied, and safe: no role means no admin.
    return { userId, email: claims.email ?? null, role: null, isAdmin: false };
  }

  const role = (profile?.role as Role | null) ?? null;

  return {
    userId,
    email: profile?.email ?? claims.email ?? null,
    role,
    isAdmin: role === "admin",
  };
}

/** Signed-in or nothing. Redirects to sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  return user;
}

/**
 * Admin or nothing.
 *
 * Signed-in non-admins are sent home rather than shown a 404 — for an
 * internal tool a redirect leaks less and confuses a moderator less than an
 * error page.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/");
  return user;
}

/**
 * Server Action / Route Handler variants, which throw instead of redirecting
 * so the caller can return a status code.
 *
 * 401 = not signed in. 403 = signed in, not allowed. Never blur the two: a
 * client needs to tell "log in" apart from "you may not do this".
 */
export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message = "You must be signed in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "You do not have permission to do that.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireUserOrThrow(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireAdminOrThrow(): Promise<SessionUser> {
  const user = await requireUserOrThrow();
  if (!user.isAdmin) throw new ForbiddenError("Admins only.");
  return user;
}