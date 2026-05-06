import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const res = await axios.get("https://api.whatdoestrumpthink.com/api/v1/quotes/random");
    return NextResponse.json({ quote: res.data.message });
}
