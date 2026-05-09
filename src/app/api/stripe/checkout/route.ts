import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST() {

  // Get the current user from Supabase
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingStripeCustomer = await stripe.customers.search({
    query: `metadata['supabase_user_id']:'${user.id}'`,
  });

  let customer: Stripe.Customer;

  if (existingStripeCustomer.data.length > 0) {
    customer = existingStripeCustomer.data[0];
  } else {
    customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/processing`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    customer: customer.id,
  });

  // Create subscription entry in database with "incomplete" status
  const supabaseAdmin = createSupabaseAdmin();
  await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        customer_id: user.id,
        stripe_subscription_id: session.subscription as string,
        subscription_status: "incomplete",
        current_period_end: null,
      },
      {
        onConflict: "customer_id",
      }
    );

  return NextResponse.redirect(session.url!, { status: 303 });
}
