import { getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server"

const RATE_LIMIT_WINDOW_MS = 2000;
const lastRequestByUser = new Map<string, number>();

export async function GET(req, { params }) {
    unstable_noStore();
    const { city } = await params
    const session = await getServerSession();

    if(!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userKey = session.user?.email || session.user?.name || "unknown-user";
    const now = Date.now();
    const lastRequestAt = lastRequestByUser.get(userKey) ?? 0;
    if (now - lastRequestAt < RATE_LIMIT_WINDOW_MS) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })
    }
    lastRequestByUser.set(userKey, now);

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!res.ok) {
        return NextResponse.json({}, { status: res.status })
    }

    const json = await res.json()
    return NextResponse.json(json)
}
