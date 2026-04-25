"use client"

import { Button } from "@/src/components/shadcn/button";
import useSWR from "swr";
import axios from "axios";
import SpinnerDemo from "@/src/components/shadcn/spinner-01";

interface Subscription {
  subscription_status: string;
  current_period_end: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function SubscriptionButton() {
  const { data: subscription, isLoading } = useSWR<Subscription | null>(
    "/api/subscription",
    fetcher
  );

  const isActive = subscription?.subscription_status === "active";
  const billingPeriodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : null;

  if (isLoading) {
    return (
      <Button disabled className="w-full" size="lg">
        <SpinnerDemo />
      </Button>
    );
  }

  if (isActive) {
    return (
      <div className="flex items-center gap-4">
        {billingPeriodEnd && (
          <p className="text-sm text-muted-foreground flex-1">
            Current billing period: {billingPeriodEnd}
          </p>
        )}
        <form action="/api/stripe/portal" method="POST">
          <Button type="submit" variant="outline" size="lg" className="cursor-pointer">
            Manage Subscription
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form action="/api/stripe/checkout" method="POST">
      <Button type="submit" className="w-full cursor-pointer" size="lg">
        Subscribe Now
      </Button>
    </form>
  );
}
