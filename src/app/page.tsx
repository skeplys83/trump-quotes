"use server"

import Header from "@/src/app/Header";
import Search from "@/src/app/SearchField";
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
      .from("weather-subscriptions")
      .select("subscription_status")
      .eq("customer_id", user.id)
      .maybeSingle();

    isPro = data?.subscription_status === "active";
  }

  return (
    <>
      <div className="flex-1 flex flex-col relative">
        <Header />
        <div className="flex flex-1 justify-center items-center">
          <Search></Search>
        </div>
        {isPro && (
          <div
            className="pointer-events-none absolute left-1/2 -bottom-36 h-80 w-[85vw] max-w-none -translate-x-1/2 rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(30, 58, 138, 0.45) 0%, rgba(67, 56, 202, 0.35) 45%, rgba(76, 29, 149, 0.2) 68%, rgba(0, 0, 0, 0) 90%)",
            }}
          />
        )}
      </div>
    </>
  );
}
