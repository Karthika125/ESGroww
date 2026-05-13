"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export default function PageLayout({
  title,
  description,
  loading = false,
  error = null,
  children,
}: PageLayoutProps) {
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-2 py-2">
        <h1 className="text-lg font-bold mb-0.5">{title}</h1>
        {description && <p className="text-[11px] text-slate-600 mb-2">{description}</p>}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-2 py-2">
        <h1 className="text-lg font-bold mb-0.5">{title}</h1>
        {description && <p className="text-[11px] text-slate-600 mb-2">{description}</p>}
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} /> {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-2 py-2">
      <div className="mb-2">
        <h1 className="text-lg font-bold mb-0.5">{title}</h1>
        {description && <p className="text-[11px] text-slate-600">{description}</p>}
      </div>
      {children}
    </main>
  );
}
