"use server"

import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export async function getSubscription() {
    const supabase = await createSupabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data } = await supabaseAdmin
        .from("weather-subscriptions")
        .select("*")
        .eq("customer_id", user.id)
        .maybeSingle();

    return data;
}
