"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Supabase client for Client Components.
 *
 * Uses the anon/publishable key only — it is safe to ship because Row Level
 * Security is what actually protects the data. The service-role key must never
 * appear in any `NEXT_PUBLIC_*` variable.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}