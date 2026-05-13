"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { getUploadProgress, type UploadProgressPayload } from "@/actions/uploadProgress.actions";

const MONTH_KEYS = ["electricity", "water", "fuel", "waste", "refrigerants", "transport"] as const;

type SlotState = "complete" | "partial" | "notStarted";

function slotForMonths(months: number): SlotState {
  if (months >= 12) return "complete";
  if (months > 0) return "partial";
  return "notStarted";
}

function slotForGovernance(g: UploadProgressPayload["governance"]): SlotState {
  if (g.isComplete) return "complete";
  if (g.answeredCount > 0) return "partial";
  return "notStarted";
}

function buildOverview(data: UploadProgressPayload) {
  const slots: SlotState[] = [
    ...MONTH_KEYS.map((k) => slotForMonths(data[k])),
    slotForGovernance(data.governance),
  ];

  const completed = slots.filter((s) => s === "complete").length;
  const partial = slots.filter((s) => s === "partial").length;
  const notStarted = slots.filter((s) => s === "notStarted").length;

  const monthScores = MONTH_KEYS.map((k) => Math.min(data[k] / 12, 1));
  const govScore = data.governance.answeredCount / Math.max(data.governance.totalCount, 1);
  const overallPct = Math.round(
    ((monthScores.reduce((a, b) => a + b, 0) + govScore) / (MONTH_KEYS.length + 1)) * 100
  );

  return {
    completed,
    partial,
    notStarted,
    overallPct: Math.min(100, Math.max(0, overallPct)),
    chartData: [
      { name: "Completed", value: completed, fill: "#10b981" },
      { name: "Partial", value: partial, fill: "#f59e0b" },
      { name: "Not started", value: notStarted, fill: "#cbd5e1" },
    ].filter((d) => d.value > 0),
  };
}

export default function UploadOverviewPanel({ refreshKey = 0 }: { refreshKey?: number }) {
  const [payload, setPayload] = useState<UploadProgressPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getUploadProgress();
      if (!cancelled) setPayload(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const overview = useMemo(() => (payload ? buildOverview(payload) : null), [payload]);

  if (!overview || !payload) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Upload Overview</h2>
        <p className="mt-8 text-center text-sm text-slate-400">Loading overview…</p>
      </div>
    );
  }

  const { chartData, completed, partial, notStarted, overallPct } = overview;
  const barWidth = overallPct;
  const sliceData =
    chartData.length > 0 ? chartData : [{ name: "Not started", value: 1, fill: "#e2e8f0" }];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Upload Overview</h2>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative h-[200px] w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sliceData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={chartData.length > 1 ? 2 : 0}
                dataKey="value"
                stroke="none"
              >
                {sliceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-3xl font-bold text-slate-900">{overallPct}%</span>
            <span className="text-xs font-medium text-slate-500">Complete</span>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5 text-sm">
        <li className="flex justify-between text-slate-600">
          <span>Total categories</span>
          <span className="font-semibold text-slate-900">8</span>
        </li>
        <li className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Completed
          </span>
          <span className="font-semibold text-slate-900">{completed}</span>
        </li>
        <li className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Partial
          </span>
          <span className="font-semibold text-slate-900">{partial}</span>
        </li>
        <li className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Not started
          </span>
          <span className="font-semibold text-slate-900">{notStarted}</span>
        </li>
        <li className="flex justify-between border-t border-slate-100 pt-2 text-slate-500">
          <span>Optional</span>
          <span className="font-medium text-slate-600">Additional data</span>
        </li>
      </ul>

      <div className="mt-6">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500">
          <span>Overall progress</span>
          <span className="font-semibold text-slate-700">{overallPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <p>
          Electricity, Water, and Waste each need at least <strong>6 months</strong> of uploads before you can
          continue to summary.
        </p>
      </div>
    </div>
  );
}
