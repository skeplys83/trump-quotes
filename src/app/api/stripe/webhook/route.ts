import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import Stripe from "stripe";
import stripe from "stripe";

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const supabase = await createSupabaseAdmin();
    const event: Stripe.Event | null = await stripeWebhookEvent(await req.text(), (await headers()).get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);

    if (!event) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("stripe webhook event: " + event.type);

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

                const { error } = await supabase
                    .from("weather-subscriptions")
                    .update({
                        stripe_subscription_id: subscription.id,
                        subscription_status: "active",
                        current_period_end: new Date(subscription.billing_cycle_anchor * 1000).toISOString(),
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

async function stripeWebhookEvent(
    body: string,
    sig: string | null,
    webhookSecret: string | undefined
): Promise<Stripe.Event | null> {
    if (!sig || !webhookSecret) {
        console.error("Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
        return null;
    }

    try {
        return stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("Stripe signature verification failed:", err);
        return null;
    }
}