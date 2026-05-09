# Trump Quotes

A full-stack SaaS learning project built with Next.js. Users can sign up, subscribe via Stripe, and receive random Donald Trump quotes from an external API. Built to practice integrating Vercel, Supabase, Stripe, and third-party APIs end-to-end.

![App screenshot](public/page.png)

---

## What It Does

- **Authentication** — email/password, Google OAuth, and X (Twitter) OAuth via Supabase Auth
- **Subscription gate** — quotes are only accessible to users with an active Stripe subscription (€0.51/month)
- **Quote fetching** — calls the public [whatdoestrumpthink.com](https://whatdoestrumpthink.com) API on every request, gated server-side
- **Free preview** — unauthenticated users get 3 free quotes tracked in `localStorage` (client-side only, no server enforcement)
- **Account management** — users can update their password, manage/cancel their subscription, and delete their account
- **Stripe billing** — checkout, webhook handling, customer portal, and subscription cancellation
- **AI assistant integration** — OAuth 2.1 + PKCE flow lets Claude AI connect to a user's account; an MCP server exposes tools for subscription management and quote fetching
- **Legal pages** — Privacy Policy, Terms of Service, Imprint, Right of Withdrawal

---

## Tech Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Framework     | Next.js 16 (App Router)         |
| Language      | TypeScript                      |
| Styling       | Tailwind CSS v4                 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Auth          | Supabase Auth (`@supabase/ssr`) |
| Database      | Supabase Postgres               |
| Payments      | Stripe                          |
| Hosting       | Vercel                          |
| Analytics     | Vercel Speed Insights           |
| External API  | whatdoestrumpthink.com          |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── account/delete/     # Delete user account + Stripe customer
│   │   ├── auth/callback/      # OAuth redirect handler (code → session)
│   │   ├── stripe/
│   │   │   ├── checkout/       # Create Stripe checkout session
│   │   │   ├── cancel/         # Cancel active subscription
│   │   │   ├── portal/         # Redirect to Stripe customer portal
│   │   │   └── webhook/        # Handle Stripe events (invoice.paid, etc.)
│   │   ├── oauth/
│   │   │   ├── authorize/      # POST: issue auth code after user clicks Allow
│   │   │   ├── reject/         # POST: redirect back with error=access_denied after Deny
│   │   │   ├── token/          # POST: exchange auth code for access token (server-to-server)
│   │   │   └── connections/    # GET list / DELETE one access token (used by settings page)
│   │   ├── mcp/                # MCP server — validates token, exposes 5 tools over Streamable HTTP
│   │   ├── subscription/       # GET current user subscription status
│   │   └── trump-quote/        # GET random quote (auth + active subscription); /free for guests (3-quote localStorage gate)
│   ├── login/                  # Auth UI (sign in, sign up, forgot password)
│   ├── plans/                  # Pricing page + subscription button
│   ├── settings/               # Account settings (password, plans, delete)
│   ├── billing/cancel/         # Post-cancellation redirect page
│   ├── processing/             # Polls for subscription activation after checkout
│   └── legal/                  # Privacy, Terms, Imprint, Withdrawal pages
├── components/
│   └── shadcn/                 # Button, Card, Dialog, Input, etc.
└── lib/
    └── supabase/
        ├── supabaseBrowser.ts  # Client-side Supabase instance (singleton)
        ├── supabaseServer.ts   # Server-side Supabase instance (cookie-based)
        └── supabaseAdmin.ts    # Admin Supabase instance (service role key)
```

---

## Environment Variables

Copy these names into your `.env.local` and fill in the values:

```env
# App
NEXT_PUBLIC_APP_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_WEATHER_PRICE_ID=

# Google OAuth (configured in Supabase dashboard, not used directly in app code)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth / MCP (Claude AI connector)
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
```

---

## Service Setup

### Vercel

1. Import the repository in the Vercel dashboard
2. Add all environment variables above under **Project → Settings → Environment Variables**
3. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://your-app.vercel.app`)
4. Deploy — Vercel auto-detects Next.js and handles build and routing

