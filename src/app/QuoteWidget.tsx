"use client"

import { cn } from '@/src/lib/utils'
import { toBlob } from 'html-to-image'
import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const TRUMP_IMAGES = [
  "https://media.gettyimages.com/id/2271917249/de/foto/washington-dc-u-s-president-donald-trump-speaks-in-the-oval-office-after-signing-an-executive.jpg?s=2048x2048&w=gi&k=20&c=kBg3Wl9KBqTxV0i5YLjHPJODjn5CzWmIFaH8Pn4P97Q=",
  "https://media.gettyimages.com/id/2272981339/de/foto/joint-base-andrews-maryland-u-s-president-donald-trump-boards-air-force-one-on-april-24-2026.jpg?s=2048x2048&w=gi&k=20&c=uGzWJFjnp-ofZEsVy95l04hqW0mS2CvPiDd_HfqA7m4=",
  "https://media.gettyimages.com/id/2270719290/de/foto/topshot-us-president-donald-trump-speaks-to-the-press-outside-the-oval-office-at-the-white.jpg?s=2048x2048&w=gi&k=20&c=kG--jOfdxYm0ISInOy7KVAmzaaQEBg6yo8aYAP7rig8=",
  "https://media.gettyimages.com/id/2252098056/de/foto/washington-dc-u-s-president-donald-trump-listens-during-a-ceremony-for-the-presentation-of-the.jpg?s=2048x2048&w=gi&k=20&c=mNw6oxLL-GOQxNH_wsh_YLfEteVIWqfn3PjvVdAFg9k=",
  "https://media.gettyimages.com/id/2270903708/de/foto/joint-base-andrews-maryland-u-s-president-donald-trump-walks-to-air-force-one-on-april-11-2026.jpg?s=2048x2048&w=gi&k=20&c=LdgikPByWaoQ5oPm_Y8LM5HrX7xPQMIHfvk8shP3JTI=",
  "https://media.gettyimages.com/id/2273157306/de/foto/washington-dc-u-s-president-donald-trump-speaks-during-a-press-conference-in-the-brady.jpg?s=2048x2048&w=gi&k=20&c=zc5HgdxY6UdbyJ_E0Jxd0bPSFzaINFz5fGZfLUDY6Ig=",
  "https://media.gettyimages.com/id/2161923146/de/foto/butler-pennsylvania-republican-presidential-candidate-former-president-donald-trump-pumps-his.jpg?s=2048x2048&w=gi&k=20&c=Hy6H4L35U2AhGpiUQE5kWdJsvk4m0LjY392_ETM534U=",
  "https://media.gettyimages.com/id/2190485630/de/foto/phoenix-arizona-u-s-president-elect-donald-trump-looks-on-during-turning-point-usas.jpg?s=2048x2048&w=gi&k=20&c=VyqsjRUXl2UUBprFz_Dp9SLyj9nnHMT9TByxvFHqKHo=",
  "https://media.gettyimages.com/id/2246067096/de/foto/washington-dc-u-s-president-donald-trump-looks-on-during-the-swearing-in-ceremony-of-u-s.jpg?s=2048x2048&w=gi&k=20&c=escsjlnPwE4jZyh8R0uOONfMZnLoSZfwOJXVeIp337k=",
  "https://media.gettyimages.com/id/2268462290/de/foto/washington-dc-u-s-president-donald-trump-speaks-during-a-cabinet-meeting-in-the-cabinet-room.jpg?s=2048x2048&w=gi&k=20&c=RafKfV1fg9EZxJtQ9hrCvIpzxkX9mpGRF_QePIv_hQ4=",
  "https://media.gettyimages.com/id/2210242606/de/foto/washington-dc-u-s-president-donald-trump-smiles-as-he-meets-with-president-nayib-bukele-of-el.jpg?s=2048x2048&w=gi&k=20&c=WQInR9D57hzI1afp0UYr8guhmVKHIleZI9Pc6ejvSrQ=",
  "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/ATK2LIVIWMI6TBZTJDEHENPTSY.jpg&w=1440&impolicy=high_res"
]

export default function QuoteWidget({ quote, className }: { quote: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState('')
  const [copied, setCopied] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setImgSrc(TRUMP_IMAGES[Math.floor(Math.random() * TRUMP_IMAGES.length)])
  }, [quote])

  async function handleCopy() {
    if (!widgetRef.current) return
    const blob = await toBlob(widgetRef.current, {
      filter: (el) => el !== buttonRef.current,
      backgroundColor: '#171717',
    })
    if (!blob) return
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const proxiedSrc = imgSrc ? `/api/image-proxy?url=${encodeURIComponent(imgSrc)}` : ''

  return (
    <div ref={widgetRef} className={cn("relative border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden text-neutral-900 dark:text-neutral-100", className)}>
      <button
        ref={buttonRef}
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <div className="w-full h-56 overflow-hidden shrink-0">
        {proxiedSrc && (
          <img
            src={proxiedSrc}
            alt="Donald Trump"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={() => setImgSrc('')}
          />
        )}
      </div>
      <div className="p-6">
        <p className="text-lg italic leading-relaxed text-center">"{quote}"</p>
        <p className="mt-3 text-sm text-muted-foreground text-right">- Donald J. Trump</p>
      </div>
    </div>
  )
}
