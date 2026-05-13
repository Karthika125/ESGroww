'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SystemConfigPage() {
  const benchmarks = [
    {
      sector: 'Hospital',
      metric: 'Energy Intensity',
      unit: 'kWh/sqft/year',
      efficient: '<15.0',
      acceptable: '15.0–22.0',
      attention: '>22.0',
    },
    {
      sector: 'Hospital',
      metric: 'Water Intensity',
      unit: 'KL/sqft/year',
      efficient: '<0.20',
      acceptable: '0.20–0.35',
      attention: '>0.35',
    },
    {
      sector: 'Building',
      metric: 'Energy Intensity',
      unit: 'kWh/sqft/year',
      efficient: '<10.0',
      acceptable: '10.0–18.0',
      attention: '>18.0',
    },
  ];

  const emissionFactors = [
    { source: 'Diesel', region: 'India', factor: '2.68', unit: 'kgCO₂e/L', override: 'Yes' },
    { source: 'PNG/CNG', region: 'India', factor: '2.04', unit: 'kgCO₂e/kg', override: 'Yes' },
    { source: 'Electricity', region: 'India', factor: '0.72', unit: 'kgCO₂e/kWh', override: 'Yes' },
    { source: 'Waste to Landfill', region: 'India', factor: '0.46', unit: 'kgCO₂e/kg', override: 'No' },
    { source: 'Wastewater', region: 'India', factor: '0.71', unit: 'kgCO₂e/KL', override: 'No' },
  ];

  const confidenceThresholds = [
    { months: '12', label: 'High', modifier: '1.00' },
    { months: '9–11', label: 'High', modifier: '0.95' },
    { months: '6–8', label: 'Medium', modifier: '0.85' },
    { months: '3–5', label: 'Low', modifier: '0.70' },
    { months: '1–2', label: 'Insufficient', modifier: 'N/A' },
    { months: '0', label: 'Missing', modifier: '0.00' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">System Configuration</h1>
          <p className="text-slate-400">
            Master data: Benchmarks, emission factors, confidence thresholds, and certification applicability rules
          </p>
        </div>

        {/* Benchmarks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Benchmark Master Data</h2>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Sector</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Metric</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Unit</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Efficient</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Acceptable</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Needs Attention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {benchmarks.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3 text-slate-200 font-medium">{b.sector}</td>
                      <td className="px-6 py-3 text-slate-300">{b.metric}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs">{b.unit}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                          {b.efficient}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-400">
                          {b.acceptable}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400">
                          {b.attention}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Emission Factors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Emission Conversion Factors</h2>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Source</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Region</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Factor</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Unit</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Overrideable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {emissionFactors.map((factor, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3 text-slate-200 font-medium">{factor.source}</td>
                      <td className="px-6 py-3 text-slate-300">{factor.region}</td>
                      <td className="px-6 py-3 text-slate-300 font-mono">{factor.factor}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs">{factor.unit}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            factor.override === 'Yes'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {factor.override}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Confidence Thresholds */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Confidence Modifiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confidenceThresholds.map((ct, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Months Uploaded</p>
                <p className="text-2xl font-bold text-slate-100 mb-3">{ct.months}</p>
                <div className="flex items-end justify-between pt-3 border-t border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Confidence</p>
                    <p className="text-sm font-semibold text-slate-200">{ct.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Modifier</p>
                    <p className="text-lg font-bold text-emerald-400">{ct.modifier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
