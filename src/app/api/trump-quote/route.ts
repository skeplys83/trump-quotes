import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import axios from "axios";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
    unstable_noStore();

    const supabase = await createSupabaseServer();
    const supabaseAdmin = createSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = await supabaseAdmin
        .from("weather-subscriptions")
        .select("subscription_status")
        .eq("customer_id", user.id)
        .maybeSingle();

    if (data?.subscription_status !== "active") {
        return NextResponse.json({ error: "Payment Required" }, { status: 402 });
    }

    const res = await axios.get("https://api.whatdoestrumpthink.com/api/v1/quotes/random");
    return NextResponse.json({ quote: res.data.message });
}
