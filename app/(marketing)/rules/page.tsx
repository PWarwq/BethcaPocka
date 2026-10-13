import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How hold'em works",
  description: "Hand rankings, betting rounds, and the basics of no-limit Texas hold'em.",
};

const RANKINGS = [
  ["Royal flush", "A-K-Q-J-10, all one suit"],
  ["Straight flush", "Five in a row, all one suit"],
  ["Four of a kind", "Four cards of one rank"],
  ["Full house", "Three of a kind plus a pair"],
  ["Flush", "Five cards of one suit"],
  ["Straight", "Five in a row, mixed suits"],
  ["Three of a kind", "Three cards of one rank"],
  ["Two pair", "Two pairs"],
  ["One pair", "Two cards of one rank"],
  ["High card", "Nothing matched"],
];

export default function RulesPage() {
  return (
    <main className="flex-1 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <h1 className="font-display text-[2.4rem] leading-tight tracking-tight text-bone-50">
          How hold&apos;em works
        </h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-bone-300">
          You get two private cards. The table deals five shared ones. Make the
          best five-card hand from any seven. No-limit means you can bet any
          amount, all in, at any point.
        </p>

        <h2 id="odds" className="mt-12 font-display text-[1.5rem] tracking-tight text-bone-50">
          Hand rankings
        </h2>
        <dl className="mt-4">
          {RANKINGS.map(([name, detail]) => (
            <div
              key={name}
              className="rail-top flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"
            >
              <dt className="text-[0.95rem] text-brass-400">{name}</dt>
              <dd className="text-[0.9rem] text-bone-400">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}