"use client";

import React from "react";
import {
  BarChart,
  CartesianGrid,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminGlassCard, AdminSectionTitle, ExportCsvButton } from "@/components/admin/admin-ui";

type Props = {
  overview: any;
  trend: any[];
  readinessChart: any[];
  certChart: any[];
  pieColors: string[];
};

export default function OverviewCharts({ overview, trend, readinessChart, certChart, pieColors }: Props) {
  const EMERALD = "#00673F";
  const SLATE = "#3d5248";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-6">
        <AdminSectionTitle
          eyebrow="Emissions"
          title="Inventory by scope"
          description="Aggregated tCO₂e from EmissionsSummary — totals reflect latest calculated engine output per organization."
        />
        <div className={adminGlassCard("min-h-[280px]")}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-[#3d5248]">
              Total platform inventory: {" "}
              <span className="font-semibold text-[#15221a]">
                {overview.emissions.totalTCO2e.toLocaleString(undefined, { maximumFractionDigits: 1 })} tCO₂e
              </span>
            </p>
            <ExportCsvButton
              filename="esgroww-emissions-by-scope.csv"
              rows={overview.emissions.byScope as unknown as Record<string, unknown>[]}
              columns={[
                { key: "scope", header: "Scope" },
                { key: "tCO2e", header: "tCO2e" },
              ]}
            />
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.emissions.byScope}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5efe9" />
                <XAxis dataKey="scope" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis tick={{ fontSize: 11, fill: SLATE }} width={44} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #d5ddd6",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="tCO2e" radius={[6, 6, 0, 0]} fill={EMERALD} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <AdminSectionTitle
          eyebrow="Ingestion"
          title="Upload batch trend (30 days)"
          description="Daily counts of DataUploadBatch commits — operational pulse of the Upload Intelligence pipeline."
        />
        <div className={adminGlassCard("min-h-[260px]")}>
          <div className="mb-2 flex justify-end">
            <ExportCsvButton
              filename="esgroww-upload-trend-30d.csv"
              rows={trend as unknown as Record<string, unknown>[]}
              columns={[
                { key: "day", header: "Day (MM-DD)" },
                { key: "batches", header: "Batches" },
              ]}
            />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5efe9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: SLATE }} />
                <YAxis allowDecimals={false} width={36} tick={{ fontSize: 10, fill: SLATE }} />
                <Tooltip />
                <Line type="monotone" dataKey="batches" stroke="#008F56" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AdminSectionTitle eyebrow="Readiness" title="Assessment stage mix" />
        <div className={adminGlassCard("min-h-[240px]")}>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={readinessChart} innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {readinessChart.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {readinessChart.length === 0 ? <p className="text-center text-xs text-[#3d5248]">No readiness stages recorded yet.</p> : null}
        </div>

        <AdminSectionTitle eyebrow="Certification" title="Status label distribution" />
        <div className={adminGlassCard("min-h-[240px]")}>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={certChart} innerRadius={44} outerRadius={70} paddingAngle={2}>
                  {certChart.map((_, i) => (
                    <Cell key={i} fill={pieColors[(i + 2) % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
