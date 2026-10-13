/**
 * Domain types shared by the lobby, the table, and the server actions.
 * Kept dependency-free so both client and server code can import them.
 */

export type GameVariant = "nlh" | "plo";

export const GAME_VARIANT_LABEL: Record<GameVariant, string> = {
  nlh: "No-limit hold'em",
  plo: "Pot-limit Omaha",
};

/** Maximum seats a table can be configured for (full 9-max). */
export const MAX_SEATS = 9;
/** Smallest table we will deal. */
export const MIN_SEATS = 2;

export type TablePhase =
  | "waiting" // not yet full, seats open
  | "running" // hand in progress
  | "paused"; // between hands, action pending

export type TableSummary = {
  id: string;
  name: string;
  variant: GameVariant;
  /** Small and big blind, in chips. */
  smallBlind: number;
  bigBlind: number;
  maxSeats: number;
  seatedCount: number;
  phase: TablePhase;
  /** Average stack across seated players, in chips. */
  averageStack: number;
};

export function seatsRemaining(table: TableSummary): number {
  return Math.max(0, table.maxSeats - table.seatedCount);
}

export function isJoinable(table: TableSummary): boolean {
  return seatsRemaining(table) > 0 && table.phase !== "paused";
}

/** 1234 -> "1.2k". Chip stacks are large; nobody reads seven digits. */
export function formatChips(chips: number): string {
  if (chips >= 1_000_000) return `${(chips / 1_000_000).toFixed(1)}M`;
  if (chips >= 1_000) return `${(chips / 1_000).toFixed(chips % 1000 === 0 ? 0 : 1)}k`;
  return String(chips);
}