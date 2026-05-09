import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

//export const runtime = "nodejs";

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}

export async function GET() {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
        const supabase = await createSupabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseAdmin = createSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from("subscriptions")
            .select("*")
            .eq("customer_id", user.id)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json(null);
        }

        if (!data.stripe_subscription_id) {
            return NextResponse.json(data);
        }

        const res = await stripe.subscriptions.retrieve(data.stripe_subscription_id);

        if (res.status === "canceled" || res.status === "incomplete_expired") {
            const { error: deleteError } = await supabaseAdmin
                .from("subscriptions")
                .delete()
                .eq("customer_id", user.id);

            if (deleteError) {
                return NextResponse.json({ error: deleteError.message }, { status: 500 });
            }

            console.log("found canceled subscription, deleting from database for user:", user.id);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
