import React from 'react'

export default function WeatherBox({ data }) {
    const weather = data?.weather?.[0]
    const tempC = Math.round(data?.main?.temp)
    const windKmh = Math.round((data?.wind?.speed ?? 0) * 3.6)
    const city = data?.name

    const emojiForWeather = (main, desc) => {
        const key = (main || desc || '').toLowerCase()
        if (key.includes('thunder')) return '⛈️'
        if (key.includes('drizzle')) return '🌦️'
        if (key.includes('rain')) return '🌧️'
        if (key.includes('snow')) return '❄️'
        if (key.includes('sleet')) return '🌨️'
        if (key.includes('mist') || key.includes('fog') || key.includes('haze')) return '🌫️'
        if (key.includes('cloud')) return '☁️'
        if (key.includes('clear')) return '☀️'
        if (key.includes('smoke')) return '💨'
        if (key.includes('dust') || key.includes('sand')) return '🌪️'
        return '🌤️'
    }

    const emoji = emojiForWeather(weather?.main, weather?.description)

    return (
        <div className="mt-6 w-full h-36 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden text-neutral-900 dark:text-neutral-100">
            <div className="flex items-stretch">
                {/* Left: Big emoji fills the widget height */}
                <div className="flex items-center justify-center px-6 py-6 bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-950">
                    <span className="text-[5rem] leading-none md:text-[6rem] drop-shadow-sm" aria-label={weather?.description}>
                        {emoji}
                    </span>
                </div>

                {/* Right: Details */}
                <div className="flex-1 p-6 grid grid-cols-1 gap-2">
                    <div className="flex items-baseline justify-between">
                        <div className="text-xl font-semibold truncate mr-3">{city}</div>
                        <div className="text-3xl font-bold tabular-nums">{tempC}°C</div>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-300 capitalize">{weather?.description}</div>
                    <div className="text-neutral-700 dark:text-neutral-300">Wind: {windKmh} km/h</div>
                </div>
            </div>
        </div>
    )
}
