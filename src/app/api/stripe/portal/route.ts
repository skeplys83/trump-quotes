import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await stripe.customers.search({
    query: `metadata['supabase_user_id']:'${user.id}'`,
  });

  if (customers.data.length === 0) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`, { status: 303 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans`,
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
