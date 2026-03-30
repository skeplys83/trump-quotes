import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import Stripe from "stripe";

export async function POST(req: Request) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const requestBody = await req.text();
    const requestHeaders = await headers();
    const stripeSignature = requestHeaders.get("stripe-signature");

    if (!stripeSecretKey) {
        return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    if (!webhookSecret) {
        return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }

    if (!stripeSignature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    if (!requestBody) {
        return NextResponse.json({ error: "Missing request body" }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey, {});
    const supabase = await createSupabaseAdmin();
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(requestBody, stripeSignature, webhookSecret);
    } catch (err) {
        console.error("Stripe signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Stripe webhook event received", {
        type: event.type,
        id: event.id,
        data: event.data.object,
    });

    try {
        switch (event.type) {
            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;

                const subscription = await stripe.subscriptions.retrieve(invoice.parent.subscription_details.subscription as string) as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
                const userId = customer.metadata?.supabase_user_id;

                if (!subscription.id) {
                    throw new Error("No subscription ID found on invoice");
                }

                if (!userId) {
                    throw new Error("No supabase_user_id found in Stripe customer metadata");
                }

                const nextPeriodEnd = subscription.items.data[0]?.current_period_end;

                if (!nextPeriodEnd) {
                    throw new Error("No current_period_end found on subscription items");
                }

                const { error } = await supabase
                    .from("weather-subscriptions")
                    .update({
                        stripe_subscription_id: subscription.id,
                        subscription_status: "active",
                        current_period_end: new Date(nextPeriodEnd * 1000).toISOString(),
                    })
                    .eq("customer_id", userId);

                if (error) {
                    throw new Error("Failed to update subscription in database: " + error.message);
                }

                console.log("Payment successful for user:", userId);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
                const userId = customer.metadata?.supabase_user_id;

                if (!userId) {
                    throw new Error("No supabase_user_id found in Stripe customer metadata");
                }

                // Delete the subscription from the database on payment failure
                const { error } = await supabase
                    .from("weather-subscriptions")
                    .delete()
                    .eq("customer_id", userId);

                if (error) {
                    throw new Error("Failed to delete subscription from database: " + error.message);
                }

                console.log("Payment failed and subscription deleted for user:", userId);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
                const userId = customer.metadata?.supabase_user_id;

                if (!userId) {
                    throw new Error("No supabase_user_id found in Stripe customer metadata");
                }

                // Delete the subscription from the database
                const { error } = await supabase
                    .from("weather-subscriptions")
                    .delete()
                    .eq("customer_id", userId);

                if (error) {
                    throw new Error("Failed to delete subscription from database: " + error.message);
                }

                console.log("Subscription deleted for user:", userId);
                break;
            }

            default:
                // Ignore everything else
                break;
        }
    } catch (err) {
        console.error("Webhook handler error:", err);
        // Important: return 500 so Stripe retries
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
