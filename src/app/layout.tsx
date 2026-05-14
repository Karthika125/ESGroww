import type { Metadata } from "next";
import { Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { ConditionalChatbot } from "@/components/chatbot/ConditionalChatbot";
import VerticalFloatingMenuWrapper from "@/components/ui/VerticalFloatingMenuWrapper";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex h-full flex-col bg-background font-sans text-foreground">
        <TopNav />
        <main className="mx-auto flex min-h-0 w-full min-w-0 max-w-none flex-1 flex-col overflow-y-auto px-3 pt-1 pb-5 sm:px-4 sm:pb-6 lg:px-6 xl:px-8 2xl:px-10">
          {children}
        </main>
        <ConditionalChatbot />
        <VerticalFloatingMenuWrapper />
      </body>
    </html>
  );
}
