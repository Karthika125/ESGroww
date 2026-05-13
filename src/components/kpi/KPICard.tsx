"use client";

import { KPIBenchmark, getStatusBadgeColor, getStatusColor } from "@/lib/kpiUtils";

interface KPICardProps {
  title: string;
  kpi: KPIBenchmark;
  unit: string;
}

export default function KPICard({ title, kpi, unit }: KPICardProps) {
  const scoreImpactLabel =
    kpi.scoreImpact === "Full"
      ? "Full Score"
      : kpi.scoreImpact === "Partial"
        ? "50% Score"
        : "Zero Score";

  const scoreImpactColor =
    kpi.scoreImpact === "Full"
      ? "text-green-700"
      : kpi.scoreImpact === "Partial"
        ? "text-amber-700"
        : "text-red-700";

  return (
    <article className={`border rounded p-2.5 shadow-sm ${getStatusColor(kpi.status)}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <div className={`text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${getStatusBadgeColor(kpi.status)}`}>
          {kpi.status}
        </div>
      </div>

      <div className="space-y-1 text-xs">
        {/* Value Display */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Current Value</span>
          <span className="text-current font-bold text-sm">
            {kpi.value !== null ? `${kpi.value.toFixed(2)} ${unit}` : "N/A"}
          </span>
        </div>

        {/* Score Impact */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Score Impact</span>
          <span className={`font-bold ${scoreImpactColor}`}>{scoreImpactLabel}</span>
        </div>

        {/* Range */}
        <div className="flex items-center justify-between">
          <span>Range</span>
          <span className="font-mono">{kpi.range}</span>
        </div>

        {/* Threshold */}
        <div className="pt-1 border-t border-current border-opacity-20">
          <div className="text-xs leading-snug">
            <span className="font-semibold">Target: </span>
            {kpi.threshold}
          </div>
        </div>
      </div>
    </article>
  );
}
