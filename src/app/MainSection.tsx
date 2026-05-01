"use client"

import { useEffect, useState } from "react"
import LandingHero from "./LandingHero"
import QuoteField from "./QuoteField"

export default function MainSection() {
  const [hasQuote, setHasQuote] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const handler = () => {
      setHasQuote(false)
      setResetKey((k) => k + 1)
    }
    window.addEventListener("reset-quote", handler)
    return () => window.removeEventListener("reset-quote", handler)
  }, [])

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="flex items-center gap-16 w-full max-w-4xl flex-col sm:flex-row">
        {!hasQuote && <LandingHero />}
        <div className="flex-1 flex justify-center">
          <QuoteField key={resetKey} onFirstQuote={() => setHasQuote(true)} />
        </div>
      </div>
    </div>
  )
}
