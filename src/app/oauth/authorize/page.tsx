import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { Card, CardContent } from "@/src/components/shadcn/card"
import { Button } from "@/src/components/shadcn/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/shadcn/avatar"
import Image from "next/image"

interface Props {
    searchParams: Promise<{
        client_id?: string
        redirect_uri?: string
        code_challenge?: string
        code_challenge_method?: string
        state?: string
        response_type?: string
    }>
}

export default async function AuthorizePage({ searchParams }: Props) {
    const params = await searchParams
    const { client_id, redirect_uri, code_challenge, state, response_type } = params

    const clientName = (() => { try { return new URL(redirect_uri ?? "").hostname } catch { return "Claude" } })()

    if (!client_id || !redirect_uri || !code_challenge || response_type !== "code") {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-sm text-muted-foreground">Invalid OAuth request.</p>
            </div>
        )
    }

    if (client_id !== process.env.OAUTH_CLIENT_ID) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-sm text-muted-foreground">Unknown OAuth client.</p>
            </div>
        )
    }

    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const next = `/oauth/authorize?${new URLSearchParams(params as Record<string, string>).toString()}`
        redirect(`/login?next=${encodeURIComponent(next)}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <Card className="w-full max-w-sm shadow-lg">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center gap-6">

                    {/* Heading */}
                    <div className="text-center flex flex-col gap-2">
                        <h1 className="text-lg font-semibold">{clientName} wants to connect</h1>
                        <div className="flex items-center justify-center gap-2">
                            <Avatar className="w-5 h-5">
                                <AvatarImage src={user!.user_metadata?.avatar_url ?? user!.user_metadata?.picture} />
                                <AvatarFallback className="text-[10px]">{(user!.email ?? "?").charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm text-muted-foreground">
                                Signed in as <span className="font-medium text-foreground">{user!.email}</span>
                            </p>
                        </div>
                    </div>

                    {/* Icon + dotted connector */}
                    <div className="flex items-center w-full">
                        <div className="flex-1 flex justify-end">
                            <Image src="/favicon.svg" alt="TrumpQuotes" width={24} height={24} />
                        </div>

                        <div className="flex items-center gap-1.5 px-3">
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="w-1 h-1 rounded-full bg-border" />
                        </div>

                        <span className="flex-1 text-left text-sm font-semibold text-foreground pl-0">{clientName}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <form action="/api/oauth/reject" method="POST" className="flex-1">
                            <input type="hidden" name="redirect_uri" value={redirect_uri} />
                            <input type="hidden" name="state" value={state ?? ""} />
                            <Button variant="outline" className="w-full cursor-pointer" type="submit">Deny</Button>
                        </form>
                        <form action="/api/oauth/authorize" method="POST" className="flex-1">
                            <input type="hidden" name="client_id" value={client_id} />
                            <input type="hidden" name="redirect_uri" value={redirect_uri} />
                            <input type="hidden" name="code_challenge" value={code_challenge} />
                            <input type="hidden" name="state" value={state ?? ""} />
                            <Button type="submit" className="w-full cursor-pointer">Allow</Button>
                        </form>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        you can revoke access at any time in your account settings.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
