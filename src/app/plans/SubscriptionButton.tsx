"use client"

import { Button } from "@/src/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/shadcn/dialog";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

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
            Next billing: {billingPeriodEnd}
          </p>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              className="cursor-pointer"
            >
              Cancel Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will cancel your subscription. You&apos;ll still have access until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                No, keep subscription
              </Button>
              <form action="/api/stripe/cancel" method="POST">
                <Button type="submit" variant="destructive" className="cursor-pointer">
                  Yes, cancel subscription
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
