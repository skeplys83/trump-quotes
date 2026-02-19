import { createSupabaseServer } from "@/src/lib/supabase/server";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    unstable_noStore();
    const { city } = await params
    
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!res.ok) {
        return NextResponse.json({}, { status: res.status })
    }

    const json = await res.json()
    return NextResponse.json(json)
}
