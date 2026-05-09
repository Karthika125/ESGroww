"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Droplets, Fuel, Trash2, Snowflake, Truck, ShieldCheck, FileText, UploadCloud } from "lucide-react";

export function UploadCategoryGrid() {
  const categories = [
    { name: "Electricity", icon: Zap, color: "text-amber-500", desc: "Upload electricity bills", status: "7 / 12 months", progressColor: "text-amber-600" },
    { name: "Water", icon: Droplets, color: "text-blue-500", desc: "Upload water bills", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Fuel", icon: Fuel, color: "text-slate-700", desc: "Upload fuel / DG invoices", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Waste", icon: Trash2, color: "text-green-600", desc: "Upload waste records", status: "12 / 12 months", progressColor: "text-emerald-600" },
    { name: "Refrigerants", icon: Snowflake, color: "text-sky-400", desc: "Upload AC / Refrigerant data", status: "8 / 12 months", progressColor: "text-amber-600" },
    { name: "Transport", icon: Truck, color: "text-emerald-700", desc: "Upload transport data", status: "6 / 12 months", progressColor: "text-amber-600" },
  ];

  return (
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
  );
}
