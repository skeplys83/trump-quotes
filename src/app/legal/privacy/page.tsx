import Link from "next/link";
import { Button } from "@/src/components/shadcn/button";

export const metadata = {
  title: "Privacy Policy – Next Weather",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full px-4 py-2 h-10 cursor-pointer">
            ← Back
          </Button>
        </Link>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-1">Datenschutzerklärung</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">1. Controller</h2>
          <p className="text-muted-foreground">
            The controller responsible for data processing on this website within the meaning of the
            General Data Protection Regulation (GDPR) is:
          </p>
          <p>
            Martin Hustoles<br />
            Richard Wagner str. 32<br />
            72766 Reutlingen, Germany<br />
            E-Mail: hustoles.martin@gmail.com
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">2. Data We Collect</h2>
          <p className="text-muted-foreground">
            We only collect your <strong className="text-foreground">email address</strong> when you
            create an account. We do not collect names, addresses, phone numbers, or any other personal
            data beyond what is strictly necessary to provide the service.
          </p>
          <p className="text-muted-foreground">
            Payment data (e.g. card details) is processed exclusively by our payment provider Stripe
            and is never stored on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">3. Purpose and Legal Basis</h2>
          <p className="text-muted-foreground">
            Your email address is used solely to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Create and manage your account</li>
            <li>Authenticate you when you sign in</li>
            <li>Associate your subscription with your account</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            The legal basis is the performance of a contract with you (Art. 6(1)(b) GDPR).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">4. Third-Party Services</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Supabase</p>
              <p>
                We use Supabase for user authentication and database storage. Your email address is
                stored in their infrastructure. Supabase is GDPR compliant.{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Supabase Privacy Policy
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Stripe</p>
              <p>
                We use Stripe to process subscription payments. When you subscribe, Stripe collects and
                processes your payment information. We only receive a customer identifier, not your
                card details. Stripe is GDPR compliant.{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Stripe Privacy Policy
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Vercel</p>
              <p>
                This website is hosted on Vercel. Vercel may process technical request data (e.g. IP
                address, browser type) as part of hosting the service. Vercel is GDPR compliant.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Vercel Privacy Policy
                </a>
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">OpenWeatherMap</p>
              <p>
                Weather data is retrieved from OpenWeatherMap. Search queries (city names) are sent to
                their API. No personal data is transmitted to OpenWeatherMap.{" "}
                <a
                  href="https://openweathermap.org/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  OpenWeatherMap Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">5. Data Retention</h2>
          <p className="text-muted-foreground">
            Your email address is retained for as long as your account exists. If you delete your
            account, your data will be deleted within 30 days, unless we are required to retain it
            longer under applicable law (e.g. for tax or invoicing purposes).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">6. Your Rights</h2>
          <p className="text-muted-foreground">
            Under the GDPR, you have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Right of access (Art. 15 GDPR)</li>
            <li>Right to rectification (Art. 16 GDPR)</li>
            <li>Right to erasure (Art. 17 GDPR)</li>
            <li>Right to restriction of processing (Art. 18 GDPR)</li>
            <li>Right to data portability (Art. 20 GDPR)</li>
            <li>Right to object (Art. 21 GDPR)</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            To exercise any of these rights, please contact us at{" "}
            <span className="text-foreground">[YOUR EMAIL ADDRESS]</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">7. Right to Lodge a Complaint</h2>
          <p className="text-muted-foreground">
            You have the right to lodge a complaint with a supervisory authority, in particular in the
            EU member state of your habitual residence, place of work, or place of the alleged
            infringement, if you consider that the processing of your personal data infringes the GDPR.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">8. Cookies</h2>
          <p className="text-muted-foreground">
            We use only technically necessary cookies for session management (authentication). We do
            not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/40">
          Last updated: April 2025
        </p>
      </main>
    </div>
  );
}
