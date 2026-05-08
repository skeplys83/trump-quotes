import Stripe from "stripe";
import { createHash } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
    if (!authHeader?.startsWith("Bearer ")) return null;

    const rawToken = authHeader.slice(7);
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const supabaseAdmin = createSupabaseAdmin();
    const { data } = await supabaseAdmin
        .from("oauth_access_tokens")
        .select("user_id")
        .eq("token_hash", tokenHash)
        .maybeSingle();
    return data?.user_id ?? null;
}

async function getSubscription(userId: string) {
    const supabaseAdmin = createSupabaseAdmin();
    const { data } = await supabaseAdmin
        .from("weather-subscriptions")
        .select("*")
        .eq("customer_id", userId)
        .maybeSingle();
    return data;
}

function text(t: string) {
    return { content: [{ type: "text" as const, text: t }] };
}

function createMcpServer() {
    const server = new McpServer({ name: "trump-quotes", version: "1.0.0" });

    server.registerTool(
        "get_subscription_info",
        {
            description: "Get the current subscription status and billing period end date for the authenticated user.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) return text("Not authenticated.");

            const sub = await getSubscription(userId);
            if (!sub) return text("No subscription found.");

            const periodEnd = sub.current_period_end
                ? new Date(sub.current_period_end).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "unknown";

            return text(`Status: ${sub.subscription_status}\nCurrent period ends: ${periodEnd}`);
        }
    );

    server.registerTool(
        "cancel_subscription",
        {
            description: "Cancel the authenticated user's subscription at the end of the current billing period. The user keeps access until the period ends.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) return text("Not authenticated.");

            const sub = await getSubscription(userId);
            if (!sub) return text("No active subscription found.");
            if (sub.subscription_status === "canceling") return text("Subscription is already set to cancel at the end of the billing period.");
            if (!["active"].includes(sub.subscription_status)) return text(`Cannot cancel a subscription with status: ${sub.subscription_status}.`);

            await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });

            const supabaseAdmin = createSupabaseAdmin();
            await supabaseAdmin
                .from("weather-subscriptions")
                .update({ subscription_status: "canceling" })
                .eq("customer_id", userId);

            const periodEnd = sub.current_period_end
                ? new Date(sub.current_period_end).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "the end of the billing period";

            return text(`Subscription cancelled. You keep access until ${periodEnd}.`);
        }
    );

    server.registerTool(
        "undo_cancellation",
        {
            description: "Reactivate a subscription that was set to cancel at the end of the billing period.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) return text("Not authenticated.");

            const sub = await getSubscription(userId);
            if (!sub) return text("No subscription found.");
            if (sub.subscription_status !== "canceling") return text("Subscription is not pending cancellation.");

            await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: false });

            const supabaseAdmin = createSupabaseAdmin();
            await supabaseAdmin
                .from("weather-subscriptions")
                .update({ subscription_status: "active" })
                .eq("customer_id", userId);

            return text("Cancellation reversed. Your subscription is active again.");
        }
    );

    server.registerTool(
        "subscribe",
        {
            description: "Create a checkout link for the user to start a new subscription. Returns a URL the user must open in their browser to complete payment.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) return text("Not authenticated.");

            const sub = await getSubscription(userId);
            if (sub && ["active", "canceling"].includes(sub.subscription_status)) {
                return text("You already have an active subscription.");
            }

            const supabaseAdmin = createSupabaseAdmin();
            const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
            const email = userData?.user?.email;

            const existingCustomers = await stripe.customers.search({
                query: `metadata['supabase_user_id']:'${userId}'`,
            });

            let customerId: string;
            if (existingCustomers.data.length > 0) {
                customerId = existingCustomers.data[0].id;
            } else {
                const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: userId } });
                customerId = customer.id;
            }

            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                line_items: [{ price: process.env.STRIPE_WEATHER_PRICE_ID!, quantity: 1 }],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/processing`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
                customer: customerId,
            });

            return text(`To subscribe, open this link in your browser:\n${session.url}`);
        }
    );

    server.registerTool(
        "get_quote",
        {
            description: "Get a random Trump quote. Requires an active subscription.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) return text("Not authenticated.");

            const sub = await getSubscription(userId);
            if (!sub || !["active", "canceling"].includes(sub.subscription_status)) {
                return text("An active subscription is required to get quotes. Use the subscribe tool to get started.");
            }

            const res = await fetch("https://api.whatdoestrumpthink.com/api/v1/quotes/random");
            const json = await res.json();
            const quote = json?.message;

            if (!quote) return text("Failed to fetch a quote. Try again.");

            return text(`"${quote}"`);
        }
    );

    return server;
}

async function handleRequest(request: Request): Promise<Response> {
    const userId = await getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
        const origin = new URL(request.url).origin;
        return new Response("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource"`,
            },
        });
    }

    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    });

    await server.connect(transport);
    return transport.handleRequest(request, { authInfo: { userId } as any });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
