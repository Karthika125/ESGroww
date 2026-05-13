"use client";

import React from "react";
import { useFetchAssessment } from "@/hooks/useFetchAssessment";
import { Zap, Droplets, Leaf, RotateCcw } from "lucide-react";
import PageLayout from "@/components/shared/PageLayout";
import BenchmarkComparisonSection from "@/components/shared/BenchmarkComparisonSection";
import GenericBarChart from "@/components/charts/GenericBarChart";

export default function AnalysisPage() {
  const { data, loading, error } = useFetchAssessment();

  if (!data && !loading && !error) {
    return (
      <PageLayout
        title="Metrics Analysis & Benchmark Comparison"
        description="Detailed comparison of key ESG metrics against hospital industry benchmarks"
        error="No data available"
      >
        <div />
      </PageLayout>
    );
  }

  // Calculate metrics
  const numberOfBeds = data?.orgBeds || 100;
  const sqft = numberOfBeds * 2.5;
  const electricity = data?.annualizedValues?.electricity || 0;
  const water = data?.annualizedValues?.water || 0;

  const energyIntensity = electricity > 0 ? electricity / sqft : 0;
  const waterIntensity = water > 0 ? water / sqft : 0;
  const renewableEnergy = data?.percentages?.renewableEnergy || 0;
  const recyclingRate = data?.percentages?.wasteRecycling || 0;

  // Benchmark ranges for display
  const energyBenchmarks = [
    { min: 0, max: 15, label: "Efficient (<15)", color: "green" as const },
    { min: 15, max: 22, label: "Acceptable (15-22)", color: "amber" as const },
    { min: 22, label: "Needs Attention (>22)", color: "orange" as const },
  ];

  const waterBenchmarks = [
    { min: 0, max: 0.2, label: "Efficient (<0.20)", color: "green" as const },
    { min: 0.2, max: 0.35, label: "Acceptable (0.20-0.35)", color: "amber" as const },
    { min: 0.35, label: "Needs Attention (>0.35)", color: "orange" as const },
  ];

  const renewableBenchmarks = [
    { min: 10, label: "Efficient (≥10%)", color: "green" as const },
    { min: 1, max: 10, label: "Acceptable (1-9%)", color: "amber" as const },
    { min: 0, max: 1, label: "Needs Attention (0%)", color: "orange" as const },
  ];

  const recyclingBenchmarks = [
    { min: 60, label: "Efficient (≥60%)", color: "green" as const },
    { min: 40, max: 60, label: "Acceptable (40-59%)", color: "amber" as const },
    { min: 0, max: 40, label: "Needs Attention (<40%)", color: "orange" as const },
  ];

  // Prepare chart data
  const energyComparisonData = [
    {
      name: "Energy Intensity",
      current: Math.min(energyIntensity, 35),
      efficient: 15,
      acceptable: 22,
    },
  ];

  const waterComparisonData = [
    {
      name: "Water Intensity",
      current: Math.min(waterIntensity, 0.5),
      efficient: 0.2,
      acceptable: 0.35,
    },
  ];

  const renewableComparisonData = [
    { name: "Renewable Energy", current: renewableEnergy, benchmark: 10 },
  ];

  const recyclingComparisonData = [
    { name: "Recycling Rate", current: recyclingRate, benchmark: 60 },
  ];

  // Status helpers
  const getEnergyStatus = () => {
    if (energyIntensity < 15) return "good";
    if (energyIntensity <= 22) return "acceptable";
    return "warning";
  };

  const getWaterStatus = () => {
    if (waterIntensity < 0.2) return "good";
    if (waterIntensity <= 0.35) return "acceptable";
    return "warning";
  };

  const getRenewableStatus = () => {
    if (renewableEnergy >= 10) return "good";
    if (renewableEnergy >= 1) return "acceptable";
    return "warning";
  };

  const getRecyclingStatus = () => {
    if (recyclingRate >= 60) return "good";
    if (recyclingRate >= 40) return "acceptable";
    return "warning";
  };

  return (
    <PageLayout
      title="Metrics Analysis & Benchmark Comparison"
      description="Detailed comparison of key ESG metrics against hospital industry benchmarks"
      loading={loading}
      error={error}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Intensity Section */}
        <BenchmarkComparisonSection
          title="Energy Intensity"
          icon={Zap}
          currentValue={energyIntensity}
          unit="kWh/sqft/year"
          benchmarkRanges={energyBenchmarks}
        >
          <GenericBarChart
            data={energyComparisonData}
            dataKeys={[
              { key: "current", label: "Current", color: "#f59e0b" },
              { key: "efficient", label: "Efficient Threshold", color: "#10b981" },
              { key: "acceptable", label: "Acceptable Ceiling", color: "#8b5cf6" },
            ]}
            xAxisKey="name"
            yAxisLabel="kWh/sqft/year"
            valueFormatter={(value) => `${value.toFixed(2)}`}
          />
        </BenchmarkComparisonSection>

        {/* Water Intensity Section */}
        <BenchmarkComparisonSection
          title="Water Intensity"
          icon={Droplets}
          currentValue={waterIntensity}
          unit="KL/sqft/year"
          benchmarkRanges={waterBenchmarks}
        >
          <GenericBarChart
            data={waterComparisonData}
            dataKeys={[
              { key: "current", label: "Current", color: "#3b82f6" },
              { key: "efficient", label: "Efficient Threshold", color: "#10b981" },
              { key: "acceptable", label: "Acceptable Ceiling", color: "#8b5cf6" },
            ]}
            xAxisKey="name"
            yAxisLabel="KL/sqft/year"
            valueFormatter={(value) => `${value.toFixed(3)}`}
          />
        </BenchmarkComparisonSection>

        {/* Renewable Energy Section */}
        <BenchmarkComparisonSection
          title="Renewable Energy %"
          icon={Leaf}
          currentValue={renewableEnergy}
          unit="% of total energy"
          benchmarkRanges={renewableBenchmarks}
        >
          <GenericBarChart
            data={renewableComparisonData}
            dataKeys={[
              { key: "current", label: "Current %", color: "#10b981" },
              { key: "benchmark", label: "Efficient Benchmark", color: "#8b5cf6" },
            ]}
            xAxisKey="name"
            yAxisLabel="Percentage (%)"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </BenchmarkComparisonSection>

        {/* Recycling Rate Section */}
        <BenchmarkComparisonSection
          title="Recycling Rate %"
          icon={RotateCcw}
          currentValue={recyclingRate}
          unit="% of waste recycled"
          benchmarkRanges={recyclingBenchmarks}
        >
          <GenericBarChart
            data={recyclingComparisonData}
            dataKeys={[
              { key: "current", label: "Current %", color: "#a855f7" },
              { key: "benchmark", label: "Efficient Benchmark", color: "#10b981" },
            ]}
            xAxisKey="name"
            yAxisLabel="Percentage (%)"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </BenchmarkComparisonSection>
      </div>

      {/* Summary Section */}
      <div className="mt-4 border rounded-lg p-4 bg-slate-50">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-gray-600">Energy Intensity</div>
            <div className="font-bold text-sm mt-1">{energyIntensity.toFixed(2)} kWh/sqft/yr</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-gray-600">Water Intensity</div>
            <div className="font-bold text-sm mt-1">{waterIntensity.toFixed(3)} KL/sqft/yr</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-gray-600">Renewable Energy</div>
            <div className="font-bold text-sm mt-1">{renewableEnergy.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded p-2 border border-gray-200">
            <div className="text-gray-600">Recycling Rate</div>
            <div className="font-bold text-sm mt-1">{recyclingRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
