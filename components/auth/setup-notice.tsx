import Link from "next/link";

/**
 * Shown on /sign-in and /sign-up when no Supabase project is connected.
 *
 * Replaces a 500 with the three steps needed to finish setup. Without this the
 * whole site looks broken when the only thing missing is two env vars.
 */
export function SetupNotice() {
  return (
    <div className="rounded-[0.3rem] border border-brass-700/40 bg-baize-800/60 p-6">
      <p className="text-[0.95rem] text-bone-50">Almost — connect a database.</p>

      <ol className="mt-4 space-y-3 text-[0.9rem] leading-relaxed text-bone-300">
        <li>
          <span className="tabular text-brass-500">1.</span> Create a free project at{" "}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-brass-400 underline underline-offset-4 hover:text-brass-300"
          >
            supabase.com/dashboard
          </a>
        </li>
        <li>
          <span className="tabular text-brass-500">2.</span> Open the SQL editor and paste
          everything from{" "}
          <code className="rounded bg-baize-950 px-1.5 py-0.5 font-mono text-[0.82rem] text-brass-400">
            supabase/schema.sql
          </code>
          , then Run.
        </li>
        <li>
          <span className="tabular text-brass-500">3.</span> Copy the project URL and anon key
          into <code className="rounded bg-baize-950 px-1.5 py-0.5 font-mono text-[0.82rem] text-brass-400">.env.local</code>.
        </li>
      </ol>

      <p className="mt-5 text-[0.85rem] text-bone-400">
        Then run{" "}
        <code className="rounded bg-baize-950 px-1.5 py-0.5 font-mono text-[0.82rem] text-brass-400">
          npm run setup
        </code>{" "}
        to confirm.
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex text-[0.9rem] text-bone-300 underline underline-offset-4 hover:text-bone-50"
      >
        Back to the tables
      </Link>
    </div>
  );
}