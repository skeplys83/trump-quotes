import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createSupabaseServer } from "@/src/lib/supabase/supabaseServer"
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin"

export async function DELETE() {
  const supabase = await createSupabaseServer()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createSupabaseAdmin()

  const { data: subscription, error: subFetchError } = await admin
    .from("subscriptions")
    .select("*")
    .eq("customer_id", user.id)
    .maybeSingle()

  if (subFetchError) {
    return NextResponse.json({ error: subFetchError.message }, { status: 500 })
  }

  if (subscription) {
    if (subscription.subscription_status === "active") {
      return NextResponse.json(
        { error: "Please cancel your subscription before deleting your account." },
        { status: 402 }
      )
    }

    // incomplete — clean up Stripe customer if one exists
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
    const { data: customers } = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
    })

    if (customers.length > 0) {
      const deleted = await stripe.customers.del(customers[0].id)
      if (!deleted.deleted) {
        return NextResponse.json({ error: "Failed to delete User. Please try again." }, { status: 500 })
      }
    }

    const { error: subDeleteError } = await admin
      .from("subscriptions")
      .delete()
      .eq("customer_id", user.id)

    if (subDeleteError) {
      return NextResponse.json({ error: subDeleteError.message }, { status: 500 })
    }
  }

  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
