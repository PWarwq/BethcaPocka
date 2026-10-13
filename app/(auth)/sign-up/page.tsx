import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { SetupNotice } from "@/components/auth/setup-notice";
import { signUp } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  const ready = isSupabaseConfigured();

  return (
    <AuthShell
      title={ready ? "Create your account" : "One thing first"}
      blurb={
        ready
          ? "Free chips are waiting at the table."
          : "Creating an account needs a database before it can work."
      }
    >
      {ready ? <AuthForm mode="sign-up" action={signUp} /> : <SetupNotice />}
    </AuthShell>
  );
}