import { Suspense } from "react";
import { requireUser } from "@/lib/auth/guards";

export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-16 sm:px-8" />}>
      <Leaderboard />
    </Suspense>
  );
}

async function Leaderboard() {
  await requireUser();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <h1 className="font-display text-[2.2rem] tracking-tight text-bone-50">
        Leaderboard
      </h1>
      <div className="mt-6 rounded-[0.3rem] border border-brass-700/30 bg-baize-800/50 p-6">
        <p className="text-[0.9rem] text-bone-400">
          Ranks players once the chip ledger records settled hands.
        </p>
      </div>
    </div>
  );
}