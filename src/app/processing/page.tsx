"use client"

import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProcessingPage() {
    const router = useRouter();

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await axios.get("/api/subscription");

                // If subscription is active, redirect to plans
                if (response.data && response.data.subscription_status === "active") {
                    router.push("/plans");
                }

                // If subscription doesn't exist (deleted/canceled), also redirect
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
        <div className="min-h-screen flex items-center justify-center">
            <LoaderIcon className="animate-spin w-6 h-6" />
        </div>
    );
}
