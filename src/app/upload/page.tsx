import { Info } from "lucide-react";

import UploadWorkspace from "@/components/upload/UploadWorkspace";

export default function UploadPage() {
  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col bg-[#f4f6f9] text-slate-900">
      <div className="mx-auto flex w-full min-w-0 max-w-none flex-col gap-2 py-2 sm:py-2.5">
        <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-200/90 pb-2">
          <span className="shrink-0 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
            Step 1 of 3
          </span>
          <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Assessment Progress</h1>
          <p className="hidden min-w-0 flex-1 text-[11px] leading-snug text-slate-600 md:block md:truncate">
            Upload operational records and complete the governance questionnaire.
          </p>
        </header>

        <div className="flex shrink-0 items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/90 px-2 py-1.5 text-[11px] leading-snug text-blue-900">
          <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600" aria-hidden />
          <p>
            <strong className="font-semibold">6 months minimum</strong> for Electricity, Water, and Waste.{" "}
            <strong className="font-semibold">12 months</strong> recommended for confidence.
          </p>
        </div>

        <UploadWorkspace />

        <footer className="mt-auto flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2 text-[10px] text-slate-400">
          <span>© {new Date().getFullYear()} ESGroww</span>
          <span className="text-slate-500">v0.1.0</span>
        </footer>
      </div>
    </div>
  );
}
