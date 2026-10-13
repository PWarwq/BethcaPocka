import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Create a NEW client per request — never share one across requests, or a
 * session cookie from one user can leak into another's response.
 *
 * Uses the current `getAll`/`setAll` cookie API. The deprecated `get`/`set`/
 * `remove` trio misses edge cases and is removed in the next major version.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies — the API is read-only there.
          // proxy.ts already refreshes the session, so this is safe to ignore.
          // Anything that MUST write cookies has to run in a Server Action or
          // Route Handler instead.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses Row Level Security.
 *
 * ONLY for trusted server code that has already verified who is asking —
 * chiefly the admin chip-grant path. Never import this into a Client
 * Component, and never expose it through a Route Handler without an admin check
 * first.
 */
export async function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations. " +
        "It bypasses Row Level Security and must never reach the browser.",
    );
  }

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}