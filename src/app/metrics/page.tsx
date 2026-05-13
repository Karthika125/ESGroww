"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/components/metrics/CategoryCard";
import OverallMetricsChart from "@/components/metrics/OverallMetricsChart";
import CategoryComparisonChart from "@/components/metrics/CategoryComparisonChart";
import ConfidenceChart from "@/components/metrics/ConfidenceChart";

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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Completeness & Confidence</h1>
        <p className="text-slate-600 mb-6">Loading assessment...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Completeness & Confidence</h1>
        <p className="text-red-600">{error ?? "No data available"}</p>
      </main>
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
    <main className="max-w-7xl mx-auto px-3 py-4">
      <div className="mb-3">
        <h1 className="text-xl font-bold mb-1">Completeness & Confidence</h1>
        <p className="text-xs text-slate-600">Data completeness and confidence breakdowns.</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-3 overflow-hidden">
        <OverallMetricsChart categoryScores={categoryScores} />
        <CategoryComparisonChart
          data={categories.map((c) => ({
            name: c.title,
            score: Math.min(100, Math.max(0, c.score || 0)),
            completeness: Math.min(100, Math.max(0, months[c.monthKey] ? ((months[c.monthKey] / 12) * 100) : 0)),
          }))}
        />
        <ConfidenceChart data={categoryConfidence} />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 overflow-hidden">
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
    </main>
  );
}
