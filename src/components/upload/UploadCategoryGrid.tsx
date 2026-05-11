"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ExcelUploadButton from "./ExcelUploadButton";

import { getUploadProgress } from "@/actions/uploadProgress.actions";

import {
  Zap,
  Droplets,
  Fuel,
  Trash2,
  Snowflake,
  Truck,
  ShieldCheck,
  FileText,
  UploadCloud,
} from "lucide-react";

export default function UploadCategoryGrid() {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    async function loadProgress() {
      const data = await getUploadProgress();
      setProgress(data);
    }

    loadProgress();
  }, []);

  const categories = [
    {
      name: "Electricity",
      icon: Zap,
      color: "text-amber-500",
      desc: "Upload electricity bills",
      uploadedMonths:
        progress?.electricityMonths || 0,
      totalMonths: 12,
    },

    {
      name: "Water",
      icon: Droplets,
      color: "text-blue-500",
      desc: "Upload water bills",
      uploadedMonths:
        progress?.waterMonths || 0,
      totalMonths: 12,
    },

    {
      name: "Fuel",
      icon: Fuel,
      color: "text-slate-700",
      desc: "Upload fuel / DG invoices",
      uploadedMonths:
        progress?.fuelMonths || 0,
      totalMonths: 12,
    },

    {
      name: "Waste",
      icon: Trash2,
      color: "text-green-600",
      desc: "Upload waste records",
      uploadedMonths:
        progress?.wasteMonths || 0,
      totalMonths: 12,
    },

    {
      name: "Refrigerants",
      icon: Snowflake,
      color: "text-sky-400",
      desc: "Upload AC / Refrigerant data",
      uploadedMonths: 0,
      totalMonths: 12,
    },

    {
      name: "Transport",
      icon: Truck,
      color: "text-emerald-700",
      desc: "Upload transport data",
      uploadedMonths: 0,
      totalMonths: 12,
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">
        Select Category to Upload
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, index) => {
          const progressPercentage =
            (cat.uploadedMonths /
              cat.totalMonths) *
            100;

          const progressColor =
            progressPercentage >= 80
              ? "text-emerald-600"
              : progressPercentage >= 40
              ? "text-amber-600"
              : "text-rose-600";

          return (
            <Card
              key={index}
              className="border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <cat.icon
                      className={`w-6 h-6 ${cat.color}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {cat.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Upload Progress
                    </span>

                    <span
                      className={`font-semibold ${progressColor}`}
                    >
                      {cat.uploadedMonths} /{" "}
                      {cat.totalMonths} months
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {cat.name ===
                  "Electricity" ? (
                    <ExcelUploadButton />
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Upload Excel
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full text-slate-600 hover:bg-slate-100"
                  >
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Governance Card */}
        <Card className="border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 text-lg">
                  Governance
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Upload policies &
                  compliance documents
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Governance Readiness
                </span>

                <span className="font-semibold text-emerald-600">
                  0%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-0 bg-emerald-500 rounded-full" />
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Continue
            </Button>
          </CardContent>
        </Card>

        {/* Additional Data */}
        <Card className="border border-slate-200 rounded-2xl bg-slate-50/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 text-lg">
                  Additional Data
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Upload supporting ESG
                  documents
                </p>
              </div>
            </div>

            <div className="text-sm font-medium text-slate-400">
              Optional Upload
            </div>

            <Button
              variant="outline"
              className="w-full border-slate-200"
            >
              Upload Files
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}