import TopNav from "@/components/TopNav";
import UploadCategoryGrid from "@/components/upload/UploadCategoryGrid";
import RecentUploadsTable from "@/components/upload/RecentUploadsTable";
import ProceedButton from "@/components/upload/ProceedButton";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <TopNav />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3 tracking-wide uppercase">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            Step 1 of 3
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Data Load</h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Upload your operational records and complete the governance questionnaire.
          </p>
        </div>

        {/* BRD §4.4 — Persistent data notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 leading-relaxed">
            Upload monthly data for a <strong>minimum of 6 months</strong>. We recommend{" "}
            <strong>12 months</strong> for the most accurate assessment and highest confidence score.
          </p>
        </div>

        {/* Category Grid */}
        <UploadCategoryGrid />

        {/* Recent Uploads */}
        <div className="mt-10">
          <RecentUploadsTable />
        </div>

        {/* BRD §4.4 — Proceed button gated on ≥6 months mandatory uploads */}
        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Electricity, Water, and Waste must each have ≥ 6 months to proceed.
          </p>
          <ProceedButton />
        </div>
      </main>
    </div>
  );
}