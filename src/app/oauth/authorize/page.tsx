import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { Card, CardContent } from "@/src/components/shadcn/card"
import { Button } from "@/src/components/shadcn/button"
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

                    {/* Icons with dotted connector */}
                    <div className="flex items-center gap-0 w-full justify-center">
                        <div className="w-14 h-14 rounded-2xl border bg-background shadow-sm flex items-center justify-center shrink-0">
                            <Image src="/favicon.svg" alt="TrumpQuotes" width={36} height={36} />
                        </div>

                        <div className="flex items-center gap-1.5 px-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        </div>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className="w-14 h-14 rounded-2xl border bg-[#cc785c] shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src="https://claude.ai/favicon.ico"
                                alt="Claude"
                                width={36}
                                height={36}
                                className="w-9 h-9 object-contain"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center flex flex-col gap-1">
                        <h1 className="text-lg font-semibold">Claude wants to connect</h1>
                        <p className="text-sm text-muted-foreground">
                            Signed in as <span className="font-medium text-foreground">{user!.email}</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <form action="/api/oauth/reject" method="POST" className="flex-1">
                            <input type="hidden" name="redirect_uri" value={redirect_uri} />
                            <input type="hidden" name="state" value={state ?? ""} />
                            <Button variant="outline" className="w-full" type="submit">Deny</Button>
                        </form>
                        <form action="/api/oauth/authorize" method="POST" className="flex-1">
                            <input type="hidden" name="client_id" value={client_id} />
                            <input type="hidden" name="redirect_uri" value={redirect_uri} />
                            <input type="hidden" name="code_challenge" value={code_challenge} />
                            <input type="hidden" name="state" value={state ?? ""} />
                            <Button type="submit" className="w-full">Allow</Button>
                        </form>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        This allows Claude to read your subscription status. You can revoke access at any time in your account settings.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
