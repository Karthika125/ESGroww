import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav  from "@/components/TopNav";
import { MistralChatbot } from "@/components/chatbot/MistralChatbot";
import VerticalFloatingMenuWrapper from "@/components/ui/VerticalFloatingMenuWrapper";

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
        <main className="mx-auto flex w-full min-w-0 max-w-none flex-1 px-3 pb-40 pt-1 sm:px-5 lg:px-8 lg:pb-44 xl:px-10 2xl:px-12">
          {children}
        </main>
        <MistralChatbot />
        <VerticalFloatingMenuWrapper />
      </body>
    </html>
  );
}
