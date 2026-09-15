import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { LearningSheet } from "@/components/learning/LearningSheet";
import { LearningSyncProvider } from "@/components/learning/LearningSyncProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CinemaFlow",
  description: "프리미엄 영화 탐색 및 감상 기록 서비스",
};

import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <TooltipProvider>
          <LearningSyncProvider user={user} />
          <Header user={user} />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <LearningSheet />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
