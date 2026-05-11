import TopNav from "@/components/TopNav";

import { getSummaryData } from "@/actions/summary.actions";

export default async function SummaryPage() {
  const data =
    await getSummaryData();

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <TopNav />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Upload Summary
          </h1>

          <p className="text-slate-500 mt-2">
            Review uploaded ESG operational
            data before generating readiness
            results.
          </p>
        </div>

        {/* HOSPITAL PROFILE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Hospital Profile
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <p className="text-sm text-slate-500">
                Hospital
              </p>

              <p className="font-semibold text-slate-900">
                {data.hospital.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Industry
              </p>

              <p className="font-semibold text-slate-900">
                {data.hospital.industry}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Beds
              </p>

              <p className="font-semibold text-slate-900">
                {data.hospital.beds}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Built-up Area
              </p>

              <p className="font-semibold text-slate-900">
                {
                  data.hospital
                    .builtUpArea
                }{" "}
                sq.ft
              </p>
            </div>
          </div>
        </div>

        {/* DATA COVERAGE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Upload Coverage
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <CoverageCard
              label="Electricity"
              value={
                data.coverage
                  .electricityMonths
              }
            />

            <CoverageCard
              label="Water"
              value={
                data.coverage
                  .waterMonths
              }
            />

            <CoverageCard
              label="Fuel"
              value={
                data.coverage
                  .fuelMonths
              }
            />

            <CoverageCard
              label="Waste"
              value={
                data.coverage
                  .wasteMonths
              }
            />

            <CoverageCard
              label="Refrigerants"
              value={
                data.coverage
                  .refrigerantMonths
              }
            />

            <CoverageCard
              label="Transport"
              value={
                data.coverage
                  .transportMonths
              }
            />
          </div>
        </div>

        {/* ESG SNAPSHOT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            ESG Operational Snapshot
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <MetricCard
              label="Electricity"
              value={`${data.totals.totalElectricity.toFixed(
                0
              )} kWh`}
            />

            <MetricCard
              label="Water"
              value={`${data.totals.totalWater.toFixed(
                0
              )} KL`}
            />

            <MetricCard
              label="Diesel"
              value={`${data.totals.totalDiesel.toFixed(
                0
              )} L`}
            />

            <MetricCard
              label="Waste"
              value={`${data.totals.totalWaste.toFixed(
                0
              )} kg`}
            />

            <MetricCard
              label="Renewable Energy"
              value={`${data.percentages.renewablePercentage}%`}
            />

            <MetricCard
              label="Water Recycling"
              value={`${data.percentages.waterRecyclePercentage}%`}
            />
          </div>
        </div>

        {/* VALIDATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Data Quality Checks
          </h2>

          <div className="space-y-4">
            {data.checks.map(
              (check, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <p className="text-slate-700">
                    {check.label}
                  </p>

                  <span
                    className={`text-sm font-semibold ${
                      check.status
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {check.status
                      ? "Available"
                      : "Insufficient"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-end">
          <a
            href="/results"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Generate ESG Results →
          </a>
        </div>
      </main>
    </div>
  );
}

/* ======================= */
/* SMALL COMPONENTS        */
/* ======================= */

function CoverageCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-2">
        {value} / 12
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-xl font-bold text-slate-900 mt-2">
        {value}
      </p>
    </div>
  );
}