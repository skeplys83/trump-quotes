"use client"

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/src/components/shadcn/button";

export default function ProcessingPage() {
    const router = useRouter();
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowFallback(true), 10000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await axios.get("/api/subscription");

                // If subscription is active, redirect to home page
                if (response.data && response.data.stripe_subscription_id !== null) {
                    router.push("/");
                }

                // If subscription doesn't exist (deleted/canceled), go back to plans page
                if (!response.data) {
                    router.push("/plans");
                }
            } catch (error) {
                // If we get an error, keep polling
                console.error("Error checking subscription:", error);
            }
        };

        // Poll every 1 second
        const interval = setInterval(checkSubscription, 1000);

        // Also check immediately
        checkSubscription();

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <LoaderIcon className="animate-spin w-6 h-6" />
            {showFallback && (
                <>
                    <p className="text-sm text-muted-foreground mt-5">Not loading? Return to plans</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/plans")}
                        className="rounded-full px-4 py-2 h-10 cursor-pointer"
                    >
                        Go to Plans
                    </Button>
                </>
            )}
        </div>
    );
}
