import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/poker/card";

/**
 * Split layout for the auth pages: brand panel on the left, the form on the
 * right. Auth routes are deliberately public — they must not call
 * `requireUser()`.
 */
export function AuthShell({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden lg:block">
        <div className="lamp-pool absolute inset-0" aria-hidden="true" />
        <div className="felt-weave absolute inset-0 opacity-50" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-[1.2rem] font-semibold text-bone-50"
          >
            <span aria-hidden="true" className="text-brass-500">
              &#9830;
            </span>
            BetchaPokah
          </Link>

          <div>
            {/* Four of a royal flush, one card short. Static — the only
                motion on the page belongs to the landing hero. */}
            <div className="flex items-center">
              {(["A", "K", "Q", "J"] as const).map((rank, i) => (
                <div
                  key={rank}
                  className="w-16 shrink-0"
                  style={{
                    marginLeft: i === 0 ? 0 : "-0.7rem",
                    rotate: `${i * 11 - 16.5}deg`,
                    zIndex: i,
                  }}
                >
                  <Card rank={rank} suit="s" />
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-[26ch] font-display text-[1.7rem] leading-tight text-bone-50">
              Chips are free. Take a seat.
            </p>
          </div>

          <p className="max-w-[34ch] text-[0.85rem] leading-relaxed text-bone-400">
            No deposits, no withdrawals, no real money. Play money only.
          </p>
        </div>
      </section>

      {/* Auth form */}
      <section className="flex items-center justify-center px-5 py-14 sm:px-8">
        <div className="w-full max-w-[26rem]">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 font-display text-[1.2rem] font-semibold text-bone-50 lg:hidden"
          >
            <span aria-hidden="true" className="text-brass-500">
              &#9830;
            </span>
            BetchaPokah
          </Link>

          <h1 className="font-display text-[1.8rem] tracking-tight text-bone-50">
            {title}
          </h1>
          <p className="mt-2 text-[0.9rem] text-bone-400">{blurb}</p>

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}