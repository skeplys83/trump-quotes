"use server"

import Header from "@/src/app/Header";
import MainSection from "@/src/app/MainSection";
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export default async function Page() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;

  if (user) {
    const supabaseAdmin = createSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("subscriptions")
      .select("subscription_status")
      .eq("customer_id", user.id)
      .maybeSingle();

    isPro = data?.subscription_status === "active";
  }

  return (
    <>
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header />
        <MainSection />
        {isPro && (
          <div
            className="pointer-events-none absolute left-1/2 -bottom-36 h-80 w-[85vw] max-w-none -translate-x-1/2 rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(185, 28, 28, 0.45) 0%, rgba(220, 38, 38, 0.35) 45%, rgba(153, 27, 27, 0.2) 68%, rgba(0, 0, 0, 0) 90%)",
            }}
          />
        )}
      </div>
    </>
  );
}
