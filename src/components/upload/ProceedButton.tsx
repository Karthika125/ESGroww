"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { getUploadProgress } from "@/actions/uploadProgress.actions";

const MANDATORY_CATEGORIES = ["electricity", "water", "waste"] as const;
const MIN_MONTHS = 6;

export default function ProceedButton() {
  const router = useRouter();
  const [canProceed, setCanProceed] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    async function check() {
      const data = await getUploadProgress();
      if (!data) return;

      const missingList = MANDATORY_CATEGORIES.filter(
        (cat) => (data[cat] ?? 0) < MIN_MONTHS
      );

      setMissing(missingList);
      setCanProceed(missingList.length === 0);
    }
    check();
  }, []);

  if (canProceed) {
    return (
      <button
        onClick={() => router.push("/summary")}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Continue to Summary
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        disabled
        className="flex items-center gap-2 bg-slate-200 text-slate-400 cursor-not-allowed px-6 py-3 rounded-xl font-medium text-sm"
      >
        <Lock className="w-4 h-4" />
        Continue to Summary
      </button>
      {missing.length > 0 && (
        <p className="text-xs text-rose-500">
          Need ≥6 months for: {missing.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
        </p>
      )}
    </div>
  );
}