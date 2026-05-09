import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SustainabilityOverview } from "@/components/dashboard/SustainabilityOverview";
import { CertificationReadiness } from "@/components/dashboard/CertificationReadiness";
import { RegulatoryReadiness } from "@/components/dashboard/RegulatoryReadiness";
import { StrengthsWidget, CriticalGapsWidget, ActionRoadmapWidget } from "@/components/dashboard/RoadmapWidgets";
import { AIExecutiveSummary } from "@/components/dashboard/AIExecutiveSummary";

// Server action mapping
import { fetchDashboardIntelligence } from "@/actions/dashboard.actions";

// This becomes a React Server Component to fetch the dynamic Intel securely!
export default async function ResultsPage() {
  
  // 1. We dynamically fetch the calculated ESGIQ engine output 
  const dashboardData = await fetchDashboardIntelligence();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:space-y-4 print:pb-0 print:m-0">
      
      {/* Overview Top Section dynamically injected with ESG score algorithms */}
      <SustainabilityOverview data={dashboardData} />

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
