import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin"

async function getAuthenticatedUserId(): Promise<string | null> {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
}

export async function GET() {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabaseAdmin = createSupabaseAdmin()
    const { data, error } = await supabaseAdmin
        .from("oauth_access_tokens")
        .select("id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: "server_error" }, { status: 500 })

    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin
        .from("oauth_access_tokens")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)

    if (error) return NextResponse.json({ error: "server_error" }, { status: 500 })

    return NextResponse.json({ success: true })
}
