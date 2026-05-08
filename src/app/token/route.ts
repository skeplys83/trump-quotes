import { createHash, randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin"

function verifyPkce(codeVerifier: string, codeChallenge: string): boolean {
    const hash = createHash("sha256").update(codeVerifier).digest()
    const computed = hash.toString("base64url")
    return computed === codeChallenge
}

export async function POST(request: Request) {
    const contentType = request.headers.get("content-type") ?? ""
    let params: URLSearchParams

    if (contentType.includes("application/x-www-form-urlencoded")) {
        params = new URLSearchParams(await request.text())
    } else {
        const json = await request.json()
        params = new URLSearchParams(json)
    }

    const grant_type = params.get("grant_type")
    const code = params.get("code")
    const client_id = params.get("client_id")
    const client_secret = params.get("client_secret")
    const code_verifier = params.get("code_verifier")
    const redirect_uri = params.get("redirect_uri")

    // Support Basic auth for client credentials
    const authHeader = request.headers.get("Authorization")
    let resolvedClientId = client_id
    let resolvedClientSecret = client_secret
    if (authHeader?.startsWith("Basic ")) {
        const decoded = Buffer.from(authHeader.slice(6), "base64").toString()
        const [id, secret] = decoded.split(":")
        resolvedClientId = id
        resolvedClientSecret = secret
    }

    if (grant_type !== "authorization_code") {
        return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400 })
    }
    if (!code || !code_verifier || !redirect_uri) {
        return NextResponse.json({ error: "invalid_request" }, { status: 400 })
    }
    if (resolvedClientId !== process.env.OAUTH_CLIENT_ID || resolvedClientSecret !== process.env.OAUTH_CLIENT_SECRET) {
        return NextResponse.json({ error: "invalid_client" }, { status: 401 })
    }

    const codeHash = createHash("sha256").update(code).digest("hex")
    const supabaseAdmin = createSupabaseAdmin()

    const { data: authCode, error } = await supabaseAdmin
        .from("oauth_auth_codes")
        .select("*")
        .eq("code_hash", codeHash)
        .eq("used", false)
        .single()

    if (error || !authCode) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 })
    }
    if (new Date(authCode.expires_at) < new Date()) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 })
    }
    if (authCode.redirect_uri !== redirect_uri) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 })
    }
    if (!verifyPkce(code_verifier, authCode.code_challenge)) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 })
    }

    // Mark code as used
    await supabaseAdmin.from("oauth_auth_codes").update({ used: true }).eq("code_hash", codeHash)

    // Issue access token
    const rawToken = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(rawToken).digest("hex")

    const { error: insertError } = await supabaseAdmin.from("oauth_access_tokens").insert({
        token_hash: tokenHash,
        user_id: authCode.user_id,
    })

    if (insertError) {
        return NextResponse.json({ error: "server_error" }, { status: 500 })
    }

    return NextResponse.json({
        access_token: rawToken,
        token_type: "Bearer",
        expires_in: 2592000, // 30 days
    })
}
