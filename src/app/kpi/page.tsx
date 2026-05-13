"use client";

import { useFetchAssessment } from "@/hooks/useFetchAssessment";
import KPICard from "@/components/kpi/KPICard";
import PageLayout from "@/components/shared/PageLayout";
import {
  evaluateEnergyIntensity,
  evaluateWaterIntensity,
  evaluateRecyclingRate,
  evaluateWasteSegregation,
  evaluateRenewableEnergy,
  evaluateTankerWaterDependency,
  evaluateWaterReuse,
  evaluatePowerFactor,
  evaluateDGDependency,
} from "@/lib/kpiUtils";

export default function KPIPage() {
  const { data, loading, error } = useFetchAssessment();

  if (!data && !loading && !error) {
    return (
      <PageLayout
        title="KPI Dashboard"
        description="Key Performance Indicators benchmarked against industry standards"
        error="No data available"
      >
        <div />
      </PageLayout>
    );
  }

  // Extract assessment data
  const annualizedValues = data?.annualizedValues || {};
  const numberOfBeds = data?.orgBeds || 100;
  const sqft = numberOfBeds * 2.5;

  // Calculate KPIs
  const electricity = annualizedValues.electricity || 0;
  const water = annualizedValues.water || 0;
  const waste = annualizedValues.waste || 0;

  // Per sqft calculations
  const energyIntensity = electricity > 0 ? electricity / sqft : null;
  const waterIntensity = water > 0 ? water / sqft : null;

  // Percentages from assessment data
  const renewablePercentage = data?.percentages?.renewableEnergy || 0;
  const waterRecyclingPercentage = data?.percentages?.waterRecycling || 0;
  const wasteRecyclingPercentage = data?.percentages?.wasteRecycling || 0;

  // Placeholder values - these need actual meter/supply data
  const powerFactor = 0.85;
  const dgDependency = 0;
  const tankerWaterDependency = 0;

  // Calculate KPI objects
  const kpis = {
    energyIntensity: evaluateEnergyIntensity(energyIntensity),
    waterIntensity: evaluateWaterIntensity(waterIntensity),
    recyclingRate: evaluateRecyclingRate(wasteRecyclingPercentage),
    wasteSegregation: evaluateWasteSegregation(wasteRecyclingPercentage),
    renewableEnergy: evaluateRenewableEnergy(renewablePercentage),
    tankerDependency: evaluateTankerWaterDependency(tankerWaterDependency),
    waterReuse: evaluateWaterReuse(waterRecyclingPercentage),
    powerFactor: evaluatePowerFactor(powerFactor),
    dgDependency: evaluateDGDependency(dgDependency),
  };

  return (
    <PageLayout
      title="KPI Dashboard"
      description="Key Performance Indicators benchmarked against industry standards"
      loading={loading}
      error={error}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        <KPICard title="Energy Intensity" kpi={kpis.energyIntensity} unit="kWh/sqft/yr" />
        <KPICard title="Water Intensity" kpi={kpis.waterIntensity} unit="KL/sqft/yr" />
        <KPICard title="Recycling Rate" kpi={kpis.recyclingRate} unit="%" />
        <KPICard title="Waste Segregation" kpi={kpis.wasteSegregation} unit="%" />
        <KPICard title="Renewable Energy" kpi={kpis.renewableEnergy} unit="%" />
        <KPICard title="Tanker Dependency" kpi={kpis.tankerDependency} unit="%" />
        <KPICard title="Water Reuse" kpi={kpis.waterReuse} unit="%" />
        <KPICard title="Power Factor" kpi={kpis.powerFactor} unit="" />
        <KPICard title="DG Dependency" kpi={kpis.dgDependency} unit="%" />
      </div>

      {/* Data Summary */}
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-2">
        <h3 className="text-xs font-semibold mb-2">Data Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          <div className="text-slate-700">
            <span className="text-slate-500">Annual Electricity:</span>
            <div className="font-semibold">{(electricity / 1000).toFixed(1)} MWh</div>
          </div>
          <div className="text-slate-700">
            <span className="text-slate-500">Annual Water:</span>
            <div className="font-semibold">{water.toFixed(0)} KL</div>
          </div>
          <div className="text-slate-700">
            <span className="text-slate-500">Annual Waste:</span>
            <div className="font-semibold">{(waste / 1000).toFixed(1)} MT</div>
          </div>
          <div className="text-slate-700">
            <span className="text-slate-500">Beds:</span>
            <div className="font-semibold">{numberOfBeds}</div>
          </div>
          <div className="text-slate-700">
            <span className="text-slate-500">Sqft:</span>
            <div className="font-semibold">{sqft.toFixed(0)}</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
