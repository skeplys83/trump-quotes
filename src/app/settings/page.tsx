"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSessionContext } from "@/src/lib/supabase/SupabaseSessionContext"
import { Button } from "@/src/components/shadcn/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcn/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/src/components/shadcn/field"
import { Input } from "@/src/components/shadcn/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/shadcn/dialog"
import { toast } from "sonner"

export default function SettingsPage() {
  const { supabase, user, isLoading } = useSessionContext()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [hasToken, setHasToken] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (!user) return
    axios.get("/api/user-token").then((res) => setHasToken(res.data.hasToken))
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  const isOAuthOnly = user.app_metadata?.provider !== "email"

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.")
      return
    }

    setPasswordLoading(true)

    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    })

    if (reAuthError) {
      setPasswordError("Current password is incorrect.")
      setPasswordLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  async function handleGenerateToken() {
    setTokenLoading(true)
    setNewToken(null)
    try {
      const res = await axios.post("/api/user-token")
      setNewToken(res.data.token)
      setHasToken(true)
    } catch {
      toast.error("Failed to generate token.")
    } finally {
      setTokenLoading(false)
    }
  }

  async function handleRevokeToken() {
    setTokenLoading(true)
    setNewToken(null)
    try {
      await axios.delete("/api/user-token")
      setHasToken(false)
    } catch {
      toast.error("Failed to revoke token.")
    } finally {
      setTokenLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      await axios.delete("/api/account/delete")
    } catch (err: any) {
      setDeleteError(err.response?.data?.error || "Failed to delete account.")
      setDeleteLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push("/")
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

          <Card className={isOAuthOnly ? "opacity-50" : ""}>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>
                {isOAuthOnly
                  ? "Password login is not available for Google accounts."
                  : "Set a new password for your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={isOAuthOnly}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isOAuthOnly}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isOAuthOnly}
                    />
                  </Field>
                  {passwordError && <FieldError>{passwordError}</FieldError>}
                  {passwordSuccess && (
                    <p className="text-sm text-green-500">Password updated successfully.</p>
                  )}
                  <Button type="submit" disabled={passwordLoading || isOAuthOnly}>
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Access</CardTitle>
              <CardDescription>
                Connect an AI assistant like Claude to your subscription data. Generate a personal API token and add it to your AI client once.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {newToken ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Your token — save it now, it won&apos;t be shown again:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-md bg-muted px-3 py-2 text-xs break-all font-mono">{newToken}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(newToken)
                        toast.success("Token copied!")
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <details className="text-sm text-muted-foreground">
                    <summary className="cursor-pointer select-none">How to connect to Claude Desktop</summary>
                    <div className="mt-2 flex flex-col gap-2">
                      <p>Open or create this file:</p>
                      <code className="rounded-md bg-muted px-3 py-2 text-xs font-mono block">~/Library/Application Support/Claude/claude_desktop_config.json</code>
                      <p>Add this configuration:</p>
                      <div className="flex items-start gap-2">
                        <pre className="flex-1 rounded-md bg-muted px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre">
                          {`{
  "mcpServers": {
    "trump-quotes": {
      "url": "${process.env.NEXT_PUBLIC_APP_URL}/api/mcp",
      "headers": {
        "Authorization": "Bearer ${newToken}"
      }
    }
  }
}`}</pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 shrink-0"
                          onClick={() => {
                            const config = JSON.stringify({
                              mcpServers: {
                                "trump-quotes": {
                                  url: `${window.location.origin}/api/mcp`,
                                  headers: { Authorization: `Bearer ${newToken}` },
                                },
                              },
                            }, null, 2)
                            navigator.clipboard.writeText(config)
                            toast.success("Config copied!")
                          }}
                        >
                          Copy config
                        </Button>
                      </div>
                      <p>Restart Claude Desktop. Then ask: <em>&quot;What is my subscription status?&quot;</em></p>
                    </div>
                  </details>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button onClick={handleGenerateToken} disabled={tokenLoading} variant="outline">
                  {tokenLoading ? "Generating..." : hasToken ? "Regenerate Token" : "Generate Token"}
                </Button>
                {hasToken && !newToken && (
                  <Button onClick={handleRevokeToken} disabled={tokenLoading} variant="ghost" className="text-destructive hover:text-destructive">
                    {tokenLoading ? "Revoking..." : "Revoke Token"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to permanently delete your account? All your data will be
                      removed and this action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  {deleteError && (
                    <p className="text-sm text-destructive">{deleteError}</p>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
