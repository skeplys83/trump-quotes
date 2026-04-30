import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import axios from "axios";
import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server";

const API = "https://truthsocial.com/api/v1";
const HANDLE = "realDonaldTrump";

// module-level cache so we don't look up the account ID on every request
let cachedAccountId: string | null = null;

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function headers() {
  const h: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (compatible; TrumpQuotesApp/1.0)",
    "Accept": "application/json",
  };
  if (process.env.TRUTH_SOCIAL_TOKEN) {
    h["Authorization"] = `Bearer ${process.env.TRUTH_SOCIAL_TOKEN}`;
  }
  return h;
}

async function getAccountId(): Promise<string> {
  if (cachedAccountId) return cachedAccountId;
  const res = await axios.get(`${API}/accounts/lookup`, {
    params: { acct: HANDLE },
    headers: headers(),
  });
  cachedAccountId = res.data.id;
  return cachedAccountId!;
}

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

  let accountId: string;
  try {
    accountId = await getAccountId();
  } catch {
    return NextResponse.json(
      { error: "Could not reach Truth Social. Try adding a TRUTH_SOCIAL_TOKEN env var if the API requires auth." },
      { status: 502 }
    );
  }

  let posts: any[];
  try {
    const res = await axios.get(`${API}/accounts/${accountId}/statuses`, {
      params: { limit: 40, exclude_replies: true, exclude_reblogs: true },
      headers: headers(),
    });
    posts = res.data.filter((p: any) => !p.reblog && p.content?.length > 20);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts from Truth Social." },
      { status: 502 }
    );
  }

  if (!posts.length) {
    return NextResponse.json({ error: "No posts found." }, { status: 404 });
  }

  const post = posts[Math.floor(Math.random() * posts.length)];

  return NextResponse.json({
    content: stripHtml(post.content),
    date: post.created_at,
    url: post.url ?? `https://truthsocial.com/@${HANDLE}/${post.id}`,
  });
}
