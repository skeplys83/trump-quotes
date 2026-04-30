"use client"

import { useState } from "react"
import LandingHero from "./LandingHero"
import QuoteField from "./QuoteField"

export default function MainSection() {
  const [hasQuote, setHasQuote] = useState(false)

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="flex items-center gap-16 w-full max-w-4xl">
        {!hasQuote && <LandingHero />}
        <div className="flex-1 flex justify-center">
          <QuoteField onFirstQuote={() => setHasQuote(true)} />
        </div>
      </div>
    </div>
  )
}
