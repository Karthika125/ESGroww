import TopNav from "@/components/TopNav";
import UploadCategoryGrid from "@/components/upload/UploadCategoryGrid";
import RecentUploadsTable from "@/components/upload/RecentUploadsTable";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <TopNav />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Data Load
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your operational data and supporting documents
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-10">
          <p className="text-sm text-blue-700">
            Upload monthly data for minimum 6 months.
            We recommend 12 months for accurate assessment.
          </p>
        </div>

        <UploadCategoryGrid />

        <div className="mt-10">
          <RecentUploadsTable />
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href="/summary"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition rounded-xl"
          >
            Continue to Summary →
          </a>
        </div>
      </main>
    </div>
  );
}