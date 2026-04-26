import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const cities = res.data.map((c: any) => ({
      id: `${c.lat}-${c.lon}`,
      name: c.name,
      country: c.country,
      state: c.state ?? null,
    }));

    return NextResponse.json(cities);
  } catch {
    return NextResponse.json([]);
  }
}
