import { Info } from "lucide-react";

import UploadWorkspace from "@/components/upload/UploadWorkspace";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8">
          <span className="mb-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
            Step 1 of 3
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Data load</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Upload your operational records and complete the governance questionnaire.
          </p>
        </div>

        <div className="mb-8 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5 md:px-5">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden />
          <p className="text-sm leading-relaxed text-blue-800">
            Upload monthly data for a <strong>minimum of 6 months</strong> for Electricity, Water, and Waste. We
            recommend <strong>12 months</strong> for the most accurate assessment and highest confidence score.
          </p>
        </div>

        <UploadWorkspace />

        <footer className="mt-16 flex flex-col gap-2 border-t border-slate-200 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ESGroww. All rights reserved.</span>
          <span className="text-slate-500">Version 0.1.0</span>
        </footer>
      </div>
    </div>
  );
}
