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
      <main className="max-w-7xl mx-auto px-3 py-4">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        {description && <p className="text-xs text-slate-600 mb-4">{description}</p>}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-3 py-4">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        {description && <p className="text-xs text-slate-600 mb-4">{description}</p>}
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} /> {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-3 py-4">
      <div className="mb-3">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        {description && <p className="text-xs text-slate-600">{description}</p>}
      </div>
      {children}
    </main>
  );
}
