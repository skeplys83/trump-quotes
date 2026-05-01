"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";

export default function BillingCancelPage() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push("/");
        }, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4">
            <LoaderIcon className="animate-spin w-6 h-6" />
            <h1 className="text-2xl font-semibold text-center">Billing canceled</h1>
            <p className="text-sm text-muted-foreground">Redirecting you home...</p>
        </main>
    );
}
