import { z } from "zod";

/**
 * Validated access to environment variables.
 *
 * Failing loudly at the boundary beats a silent `undefined` surfacing three
 * layers deep as "cannot read property of null".
 */

const serverSchema = z.object({
  url: z.url("NEXT_PUBLIC_SUPABASE_URL must be a URL"),
  anonKey: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  // Server-only. Never exposed to the browser, never prefixed with NEXT_PUBLIC_.
  serviceRoleKey: z.string().min(1).optional(),
});

export type SupabaseEnv = z.infer<typeof serverSchema>;

let cached: SupabaseEnv | null = null;

/**
 * Is a Supabase project connected?
 *
 * Lets the marketing pages render and the auth pages show setup instructions
 * instead of throwing a 500. Checked with a plain boolean so callers can
 * degrade gracefully; anything that actually touches the database still goes
 * through getSupabaseEnv(), which throws.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached;

  const parsed = serverSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");

    throw new Error(
      `Missing Supabase environment variables — ${detail}. ` +
        `Copy .env.example to .env.local and fill them in.`,
    );
  }

  cached = parsed.data;
  return cached;
}