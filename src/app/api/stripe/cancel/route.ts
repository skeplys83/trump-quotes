import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export async function POST() {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
        const supabase = await createSupabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the user's subscription from the database
        const supabaseAdmin = createSupabaseAdmin();
        const { data: subscription, error: fetchError } = await supabaseAdmin
            .from("weather-subscriptions")
            .select("*")
            .eq("customer_id", user.id)
            .maybeSingle();

        if (fetchError || !subscription) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 }
            );
        }

        // Cancel the subscription in Stripe (webhook will handle database deletion)
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}/processing`));
    } catch (error) {
        console.error("Subscription cancellation error:", error);
        return NextResponse.json(
            { error: "Failed to cancel subscription" },
            { status: 500 }
        );
    }
}
