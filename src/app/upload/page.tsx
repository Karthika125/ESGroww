"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Droplets, Fuel, Trash2, Snowflake, Truck, ShieldCheck, FileText, UploadCloud, Info, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const categories = [
    { name: "Electricity", icon: Zap, color: "text-amber-500", desc: "Upload electricity bills", status: "7 / 12 months", progressColor: "text-amber-600" },
    { name: "Water", icon: Droplets, color: "text-blue-500", desc: "Upload water bills", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Fuel", icon: Fuel, color: "text-slate-700", desc: "Upload fuel / DG invoices", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Waste", icon: Trash2, color: "text-green-600", desc: "Upload waste records", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Refrigerants", icon: Snowflake, color: "text-sky-400", desc: "Upload AC / Refrigerant data", status: "8 / 12 months", progressColor: "text-amber-600" },
    { name: "Transport", icon: Truck, color: "text-emerald-700", desc: "Upload transport data", status: "6 / 12 months", progressColor: "text-amber-600" },
  ];

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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Select Category to Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-3">
                  <cat.icon className={`w-8 h-8 ${cat.color}`} />
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.desc}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${cat.progressColor}`}>
                  {cat.status}
                </div>
                <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Files
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {/* Governance & Additional */}
          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">Governance</h3>
                  <p className="text-xs text-slate-500">Upload policies & docs</p>
                </div>
              </div>
              <div className="text-sm font-medium text-emerald-600">85% Completed</div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200 bg-slate-50/50">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-slate-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">Additional Data</h3>
                  <p className="text-xs text-slate-500">Any other supporting data</p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-400">Optional</div>
              <Button variant="outline" className="w-full">
                Upload Files
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Uploads</h2>
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">File Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Uploaded On</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
               {[
                 { file: "Electricity_Jul2024.pdf", cat: "Electricity", month: "Jul 2024", date: "05 Aug 2024" },
                 { file: "Water_Jul2024.pdf", cat: "Water", month: "Jul 2024", date: "05 Aug 2024" },
                 { file: "DG_Invoice_Jul2024.pdf", cat: "Fuel", month: "Jul 2024", date: "05 Aug 2024" },
                 { file: "Waste_Jul2024.xlsx", cat: "Waste", month: "Jul 2024", date: "05 Aug 2024" },
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-medium text-slate-900">{row.file}</td>
                   <td className="px-6 py-4">{row.cat}</td>
                   <td className="px-6 py-4">{row.month}</td>
                   <td className="px-6 py-4">{row.date}</td>
                   <td className="px-6 py-4 flex items-center text-emerald-600 gap-1.5 font-medium">
                     <CheckCircle2 className="w-4 h-4" /> Uploaded
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => router.push('/summary')}>
          Proceed to Summary →
        </Button>
      </div>
    </div>
  );
}
