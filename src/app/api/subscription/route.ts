import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createSupabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseAdmin = createSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from("weather-subscriptions")
            .select("*")
            .eq("customer_id", user.id)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
