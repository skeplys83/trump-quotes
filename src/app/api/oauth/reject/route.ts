import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.formData()
    const redirect_uri = body.get("redirect_uri") as string
    const state = body.get("state") as string | null

    if (!redirect_uri) {
        return NextResponse.json({ error: "invalid_request" }, { status: 400 })
    }

    const callbackUrl = new URL(redirect_uri)
    callbackUrl.searchParams.set("error", "access_denied")
    if (state) callbackUrl.searchParams.set("state", state)

    return NextResponse.redirect(callbackUrl.toString(), 302)
}
