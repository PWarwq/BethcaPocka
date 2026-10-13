import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { SAMPLE_TABLES } from "@/lib/poker/sample-tables";

export const metadata = { title: "Table" };

type Params = PageProps<"/tables/[id]">["params"];

/**
 * The page component itself stays synchronous. Awaiting `params` here would be
 * runtime data outside a boundary, which blocks the route from prerendering.
 * The promise is handed down and awaited inside the <Suspense> boundary below.
 */
export default function TablePage({ params }: PageProps<"/tables/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-16 sm:px-8" />}>
      <Table params={params} />
    </Suspense>
  );
}

async function Table({ params }: { params: Params }) {
  const { id } = await params;

  await requireUser();

  const table = SAMPLE_TABLES.find((t) => t.id === id);
  if (!table) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <h1 className="font-display text-[2rem] tracking-tight text-bone-50">
        {table.name}
      </h1>
      <p className="mt-2 text-[0.9rem] text-bone-400">
        {table.smallBlind}/{table.bigBlind} &middot; {table.maxSeats}-max
      </p>

      <div className="mt-8 rounded-[0.3rem] border border-brass-700/30 bg-baize-800/50 p-6">
        <p className="text-[0.95rem] text-bone-100">The table view is not built yet.</p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-bone-400">
          Playing a hand needs the server-authoritative game engine, the chip
          ledger, and the realtime transport. That is the next milestone.
        </p>
      </div>
    </div>
  );
}