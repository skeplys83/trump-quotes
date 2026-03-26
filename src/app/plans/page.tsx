"use server"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shadcn/card";
import { Button } from "@/src/components/shadcn/button";
import Link from "next/link";
import SubscriptionButton from "@/src/app/plans/SubscriptionButton";

export default async function PlansPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="rounded-full px-4 py-2 h-10 cursor-pointer">
            ← Back
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-40">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Access Next Weather <span className="bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Pro</span>
            </h1>
          </div>

          <Card className="bg-background border rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl ">Next Weather Pro</CardTitle>
              <CardDescription>Monthly billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$0.01</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited weather searches</span>
                </li>
              </ul>

              <SubscriptionButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
