import Link from "next/link";
import {
  GAME_VARIANT_LABEL,
  formatChips,
  isJoinable,
  seatsRemaining,
  type TableSummary,
} from "@/lib/poker/tables";
import { buttonStyles } from "@/components/ui/button";

/** Filled dots = taken seats. Reads as occupancy at a glance, no numerals needed. */
function SeatDots({ seated, total }: { seated: number; total: number }) {
  return (
    <span className="flex items-center gap-[5px]" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-[7px] w-[7px] rounded-full ${
            i < seated ? "bg-brass-500" : "bg-bone-100/14"
          }`}
        />
      ))}
    </span>
  );
}

function TableRow({ table }: { table: TableSummary }) {
  const joinable = isJoinable(table);
  const open = seatsRemaining(table);

  return (
    <li className="rail-top">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-1 py-4 sm:px-2 sm:flex-nowrap">
        {/* Stakes lead: it is what a player scans for first. */}
        <div className="w-24 shrink-0">
          <div className="tabular font-display text-[1.35rem] leading-none text-brass-400">
            {formatChips(table.smallBlind)}
            <span className="text-bone-400">/{formatChips(table.bigBlind)}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] text-bone-100">{table.name}</p>
          <p className="text-[0.8rem] text-bone-400">
            {GAME_VARIANT_LABEL[table.variant]} &middot; {table.maxSeats}-max
          </p>
        </div>

        {/* Width matches the "Seats" header column exactly. */}
        <div className="flex w-[11rem] shrink-0 items-center gap-3">
          <SeatDots seated={table.seatedCount} total={table.maxSeats} />
          <span className="tabular text-[0.82rem] text-bone-400">
            {table.seatedCount}/{table.maxSeats}
          </span>
        </div>

        <div className="tabular w-28 shrink-0 text-[0.82rem] text-bone-400">
          {formatChips(table.averageStack)} avg
        </div>

        {joinable ? (
          <Link
            href={`/tables/${table.id}`}
            className={buttonStyles({ variant: "brass", size: "sm", className: "w-24 shrink-0" })}
          >
            Join
          </Link>
        ) : (
          <span className="flex h-9 w-24 shrink-0 items-center justify-center rounded-[0.3rem] border border-bone-100/12 text-[0.85rem] text-bone-400">
            Full
          </span>
        )}
      </div>

      <span className="sr-only">
        {open} seat{open === 1 ? "" : "s"} open.
      </span>
    </li>
  );
}

export function TableRail({
  tables,
  heading = "Tables you can sit at now",
}: {
  tables: TableSummary[];
  heading?: string;
}) {
  return (
    <section aria-labelledby="tables-heading" className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <h2 id="tables-heading" className="font-display text-[1.6rem] tracking-tight text-bone-50">
          {heading}
        </h2>
        <p className="text-[0.85rem] text-bone-400">
          {tables.length} open
        </p>
      </div>

      {/* Widths here MUST match TableRow below, or the header drifts out of
            alignment with the data it labels. */}
        <div className="mt-6 hidden gap-x-6 border-b border-brass-700/30 pb-2 text-[0.72rem] text-bone-400 sm:flex">
          <span className="w-24 shrink-0">Blinds</span>
          <span className="flex-1">Table</span>
          <span className="w-[11rem] shrink-0">Seats</span>
          <span className="w-28 shrink-0">Stack</span>
          <span className="w-24 shrink-0 text-center">Seat</span>
        </div>

      <ul className="border-b border-brass-700/30">
        {tables.map((table) => (
          <TableRow key={table.id} table={table} />
        ))}
      </ul>
    </section>
  );
}