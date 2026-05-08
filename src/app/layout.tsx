import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SupabaseSessionProvider } from "../lib/supabase/SupabaseSessionProvider";
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
  description: "Get unlimited random Donald Trump quotes. Subscribe for Pro access and receive fresh wisdom from the 45th and 47th President of the United States, delivered instantly.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "Trump Quotes",
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
          <Footer />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
