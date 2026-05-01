"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/shadcn/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/src/components/shadcn/field"
import { Input } from "@/src/components/shadcn/input"
import { LoaderIcon } from "lucide-react"
import { useSessionContext } from "@/src/lib/supabase/SupabaseSessionContext"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Captcha } from "./Captcha"

type AuthMode = "signin" | "signup"

type EmailLoginFormProps = {
    mode: AuthMode
    onModeChange: (mode: AuthMode) => void
}

export function EmailLoginForm({ mode, onModeChange }: EmailLoginFormProps) {
    const { supabase } = useSessionContext()
    const router = useRouter()
    const captchaRef = useRef<HCaptcha>(null)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [resetMode, setResetMode] = useState(false)

    function handleModeChange(next: AuthMode) {
        onModeChange(next)
        setError(null)
        setMessage(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)
        captchaRef.current?.execute()
    }

    async function handleCaptchaVerify(token: string) {
        if (mode === "signin") {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: { captchaToken: token },
            })
            if (error) {
                setError(error.message)
            } else {
                router.push("/")
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/`,
                    captchaToken: token,
                },
            })
            if (error) {
                setError(error.message)
            } else {
                setMessage("Check your email for a confirmation link.")
            }
        }

        setLoading(false)
        captchaRef.current?.resetCaptcha()
    }

    async function handlePasswordReset(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        // supabase-js v2 may expose resetPasswordForEmail; call via `any` to avoid TS type issues
        const result = await ((supabase.auth as any).resetPasswordForEmail?.(email, { redirectTo: `${window.location.origin}/login` }) ?? { error: null })
        const error = result?.error ?? null

        if (error) {
            setError(error.message ?? String(error))
        } else {
            setMessage("If that email exists, a reset link was sent.")
            setResetMode(false)
        }

        setLoading(false)
    }

    return (
        <FieldGroup>
            <form onSubmit={resetMode ? handlePasswordReset : handleSubmit} className="flex flex-col gap-4">
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>
                {!resetMode && (
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Field>
                )}
                {error && <FieldError>{error}</FieldError>}
                {message && <p className="text-sm text-green-500">{message}</p>}
                <Captcha
                    ref={captchaRef}
                    onVerify={handleCaptchaVerify}
                    onError={() => {
                        setError("Captcha failed. Please try again.")
                        setLoading(false)
                    }}
                    onExpire={() => {
                        setError("Captcha expired. Please try again.")
                        setLoading(false)
                    }}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <LoaderIcon className="animate-spin w-4 h-4" /> : resetMode ? "Send Reset Email" : mode === "signin" ? "Sign In" : "Sign Up"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => handleModeChange(mode === "signin" ? "signup" : "signin")}
                        className="underline hover:text-foreground transition-colors"
                    >
                        {mode === "signin" ? "Sign Up" : "Sign In"}
                    </button>
                    {mode === "signin" && (
                        <>
                            <span className="mx-2">·</span>
                            <button
                                type="button"
                                onClick={() => setResetMode((s) => !s)}
                                className="underline hover:text-foreground transition-colors"
                            >
                                {resetMode ? "Back to sign in" : "Forgot password?"}
                            </button>
                        </>
                    )}
                </p>
            </form>
        </FieldGroup>
    )
}
