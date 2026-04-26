import Link from "next/link";
import { Button } from "@/src/components/shadcn/button";

export const metadata = {
  title: "Impressum – Next Weather",
};

export default function ImpressumPage() {
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
        <h1 className="text-3xl font-bold">Imprint</h1>
        <p className="text-sm text-muted-foreground">Information pursuant to § 5 TMG (German Telemedia Act)</p>

        <section className="space-y-1">
          <h2 className="font-semibold text-lg">Responsible</h2>
          <p>Martin Hustoles</p>
          <p>Richard Wagner str. 32</p>
          <p>72766 Reutlingen</p>
          <p>Germany</p>
        </section>

        <section className="space-y-1">
          <h2 className="font-semibold text-lg">Contact</h2>
          <p>E-Mail: hustoles.martin@gmail.com</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">VAT</h2>
          <p className="text-muted-foreground">
            Pursuant to § 19 UStG, no VAT is charged (small business exemption).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Dispute Resolution</h2>
          <p className="text-muted-foreground">
            The European Commission provides a platform for online dispute resolution (ODR):{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . We are not willing or obliged to participate in dispute resolution proceedings before a
            consumer arbitration board.
          </p>
        </section>
      </main>
    </div>
  );
}
