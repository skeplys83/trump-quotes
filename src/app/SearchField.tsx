"use client"

import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { Input } from '@/src/components/shadcn/input'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import { useRouter } from 'next/navigation'

interface CitySuggestion {
  id: string
  name: string
  country: string
  state: string | null
}

export default function SearchBox() {
  const [inputValue, setInputValue] = useState('')
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data, error, isLoading } = useSWR(
    city ? `/api/weather/${city}` : null,
    async (url) => {
      const res = await axios.get(url)
      return res.data
    }
  )

  useEffect(() => {
    if (!error) return
    const status = error.response?.status
    if (status === 401) { router.push('/login'); return }
    if (status === 402) { router.push('/plans'); return }
    if (status === 404) { toast.error(`City "${city}" not found`); return }
    if (status === 429) { toast.error("Slow down a little.."); return }
    toast.error(`Error fetching weather data for ${city}`)
  }, [error, city])

  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    axios.get(`/api/geocode?q=${encodeURIComponent(inputValue)}`).then(res => {
      setSuggestions(res.data)
      setShowDropdown(res.data.length > 0)
      setActiveIndex(0)
    }).catch(() => setSuggestions([]))
  }, [inputValue])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submitCity = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setCity(trimmed)
    setShowDropdown(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    } else if (e.key === 'Enter') {
      if (showDropdown && suggestions.length > 0) {
        const s = suggestions[activeIndex]
        submitCity(`${s.name},${s.country}`)
      } else {
        submitCity(inputValue)
      }
    }
  }

  return (
    <div className="w-full mx-3 sm:w-md" ref={containerRef}>
      <h1 className="text-center mb-2">Search for City</h1>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          className="w-full"
          autoComplete="off"
        />
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                onMouseDown={() => submitCity(`${s.name},${s.country}`)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                  i === activeIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/50'
                }`}
              >
                <span>
                  {s.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {s.state ? `${s.state}, ` : ''}{s.country}
                  </span>
                </span>
                {i === activeIndex && (
                  <span className="text-xs text-muted-foreground">↵</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isLoading && (
        <div className="mt-6 w-full h-36 rounded-xl flex items-center justify-center">
          <LoaderIcon className="animate-spin w-6 h-6" />
        </div>
      )}
      {data && <WeatherWidget data={data} className="mt-6 w-full h-36 rounded-xl" />}
    </div>
  )
}
