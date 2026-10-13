import type { CSSProperties } from "react";
import { Card, type Rank, type Suit } from "@/components/poker/card";

/**
 * The hero's one motion: a royal flush dealing onto the felt.
 *
 * A 10-J-Q-K-A straight flush is simply the best hand in the game, so it is
 * the only thing worth spending an entrance animation on. Cards are fanned
 * into an arc, each landing a beat after the last, and the whole thing is pure
 * CSS — it plays on first paint and costs no client JavaScript.
 */

/**
 * Arc the fan follows. Rotation is wide enough to read as a fan rather than a
 * row, and the outer cards drop and pull back so every rank stays legible
 * instead of hiding behind its neighbour.
 */
const FAN: { rank: Rank; suit: Suit; rot: number; lift: number; shift: number }[] = [
  { rank: "10", suit: "s", rot: -21, lift: 14, shift: 0 },
  { rank: "J", suit: "c", rot: -11, lift: 5, shift: 0 },
  { rank: "Q", suit: "d", rot: 0, lift: 0, shift: 0 },
  { rank: "K", suit: "h", rot: 11, lift: 5, shift: 0 },
  { rank: "A", suit: "s", rot: 21, lift: 14, shift: 0 },
];

export function RoyalFlush() {
  return (
    <div
      className="relative"
      style={{ animation: "lamp-settle 900ms ease-out both" }}
    >
      {/* Table lamp throwing a pool of light across the felt. */}
      <div
        aria-hidden="true"
        className="lamp-pool absolute inset-0 rounded-[1.25rem] opacity-70"
      />
      <div
        aria-hidden="true"
        className="felt-weave absolute inset-0 rounded-[1.25rem] opacity-60 ring-1 ring-brass-700/25"
      />

      <div className="relative px-4 pb-2 pt-14 sm:px-8 sm:pb-3 sm:pt-16">
        {/* pb-10 on the row below leaves room for the rotated outer corners,
            which would otherwise clip against the panel edge. */}
        <div className="flex items-start justify-center pb-10">
          {FAN.map((card, i) => (
            <div
              key={card.rank}
              className="deal-card w-[4.75rem] shrink-0 sm:w-[5.75rem]"
              style={
                {
                  "--fan-rot": `${card.rot}deg`,
                  "--fan-lift": `${card.lift}px`,
                  "--deal-delay": `${180 + i * 130}ms`,
                  // Overlap enough to read as one hand of cards, but not so
                  // much that the rank and corner pip are hidden.
                  marginLeft: i === 0 ? 0 : "-0.7rem",
                  zIndex: i,
                } as CSSProperties
              }
            >
              <Card rank={card.rank} suit={card.suit} />
            </div>
          ))}
        </div>

        {/* Quiet, and inside the panel where it belongs. */}
        <p className="text-center text-[0.78rem] text-bone-400">
          Royal flush — the best hand in the game, dealt in under a second.
        </p>
      </div>
    </div>
  );
}