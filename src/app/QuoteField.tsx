"use client"

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/src/components/shadcn/button'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import QuoteWidget from './QuoteWidget'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function QuoteField({ onFirstQuote }: { onFirstQuote?: () => void }) {
  const [quote, setQuote] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchQuote = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('/api/trump-quote')
      if (!quote) onFirstQuote?.()
      setQuote(res.data.quote)
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

  return (
    <div className="w-full mx-3 sm:w-md flex flex-col items-center">
      {!quote && !isLoading && (
        <div className="relative mb-6 rounded-2xl overflow-hidden" style={{ width: 320, height: 320 }}>
          <Image
            src="/trump.jpg"
            alt="Donald Trump"
            fill
            sizes="320px"
            className="object-cover"
            priority
          />
          <div className="inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at center, transparent 72%, black 100%)' }} />
        </div>
      )}
      {quote && <QuoteWidget quote={quote} className="mb-6 w-full rounded-xl" />}
      <Button
        onClick={fetchQuote}
        disabled={isLoading}
        size="lg"
        variant="outline"
        className="w-xsm cursor-pointer border-red-600 "
      >
        {isLoading
          ? <LoaderIcon className="animate-spin w-4 h-4" />
          : "Get Trump Quote"
        }
      </Button>
    </div>
  )
}
