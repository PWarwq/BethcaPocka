"use client";

import { useActionState, useState } from "react";
import { grantChips, type GrantState } from "@/app/(app)/admin/actions";

/**
 * Grant / remove chips for one player.
 *
 * The balance shown is the value read from the server. After a successful
 * grant the page revalidates and the server sends a fresh balance, so this
 * component never invents a number — it only renders what it was told.
 */

type Player = { id: string; email: string | null; chips: number; role: string };

export function GrantChipsForm({ players }: { players: Player[] }) {
  const [state, formAction, pending] = useActionState<GrantState, FormData>(grantChips, {});
  const [selected, setSelected] = useState<string>(players[0]?.id ?? "");
  const [amount, setAmount] = useState("");

  const player = players.find((p) => p.id === selected);
  const preview = Number(amount);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-[0.3rem] border border-oxide-500/40 bg-oxide-500/10 px-3.5 py-2.5 text-[0.88rem] text-oxide-400">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="rounded-[0.3rem] border border-felt-400/40 bg-felt-400/10 px-3.5 py-2.5 text-[0.88rem] text-felt-400">
          {state.ok}
        </p>
      )}

      <div>
        <label htmlFor="player" className="mb-1.5 block text-[0.82rem] text-bone-300">
          Player
        </label>
        <select
          id="player"
          name="userId"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-[0.3rem] border border-bone-100/15 bg-baize-950 px-3.5 py-2.5 text-[0.95rem] text-bone-50 focus:border-brass-500 focus:outline-none"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.email ?? p.id} — {p.chips.toLocaleString()}
            </option>
          ))}
        </select>
        {state.fieldErrors?.userId && (
          <p className="mt-1.5 text-[0.8rem] text-oxide-400">{state.fieldErrors.userId}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="mb-1.5 block text-[0.82rem] text-bone-300">
          Amount — negative to remove
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step={1}
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10000"
          className="tabular w-full rounded-[0.3rem] border border-bone-100/15 bg-baize-950 px-3.5 py-2.5 text-[0.95rem] text-bone-50 placeholder:text-bone-400/60 focus:border-brass-500 focus:outline-none"
        />
        {state.fieldErrors?.amount && (
          <p className="mt-1.5 text-[0.8rem] text-oxide-400">{state.fieldErrors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="reason" className="mb-1.5 block text-[0.82rem] text-bone-300">
          Reason (recorded in the audit log)
        </label>
        <input
          id="reason"
          name="reason"
          maxLength={200}
          placeholder="Promo giveaway"
          className="w-full rounded-[0.3rem] border border-bone-100/15 bg-baize-950 px-3.5 py-2.5 text-[0.95rem] text-bone-50 placeholder:text-bone-400/60 focus:border-brass-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending || !selected || !Number.isFinite(preview) || preview === 0}
        className="inline-flex h-11 w-full items-center justify-center rounded-[0.3rem] bg-brass-500 text-[0.95rem] font-medium text-baize-950 transition-colors hover:bg-brass-400 disabled:opacity-40"
      >
        {pending
          ? "Applying…"
          : preview < 0
            ? `Remove ${Math.abs(preview).toLocaleString()} chips`
            : preview > 0
              ? `Grant ${preview.toLocaleString()} chips`
              : "Grant chips"}
      </button>

      {player && Number.isFinite(preview) && preview !== 0 && (
        <p className="tabular text-center text-[0.85rem] text-bone-400">
          {player.email} would go from {player.chips.toLocaleString()} to{" "}
          <span className={preview < 0 ? "text-oxide-400" : "text-felt-400"}>
            {(player.chips + preview).toLocaleString()}
          </span>
        </p>
      )}
    </form>
  );
}