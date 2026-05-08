import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export async function POST() {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseAdmin();

    // Delete any existing token for this user (one token per user)
    await supabaseAdmin.from("user_api_tokens").delete().eq("user_id", user.id);

    const rawToken = "tok_" + randomBytes(24).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const { error } = await supabaseAdmin.from("user_api_tokens").insert({
        user_id: user.id,
        token_hash: tokenHash,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ token: rawToken });
}

export async function DELETE() {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { error } = await supabaseAdmin
        .from("user_api_tokens")
        .delete()
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

export async function GET() {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data } = await supabaseAdmin
        .from("user_api_tokens")
        .select("created_at")
        .eq("user_id", user.id)
        .maybeSingle();

    return NextResponse.json({ hasToken: !!data, createdAt: data?.created_at ?? null });
}
