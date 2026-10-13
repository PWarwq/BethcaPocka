"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Auth Server Actions.
 *
 * Server Actions are public endpoints — anyone can invoke them directly. Every
 * one of these re-derives the session server-side and never trusts anything
 * the client sent beyond the validated form fields.
 */

const NOT_CONFIGURED =
  "This site is not connected to a database yet. Ask the developer to finish setup.";

export type AuthState = {
  error?: string;
  notice?: string;
  fieldErrors?: Record<string, string>;
};

/** Shared password rules. Kept loose enough to be memorable, long enough to matter. */
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Passwords longer than 72 characters are not accepted.");

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  // Not re-validated on length here; an old password may predate the rule and
  // must still be able to sign in.
  password: z.string().min(1, "Enter your password."),
});

const signUpSchema = z
  .object({
    email: z.email("Enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Deliberately vague. Distinguishing "no such account" from "wrong
    // password" hands an attacker a list of registered emails.
    return { error: "That email and password do not match an account." };
  }

  // redirect() signals by throwing — keep it outside any try/catch.
  redirect("/tables");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Could not create that account. Try a different email." };
  }

  // With "Confirm email" enabled in the Supabase dashboard there is no session
  // yet — the player has to verify before they can sit at a table.
  if (data.session === null) {
    return {
      notice: "Check your inbox to confirm your email, then sign in.",
    };
  }

  redirect("/tables");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}