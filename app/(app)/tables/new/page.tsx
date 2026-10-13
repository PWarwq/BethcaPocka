import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guards";

export const metadata = { title: "Host a table" };

export default function NewTablePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-5 py-16 sm:px-8" />}>
      <NewTable />
    </Suspense>
  );
}

async function NewTable() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8">
      <h1 className="font-display text-[2.2rem] leading-tight tracking-tight text-bone-50">
        Host a table
      </h1>

      <div className="mt-6 rounded-[0.3rem] border border-brass-700/30 bg-baize-800/50 p-6">
        <p className="text-[0.95rem] text-bone-100">Table creation is not wired up yet.</p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-bone-400">
          Hosting a table needs the seat and stack ledger in Postgres, which lands
          with the data layer. Until then, the lobby shows sample tables.
        </p>
      </div>
    </div>
  );
}