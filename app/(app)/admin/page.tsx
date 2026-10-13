import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { GrantChipsForm } from "@/components/admin/grant-chips-form";

export const metadata = { title: "Admin" };

/**
 * The admin dashboard.
 *
 * requireAdmin() is called on every load, so a non-admin never sees this data.
 * The grant action re-checks independently — a hidden link is not protection.
 */
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8" />}>
      <Admin />
    </Suspense>
  );
}

async function Admin() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h1 className="font-display text-[2.2rem] tracking-tight text-bone-50">Admin</h1>
        <p className="mt-4 text-[0.95rem] text-bone-400">
          Connect a Supabase project first — see <Link href="/sign-in" className="text-brass-400">the setup steps</Link>.
        </p>
      </div>
    );
  }

  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: players } = await supabase
    .from("profiles")
    .select("id, email, chips, role")
    .order("chips", { ascending: false })
    .limit(200);

  const { data: grants } = await supabase
    .from("chip_grants")
    .select("id, user_id, amount, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  const rows = players ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.2rem] tracking-tight text-bone-50">Admin</h1>
          <p className="mt-1 text-[0.9rem] text-bone-400">
            Signed in as {admin.email}
          </p>
        </div>
        <p className="tabular text-[0.9rem] text-bone-400">
          {rows.length} player{rows.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[22rem_1fr]">
        <section aria-labelledby="grant-heading" className="rail-top pt-5">
          <h2 id="grant-heading" className="font-display text-[1.25rem] text-bone-50">
            Move chips
          </h2>
          <div className="mt-5">
            <GrantChipsForm players={rows} />
          </div>
        </section>

        <section aria-labelledby="balances-heading" className="rail-top pt-5">
          <h2 id="balances-heading" className="font-display text-[1.25rem] text-bone-50">
            Balances
          </h2>

          <table className="mt-5 w-full text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-brass-700/30 text-[0.72rem] text-bone-400">
                <th className="pb-2 font-normal">Player</th>
                <th className="pb-2 text-right font-normal">Chips</th>
                <th className="pb-2 text-right font-normal">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-bone-100/6">
                  <td className="py-2.5 pr-4 text-bone-100">{p.email ?? p.id}</td>
                  <td className="tabular py-2.5 text-right text-brass-400">
                    {p.chips.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-4 text-right">
                    {p.role === "admin" ? (
                      <span className="text-[0.8rem] text-brass-500">admin</span>
                    ) : (
                      <span className="text-[0.8rem] text-bone-400">player</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-12 font-display text-[1.25rem] text-bone-50">Recent grants</h2>
          {grants && grants.length > 0 ? (
            <ul className="mt-5">
              {grants.map((g) => (
                <li key={g.id} className="rail-top flex flex-wrap items-baseline gap-x-3 py-2.5 text-[0.88rem]">
                  <span
                    className={`tabular font-medium ${
                      g.amount > 0 ? "text-felt-400" : "text-oxide-400"
                    }`}
                  >
                    {g.amount > 0 ? "+" : ""}
                    {g.amount.toLocaleString()}
                  </span>
                  <span className="text-bone-300">{g.reason || "No reason given"}</span>
                  <span className="ml-auto text-[0.8rem] text-bone-400">
                    {new Date(g.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[0.9rem] text-bone-400">
              Nothing granted yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}