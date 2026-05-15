"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dynamic from "next/dynamic";
const Activity = dynamic(() => import("lucide-react").then((m) => m.Activity), { ssr: false, loading: () => null });
const Building2 = dynamic(() => import("lucide-react").then((m) => m.Building2), { ssr: false, loading: () => null });
const ClipboardCheck = dynamic(() => import("lucide-react").then((m) => m.ClipboardCheck), { ssr: false, loading: () => null });
const ShieldAlert = dynamic(() => import("lucide-react").then((m) => m.ShieldAlert), { ssr: false, loading: () => null });
const Upload = dynamic(() => import("lucide-react").then((m) => m.Upload), { ssr: false, loading: () => null });
import { adminGlassCard, AdminEmpty, AdminSectionTitle, ExportCsvButton } from "@/components/admin/admin-ui";
import dynamic from "next/dynamic";

const OverviewCharts = dynamic(() => import("@/components/admin/OverviewCharts"), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse rounded bg-white/5" />,
});
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const EMERALD = "#00673F";
const GREEN = "#008F56";
const MINT = "#00A86B";
const AMBER = "#b8860b";
const SLATE = "#3d5248";

type Overview = {
  kpis: {
    organizations: number;
    activeAssessments: number;
    pendingValidations: number;
    failedUploadValidations: number;
    dataUploadBatches30d: number;
    totalUploads: number;
    assessmentsRun: number;
    organizationsBelowReadinessData: number;
    brdReadinessMonthGate: number;
  };
  readinessDistribution: { stage: string; count: number }[];
  certificationDistribution: { statusLabel: string; count: number }[];
  emissions: { byScope: { scope: string; tCO2e: number }[]; totalTCO2e: number };
  uploadTrend: { day: string; count: number }[];
  validationAnomalies: {
    id: string;
    createdAt: string;
    hospitalName: string;
    category: string;
    checkType: string;
    status: string;
    notes: string | null;
  }[];
  recentReports: {
    id: string;
    createdAt: string;
    hospitalName: string;
    completenessPct: number | null;
    confidenceScore: number | null;
    readinessStage: string | null;
  }[];
};

