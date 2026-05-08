import { createHash, randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin"

export async function POST(request: Request) {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.formData()
    const client_id = body.get("client_id") as string
    const redirect_uri = body.get("redirect_uri") as string
    const code_challenge = body.get("code_challenge") as string
    const state = body.get("state") as string | null

    if (client_id !== process.env.OAUTH_CLIENT_ID) {
        return NextResponse.json({ error: "invalid_client" }, { status: 400 })
    }

    if (!redirect_uri || !code_challenge) {
        return NextResponse.json({ error: "invalid_request" }, { status: 400 })
    }

    const rawCode = randomBytes(32).toString("hex")
    const codeHash = createHash("sha256").update(rawCode).digest("hex")
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin.from("oauth_auth_codes").insert({
        code_hash: codeHash,
        user_id: user.id,
        redirect_uri,
        code_challenge,
        expires_at: expiresAt,
    })

    if (error) {
        return NextResponse.json({ error: "server_error" }, { status: 500 })
    }

    const callbackUrl = new URL(redirect_uri)
    callbackUrl.searchParams.set("code", rawCode)
    if (state) callbackUrl.searchParams.set("state", state)

    return NextResponse.redirect(callbackUrl.toString(), 302)
}
