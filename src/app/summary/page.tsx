"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadOverviewTable } from "@/components/summary/UploadOverviewTable";
import { ValidationResults } from "@/components/summary/ValidationResults";
import { CalculationsSummary } from "@/components/summary/CalculationsSummary";
import { KeyPerformanceIndicators } from "@/components/summary/KeyPerformanceIndicators";

export default function SummaryPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Summary &amp; Calculations</h1>
        <p className="text-slate-500 mt-2">Review your uploaded data, validations, calculations and estimated results</p>
      </div>

      <UploadOverviewTable />
      <ValidationResults />
      <CalculationsSummary />
      <KeyPerformanceIndicators />

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" className="text-slate-600" onClick={() => router.push('/upload')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
        </Button>
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => router.push('/results')}>
          View Readiness Results <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
