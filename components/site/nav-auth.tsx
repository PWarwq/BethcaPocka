import Link from "next/link";
import { getSessionUser } from "@/lib/auth/guards";
import { signOut } from "@/lib/auth/actions";

/**
 * The nav's auth slot. A Server Component that reads the session, so the whole
 * thing streams in behind the <Suspense> boundary in rail-nav.tsx.
 *
 * Gating UI is not a security boundary — every protected resource re-checks the
 * session itself via requireUser() / requireAdmin().
 */
export async function NavAuth() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-[0.3rem] px-3.5 py-2 text-[0.9rem] text-bone-300 transition-colors hover:text-bone-50"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex h-9 items-center rounded-[0.3rem] bg-brass-500 px-4 text-[0.88rem] font-medium text-baize-950 transition-colors hover:bg-brass-400"
        >
          Join a table
        </Link>
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      {/* Chip balance: wired to the ledger once the chip tables exist. */}
      <span className="tabular hidden text-[0.9rem] text-brass-400 sm:inline">
        10,000
      </span>

      {user.isAdmin && (
        <Link
          href="/admin"
          className="rounded-[0.3rem] border border-brass-700/70 px-3 py-1.5 text-[0.82rem] text-brass-300 transition-colors hover:border-brass-500 hover:text-brass-400"
        >
          Admin
        </Link>
      )}

      <span
        className="hidden max-w-[14ch] truncate text-[0.85rem] text-bone-300 md:inline"
        title={user.email ?? undefined}
      >
        {user.email}
      </span>

      <form action={signOut}>
        <button
          type="submit"
          className="rounded-[0.3rem] px-2.5 py-1.5 text-[0.85rem] text-bone-400 transition-colors hover:text-bone-50"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}