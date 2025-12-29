import { log } from "console";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    const { city } = await params

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
    );

    if (!res.ok) {
        return NextResponse.json({}, { status: res.status })
    }

    return NextResponse.json(await res.json())
}
