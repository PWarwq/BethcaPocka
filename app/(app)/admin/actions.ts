"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminOrThrow } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin chip grants.
 *
 * Server Actions are public endpoints, so `requireAdminOrThrow()` runs first —
 * before any validation, and before touching the database. A non-admin gets a
 * 403 no matter what they submit.
 *
 * The grant itself goes through the `grant_chips()` Postgres function, which
 * re-checks the admin role and writes the balance and the audit row in one
 * transaction. There is no code path here that can change a balance without
 * also recording who changed it.
 */

export type GrantState = {
  ok?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const grantSchema = z.object({
  userId: z.uuid("Pick a player."),
  // Negative removes chips. Bounded so a fat-finger cannot zero the economy.
  amount: z.coerce
    .number()
    .int("Chips must be a whole number.")
    .min(-100_000_000, "That is too large a removal.")
    .max(100_000_000, "That is too large a grant.")
    .refine((n) => n !== 0, "Enter an amount other than zero."),
  reason: z.string().trim().max(200, "Keep the reason under 200 characters."),
});

export async function grantChips(
  _prev: GrantState,
  formData: FormData,
): Promise<GrantState> {
  // Throws for a non-admin (403) — the result is only used for its side effect.
  await requireAdminOrThrow();

  const parsed = grantSchema.safeParse({
    userId: formData.get("userId"),
    amount: formData.get("amount"),
    reason: formData.get("reason") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("grant_chips", {
    target_user: parsed.data.userId,
    amount: parsed.data.amount,
    note: parsed.data.reason,
  });

  if (error) {
    // Surface the real reason: "not authorized" here would mean a real bug in
    // the guard or in the RLS policies, and should not be hidden.
    return { error: error.message };
  }

  revalidatePath("/admin");

  const verb = parsed.data.amount > 0 ? "Granted" : "Removed";
  return {
    ok: `${verb} ${Math.abs(parsed.data.amount).toLocaleString()} chips. New balance: ${Number(data).toLocaleString()}.`,
  };
}