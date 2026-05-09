"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { LoaderIcon } from "lucide-react"
import { Button } from "@/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card"

type Connection = { id: string; created_at: string; client_name: string }

export function AiAccessCard() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("/api/oauth/connections")
      .then((res) => setConnections(res.data))
      .catch(() => setConnections([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleDisconnect(id: string) {
    await axios.delete("/api/oauth/connections", { data: { id } })
    setConnections((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant Access</CardTitle>
        <CardDescription>Connect your TrumpQuotes account to an AI assistant.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          This is an experimental feature and is not yet accessible to the public. If you would like to test it, please contact an administrator.
        </p>
        {loading ? (
          <LoaderIcon className="animate-spin w-4 h-4 text-muted-foreground" />
        ) : connections.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Connected assistants</p>
            <div className="rounded-md border divide-y">
              {connections.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-3 py-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm">{c.client_name}</span>
                    <span className="text-xs text-muted-foreground">
                      Connected {new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <Button variant="destructive" className="cursor-pointer" size="sm" onClick={() => handleDisconnect(c.id)}>
                    Disconnect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No assistants connected.</p>
        )}
      </CardContent>
    </Card>
  )
}
