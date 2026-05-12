"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, Droplets, Fuel, Trash2, Snowflake, Truck, ShieldCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExcelUploadButton from "./ExcelUploadButton";
import { getUploadProgress } from "@/actions/uploadProgress.actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadCategory = "electricity" | "water" | "fuel" | "waste" | "refrigerants" | "transport";

interface CategoryConfig {
  name: string;
  key: UploadCategory;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  desc: string;
  template: string;
}

// ─── BRD §4.4 — Status colour rules ─────────────────────────────────────────
// Green = 12/12 | Amber = 6–11 | Red = 3–5 | Grey = 0

function getStatusStyle(uploaded: number): {
  bar: string;
  label: string;
  dot: string;
  badge: string;
} {
  if (uploaded === 12)
    return { bar: "bg-emerald-500", label: "text-emerald-700", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (uploaded >= 6)
    return { bar: "bg-amber-400", label: "text-amber-700", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" };
  if (uploaded >= 3)
    return { bar: "bg-rose-400", label: "text-rose-700", dot: "bg-rose-400", badge: "bg-rose-50 text-rose-700 border-rose-200" };
  return { bar: "bg-slate-300", label: "text-slate-500", dot: "bg-slate-300", badge: "bg-slate-50 text-slate-500 border-slate-200" };
}

function statusLabel(uploaded: number): string {
  if (uploaded === 12) return "Complete";
  if (uploaded >= 6) return "Partial";
  if (uploaded >= 3) return "Low Data";
  if (uploaded > 0) return "Insufficient";
  return "Not Started";
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORIES: CategoryConfig[] = [
  {
    name: "Electricity",
    key: "electricity",
    icon: Zap,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    desc: "Monthly kWh, cost, peak demand, power factor",
    template: "/templates/electricity-template.xlsx",
  },
  {
    name: "Water",
    key: "water",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    desc: "Municipal, tanker, borewell, reuse volumes",
    template: "/templates/water-template.xlsx",
  },
  {
    name: "Fuel / DG",
    key: "fuel",
    icon: Fuel,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-100",
    desc: "Diesel litres, runtime hours, PNG/CNG kg",
    template: "/templates/fuel-template.xlsx",
  },
  {
    name: "Waste",
    key: "waste",
    icon: Trash2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    desc: "Wet, dry, hazardous, biomedical, e-waste kg",
    template: "/templates/waste-template.xlsx",
  },
  {
    name: "Refrigerants",
    key: "refrigerants",
    icon: Snowflake,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    desc: "R-22, R-410A, R-32 — type & quantity leaked",
    template: "/templates/refrigerants-template.xlsx",
  },
  {
    name: "Transport",
    key: "transport",
    icon: Truck,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    desc: "Fleet fuel, vehicle km, cargo tonnage",
    template: "/templates/transport-template.xlsx",
  },
];

// ─── Category Card ────────────────────────────────────────────────────────────

interface CategoryCardProps {
  config: CategoryConfig;
  uploadedMonths: number;
  onUploadSuccess: () => void;
}

function CategoryCard({ config, uploadedMonths, onUploadSuccess }: CategoryCardProps) {
  const pct = Math.min((uploadedMonths / 12) * 100, 100);
  const style = getStatusStyle(uploadedMonths);
  const label = statusLabel(uploadedMonths);
  const Icon = config.icon;

  return (
    <Card className="border border-slate-200 rounded-2xl hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${config.iconBg} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">{config.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{config.desc}</p>
            </div>
          </div>

          {/* Status badge */}
          <span className={`flex-shrink-0 text-xs font-medium border rounded-full px-2 py-0.5 ${style.badge}`}>
            {label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Months uploaded</span>
            <span className={`text-xs font-semibold ${style.label}`}>
              {uploadedMonths} / 12
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <ExcelUploadButton category={config.key} onUploadSuccess={onUploadSuccess} />
          <a href={config.template} download className="block">
            <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100">
              Download Template
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────

export default function UploadCategoryGrid() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  const loadProgress = useCallback(async () => {
    const data = await getUploadProgress();
    setProgress(data ?? {});
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">Upload Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dynamic categories */}
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.key}
            config={cat}
            uploadedMonths={progress[cat.key] ?? 0}
            onUploadSuccess={loadProgress}
          />
        ))}

        {/* Governance Card — questionnaire based, not monthly */}
        <Card className="border border-emerald-200 rounded-2xl hover:shadow-md transition-all duration-200 bg-emerald-50/30">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Governance</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Policies, ESG owner, audit records, compliance register
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500 bg-white border border-emerald-100 rounded-xl px-3 py-2">
              Completed via questionnaire — not monthly data
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9">
              Fill Questionnaire →
            </Button>
          </CardContent>
        </Card>

        {/* Additional Data — optional */}
        <Card className="border border-dashed border-slate-200 rounded-2xl hover:shadow-md transition-all duration-200 bg-slate-50/50">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white flex-shrink-0">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Additional Data</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  IAQ reports, certifications, production output
                </p>
              </div>
            </div>
            <span className="inline-block text-xs text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">
              Optional
            </span>
            <Button variant="outline" size="sm" className="w-full text-sm border-slate-200 h-9">
              Upload Files
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}