import type { ReactNode } from "react";

export type Suit = "s" | "h" | "d" | "c";
export type Rank =
  | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
  | "J" | "Q" | "K" | "A";

const SUIT_GLYPH: Record<Suit, ReactNode> = {
  s: "\u2660", // spade
  h: "\u2665", // heart
  d: "\u2666", // diamond
  c: "\u2667", // club
};

const SUIT_NAME: Record<Suit, string> = {
  s: "spades",
  h: "hearts",
  d: "diamonds",
  c: "clubs",
};

/** Hearts and diamonds are printed red on a real card; everything else is black. */
const SUIT_COLOR: Record<Suit, string> = {
  s: "text-baize-900",
  h: "text-oxide-500",
  d: "text-oxide-500",
  c: "text-baize-900",
};

function Corner({ rank, suit, position }: { rank: Rank; suit: Suit; position: "tl" | "br" }) {
  const align =
    position === "tl" ? "left-1.5 top-1.5 items-start" : "right-1.5 bottom-1.5 items-end";
  return (
    <span className={`absolute flex flex-col leading-none ${align}`}>
      <span className={`text-[0.95rem] font-semibold ${SUIT_COLOR[suit]}`}>{rank}</span>
      <span className={`text-[0.7rem] leading-none ${SUIT_COLOR[suit]}`}>{SUIT_GLYPH[suit]}</span>
    </span>
  );
}

type CardProps = {
  rank?: Rank;
  suit?: Suit;
  /** Face-down cards show the woven back instead of a rank. */
  faceDown?: boolean;
  /** Pip layout: true renders the large centre suit used by number cards. */
  className?: string;
  /** Rendered under the centre pip — used by the hero's "you" card. */
  children?: ReactNode;
};

export function Card({
  rank = "A",
  suit = "s",
  faceDown = false,
  className = "",
  children,
}: CardProps) {
  if (faceDown) {
    return (
      <div
        aria-hidden="true"
        className={`relative aspect-[5/7] w-full overflow-hidden rounded-[0.375rem] border border-brass-700/60 bg-baize-800 shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${className}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(200,162,80,0.14) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(200,162,80,0.14) 0 2px, transparent 2px 6px)",
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${rank} of ${SUIT_NAME[suit]}`}
      className={`relative aspect-[5/7] w-full overflow-hidden rounded-[0.375rem] bg-bone-50 shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-baize-950/20 ${className}`}
    >
      {/* Inner keyline, like a real card's printed border. */}
      <span
        aria-hidden="true"
        className="absolute inset-[3px] rounded-[0.25rem] border border-baize-900/12"
      />
      <Corner rank={rank} suit={suit} position="tl" />
      <Corner rank={rank} suit={suit} position="br" />
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center text-[2.1rem] leading-none opacity-90 ${SUIT_COLOR[suit]}`}
      >
        {SUIT_GLYPH[suit]}
      </span>
      {children}
    </div>
  );
}