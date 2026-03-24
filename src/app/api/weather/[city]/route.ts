import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import axios from "axios";
import console from "console";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }) {
    unstable_noStore();
    const { city } = await params

    const supabase = await createSupabaseServer();
    const supabaseAdmin = await createSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data } = await supabaseAdmin
        .from("weather-subscriptions")
        .select("subscription_status")
        .eq("customer_id", user.id)
        .maybeSingle();

    if (!data || data.subscription_status !== "active") {
        return NextResponse.json({ error: "Payment Required" }, { status: 402 })
    }

    const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (res.status !== 200) {
        return NextResponse.json({}, { status: res.status })
    }

    const json = await res.data;
    return NextResponse.json(json)
}
