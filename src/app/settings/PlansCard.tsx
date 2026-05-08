"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card"

export function PlansCard() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans</CardTitle>
        <CardDescription>Manage your subscription and billing.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => router.push("/plans")}>
          Manage Plans
        </Button>
      </CardContent>
    </Card>
  )
}
