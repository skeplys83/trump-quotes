"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/src/components/shadcn/button'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import QuoteWidget from './QuoteWidget'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSessionContext } from '@/src/lib/supabase/SupabaseSessionContext'

const FREE_LIMIT = 3
const LS_KEY = 'trump_free_remaining'

export default function QuoteField({ onFirstQuote }: { onFirstQuote?: () => void }) {
  const [quote, setQuote] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [freeRemaining, setFreeRemaining] = useState<number | null>(null)
  const router = useRouter()
  const { user, isLoading: authLoading } = useSessionContext()

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    setFreeRemaining(stored !== null ? parseInt(stored, 10) : FREE_LIMIT)
  }, [])

  const fetchQuote = async () => {
    if (!user && freeRemaining === 0) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const endpoint = user ? '/api/trump-quote' : '/api/trump-quote/free'
      const res = await axios.get(endpoint)
      if (!quote) onFirstQuote?.()
      setQuote(res.data.quote)

      if (!user) {
        const next = Math.max(0, (freeRemaining ?? FREE_LIMIT) - 1)
        setFreeRemaining(next)
        localStorage.setItem(LS_KEY, String(next))
      }
    } catch (error: any) {
      const status = error.response?.status
      if (status === 401) { router.push('/login'); return }
      if (status === 402) { router.push('/plans'); return }
      if (status === 429) { toast.error("Slow down a little.."); return }
      toast.error("Failed to fetch quote")
    } finally {
      setIsLoading(false)
    }
  }

  const showFreeCounter = !authLoading && !user

  return (
    <div className="w-full mx-3 pb-10 sm:w-md flex flex-col items-center">
      {!quote ? (
        <div className="relative mb-6 rounded-2xl overflow-hidden flex items-center justify-center" style={{ width: 320, height: 320 }}>
          {isLoading ? (
            <LoaderIcon className="animate-spin w-6 h-6" />
          ) : (
            <>
              <Image
                src="/trump.jpg"
                alt="Donald Trump"
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
              <div className="inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at center, transparent 72%, black 100%)' }} />
            </>
          )}
        </div>
      ) : (
        <div className="relative mb-6 w-full">
          <QuoteWidget quote={quote} className="rounded-xl" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
              <LoaderIcon className="animate-spin w-6 h-6" />
            </div>
          )}
        </div>
      )}

      <Button
        onClick={fetchQuote}
        disabled={isLoading}
        size="lg"
        variant="outline"
        className="w-xsm cursor-pointer border-red-600"
      >
        Get Trump Quote
      </Button>

      {showFreeCounter && freeRemaining !== null && (
        <p className="mt-3 text-xs text-muted-foreground">
          {freeRemaining === 0
            ? 'Sign in for more quotes'
            : `${freeRemaining} free ${freeRemaining === 1 ? 'quote' : 'quotes'} left`}
        </p>
      )}
    </div>
  )
}
