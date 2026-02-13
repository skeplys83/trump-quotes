"use client"

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Input } from './shadcn/input'
import { toast } from 'sonner'
import { Skeleton } from './shadcn/skeleton'
import WeatherWidget from './WeatherWidget'
import { useSession } from 'next-auth/react'

export default function SearchBox({ loginOpen, setLoginOpen }: { loginOpen: boolean, setLoginOpen: (open: boolean) => void }) {
  const [city, setCity] = useState('')
  const session = useSession();

  const { data, error, isLoading } = useSWR(
    city ? `/api/weather/${city}` : null,
    async (url) => {
      const res = await fetch(url)
      if (res.ok) return res.json()
      throw Object.assign(new Error('Request Failed'), { status: res.status })
    }
  )

  useEffect(() => {
    if (!error) return
    const status = (error as Error & { status?: number }).status
    if (status === 429) {
      toast.error("Slow down a little..")
      return
    }
    if (status === 404) {
      toast.error(`City "${city}" not found`)
      return
    }
    toast.error(`Error fetching weather data for ${city}`)
  }, [error, city])

  const handleInput = (e) => {
    if (e.key !== "Enter") return
    if(session.status !== "authenticated") {
      setLoginOpen(true)
      return
    }

    const cityValue = e.target.value.trim()
    if (cityValue) {
      setCity(cityValue)
    }
  }

  return (
    <div className="w-full mx-3 sm:w-md">
      <h1 className="text-center mb-2">Search for City</h1>
      <Input onKeyDown={handleInput} className='w-full' />
      {isLoading && <Skeleton className="mt-6 w-full h-36 rounded-xl" />}
      {data && <WeatherWidget data={data} className="mt-6 w-full h-36 rounded-xl" />}
    </div>
  )
}
