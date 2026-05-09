"use client";

import Link from "next/link";
import { Leaf, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  // Simple step logic based on pathname
  let currentStep = 1;
  if (pathname.includes("/summary")) currentStep = 2;
  if (pathname.includes("/results") || pathname.includes("/dashboard")) currentStep = 3;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-500" />
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-slate-900">ESGroww</span>
          </Link>
        </div>

        {/* Dynamic Stepper */}
        {pathname !== "/" && !pathname.includes("/login") && (
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? "text-emerald-600" : "text-muted-foreground"}`}>
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${currentStep >= 1 ? "bg-emerald-500" : "bg-slate-300"}`}>1</div>
              <span>Data Load</span>
            </div>
            <div className="h-px w-12 bg-slate-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? "text-emerald-600" : "text-muted-foreground"}`}>
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${currentStep >= 2 ? "bg-emerald-500" : "bg-slate-300"}`}>2</div>
              <span>Upload Summary</span>
            </div>
            <div className="h-px w-12 bg-slate-200"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? "text-emerald-600" : "text-muted-foreground"}`}>
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${currentStep >= 3 ? "bg-emerald-500" : "bg-slate-300"}`}>3</div>
              <span>Readiness Results</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
