"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BillingCancelPage() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push("/");
        }, 5000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-center">Billing canceled</h1>
        </main>
    );
}
