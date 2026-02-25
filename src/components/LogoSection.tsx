"use server"

import Link from "next/link";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export default async function LogoSection() {
    const supabase = await createSupabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let isPro = false;

    if (user) {
        const supabaseAdmin = createSupabaseAdmin();
        const { data } = await supabaseAdmin
            .from("weather-subscriptions")
            .select("subscription_status")
            .eq("customer_id", user.id)
            .maybeSingle();

        isPro = data?.subscription_status === "active";
    }

    return (
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-2xl font-bold">Next Weather</span>
            {isPro && (
                <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                    Pro
                </span>
            )}
        </Link>
    );
}