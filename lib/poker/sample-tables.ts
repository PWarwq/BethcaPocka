import type { TableSummary } from "@/lib/poker/tables";

/**
 * Placeholder lobby data for the marketing page.
 *
 * Once the lobby reads from Postgres this file is deleted and the page calls
 * `listOpenTables()` from the data-access layer instead.
 */
export const SAMPLE_TABLES: TableSummary[] = [
  {
    id: "smoke-ring",
    name: "Smoke Ring",
    variant: "nlh",
    smallBlind: 500,
    bigBlind: 1000,
    maxSeats: 6,
    seatedCount: 4,
    phase: "waiting",
    averageStack: 48_000,
  },
  {
    id: "the-back-room",
    name: "The Back Room",
    variant: "nlh",
    smallBlind: 2000,
    bigBlind: 4000,
    maxSeats: 9,
    seatedCount: 7,
    phase: "running",
    averageStack: 210_000,
  },
  {
    id: "low-stakes-3",
    name: "Practice Ring",
    variant: "nlh",
    smallBlind: 25,
    bigBlind: 50,
    maxSeats: 6,
    seatedCount: 2,
    phase: "waiting",
    averageStack: 9_500,
  },
  {
    id: "high-roller",
    name: "High Roller",
    variant: "nlh",
    smallBlind: 25_000,
    bigBlind: 50_000,
    maxSeats: 6,
    seatedCount: 6,
    phase: "running",
    averageStack: 1_850_000,
  },
];