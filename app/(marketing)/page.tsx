import Link from "next/link";
import { RoyalFlush } from "@/components/site/royal-flush";
import { TableRail } from "@/components/site/table-rail";
import { HowAHandWorks } from "@/components/site/how-a-hand-works";
import { buttonStyles } from "@/components/ui/button";
import { SAMPLE_TABLES } from "@/lib/poker/sample-tables";

export default function HomePage() {
  return (
    <main className="flex-1">
        {/* Hero: copy on the left, the deal on the right. Left-aligned, not centred. */}
        <section className="relative overflow-hidden">
          <div
            className="lamp-pool absolute inset-0 opacity-50"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
            <div className="max-w-[36ch]">
              <h1 className="font-display text-[2.5rem] leading-[1.06] tracking-tight text-bone-50 sm:text-[3.2rem]">
                A poker table that opens the second you arrive.
              </h1>

              <p className="mt-6 max-w-[46ch] text-[1.02rem] leading-relaxed text-bone-300">
                No-limit Texas hold&apos;em for 2 to 9 players. Free chips, no deposits, no real
                money &mdash; pick a seat and deal.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/tables" className={buttonStyles({ size: "lg" })}>
                  Find a table
                </Link>
                <Link
                  href="/tables/new"
                  className={buttonStyles({ variant: "outline", size: "lg" })}
                >
                  Host a table
                </Link>
              </div>

              <p className="mt-7 text-[0.82rem] text-bone-400">
                Runs in the browser &middot; No card details, ever
              </p>
            </div>

            <div className="lg:pl-4">
              <RoyalFlush />
            </div>
          </div>
        </section>

        {/* The rail — the lobby, rendered as ledger rows rather than cards. */}
        <div className="py-16 sm:py-20">
          <TableRail tables={SAMPLE_TABLES} />
        </div>

        <HowAHandWorks />
      </main>
  );
}