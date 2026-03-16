"use client"

import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowser(): SupabaseClient {
  if (typeof window === 'undefined') {
    //throw new Error('createSupabaseBrowser() can only be called in the browser')
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    )
  }

  return supabaseInstance
}