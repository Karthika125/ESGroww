"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/components/metrics/CategoryCard";
import OverallMetricsChart from "@/components/metrics/OverallMetricsChart";
import CategoryComparisonChart from "@/components/metrics/CategoryComparisonChart";
import ConfidenceChart from "@/components/metrics/ConfidenceChart";
import PageLayout from "@/components/shared/PageLayout";

type AssessmentResponse = {
  success: boolean;
  data: any;
};

export default function MetricsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/assessment")
      .then((r) => r.json())
      .then((res: AssessmentResponse) => {
        if (!mounted) return;
        if (res.success) setData(res.data);
        else setError("Failed to load assessment");
      })
      .catch((e) => {
        if (!mounted) return;
        setError(String(e));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Completeness & Confidence"
        description="Data completeness and confidence breakdowns"
        loading
      >
        <div />
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout
        title="Completeness & Confidence"
        description="Data completeness and confidence breakdowns"
        error={error ?? "No data available"}
      >
        <div />
      </PageLayout>
    );
  }

  const completeness = data.completeness;
  const confidence = (data.confidence ?? 0) * 100;
  const categoryScores = data.categoryScores || {};
  const categoryConfidence = data.categoryConfidence || [];
  const months = data.annualizedValues?.monthsUploaded || {};
  const messages = data.metadata?.messages || {};

  // Clamp values to prevent overflow
  const safeCompleteness = Math.min(100, Math.max(0, completeness || 0));
  const safeConfidence = Math.min(100, Math.max(0, confidence || 0));

  const categories = [
    {
      key: "energy",
      title: "Energy",
      score: categoryScores.energy,
      conf: categoryConfidence.find((c: any) => c.category === "Energy"),
      monthKey: "electricity",
    },
    {
      key: "water",
      title: "Water",
      score: categoryScores.water,
      conf: categoryConfidence.find((c: any) => c.category === "Water"),
      monthKey: "water",
    },
    {
      key: "waste",
      title: "Waste",
      score: categoryScores.waste,
      conf: categoryConfidence.find((c: any) => c.category === "Waste"),
      monthKey: "waste",
    },
    {
      key: "governance",
      title: "Governance",
      score: categoryScores.governance,
      conf: null,
      monthKey: "governance",
    },
  ];

  return (
    <PageLayout
      title="Completeness & Confidence"
      description="Data completeness and confidence breakdowns"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-center overflow-hidden">
          <div className="text-xs text-green-700">Completeness</div>
          <div className="text-lg font-semibold text-green-900 truncate">{Math.round(safeCompleteness)}%</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-center overflow-hidden">
          <div className="text-xs text-blue-700">Confidence</div>
          <div className="text-lg font-semibold text-blue-900 truncate">{Math.round(safeConfidence)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        <section className="xl:col-span-8 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-3 py-2.5">
            <h2 className="text-sm font-semibold text-white">Score Overview</h2>
          </div>
          <div className="p-2.5 grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-1.5 overflow-hidden">
              <OverallMetricsChart categoryScores={categoryScores} />
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-1.5 overflow-hidden">
              <CategoryComparisonChart
                data={categories.map((c) => ({
                  name: c.title,
                  score: Math.min(100, Math.max(0, c.score || 0)),
                  completeness: Math.min(100, Math.max(0, months[c.monthKey] ? ((months[c.monthKey] / 12) * 100) : 0)),
                }))}
              />
            </div>
          </div>
        </section>

        <aside className="xl:col-span-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-3 py-2.5">
            <h2 className="text-sm font-semibold text-white">Confidence</h2>
          </div>
          <div className="p-2.5 rounded-md">
            <ConfidenceChart data={categoryConfidence} />
          </div>
        </aside>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 overflow-hidden">
        {categories.map((c) => (
          <CategoryCard
            key={c.key}
            title={c.title}
            score={c.score}
            monthsUploaded={months[c.monthKey]}
            confidence={c.conf?.confidence ?? 0}
            confidenceMonths={c.conf?.months}
            message={messages[c.key]}
          />
        ))}
      </section>
    </PageLayout>
  );
}
