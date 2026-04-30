"use server"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/shadcn/card";
import { Button } from "@/src/components/shadcn/button";
import Link from "next/link";
import Image from "next/image";
import SubscriptionButton from "@/src/app/plans/SubscriptionButton";

export default async function PlansPage() {
  return (
    <>
      <div className="px-6 py-6 absolute top-0 left-0">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full px-4 py-2 h-10 cursor-pointer">
            ← Back
          </Button>
        </Link>
      </div>

      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center gap-8 w-full max-w-4xl">

            {/* Header above both columns */}
            <div className="text-center">
              <div className="inline-block text-xs font-semibold tracking-widest uppercase text-red-500 border border-red-600/40 rounded-full px-3 py-1 mb-4">
                Very Exclusive
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Trump Quotes{" "}
                <span className="bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Pro</span>
              </h1>
              <p className="text-muted-foreground">
                Join the millions* of people getting daily wisdom from the 45th and 47th president of the United States.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 w-full items-start">

              {/* Left: Trump image */}
              <div className="hidden md:block relative self-stretch rounded-2xl overflow-hidden" style={{ minHeight: 420 }}>
                <Image
                  src="/trump2.jpg"
                  alt="Donald Trump"
                  fill
                  sizes="300px"
                  className="object-cover"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at center, transparent 60%, black 100%)" }}
                />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                  <p className="text-white text-sm font-medium italic opacity-80">"You're gonna love this app. Believe me."</p>
                </div>
              </div>

              {/* Right: pricing card */}
              <div className="flex-1">
                <Card className="h-full bg-neutral-900/60 border-neutral-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Everything. Unlimited.</CardTitle>
                    <CardDescription>Billed monthly. Cancel anytime. No lawyers needed.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">€0.51</span>
                      <span className="text-muted-foreground text-sm">/ month</span>
                    </div>

                    <ul className="space-y-3 text-sm">
                      {[
                        "Unlimited Trump quotes, 24/7",
                        "Fresh random photo with every quote",
                        "Zero fake news. We checked.",
                        "Works on phones, even Android",
                        "No wall required to access",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-muted-foreground">
                          <span className="text-red-500 text-base">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <SubscriptionButton />

                    <p className="text-xs text-muted-foreground/50 text-center">
                      * millions is a estimate. A very good estimate. The best estimate.
                    </p>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
