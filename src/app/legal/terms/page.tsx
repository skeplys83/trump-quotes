import Link from "next/link";
import { Button } from "@/src/components/shadcn/button";

export const metadata = {
  title: "Terms of Service – Trump Quotes",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-1">Allgemeine Geschäftsbedingungen</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">1. Provider</h2>
          <p className="text-muted-foreground">
            Trump Quotes is operated by Martin Hustoles. For full contact details, see our{" "}
            <Link href="/legal/impressum" className="underline hover:text-foreground transition-colors">
              Imprint
            </Link>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">2. Service Description</h2>
          <p className="text-muted-foreground">
            Trump Quotes Pro is a subscription-based service that provides unlimited access to random
            Donald Trump quotes. Access to the service requires an active subscription.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">3. Registration</h2>
          <p className="text-muted-foreground">
            To use the service, you must create an account with a valid email address. You are
            responsible for keeping your login credentials secure and for all activity that occurs
            under your account. You must be at least 18 years old to use this service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">4. Subscription and Payment</h2>
          <p className="text-muted-foreground">
            The subscription fee is <strong className="text-foreground">€0.51 per month</strong>,
            billed monthly. Payment is processed by Stripe. By subscribing, you authorize us to charge
            your payment method on a recurring monthly basis.
          </p>
          <p className="text-muted-foreground">
            We operate under the German Kleinunternehmerregelung (§ 19 UStG) and do not charge VAT.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">5. Cancellation</h2>
          <p className="text-muted-foreground">
            You may cancel your subscription at any time via your account settings. Upon cancellation,
            you retain access to the service until the end of the current billing period. No partial
            refunds are issued for unused time within a billing period.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">6. Right of Withdrawal</h2>
          <p className="text-muted-foreground">
            Consumers in the EU have a 14-day right of withdrawal. Please refer to our{" "}
            <Link href="/legal/withdrawal" className="underline hover:text-foreground transition-colors">
              Right of Withdrawal
            </Link>{" "}
            page for full details, including the conditions under which the right of withdrawal may be
            excluded once service delivery has commenced.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">7. Availability</h2>
          <p className="text-muted-foreground">
            We aim to keep the service available at all times but cannot guarantee uninterrupted
            access. We are not liable for downtime caused by third-party providers (Vercel,
            Supabase, Stripe) or circumstances beyond our reasonable control.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">8. Acceptable Use</h2>
          <p className="text-muted-foreground">
            You may use the service only for lawful purposes. You may not attempt to circumvent
            subscription restrictions, abuse the API, or use the service in any way that could harm
            other users or third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">9. Termination by Us</h2>
          <p className="text-muted-foreground">
            We reserve the right to suspend or terminate accounts that violate these terms. In the
            event of termination for cause, no refund will be issued for the remaining subscription
            period.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">10. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            We are liable without limitation for damages resulting from injury to life, body, or
            health, as well as for intentional or grossly negligent conduct. For slight negligence, our
            liability is limited to foreseeable, contract-typical damages. Liability for data loss is
            limited to the effort required to restore the data from a backup made with reasonable care.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">11. Changes to These Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to amend these terms. You will be notified of material changes via
            the email address associated with your account at least 30 days before the changes take
            effect. Continued use of the service after the effective date constitutes acceptance of the
            updated terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">12. Governing Law and Jurisdiction</h2>
          <p className="text-muted-foreground">
            These terms are governed by German law, excluding the UN Convention on Contracts for the
            International Sale of Goods (CISG). For consumers within the EU, mandatory consumer
            protection provisions of your country of residence also apply. The place of jurisdiction
            for disputes with non-consumers is Germany.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/40">
          Last updated: April 2025
        </p>
      </main>
    </div>
  );
}
