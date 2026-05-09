"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadCategoryGrid } from "@/components/upload/UploadCategoryGrid";
import { RecentUploadsTable } from "@/components/upload/RecentUploadsTable";

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Load</h1>
        <p className="text-slate-500 mt-2">Upload your operational data and supporting documents</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">Upload monthly data for minimum 6 months. We recommend 12 months for accurate assessment.</p>
      </div>

      <UploadCategoryGrid />
      <RecentUploadsTable />

      <div className="flex justify-end pt-4 border-t">
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => router.push('/summary')}>
          Proceed to Summary →
        </Button>
      </div>
    </div>
  );
}
