import Link from "next/link";
import { Button } from "@/src/components/shadcn/button";

export const metadata = {
  title: "Right of Withdrawal – Trump Quotes",
};

export default function WithdrawalPage() {
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
          <h1 className="text-3xl font-bold">Right of Withdrawal</h1>
          <p className="text-sm text-muted-foreground mt-1">Widerrufsrecht</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Right of Withdrawal</h2>
          <p className="text-muted-foreground">
            You have the right to withdraw from this contract within <strong className="text-foreground">14 days</strong> without
            giving any reason.
          </p>
          <p className="text-muted-foreground">
            The withdrawal period is 14 days from the date of conclusion of the contract.
          </p>
          <p className="text-muted-foreground">
            To exercise the right of withdrawal, you must inform us of your decision to withdraw from
            this contract by means of a clear statement (e.g. a letter sent by post or an email) to:
          </p>
          <div className="bg-muted/30 rounded-lg p-4 space-y-1 text-sm">
            <p>Martin Hustoles</p>
            <p>Richard Wagner str. 32</p>
            <p>72766 Reutlingen, Germany</p>
            <p>E-Mail: hustoles.martin@gmail.com</p>
          </div>
          <p className="text-muted-foreground">
            You may use the model withdrawal form below, but it is not mandatory. To meet the
            withdrawal deadline, it is sufficient to send your communication before the withdrawal
            period has expired.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Consequences of Withdrawal</h2>
          <p className="text-muted-foreground">
            If you withdraw from this contract, we will reimburse all payments received from you,
            without undue delay and no later than 14 days from the day on which we receive your notice
            of withdrawal. We will use the same payment method for the reimbursement as you used for
            the original transaction, unless expressly agreed otherwise.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Premature Expiry of the Right of Withdrawal</h2>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Important notice:</strong> Your right of withdrawal
              expires before the 14-day period ends if we have fully performed the service and you
              have expressly consented to us beginning performance before the end of the withdrawal
              period and acknowledged that you will lose your right of withdrawal once the contract
              has been fully performed by us (§ 356(5) BGB).
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              By completing your subscription purchase and checking the corresponding consent box, you
              agree to the immediate commencement of the service and acknowledge the resulting
              loss of the right of withdrawal.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Model Withdrawal Form</h2>
          <p className="text-sm text-muted-foreground">
            (Complete and return this form only if you wish to withdraw from the contract.)
          </p>
          <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-3 font-mono">
            <p>To:</p>
            <p>
              [YOUR FULL NAME]<br />
              [YOUR STREET ADDRESS]<br />
              [YOUR POSTAL CODE] [YOUR CITY], Germany<br />
              [YOUR EMAIL ADDRESS]
            </p>
            <p>
              I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the
              provision of the following service:
            </p>
            <p>
              Trump Quotes Pro subscription
            </p>
            <p>Ordered on (*): _______________</p>
            <p>Name of consumer(s): _______________</p>
            <p>Address of consumer(s): _______________</p>
            <p>Signature of consumer(s) (only if this form is notified on paper): _______________</p>
            <p>Date: _______________</p>
            <p className="text-xs text-muted-foreground">(*) Delete as appropriate.</p>
          </div>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/40">
          Last updated: April 2025
        </p>
      </main>
    </div>
  );
}
