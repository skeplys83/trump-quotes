"use client"

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Input } from './shadcn/input'
import WeatherBox from './Weather'
import { toast, Toaster } from 'sonner'
import { Skeleton } from './shadcn/skeleton'

export default function SearchBox() {
  const [city, setCity] = useState('')

  const key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  const fetcher = async (url) => {
    const res = await fetch(url)

    if (!res.ok) {
      const error = new Error("Request failed")
      error.status = res.status
      error.info = await res.json()
      throw error
    }

    return res.json()
  }

  const { data, error, isLoading } = useSWR(
    city && key ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric` : null,
    fetcher
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
    <div className="lg:max-w-lg">
      <h1 className="text-center mb-2">Search for City</h1>
      <Input onKeyDown={handleInput} className='min-w-96' />
      {isLoading && <Skeleton className="mt-6 w-full h-36 rounded-xl" />}
      {data && <WeatherBox data={data} />}
    </div>
  )
}
