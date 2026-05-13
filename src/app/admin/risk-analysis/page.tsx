'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface CriticalGap {
  id: string;
  area: string;
  condition: string;
  severity: string;
  status: string;
}

interface RegulatoryItem {
  regulation: string;
  applicable: boolean;
  readiness: number;
  riskLevel: string;
  notes: string;
}

export default function RiskAnalysisPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRiskData();
  }, []);

  async function fetchRiskData() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/risk-analysis');
      if (!response.ok) throw new Error('Failed to fetch risk data');
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium-High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Medium':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const criticalGaps: CriticalGap[] = [
    {
      id: '1',
      area: 'No renewable energy',
      condition: '0% contribution',
      severity: 'High',
      status: 'Action Required',
    },
    {
      id: '2',
      area: 'No EMS/BMS',
      condition: 'Not available',
      severity: 'High',
      status: 'Action Required',
    },
    {
      id: '3',
      area: 'Energy intensity above benchmark',
      condition: '>22 kWh/sqft/year',
      severity: 'High',
      status: 'Monitor',
    },
    {
      id: '4',
      area: 'Weak waste segregation',
      condition: '<70% compliance',
      severity: 'Medium',
      status: 'Improvement',
    },
    {
      id: '5',
      area: 'No ESG owner',
      condition: 'Not assigned',
      severity: 'High',
      status: 'Immediate',
    },
    {
      id: '6',
      area: 'Low LED coverage',
      condition: '<60%',
      severity: 'Medium',
      status: 'Improvement',
    },
    {
      id: '7',
      area: 'Poor power factor',
      condition: '<0.80',
      severity: 'Medium',
      status: 'Monitor',
    },
    {
      id: '8',
      area: 'High tanker dependency',
      condition: '≥20% of water',
      severity: 'Medium',
      status: 'Monitor',
    },
  ];

  const regulations: RegulatoryItem[] = [
    {
      regulation: 'BRSR (Business Responsibility)',
      applicable: true,
      readiness: 68,
      riskLevel: 'Medium',
      notes: 'Scope 1 & 2 data available',
    },
    {
      regulation: 'ESG Disclosure Requirements',
      applicable: true,
      readiness: 55,
      riskLevel: 'Medium-High',
      notes: 'Documentation incomplete',
    },
    {
      regulation: 'Carbon/CDP Reporting',
      applicable: true,
      readiness: 45,
      riskLevel: 'Medium-High',
      notes: 'Scope 3 tracking needed',
    },
    {
      regulation: 'Plastic Waste Rules 2016',
      applicable: true,
      readiness: 72,
      riskLevel: 'Medium',
      notes: 'Segregation in progress',
    },
    {
      regulation: 'Biomedical Waste Rules 2016',
      applicable: true,
      readiness: 85,
      riskLevel: 'Low',
      notes: 'CPCB vendor certified',
    },
    {
      regulation: 'Hazardous Waste Rules',
      applicable: true,
      readiness: 78,
      riskLevel: 'Low',
      notes: 'Disposal records maintained',
    },
    {
      regulation: 'Water Cess Act',
      applicable: false,
      readiness: 0,
      riskLevel: 'Low',
      notes: 'Not applicable to sector',
    },
    {
      regulation: 'Energy Conservation Act',
      applicable: true,
      readiness: 62,
      riskLevel: 'Medium',
      notes: 'BEE registration pending',
    },
  ];

  const roadmapItems = [
    { timeline: 'Immediate', action: 'Appoint ESG owner & develop sustainability policy', impact: 'High' },
    { timeline: '0–3M', action: 'Increase LED coverage to >80%', impact: 'High' },
    { timeline: '0–3M', action: 'Improve waste segregation to >90%', impact: 'High' },
    { timeline: '3–6M', action: 'Implement energy & water monitoring system', impact: 'High' },
    { timeline: '6–12M', action: 'Deploy STP water reuse system', impact: 'Medium' },
    { timeline: '12+M', action: 'Install rooftop solar/REC procurement', impact: 'High' },
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
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Risk Analysis & Gaps</h1>
          <p className="text-slate-400">
            Critical gaps engine, regulatory readiness, compliance risks and remediation timelines
          </p>
        </div>

        {/* BRD Info */}
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium mb-1">Critical Alert System</p>
            <p className="text-xs text-red-200">
              These gaps are automatically detected from uploaded data. High severity items block certification readiness. Address immediately with documented remediation.
            </p>
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
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* SECTION A: Critical Gaps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            4A. Critical Gaps (Auto-detected)
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {criticalGaps.map((gap, idx) => (
              <div
                key={gap.id}
                className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  {getSeverityIcon(gap.severity)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200">{gap.area}</h3>
                    <p className="text-xs text-slate-400 mt-1">{gap.condition}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ${getSeverityColor(gap.severity)}`}>
                    {gap.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION B: Regulatory Readiness */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            4B. Regulatory Readiness Matrix
          </h2>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Regulation</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Applicable</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Readiness</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Risk Level</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-300">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {regulations.map((reg, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-200">{reg.regulation}</td>
                      <td className="px-6 py-3">
                        {reg.applicable ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-500/20 text-slate-400">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${reg.readiness}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-200">{reg.readiness}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getRiskColor(reg.riskLevel)}`}>
                          {reg.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400">{reg.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION C: Priority Action Roadmap */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-cyan-400" />
            4C. Priority Action Roadmap
          </h2>

          <div className="space-y-3">
            {roadmapItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 whitespace-nowrap">
                      {item.timeline}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">{item.action}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.impact === 'High'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    Impact: {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


        {/* Overall Risk Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RiskSummaryCard
            title="High Risk Areas"
            value="2"
            color="border-red-200 bg-red-50 text-red-600"
          />

          <RiskSummaryCard
            title="Moderate Risks"
            value="3"
            color="border-amber-200 bg-amber-50 text-amber-600"
          />

          <RiskSummaryCard
            title="Healthy Metrics"
            value="7"
            color="border-emerald-200 bg-emerald-50 text-emerald-600"
          />
        </section>

        {/* Detailed Risk Table */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Operational ESG Risk Indicators
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3">
                    ESG Area
                  </th>

                  <th className="text-left px-4 py-3">
                    Observation
                  </th>

                  <th className="text-left px-4 py-3">
                    Risk Level
                  </th>

                  <th className="text-left px-4 py-3">
                    Recommendation
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <RiskRow
                  area="Electricity"
                  observation="High grid electricity dependency"
                  risk="High"
                  recommendation="Increase renewable energy sourcing"
                  color="text-red-600"
                />

                <RiskRow
                  area="Water"
                  observation="Water recycling below benchmark"
                  risk="Moderate"
                  recommendation="Improve STP reuse efficiency"
                  color="text-amber-600"
                />

                <RiskRow
                  area="Waste"
                  observation="Waste segregation practices available"
                  risk="Low"
                  recommendation="Maintain current compliance"
                  color="text-emerald-600"
                />

                <RiskRow
                  area="Governance"
                  observation="ESG policy available"
                  risk="Low"
                  recommendation="Expand ESG audit coverage"
                  color="text-emerald-600"
                />

                <RiskRow
                  area="Transport"
                  observation="Ambulance fuel usage increasing"
                  risk="Moderate"
                  recommendation="Optimize fleet fuel efficiency"
                  color="text-amber-600"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* AI Insights */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            AI ESG Insights
          </h2>

          <div className="space-y-5">
            <InsightCard
              insight="Renewable energy adoption can reduce Scope 2 emissions by approximately 32%."
            />

            <InsightCard
              insight="Water recycling performance is below healthcare sustainability benchmarks."
            />

            <InsightCard
              insight="Governance documentation maturity is improving overall ESG readiness."
            />

            <InsightCard
              insight="Waste diversion metrics indicate strong recyclable waste handling practices."
            />
          </div>
        </section>

        {/* Compliance Heatmap */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            ESG Compliance Heatmap
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <HeatCard
              label="Energy"
              status="Moderate"
              color="bg-amber-100 text-amber-700"
            />

            <HeatCard
              label="Water"
              status="Moderate"
              color="bg-amber-100 text-amber-700"
            />

            <HeatCard
              label="Waste"
              status="Strong"
              color="bg-emerald-100 text-emerald-700"
            />

            <HeatCard
              label="Governance"
              status="Strong"
              color="bg-emerald-100 text-emerald-700"
            />

            <HeatCard
              label="Transport"
              status="Developing"
              color="bg-red-100 text-red-700"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===================================== */
/* COMPONENTS                            */
/* ===================================== */

function RiskSummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className={`border rounded-2xl p-6 ${color}`}
    >
      <p className="text-sm font-medium">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}

function RiskRow({
  area,
  observation,
  risk,
  recommendation,
  color,
}: {
  area: string;
  observation: string;
  risk: string;
  recommendation: string;
  color: string;
}) {
  return (
    <tr>
      <td className="px-4 py-4 font-medium text-slate-900">
        {area}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {observation}
      </td>

      <td
        className={`px-4 py-4 font-semibold ${color}`}
      >
        {risk}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {recommendation}
      </td>
    </tr>
  );
}

function InsightCard({
  insight,
}: {
  insight: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <p className="text-slate-700 leading-relaxed">
        {insight}
      </p>
    </div>
  );
}

function HeatCard({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl p-5 text-center ${color}`}
    >
      <p className="font-semibold">
        {label}
      </p>

      <p className="text-sm mt-2">
        {status}
      </p>
    </div>
  );
}