### Supabase

**Project setup**

1. Create a new Supabase project
2. Copy the project URL → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the anon/publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Copy the service role key → `SUPABASE_SECRET_KEY`

**Database table**

Create a table called `weather-subscriptions` with these columns:

| Column                   | Type          | Notes                                           |
| ------------------------ | ------------- | ----------------------------------------------- |
| `customer_id`            | `uuid`        | Primary key, linked to Supabase `auth.users.id` |
| `stripe_subscription_id` | `text`        | Nullable — set by webhook after payment         |
| `subscription_status`    | `text`        | `incomplete`, `active`, `past_due`, etc.        |
| `current_period_end`     | `timestamptz` | Nullable — set by webhook                       |

**Auth providers**

Go to **Authentication → Providers** and enable:

- **Email** — enable; turn on "Require current password when updating"
- **Google** — enable; paste your Google OAuth client ID and secret (from Google Cloud Console → Credentials)
- **Twitter/X** — enable; paste your X app API key and secret (from developer.twitter.com)

**Redirect URLs**

Under **Authentication → URL Configuration**, add to the allowed redirect list:

```
https://your-app.vercel.app/api/auth/callback
http://localhost:3000/api/auth/callback
```

---

### Stripe

**Product and price**

1. Create a product (e.g. "Trump Quotes Pro")
2. Add a recurring monthly price
3. Copy the price ID → `STRIPE_WEATHER_PRICE_ID`
4. Copy your secret key → `STRIPE_SECRET_KEY`

**Webhook**

1. Go to **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Select these events:
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

**Local webhook forwarding**

Stripe cannot reach `localhost` directly. Use the Stripe CLI during development:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a temporary signing secret — use that as `STRIPE_WEBHOOK_SECRET` in `.env.local` while developing. Without this, checkout will succeed but the subscription will never activate locally.

**Customer identification**

When a Stripe customer is created during checkout, the app stores the Supabase `user.id` in the customer's `metadata.supabase_user_id` field. The webhook uses this to look up and update the correct row in `weather-subscriptions`.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For the full checkout and subscription flow, run the Stripe CLI forwarder in a separate terminal alongside the dev server.

---

## OAuth / MCP Flow (Claude AI Connector)

```
User adds connector in claude.ai
  → Claude discovers OAuth endpoints via /.well-known/* metadata
  → Browser redirected to /oauth/authorize (consent page)
  → User clicks Allow → POST /api/oauth/authorize
  → Server stores auth code hash (5-min TTL) in oauth_auth_codes
  → Browser redirected to claude.ai/callback?code=RAW_CODE

claude.ai exchanges the code
  → POST /api/oauth/token { code, code_verifier, client_secret }
  → Server verifies PKCE, marks code as used
  → Issues 30-day access token stored as hash in oauth_access_tokens
  → Claude stores the token and is now connected

On every MCP tool call
  → Claude sends Authorization: Bearer TOKEN to POST /api/mcp
  → Server hashes token, looks up user_id, runs the tool
```

The six MCP tools are: `get_quote`, `get_subscription_info`, `get_cancellation_status`, `cancel_subscription`, `undo_cancellation`, `subscribe`.
See `docs/oauth-mcp-explainer.html` for the full technical reference.

---

## Auth Flow

```
Email/password  →  Supabase server action  →  session cookie set  →  redirect home
Google / X      →  Supabase OAuth redirect  →  /api/auth/callback  →  exchange code for session  →  redirect home
```

## Subscription Flow

```
Click Subscribe
  → POST /api/stripe/checkout
  → Stripe Checkout Session created, DB row inserted as "incomplete"
  → User redirected to Stripe-hosted checkout page

User pays
  → Stripe fires invoice.paid webhook
  → POST /api/stripe/webhook updates DB row to "active" with subscription ID

User lands on /processing
  → polls GET /api/subscription every second
  → once stripe_subscription_id is set and status is "active", redirects home
  → red gradient appears on home page for Pro users
```
