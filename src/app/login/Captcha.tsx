"use client"

import { forwardRef } from "react"
import HCaptcha from "@hcaptcha/react-hcaptcha"

type CaptchaProps = {
    onVerify: (token: string) => void
    onError: () => void
    onExpire: () => void
}

export const Captcha = forwardRef<HCaptcha, CaptchaProps>(function Captcha(
    { onVerify, onError, onExpire },
    ref,
) {
    return (
        <HCaptcha
            ref={ref}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            size="invisible"
            onVerify={onVerify}
            onError={onError}
            onExpire={onExpire}
        />
    )
})
