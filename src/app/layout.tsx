import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav  from "@/components/TopNav";
import { MistralChatbot } from "@/components/chatbot/MistralChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESGroww - Sustainability Readiness Platform",
  description: "Enterprise ESG Readiness Intelligence Platform. Assessing, calculating, and scoring sustainability data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <TopNav />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 pb-40 md:p-8 md:pb-44">
          {children}
        </main>
        <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] print:hidden">
          <MistralChatbot />
        </div>
      </body>
    </html>
  );
}
