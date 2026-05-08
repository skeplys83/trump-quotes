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

  const [oauthClientId, setOauthClientId] = useState<string | null>(null)
  const [oauthClientSecret, setOauthClientSecret] = useState<string | null>(null)
  const [secretRevealed, setSecretRevealed] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (!user) return
    axios.get("/api/oauth/client-info").then((res) => {
      setOauthClientId(res.data.clientId)
      setOauthClientSecret(res.data.clientSecret)
    })
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
                Connect Claude to your TrumpQuotes account via the claude.ai custom connector.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Go to <strong>claude.ai → Settings → Integrations → Add custom connector</strong> and fill in:
              </p>
              <div className="rounded-md border text-xs divide-y">
                <div className="flex items-center justify-between px-3 py-2 gap-4">
                  <span className="text-muted-foreground shrink-0">URL</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono truncate">{typeof window !== "undefined" ? window.location.origin : ""}/api/mcp</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/api/mcp`); toast.success("Copied!") }}>Copy</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 gap-4">
                  <span className="text-muted-foreground shrink-0">OAuth Client ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono truncate max-w-48">{oauthClientId ?? "—"}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0" onClick={() => { navigator.clipboard.writeText(oauthClientId ?? ""); toast.success("Copied!") }}>Copy</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 gap-4">
                  <span className="text-muted-foreground shrink-0">OAuth Client Secret</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono truncate max-w-48">{secretRevealed ? (oauthClientSecret ?? "—") : "••••••••••••••••"}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0" onClick={() => setSecretRevealed((v) => !v)}>{secretRevealed ? "Hide" : "Reveal"}</Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0" onClick={() => { navigator.clipboard.writeText(oauthClientSecret ?? ""); toast.success("Copied!") }}>Copy</Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Click <strong>Add</strong> → log in if prompted → click <strong>Allow</strong>. Then ask Claude: <em>&quot;What is my subscription status?&quot;</em>
              </p>
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
