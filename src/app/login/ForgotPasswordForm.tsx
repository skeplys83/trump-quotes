"use client"

import { useState } from "react"
import { Button } from "@/src/components/shadcn/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/components/shadcn/field"
import { Input } from "@/src/components/shadcn/input"
import { LoaderIcon } from "lucide-react"
import { sendPasswordResetEmail } from "./actions"

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        const { error } = await sendPasswordResetEmail(email, `${window.location.origin}/login`)

        if (error) {
            setError(error)
        } else {
            setMessage("If that email exists, a reset link was sent.")
        }

        setLoading(false)
    }

    return (
        <FieldGroup>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field>
                    <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                    <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>

                {error && <FieldError>{error}</FieldError>}
                {message && <p className="text-sm text-green-500">{message}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <LoaderIcon className="animate-spin w-4 h-4" /> : "Send reset email"}
                </Button>

            </form>
        </FieldGroup>
    )
}