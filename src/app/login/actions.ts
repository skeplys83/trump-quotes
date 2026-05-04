"use server"

import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"

type AuthResult = {
  error: string | null
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  return { error: error?.message ?? null }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  redirectTo: string,
): Promise<AuthResult> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectTo },
  })

  return { error: error?.message ?? null }
}

export async function sendPasswordResetEmail(email: string, redirectTo: string): Promise<AuthResult> {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  return { error: error?.message ?? null }
}
