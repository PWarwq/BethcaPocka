import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session on every matched request.
 *
 * This is required, not optional: without it, access tokens expire and users
 * get randomly signed out mid-session. `getClaims()` triggers the refresh and
 * validates the token against the Supabase Auth server.
 *
 * Runs in the Node.js runtime — Next 16's proxy defaults to Node, which the
 * WebSocket-based Supabase client requires. Do not move this to Edge.
 */
export async function updateSession(request: NextRequest) {
  // No project connected yet: pass straight through so the landing page still
  // renders. Session-dependent pages fail closed in guards.ts.
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }

        // @supabase/ssr hands us the headers that must accompany Set-Cookie.
        // Responses carrying auth cookies must never be cached by a CDN, or
        // one user's session token can be served to another.
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // IMPORTANT: call this before generating any response. If the refresh
  // finishes after the response is committed, the new token is lost and the
  // next request has to refresh all over again.
  //
  // `getClaims()` verifies the JWT against Supabase Auth's signing keys. Do not
  // swap this for `getSession()`: the session is read out of a cookie, which
  // is an untrusted storage medium, so its contents must never be treated as
  // identity.
  //
  // The result is deliberately unused here. This function exists to refresh the
  // session, not to authorize — see the note at the bottom.
  await supabase.auth.getClaims();

  /**
   * NOTE: no redirects live here. This function is a session refresher, not an
   * authorization boundary — URL matching is a blunt instrument, and a path
   * that a matcher misses is an unprotected path.
   *
   * Route protection is enforced per-resource via requireUser() / requireAdmin()
   * in lib/auth/guards.ts.
   */
  return response;
}