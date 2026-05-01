"use client"

import { Button } from "@/src/components/shadcn/button"
import { useSessionContext } from "@/src/lib/supabase/SupabaseSessionContext"

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
            <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
            />
        </svg>
    )
}

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
            <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
            />
        </svg>
    )
}

export function SocialLoginButtons() {
    const { supabase } = useSessionContext()

    async function signInWithProvider(provider: "google" | "x") {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback?next=/`,
            },
        })
    }

    return (
        <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 border-t border-border" />
            </div>
            <Button
                variant="outline"
                type="button"
                onClick={() => signInWithProvider("google")}
                className="w-full justify-center gap-3"
            >
                <GoogleIcon />
                Continue with Google
            </Button>
            <Button
                variant="outline"
                type="button"
                onClick={() => signInWithProvider("x")}
                className="w-full justify-center gap-3"
            >
                <XIcon />
                Continue with X
            </Button>
        </div>
    )
}
