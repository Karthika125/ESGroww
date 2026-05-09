"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SummaryPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Summary &amp; Calculations</h1>
        <p className="text-slate-500 mt-2">Review your uploaded data, validations, calculations and estimated results</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">1. Upload Overview</h2>
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Months Uploaded</th>
                <th className="px-6 py-3 font-medium">Completeness</th>
                <th className="px-6 py-3 font-medium">Confidence</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
               {[
                 { cat: "Electricity", months: "7 / 12", comp: "58%", conf: "Medium", confColor: "text-amber-500", stat: "Partial", statColor: "text-amber-500" },
                 { cat: "Water", months: "12 / 12", comp: "100%", conf: "High", confColor: "text-emerald-500", stat: "Complete", statColor: "text-emerald-500" },
                 { cat: "Fuel", months: "12 / 12", comp: "100%", conf: "High", confColor: "text-emerald-500", stat: "Complete", statColor: "text-emerald-500" },
                 { cat: "Waste", months: "12 / 12", comp: "100%", conf: "High", confColor: "text-emerald-500", stat: "Complete", statColor: "text-emerald-500" },
                 { cat: "Refrigerants", months: "8 / 12", comp: "67%", conf: "Medium", confColor: "text-amber-500", stat: "Partial", statColor: "text-amber-500" },
                 { cat: "Transport", months: "6 / 12", comp: "50%", conf: "Medium", confColor: "text-amber-500", stat: "Partial", statColor: "text-amber-500" },
                 { cat: "Governance", months: "-", comp: "85%", conf: "High", confColor: "text-emerald-500", stat: "Complete", statColor: "text-emerald-500" },
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-slate-50">
                   <td className="px-6 py-3 font-medium text-slate-900">{row.cat}</td>
                   <td className="px-6 py-3">{row.months}</td>
                   <td className="px-6 py-3">{row.comp}</td>
                   <td className={`px-6 py-3 ${row.confColor}`}>{row.conf}</td>
                   <td className={`px-6 py-3 ${row.statColor}`}>{row.stat}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">2. Validation Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: "Negative Values", status: "Passed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Missing Months", status: "Partial", sub: "3 Categories", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
            { label: "Abnormal Spikes", status: "Passed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Duplicate Entries", status: "Passed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Unit Consistency", status: "Passed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          ].map((item, i) => (
            <div key={i} className={`p-4 border rounded-lg ${item.bg} ${item.border} flex items-center gap-3`}>
               <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
               <div>
                 <p className="text-xs font-medium text-slate-600">{item.label}</p>
                 <p className={`text-sm font-semibold ${item.color}`}>
                   {item.status}
                   {item.sub && <span className="block text-[10px] bg-amber-100 text-amber-800 px-1 rounded inline-block ml-1">{item.sub}</span>}
                 </p>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">3. Annualized Calculations Summary</h2>
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Metric</th>
                <th className="px-6 py-3 font-medium">Uploaded Data</th>
                <th className="px-6 py-3 font-medium">Annualized Value Used</th>
                <th className="px-6 py-3 font-medium">Calculation Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-900">Electricity (kWh)</td>
                <td className="px-6 py-3">88,000</td>
                <td className="px-6 py-3 font-semibold text-slate-900">150,857</td>
                <td className="px-6 py-3 text-slate-500">88,000 ÷ 7 × 12</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-900">Renewable Energy (kWh)</td>
                <td className="px-6 py-3">0</td>
                <td className="px-6 py-3 font-semibold text-slate-900">0</td>
                <td className="px-6 py-3 text-slate-500">Actual</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-900">DG Diesel (Litres)</td>
                <td className="px-6 py-3">1,200</td>
                <td className="px-6 py-3 font-semibold text-slate-900">1,200</td>
                <td className="px-6 py-3 text-slate-500">Actual</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">4. Key Performance Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Energy Intensity", val: "15.09", unit: "kWh/sqft/year", bench: "16 - 22", color: "text-emerald-600" },
            { title: "Water Intensity", val: "0.24", unit: "KL/sqft/year", bench: "0.20 - 0.35", color: "text-emerald-600" },
            { title: "Renewable Energy", val: "0%", unit: "Of Total Energy", bench: ">10%", color: "text-slate-900" },
            { title: "Waste Recycling", val: "58.3%", unit: "Recycling Rate", bench: ">60%", color: "text-slate-900" },
          ].map((kpi, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-1 text-center">
                 <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                 <div className="flex items-baseline justify-center gap-1">
                   <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.val}</p>
                 </div>
                 <p className="text-xs text-slate-500">{kpi.unit}</p>
                 <div className="pt-2 mt-2 border-t text-xs text-slate-500">
                   Benchmark: {kpi.bench}
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
