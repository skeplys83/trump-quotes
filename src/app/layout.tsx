import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SupabaseSessionProvider } from "../lib/supabase/SupabaseSessionProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trump Quotes",
  description: "Get random Donald Trump quotes.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇺🇸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark flex flex-col min-h-screen`}
      >
        <SupabaseSessionProvider>
          {children}
          <Toaster />
          <SpeedInsights />
          <Footer />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
