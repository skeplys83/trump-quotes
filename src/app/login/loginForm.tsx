"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/src/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcn/card"
import { FieldDescription } from "@/src/components/shadcn/field"
import { EmailLoginForm } from "./EmailLoginForm"
import { SocialLoginButtons } from "./SocialLoginButtons"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  function switchMode(next: "signin" | "signup") {
    setMode(next)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <CardHeader className="text-center">
          {mode === "signup" && (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="absolute top-4 left-4 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <CardTitle className="text-xl">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin" ? "Sign in to your account" : "Sign up with your email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailLoginForm mode={mode} onModeChange={switchMode} />
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
