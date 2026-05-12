import TopNav from "@/components/TopNav";

export default function RiskAnalysisPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            ESG Risk Analysis
          </h1>

          <p className="text-slate-500 mt-2">
            AI-assisted sustainability risk monitoring
            and operational ESG intelligence for hospitals.
          </p>
        </div>

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