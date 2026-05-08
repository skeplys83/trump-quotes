"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSessionContext } from "@/src/lib/supabase/SupabaseSessionContext"
import { Button } from "@/src/components/shadcn/button"
import { PasswordCard } from "./PasswordCard"
import { PlansCard } from "./PlansCard"
import { AiAccessCard } from "./AiAccessCard"
import { DangerZoneCard } from "./DangerZoneCard"

export default function SettingsPage() {
  const { user, isLoading } = useSessionContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className="px-6 py-6 absolute top-0 left-0">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full px-4 py-2 h-10 cursor-pointer">
            ← Back
          </Button>
        </Link>
      </div>
      <div className="min-h-screen px-4 py-12 pt-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Account Settings</h1>
          <PasswordCard />
          <PlansCard />
          <AiAccessCard />
          <DangerZoneCard />
        </div>
      </div>
    </>
  )
}
