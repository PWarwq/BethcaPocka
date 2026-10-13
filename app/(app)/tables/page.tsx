import Link from "next/link";
import { Suspense } from "react";
import { TableRail } from "@/components/site/table-rail";
import { buttonStyles } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { SAMPLE_TABLES } from "@/lib/poker/sample-tables";

export const metadata = {
  title: "Tables",
  description: "Open tables you can sit at right now.",
};

/**
 * Signed-in cannot be asserted in the page body without pulling the whole
 * segment behind a request, so the check lives inside the boundary: everything
 * outside it prerenders instantly, and only the lobby content waits.
 */
export default function TablesPage() {
  return (
    <Suspense fallback={<LobbySkeleton />}>
      <Lobby />
    </Suspense>
  );
}

async function Lobby() {
  // Signed out -> redirected to /sign-in. The real chip balance is read here too.
  await requireUser();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
        <div>
          <h1 className="font-display text-[2.2rem] leading-tight tracking-tight text-bone-50">
            Pick a table
          </h1>
          <p className="mt-2 max-w-[46ch] text-[0.95rem] text-bone-300">
            Every table below has an open seat. Join one, or host your own and
            deal the first hand.
          </p>
        </div>

        <Link
          href="/tables/new"
          className={buttonStyles({ variant: "outline" })}
        >
          Host a table
        </Link>
      </div>

      <div className="mt-12">
        <TableRail tables={SAMPLE_TABLES} heading="Open now" />
      </div>
    </div>
  );
}

function LobbySkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8" aria-hidden="true">
      <div className="h-9 w-56 animate-pulse rounded bg-bone-100/6" />
      <div className="mt-3 h-5 w-80 animate-pulse rounded bg-bone-100/4" />
      <div className="mt-12 space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-16 animate-pulse rounded bg-bone-100/4" />
        ))}
      </div>
    </div>
  );
}