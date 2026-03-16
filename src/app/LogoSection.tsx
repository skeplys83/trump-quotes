"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

type SubscriptionResponse = {
    subscription_status?: string;
} | null;

export default function LogoSection() {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchSubscription = async () => {
            try {
                const response = await axios.get<SubscriptionResponse>("/api/subscription");
                if (!isMounted) return;
                setIsPro(response.data?.subscription_status === "active");
            } catch {
                if (!isMounted) return;
                setIsPro(false);
            }
        };

        fetchSubscription();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-2xl font-bold">Next Weather</span>
            {isPro && (
                <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                    Pro
                </span>
            )}
        </Link>
    );
}
