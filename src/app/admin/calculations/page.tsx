import TopNav from "@/components/TopNav";

export default function CalculationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            ESG Calculations Engine
          </h1>

          <p className="text-slate-500 mt-2">
            Transparent emission factors,
            scoring logic, KPI calculations,
            and certification intelligence
            used in ESGroww.
          </p>
        </div>

        {/* Emission Factors */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
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
        </section>

        {/* ESG KPI FORMULAS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-8">
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
        </section>

        {/* ESG READINESS ENGINE */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
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
        </section>

        {/* Certification Mapping */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
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
        </section>
      </main>
    </div>
  );
}

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