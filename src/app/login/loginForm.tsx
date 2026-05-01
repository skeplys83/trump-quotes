"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card"
import { FieldDescription } from "@/src/components/shadcn/field"
import { AuthForm } from "./AuthForm"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { SocialLoginButtons } from "./SocialLoginButtons"

type Mode = "signin" | "signup" | "forgot-password"

const titles: Record<Mode, string> = {
  "signin": "Welcome back",
  "signup": "Create an account",
  "forgot-password": "Reset password",
}

const descriptions: Record<Mode, string> = {
  "signin": "Sign in to your account",
  "signup": "Sign up with your email",
  "forgot-password": "Enter your email to receive a reset link",
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>("signin")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <CardHeader className="text-center">
          {mode !== "signin" && (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="absolute top-4 left-4 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <CardTitle className="text-xl">{titles[mode]}</CardTitle>
          <CardDescription>{descriptions[mode]}</CardDescription>
        </CardHeader>

        <CardContent>
          {mode === "forgot-password" ? (
            <ForgotPasswordForm />
          ) : (
            <AuthForm mode={mode} />
          )}

          {mode === "signin" && (
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="underline hover:text-foreground transition-colors"
              >
                Don't have an account? Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode("forgot-password")}
                className="underline hover:text-foreground transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {mode === "signin" && <SocialLoginButtons />}
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By signing up, you agree to our{" "}
        <Link href="/legal/terms" className="underline hover:text-foreground transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline hover:text-foreground transition-colors">
          Privacy Policy
        </Link>.
      </FieldDescription>
    </div>
  )
}
