import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { SetupNotice } from "@/components/auth/setup-notice";
import { signIn } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  const ready = isSupabaseConfigured();

  return (
    <AuthShell
      title={ready ? "Welcome back" : "One thing first"}
      blurb={
        ready
          ? "Sign in to take your seat at a table."
          : "Sign in needs a database before it can work."
      }
    >
      {ready ? <AuthForm mode="sign-in" action={signIn} /> : <SetupNotice />}
    </AuthShell>
  );
}