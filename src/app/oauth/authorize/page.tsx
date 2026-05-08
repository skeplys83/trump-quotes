import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card"
import { Button } from "@/src/components/shadcn/button"

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

    // Validate required params
    if (!client_id || !redirect_uri || !code_challenge || response_type !== "code") {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Invalid Request</CardTitle>
                        <CardDescription>Missing required OAuth parameters.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    // Validate client_id
    if (client_id !== process.env.OAUTH_CLIENT_ID) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Unknown Client</CardTitle>
                        <CardDescription>The OAuth client ID is not recognized.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    // Check session
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const next = `/oauth/authorize?${new URLSearchParams(params as Record<string, string>).toString()}`
        redirect(`/login?next=${encodeURIComponent(next)}`)
    }

    const denyUrl = `${redirect_uri}?error=access_denied${state ? `&state=${encodeURIComponent(state)}` : ""}`

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Connect Claude</CardTitle>
                    <CardDescription>
                        Claude would like to access your TrumpQuotes subscription status.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Signed in as <strong>{user.email}</strong>
                    </p>
                    <p className="text-sm">
                        This will allow Claude to read your subscription status and billing period. No other data is shared.
                    </p>
                    <div className="flex gap-3">
                        <form action="/api/oauth/authorize" method="POST" className="flex-1">
                            <input type="hidden" name="client_id" value={client_id} />
                            <input type="hidden" name="redirect_uri" value={redirect_uri} />
                            <input type="hidden" name="code_challenge" value={code_challenge} />
                            <input type="hidden" name="state" value={state ?? ""} />
                            <Button type="submit" className="w-full">Allow</Button>
                        </form>
                        <a href={denyUrl} className="flex-1">
                            <Button variant="outline" className="w-full">Deny</Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
