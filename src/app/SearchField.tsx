"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { Input } from '@/src/components/shadcn/input'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [city, setCity] = useState('')
  const router = useRouter()

  const { data, error, isLoading } = useSWR(
    city ? `/api/weather/${city}` : null,
    async (url) => {
      const response = await axios.get("/api/subscription")
      const res = await axios.get(url)
      return res.data
    }
  )

  useEffect(() => {
    if (!error) return
    const status = error.response?.status
    if (status === 401) {
      router.push('/login')
      return
    }
    if (status === 402) {
      router.push('/plans')
      return
    }
    if (status === 404) {
      toast.error(`City "${city}" not found`)
      return
    }
    if (status === 429) {
      toast.error("Slow down a little..")
      return
    }
    toast.error(`Error fetching weather data for ${city}`)
  }, [error, city])

  const handleInput = async (e) => {
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
      {isLoading && (
        <div className="mt-6 w-full h-36 rounded-xl flex items-center justify-center">
          <LoaderIcon className="animate-spin w-6 h-6" />
        </div>
      )}
      {data && <WeatherWidget data={data} className="mt-6 w-full h-36 rounded-xl" />}
    </div>
  )
}
