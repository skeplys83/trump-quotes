"use client"

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import axios from "axios";


export default function LogoSection() {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await axios.get("/api/subscription");
                setIsPro(response.data?.subscription_status === "active");
            } catch {
                setIsPro(false);
            }
        };

        fetchSubscription();
    }, []);

    return (
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="text-2xl font-bold">Trump Quotes</span>
            {isPro && (
                <span className="text-2xl font-bold bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Pro
                </span>
            )}
        </Link>
    );
}
