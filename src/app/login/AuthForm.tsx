"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Button } from "@/src/components/shadcn/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/components/shadcn/field"
import { Input } from "@/src/components/shadcn/input"
import { LoaderIcon } from "lucide-react"
import { Captcha } from "./Captcha"
import { signInWithEmail, signUpWithEmail } from "./actions"

const IS_DEV = process.env.NODE_ENV === "development"

type Props = {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: Props) {
  const router = useRouter()
  const captchaRef = useRef<HCaptcha>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (IS_DEV) {
      await handleAuth()
    } else {
      captchaRef.current?.execute()
    }
  }

  async function handleCaptchaVerify(token: string) {
    await handleAuth(token)
    captchaRef.current?.resetCaptcha()
  }

  async function handleAuth(captchaToken?: string) {
    if (mode === "signin") {
      const { error } = await signInWithEmail(email, password, captchaToken)
      if (error) {
        setError(error)
      } else {
        router.push("/")
        router.refresh()
      }
    } else {
      const { error } = await signUpWithEmail(
        email,
        password,
        `${window.location.origin}/api/auth/callback?next=/`,
        captchaToken,
      )
      if (error) {
        setError(error)
      } else {
        setMessage("Check your email for a confirmation link.")
      }
    }

    setLoading(false)
  }

  return (
    <FieldGroup>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {error && <FieldError>{error}</FieldError>}
        {message && <p className="text-sm text-green-500">{message}</p>}

        {!IS_DEV && (
          <Captcha
            ref={captchaRef}
            onVerify={handleCaptchaVerify}
            onError={() => { setError("Captcha failed. Please try again."); setLoading(false) }}
            onExpire={() => { setError("Captcha expired. Please try again."); setLoading(false) }}
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? <LoaderIcon className="animate-spin w-4 h-4" />
            : mode === "signin" ? "Sign In" : "Create account"}
        </Button>
      </form>
    </FieldGroup>
  )
}
