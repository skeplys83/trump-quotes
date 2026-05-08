"use client"

import { useState } from "react"
import { useSessionContext } from "@/src/lib/supabase/SupabaseSessionContext"
import { Button } from "@/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/src/components/shadcn/field"
import { Input } from "@/src/components/shadcn/input"

export function PasswordCard() {
  const { supabase, user } = useSessionContext()
  const isOAuthOnly = user?.app_metadata?.provider !== "email"

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    })

    if (reAuthError) {
      setError("Current password is incorrect.")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
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
        <form onSubmit={handleSubmit}>
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
            {error && <FieldError>{error}</FieldError>}
            {success && <p className="text-sm text-green-500">Password updated successfully.</p>}
            <Button type="submit" disabled={loading || isOAuthOnly}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
