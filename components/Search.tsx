"use client"

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Input } from './shadcn/input'
import { toast } from 'sonner'
import { Skeleton } from './shadcn/skeleton'
import WeatherWidget from './WeatherWidget'

export default function SearchBox() {
  const [city, setCity] = useState('')

  const { data, error, isLoading } = useSWR(
    city ? `/api/weather/${city}` : null,
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Request Failed')
      return res.json()
    }
  )

  useEffect(() => {
    toast.error(`could not get info for ${city}`)
  }, [error])

  const handleInput = (e) => {
    if (e.key !== "Enter") return
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
