import { createHash } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createSupabaseAdmin } from "@/src/lib/supabase/supabaseAdmin";

export const runtime = "nodejs";

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

function createMcpServer() {
    const server = new McpServer({
        name: "trump-quotes",
        version: "1.0.0",
    });

    server.registerTool(
        "get_subscription_info",
        {
            description: "Get the current subscription status and billing period end date for the authenticated user.",
            inputSchema: {},
        },
        async (_args, extra) => {
            const userId = (extra as any).authInfo?.userId;
            if (!userId) {
                return { content: [{ type: "text" as const, text: "Not authenticated." }] };
            }

            const supabaseAdmin = createSupabaseAdmin();
            const { data } = await supabaseAdmin
                .from("weather-subscriptions")
                .select("subscription_status, current_period_end")
                .eq("customer_id", userId)
                .maybeSingle();

            if (!data) {
                return { content: [{ type: "text" as const, text: "No active subscription found." }] };
            }

            const periodEnd = data.current_period_end
                ? new Date(data.current_period_end).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "unknown";

            return {
                content: [{
                    type: "text" as const,
                    text: `Status: ${data.subscription_status}\nCurrent period ends: ${periodEnd}`,
                }],
            };
        }
    );

    return server;
}

async function handleRequest(request: Request): Promise<Response> {
    const userId = await getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
        return new Response("Unauthorized — provide a valid Bearer token", { status: 401 });
    }

    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless — one server per request
        enableJsonResponse: true,
    });

    // Inject userId into authInfo so tool handlers can access it
    await server.connect(transport);
    return transport.handleRequest(request, { authInfo: { userId } as any });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
