"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: 'Energy', A: 85, fullMark: 100 },
  { subject: 'Water', A: 78, fullMark: 100 },
  { subject: 'Waste', A: 65, fullMark: 100 },
  { subject: 'Governance', A: 70, fullMark: 100 },
  { subject: 'Emissions', A: 60, fullMark: 100 },
];

export default function ResultsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-slate-900 rounded-xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
             <div className="absolute inset-0 rounded-full border-8 border-slate-800"></div>
             <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%, 50% 0, 0 0)" }}></div>
             <div className="text-center">
               <span className="text-4xl font-bold">72%</span>
             </div>
          </div>
          <div className="space-y-4">
             <h2 className="text-xl font-semibold">Sustainability Readiness Overview</h2>
             <div className="grid grid-cols-2 gap-6 mt-4">
               <div>
                  <p className="text-sm text-slate-400">Readiness Level</p>
                  <p className="text-lg font-medium text-blue-400 mt-1">Structured</p>
               </div>
               <div>
                  <p className="text-sm text-slate-400">Overall Confidence</p>
                  <p className="text-lg font-medium text-emerald-400 mt-1">Medium-High</p>
               </div>
               <div>
                  <p className="text-sm text-slate-400">Estimated Total Emissions</p>
                  <p className="text-lg font-medium mt-1">127.85 <span className="text-sm">tCO₂e/year</span></p>
               </div>
               <div>
                  <p className="text-sm text-slate-400">Benchmark Position</p>
                  <p className="text-lg font-medium text-emerald-400 mt-1 flex items-center gap-2">Above Average ↗</p>
               </div>
             </div>
          </div>
        </div>
        <div className="col-span-1 h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Readiness" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-2 border-b mb-3">
             <CardTitle className="text-lg flex justify-between items-center text-slate-900">
               Certification Readiness
               <span className="text-sm text-emerald-600 font-normal cursor-pointer">View Details &gt;</span>
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "NABH", score: "82%", status: "Strong Readiness", color: "text-emerald-600", time: "3-6 months" },
                { name: "IGBC Healthcare", score: "74%", status: "Certification Possible", color: "text-emerald-600", time: "6-12 months" },
                { name: "ISO 14001", score: "76%", status: "Strong Readiness", color: "text-emerald-600", time: "6 months" },
                { name: "LEED Healthcare", score: "68%", status: "Moderate Readiness", color: "text-amber-600", time: "12-16 months" }
              ].map((cert, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                  <div className="font-medium text-slate-900 w-32">{cert.name}</div>
                  <div className="font-bold w-12">{cert.score}</div>
                  <div className={`w-36 ${cert.color}`}>{cert.status}</div>
                  <div className="text-slate-500 w-24 text-right">{cert.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2 border-b mb-3">
             <CardTitle className="text-lg flex justify-between items-center text-slate-900">
               Regulatory Readiness
               <span className="text-sm text-emerald-600 font-normal cursor-pointer">View Details &gt;</span>
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Biomedical Waste Comp.", read: "Strong", risk: "Low", riskColor: "text-emerald-600" },
                { name: "ESG Disclosure Prep.", read: "Moderate", risk: "Medium", riskColor: "text-amber-600" },
                { name: "Energy Monitoring", read: "Moderate", risk: "Medium", riskColor: "text-amber-600" },
                { name: "Water Reuse Expectations", read: "Foundational", risk: "Medium", riskColor: "text-amber-600" }
              ].map((reg, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                  <div className="font-medium text-slate-900 flex-1">{reg.name}</div>
                  <div className="w-24 text-slate-600">{reg.read}</div>
                  <div className={`w-20 text-right font-medium ${reg.riskColor}`}>{reg.risk}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-emerald-50/50">
           <CardHeader className="pb-3 border-b border-emerald-100">
             <CardTitle className="text-emerald-900 text-base">Strengths</CardTitle>
           </CardHeader>
           <CardContent className="pt-4 space-y-3">
             {["Strong waste segregation & tracking", "Full year water monitoring", "Healthy power factor", "Structured utility tracking"].map((item, i) => (
               <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                 <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                 <span>{item}</span>
               </div>
             ))}
           </CardContent>
        </Card>

        <Card className="border-slate-200 bg-amber-50/50">
           <CardHeader className="pb-3 border-b border-amber-100">
             <CardTitle className="text-amber-900 text-base">Critical Gaps</CardTitle>
           </CardHeader>
           <CardContent className="pt-4 space-y-3">
             {["No renewable energy integration", "No centralized monitoring", "Indoor air quality not monitored", "Scope 3 tracking incomplete"].map((item, i) => (
               <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                 <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                 <span>{item}</span>
               </div>
             ))}
           </CardContent>
        </Card>

        <Card className="border-slate-200">
           <CardHeader className="pb-3 border-b">
             <CardTitle className="text-slate-900 text-base flex justify-between">
               Priority Action Roadmap
               <span className="text-xs text-emerald-600 font-normal cursor-pointer">View Roadmap</span>
             </CardTitle>
           </CardHeader>
           <CardContent className="pt-4 space-y-3">
             {[
                { time: "Immediate", action: "Appoint sustainability governance owner" },
                { time: "0-3 Months", action: "Increase LED coverage to >80%" },
                { time: "3-6 Months", action: "Implement centralized energy monitoring" },
                { time: "6-12 Months", action: "Install rooftop solar system" }
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-3 text-sm">
                 <div className="w-20 shrink-0 text-slate-500 font-medium text-xs pt-0.5">{item.time}</div>
                 <div className="text-slate-700">{item.action}</div>
               </div>
             ))}
           </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <CardTitle className="text-slate-900">AI Executive Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Sunrise Multispeciality Hospital demonstrates strong operational sustainability fundamentals with structured utility tracking, strong waste segregation practices, and moderate governance maturity. Current operational performance indicates potential for NABH, IGBC Healthcare, and ISO 14001 pathways. Key improvement opportunities include renewable energy integration, centralized energy monitoring systems, and enhanced ESG governance formalization.
          </p>
          <Button variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
             <Download className="w-4 h-4 mr-2" /> Download Full Report (PDF)
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" className="text-slate-600" onClick={() => router.push('/summary')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Summary
        </Button>
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