type Activity = {
  items: {
    id: string;
    ts: string;
    kind: string;
    title: string;
    detail: string;
    severity: string;
  }[];
};

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [o, a] = await Promise.all([
          fetch("/api/admin/overview").then((r) => r.json()),
          fetch("/api/admin/activity").then((r) => r.json()),
        ]);
        if (!cancelled) {
          if (o.error) setError(o.error);
          else {
            setOverview(o);
            setError(null);
          }
          if (!a.error) setActivity(a);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#d5ddd6] border-t-[#00673F]" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <AdminEmpty
        title="Unable to load executive dashboard"
        body={error ?? "The intelligence service did not return data. Verify DATABASE_URL and Prisma migrations, then retry."}
      />
    );
  }

  const { kpis } = overview;
  const kpiCards = [
    {
      label: "Organizations",
      value: kpis.organizations,
      sub: "Registered on platform",
      icon: Building2,
      tone: EMERALD,
    },
    {
      label: "Active assessments",
      value: kpis.activeAssessments,
      sub: "Snapshots with partial completeness",
      icon: ClipboardCheck,
      tone: GREEN,
    },
    {
      label: "Pending validations",
      value: kpis.pendingValidations,
      sub: "Partial / fail checks open",
      icon: ShieldAlert,
      tone: AMBER,
    },
    {
      label: "Failed validations",
      value: kpis.failedUploadValidations,
      sub: "BRD checks marked fail",
      icon: ShieldAlert,
      tone: "#c53030",
    },
    {
      label: "Upload batches (30d)",
      value: kpis.dataUploadBatches30d,
      sub: "Enterprise ingestion events",
      icon: Upload,
      tone: MINT,
    },
    {
      label: "Organizations below data gate",
      value: kpis.organizationsBelowReadinessData,
      sub: `Missing any of mandatory categories or empty series (BRD ≥${kpis.brdReadinessMonthGate} mo gate for readiness)`,
      icon: Activity,
      tone: SLATE,
    },
  ];

  const readinessChart = overview.readinessDistribution.map((r) => ({
    name: r.stage,
    value: r.count,
  }));

  const certChart = overview.certificationDistribution.map((c) => ({
    name: c.statusLabel,
    value: c.count,
  }));

  const trend = overview.uploadTrend.map((t) => ({
    day: t.day.slice(5, 10),
    batches: t.count,
  }));

  const pieColors = [EMERALD, GREEN, MINT, AMBER, "#004d7c", "#7c6bb5"];

  const reportRows = overview.recentReports.map((r) => ({
    id: r.id,
    hospitalName: r.hospitalName,
    createdAt: new Date(r.createdAt).toLocaleString(),
    completenessPct: r.completenessPct ?? "",
    confidenceScore: r.confidenceScore ?? "",
    readinessStage: r.readinessStage ?? "",
  }));

  return (
    <div className="space-y-10 pb-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d5248]/80">Control center</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#15221a]">Executive ESG overview</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#3d5248]">
          Investor-grade snapshot across organizations, ingestion health, validation posture, certification distribution,
          and emissions inventory — sourced live from PostgreSQL via Prisma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((k) => (
          <div key={k.label} className={adminGlassCard("min-h-[120px]")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]/80">{k.label}</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-[#15221a]">{k.value}</p>
                <p className="mt-2 text-xs leading-snug text-[#3d5248]">{k.sub}</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 ring-1 ring-[#00673F]/10"
                style={{ color: k.tone }}
              >
                <k.icon className="h-5 w-5" aria-hidden />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lazy-load heavy chart visuals */}
      <OverviewCharts
        overview={overview}
        trend={trend}
        readinessChart={readinessChart}
        certChart={certChart}
        pieColors={pieColors}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <AdminSectionTitle
            eyebrow="Validation"
            title="Recent anomalies"
            description="Latest ValidationResult records — severity follows BRD check types and pass/partial/fail outcomes."
          />
          <div className={adminGlassCard("p-0")}>
            <Table>
              <TableHeader className="sticky top-0 z-[1] bg-white/95 backdrop-blur">
                <TableRow className="border-[#d5ddd6] hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">
                    Organization
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Check</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.validationAnomalies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-[#3d5248]">
                      No validation anomalies on file — ingestion is clean or engine has not yet persisted checks.
                    </TableCell>
                  </TableRow>
                ) : (
                  overview.validationAnomalies.map((v) => (
                    <TableRow key={v.id} className="border-[#eceee8]">
                      <TableCell className="max-w-[140px] truncate text-xs font-medium text-[#15221a]">
                        {v.hospitalName}
                      </TableCell>
                      <TableCell className="text-xs text-[#3d5248]">
                        <span className="block font-medium text-[#15221a]">{v.checkType.replace(/_/g, " ")}</span>
                        <span className="text-[11px] text-[#3d5248]/80">{v.category}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={v.status === "Fail" ? "destructive" : "secondary"}
                          className="text-[10px] font-semibold uppercase"
                        >
                          {v.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <AdminSectionTitle
            eyebrow="Activity"
            title="Live operations feed"
            description="Merged stream of ingestion batches, uploads, assessments, and validation signals."
          />
          <div className={adminGlassCard("max-h-[360px] overflow-y-auto p-3")}>
            {!activity?.items?.length ? (
              <p className="text-sm text-[#3d5248]">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {activity.items.map((it) => (
                  <li
                    key={it.id}
                    className="rounded-lg border border-[#eceee8] bg-white/60 px-3 py-2 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#15221a]">{it.title}</span>
                      <span className="shrink-0 text-[10px] text-[#3d5248]/70">
                        {new Date(it.ts).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-[#3d5248]">{it.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div>
        <AdminSectionTitle
          eyebrow="Reporting"
          title="Recent assessment reports"
          description="AssessmentHistory snapshots — completeness and confidence propagate from the BRD engines."
        />
        <div className={adminGlassCard("p-0")}>
          <div className="flex items-center justify-end border-b border-[#eceee8] px-3 py-2">
            <ExportCsvButton
              filename="esgroww-recent-reports.csv"
              rows={reportRows as Record<string, unknown>[]}
              columns={[
                { key: "hospitalName", header: "Organization" },
                { key: "createdAt", header: "Generated" },
                { key: "completenessPct", header: "Completeness %" },
                { key: "confidenceScore", header: "Confidence" },
                { key: "readinessStage", header: "Stage" },
              ]}
            />
          </div>
          <Table>
            <TableHeader className="sticky top-0 z-[1] bg-white/95 backdrop-blur">
              <TableRow className="border-[#d5ddd6] hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">
                  Organization
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Generated</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Completeness</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Confidence</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-[#3d5248]">Stage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview.recentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8">
                    <AdminEmpty
                      title="No assessment reports yet"
                      body="Run assessments from the hospital workspace to populate AssessmentHistory. Reports will appear here for audit and disclosure workflows."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                overview.recentReports.map((r) => (
                  <TableRow key={r.id} className="border-[#eceee8]">
                    <TableCell className="text-xs font-medium text-[#15221a]">{r.hospitalName}</TableCell>
                    <TableCell className="text-xs text-[#3d5248]">{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-xs tabular-nums text-[#3d5248]">
                      {r.completenessPct != null ? `${Math.round(r.completenessPct)}%` : "—"}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-[#3d5248]">
                      {r.confidenceScore != null ? r.confidenceScore.toFixed(2) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-[#3d5248]">{r.readinessStage ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-[#3d5248]/90">
        SAM Assessment Application provides indicative sustainability and certification readiness intelligence. This
        console does not replace statutory audits, accredited certification reviews, or legal compliance advice.
      </p>
    </div>
  );
}
