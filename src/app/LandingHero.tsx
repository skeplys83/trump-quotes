"use client"

import Link from "next/link"

export default function LandingHero() {
  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <div>
        <div className="inline-block text-xs font-semibold tracking-widest uppercase text-red-500 border border-red-600/40 rounded-full px-3 py-1 mb-4">
          Now with AI*
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          The World's Most{" "}
          <span className="text-red-500">Stable Genius</span>
          ,{" "}On Demand.
        </h1>
      </div>

      <p className="text-muted-foreground text-base leading-relaxed">
        Get certified, 100% real Donald Trump quotes delivered straight to your screen.
        Finally, a SaaS product that tells the truth, and nothing but the truth!
      </p>

      <ul className="space-y-2 text-sm">
        {[
          "Unlimited wisdom from the 47th president",
          "Zero fake news. Guaranteed.",
          "Maybe the most beautiful quote app ever made",
          "Works on all devices (even the bad ones)",
        ].map((f) => (
          <li key={f} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-red-500 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground/50">
        * AI stands for "Actual Idiocy". Not affiliated with Donald Trump. Quotes sourced from whatdoestrumpthink.com.
      </p>
    </div>
  )
}
