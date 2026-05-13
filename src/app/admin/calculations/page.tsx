'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UploadData {
  hospitalName: string;
  category: string;
  monthsUploaded: number;
  completeness: number;
  confidenceLevel: string;
  status: string;
}

interface ValidationCheck {
  check: string;
  description: string;
  status: string;
  severity: string;
}

export default function CalculationsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/calculations');
      if (!response.ok) throw new Error('Failed to fetch calculations data');
      const data = await response.json();
      setHospitals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Complete: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      Partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      Low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Insufficient: 'bg-red-500/20 text-red-400 border-red-500/30',
      Missing: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      Error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getConfidenceBadge = (level: string) => {
    const badges: { [key: string]: string } = {
      High: 'bg-emerald-500/20 text-emerald-400',
      Medium: 'bg-amber-500/20 text-amber-400',
      Low: 'bg-orange-500/20 text-orange-400',
      Insufficient: 'bg-red-500/20 text-red-400',
    };
    return badges[level] || 'bg-slate-500/20 text-slate-400';
  };

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
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Calculations & KPI Engine</h1>
          <p className="text-slate-400 max-w-3xl">
            Comprehensive view of all data validation, annualization formulas, confidence modifiers, emissions calculations, and KPI benchmarks per organization.
          </p>
        </div>

        {/* BRD Disclaimer */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-300 font-medium mb-1">Key BRD Formulas</p>
            <ul className="text-xs text-amber-200 space-y-1">
              <li>• <strong>Annualization:</strong> (Sum of uploaded values) ÷ (Months with data) × 12</li>
              <li>• <strong>Confidence Modifier:</strong> Data confidence level applied to scores (≥3 months required)</li>
              <li>• <strong>Intensity Metrics:</strong> Annual Value ÷ Built-up Area → kWh/sqft/year or KL/sqft/year</li>
            </ul>
          </div>
        </div>

        {/* Hospital Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">Filter by Organization:</label>
          <select
            value={selectedHospital}
            onChange={e => setSelectedHospital(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="all">All Organizations</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.hospitalName}</option>
            ))}
          </select>
        </div>

        {/* SECTION A: Upload Overview Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            2A. Upload Overview & Completeness
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-emerald-500 rounded-full"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/50">
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Category</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Months Uploaded</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Completeness</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Confidence</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {hospitals.length > 0 ? (
                      hospitals.map((hospital, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-6 py-3 text-slate-200 font-medium">{hospital.category}</td>
                          <td className="px-6 py-3 text-slate-300">{hospital.months}/12</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: `${hospital.completeness}%` }}
                                ></div>
                              </div>
                              <span className="text-slate-300 text-xs">{hospital.completeness}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceBadge(hospital.confidence)}`}>
                              {hospital.confidence}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(hospital.status)}`}>
                              {hospital.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No data available yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: Validation Results */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            2B. Validation Results (6 Checks)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                check: 'Negative Value Detection',
                desc: 'Scans for kWh/KL/kg < 0',
                status: 'Pass',
              },
              {
                check: 'Missing Months Detection',
                desc: 'Identifies data gaps',
                status: 'Partial',
              },
              {
                check: 'Spike Detection',
                desc: 'Flags >100% or >70% drop',
                status: 'Pass',
              },
              {
                check: 'Duplicate Entry Check',
                desc: 'Keeps latest, flags duplicates',
                status: 'Pass',
              },
              {
                check: 'Unit Consistency',
                desc: 'Ensures kWh/MWh alignment',
                status: 'Pass',
              },
              {
                check: 'Cross-Category Consistency',
                desc: 'Renewable ≤ Total, etc.',
                status: 'Pass',
              },
            ].map((validation, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-200">{validation.check}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${validation.status === 'Pass'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : validation.status === 'Partial'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                  >
                    {validation.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{validation.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION C: KPI Benchmarks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            2D. Key Performance Indicators (KPIs)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Energy Intensity', value: '18.5', unit: 'kWh/sqft/year', benchmark: 'Within (15-22)', status: 'Good' },
              { name: 'Water Intensity', value: '0.22', unit: 'KL/sqft/year', benchmark: 'Slightly Above (0.20-0.35)', status: 'Monitor' },
              { name: 'Renewable %', value: '12.3', unit: '%', benchmark: 'Above Target (>10%)', status: 'Good' },
              { name: 'Recycling %', value: '48', unit: '%', benchmark: 'Below Target (>60%)', status: 'Action' },
              { name: 'Emissions Intensity', value: '13.3', unit: 'tCO2e/sqft', benchmark: 'Within Benchmark', status: 'Good' },
              { name: 'DG Dependency', value: '2.1', unit: '% of hours', benchmark: 'Low (<5%)', status: 'Good' },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-lg border border-slate-700/50 p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{kpi.name}</p>
                <p className="text-3xl font-bold text-slate-100 mb-1">{kpi.value}</p>
                <p className="text-xs text-slate-500 mb-3">{kpi.unit}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-xs text-slate-400">{kpi.benchmark}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${kpi.status === 'Good'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : kpi.status === 'Monitor'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                  >
                    {kpi.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E: Emissions Summary */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">2E. Emissions Summary by Scope</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                scope: 'Scope 1 (Direct)',
                tco2e: '45.2',
                color: 'emerald',
                sources: ['Diesel: 32.1', 'PNG/CNG: 8.5', 'Refrigerant: 4.6'],
              },
              {
                scope: 'Scope 2 (Electricity)',
                tco2e: '127.8',
                color: 'cyan',
                sources: ['Grid: 98.2', 'Renewable offset: -29.4'],
              },
              {
                scope: 'Scope 3 (Indirect)',
                tco2e: '18.4',
                color: 'amber',
                sources: ['Waste: 12.1', 'Wastewater: 6.3'],
              },
            ].map((scope, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                <h3 className="font-semibold text-slate-200 mb-4">{scope.scope}</h3>
                <p className="text-4xl font-bold text-slate-100 mb-1">{scope.tco2e}</p>
                <p className="text-xs text-slate-500 mb-6">tCO₂e</p>
                <div className="space-y-2 text-xs">
                  {scope.sources.map((source, i) => (
                    <div key={i} className="flex justify-between text-slate-400">
                      <span>{source.split(':')[0]}</span>
                      <span className="font-medium">{source.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
            <h3 className="font-semibold text-slate-200 mb-2">Total Emissions</h3>
            <p className="text-4xl font-bold text-slate-100 mb-2">191.4 tCO₂e</p>
            <p className="text-sm text-slate-400">Scope 1 + Scope 2 + Scope 3 = Annual Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
    

  {/* Emission Factors */ }
  < section className = "bg-white border border-slate-200 rounded-2xl p-6" >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Emission Factors
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3">
                    Parameter
                  </th>

                  <th className="text-left px-4 py-3">
                    Factor
                  </th>

                  <th className="text-left px-4 py-3">
                    Unit
                  </th>

                  <th className="text-left px-4 py-3">
                    Usage
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <FactorRow
                  parameter="Grid Electricity"
                  factor="0.708"
                  unit="kgCO₂ / kWh"
                  usage="Scope 2 Emissions"
                />

                <FactorRow
                  parameter="Diesel"
                  factor="2.68"
                  unit="kgCO₂ / litre"
                  usage="DG Emissions"
                />

                <FactorRow
                  parameter="Transport Fuel"
                  factor="2.31"
                  unit="kgCO₂ / litre"
                  usage="Ambulance Emissions"
                />

                <FactorRow
                  parameter="R134a"
                  factor="1430"
                  unit="GWP"
                  usage="Refrigerant Leakage"
                />
              </tbody>
            </table>
          </div>
        </section >

  {/* ESG KPI FORMULAS */ }
  < section className = "bg-white border border-slate-200 rounded-2xl p-6 space-y-8" >
          <h2 className="text-2xl font-semibold text-slate-900">
            ESG KPI Formulas
          </h2>

          <div className="space-y-8">
            <FormulaBlock
              title="Renewable Energy Percentage"
              formula="(Renewable Electricity ÷ Total Electricity) × 100"
            />

            <FormulaBlock
              title="Water Recycling Percentage"
              formula="(Recycled Water ÷ Total Water Consumption) × 100"
            />

            <FormulaBlock
              title="Waste Diversion Percentage"
              formula="(Recyclable Waste ÷ Total Waste Generated) × 100"
            />

            <FormulaBlock
              title="Energy Intensity per Bed"
              formula="Total Electricity Consumption ÷ Number of Beds"
            />

            <FormulaBlock
              title="Water Intensity per Bed"
              formula="Total Water Consumption ÷ Number of Beds"
            />
          </div>
        </section >

  {/* ESG READINESS ENGINE */ }
  < section className = "bg-white border border-slate-200 rounded-2xl p-6" >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            ESG Readiness Scoring Logic
          </h2>

          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <h3 className="font-semibold text-slate-900 mb-3">
                Environmental Readiness
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Calculated using renewable energy usage,
                emissions intensity, water recycling
                efficiency, and waste diversion metrics.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <h3 className="font-semibold text-slate-900 mb-3">
                Governance Readiness
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Determined using ESG policy availability,
                audit reports, sustainability committees,
                and compliance documentation.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <h3 className="font-semibold text-slate-900 mb-3">
                Certification Intelligence
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                ESGroww maps uploaded operational data
                against NABH, ISO 14001, and IGBC
                Healthcare readiness indicators.
              </p>
            </div>
          </div>
        </section >

  {/* Certification Mapping */ }
  < section className = "bg-white border border-slate-200 rounded-2xl p-6" >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Certification Mapping
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CertificationCard
              title="NABH"
              desc="Hospital governance and healthcare operational compliance."
            />

            <CertificationCard
              title="ISO 14001"
              desc="Environmental management system readiness."
            />

            <CertificationCard
              title="IGBC Healthcare"
              desc="Green healthcare infrastructure sustainability."
            />
          </div>
        </section >
      


/* ================================= */
/* SMALL COMPONENTS                  */
/* ================================= */

function FactorRow({
  parameter,
  factor,
  unit,
  usage,
}: {
  parameter: string;
  factor: string;
  unit: string;
  usage: string;
}) {
  return (
    <tr>
      <td className="px-4 py-4 font-medium text-slate-900">
        {parameter}
      </td>

      <td className="px-4 py-4 text-emerald-700 font-semibold">
        {factor}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {unit}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {usage}
      </td>
    </tr>
  );
}

function FormulaBlock({
  title,
  formula,
}: {
  title: string;
  formula: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5">
      <h3 className="font-semibold text-slate-900 mb-3">
        {title}
      </h3>

      <div className="bg-slate-100 rounded-lg px-4 py-3 text-slate-800 font-mono text-sm">
        {formula}
      </div>
    </div>
  );
}

function CertificationCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="text-slate-600 text-sm mt-3 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}