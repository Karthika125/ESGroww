import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SustainabilityOverview from "@/components/dashboard/SustainabilityOverview";
import { CertificationReadiness } from "@/components/dashboard/CertificationReadiness";
import { RegulatoryReadiness } from "@/components/dashboard/RegulatoryReadiness";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { StrengthsWidget, CriticalGapsWidget, ActionRoadmapWidget } from "@/components/dashboard/RoadmapWidgets";
import { AIExecutiveSummary } from "@/components/dashboard/AIExecutiveSummary";

// Server action mapping
import { fetchDashboardIntelligence } from "@/actions/dashboard.actions";

// Type for insufficient data response
interface InsufficientDataResponse {
  hospitalName: string;
  industry: string;
  error: string;
  requiresMoreData: boolean;
  monthsUploaded: number;
  minimumRequired: number;
}

// This becomes a React Server Component to fetch the dynamic Intel securely!
export default async function ResultsPage() {
  
  // 1. We dynamically fetch the calculated ESGIQ engine output 
  const dashboardData = await fetchDashboardIntelligence();

  // Check if there's insufficient data
  if ((dashboardData as InsufficientDataResponse).error && (dashboardData as InsufficientDataResponse).requiresMoreData) {
    const insufficientData = dashboardData as InsufficientDataResponse;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:space-y-4 print:pb-0 print:m-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Insufficient Data for ESG Analysis
              </h2>
              <p className="text-amber-700 mb-6">
                {insufficientData.error}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-amber-200 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{insufficientData.monthsUploaded}</div>
                  <div className="text-amber-700">Months Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{insufficientData.minimumRequired}</div>
                  <div className="text-amber-700">Months Required</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-amber-600 font-medium">
                Please upload data for at least {insufficientData.minimumRequired - insufficientData.monthsUploaded} more month{insufficientData.minimumRequired - insufficientData.monthsUploaded !== 1 ? 's' : ''} to generate your ESG analysis.
              </p>
              
              <Link href="/upload">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Go to Upload Page
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t print:hidden">
          <Link href="/summary">
            <Button variant="outline" className="text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Summary
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:space-y-4 print:pb-0 print:m-0">
      
      {/* Overview Top Section dynamically injected with ESG score algorithms */}
      <SustainabilityOverview data={dashboardData} />

      {/* Emissions Chart */}
      <EmissionsChart emissions={dashboardData.emissions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-4">
        {/* Certification Mapping Dynamically Injected */}
        <CertificationReadiness certifications={dashboardData.certifications} />
        <RegulatoryReadiness />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:space-y-4">
        <StrengthsWidget />
        <CriticalGapsWidget />
        <ActionRoadmapWidget />
      </div>

      <AIExecutiveSummary />

      <div className="flex justify-between pt-6 border-t print:hidden">
        <Link href="/summary">
          <Button variant="outline" className="text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Summary
          </Button>
        </Link>
        <div className="space-x-4">
          <Button variant="outline">Compare Industry Benchmark</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Book Expert Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
