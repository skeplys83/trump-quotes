"use client"

import { SessionContextProvider } from "@/src/lib/supabase/SupabaseSessionContext";

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionContextProvider>{children}</SessionContextProvider>;
}
