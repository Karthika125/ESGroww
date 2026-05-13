"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Renders a back-navigation button only after the client has mounted.
 * Placed in the TopNav so it's always accessible without touching any page layout.
 */
export default function BackButton() {
  const router = useRouter();
  // Avoid hydration mismatch — history length is browser-only.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      title="Go back"
      className="
        group flex items-center gap-1.5
        rounded-md px-2 py-1.5
        text-slate-500 text-xs font-medium
        transition-colors duration-150
        hover:bg-slate-100 hover:text-slate-800
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
      "
    >
      <ArrowLeft
        className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
        aria-hidden
      />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
