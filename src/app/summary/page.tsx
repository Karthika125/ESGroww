import { getSummaryData } from "@/actions/summary.actions";

type DriverType =
  | "positive"
  | "negative";

export default async function SummaryPage() {
  const data = await getSummaryData();

  /* ========================= */
  /* CALCULATIONS              */
  /* ========================= */

  const totalEmissions =
    data.totals.totalElectricity * 0.82 +
    data.totals.totalDiesel * 2.68;

  const environmentalScore = Math.min(
    100,
    Math.round(100 - totalEmissions / 500)
  );

  const socialScore =
    data.percentages.waterRecyclePercentage >
    40
      ? 78
      : 58;

  const governanceScore =
    data.coverage.electricityMonths >= 10
      ? 82
      : 60;

  const overallScore = Math.round(
    (
      environmentalScore +
      socialScore +
      governanceScore
    ) / 3
  );

  const readiness =
    overallScore >= 80
      ? "Advanced"
      : overallScore >= 60
      ? "Moderate"
      : "Early Stage";

  const confidence = Math.round(
    (
      (data.coverage.electricityMonths +
        data.coverage.waterMonths +
        data.coverage.fuelMonths +
        data.coverage.wasteMonths) /
      48
    ) * 100
  );

  /* ========================= */
  /* DYNAMIC INSIGHTS          */
  /* ========================= */

  const insights: string[] = [];

  if (data.totals.totalDiesel > 0) {
    insights.push(
      "High diesel dependency detected in operational activities."
    );
  }

  if (data.coverage.electricityMonths < 6) {
    insights.push(
      "Electricity tracking coverage is below ESG reporting standards."
    );
  }

  if (
    data.percentages.waterRecyclePercentage >
    40
  ) {
    insights.push(
      "Water recycling performance indicates positive sustainability adoption."
    );
  }

  if (confidence < 70) {
    insights.push(
      "Low data completeness affects ESG reporting confidence."
    );
  }

  /* ========================= */
  /* DRIVERS                   */
  /* ========================= */

  const drivers: {
    type: DriverType;
    title: string;
    impact: string;
  }[] = [
    {
      type:
        data.percentages.waterRecyclePercentage >
        40
          ? "positive"
          : "negative",

      title: "Water Recycling",

      impact:
        data.percentages.waterRecyclePercentage >
        40
          ? "+8 ESG"
          : "-5 ESG",
    },

    {
      type:
        data.coverage.electricityMonths >= 10
          ? "positive"
          : "negative",

      title: "Electricity Tracking",

      impact:
        data.coverage.electricityMonths >= 10
          ? "+10 ESG"
          : "-8 ESG",
    },

    {
      type:
        data.totals.totalDiesel > 0
          ? "negative"
          : "positive",

      title: "Diesel Consumption",

      impact:
        data.totals.totalDiesel > 0
          ? "-14 ESG"
          : "+5 ESG",
    },
  ];

  /* ========================= */
  /* RECOMMENDATIONS           */
  /* ========================= */

  const recommendations: {
    title: string;
    desc: string;
  }[] = [];

  if (data.totals.totalDiesel > 0) {
    recommendations.push({
      title: "Install Solar Infrastructure",
      desc:
        "Reduce dependency on diesel operations.",
    });
  }

  if (
    data.percentages.waterRecyclePercentage <
    40
  ) {
    recommendations.push({
      title: "Improve Water Recycling",
      desc:
        "Increase sustainability efficiency.",
    });
  }

  if (confidence < 80) {
    recommendations.push({
      title: "Improve ESG Reporting",
      desc:
        "Increase data confidence and compliance.",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 space-y-4">

        {/* HERO */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-2xl p-5 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                ESG Intelligence Center
              </h1>

              <p className="mt-2 text-sm text-emerald-50 max-w-2xl">
                Real-time sustainability
                readiness, operational
                analytics, carbon intelligence,
                and ESG scoring insights.
              </p>

            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">

              <div className="flex items-center">

                <p className="text-sm text-emerald-100">
                  ESG Readiness Score
                </p>

                <InfoTooltip text="Calculated using Environmental, Social, and Governance scores derived from emissions, water recycling, and reporting completeness." />

              </div>

              <h2 className="text-5xl font-bold mt-1">
                {overallScore}
              </h2>

              <p className="mt-1 text-sm text-emerald-50">
                {readiness}
              </p>

            </div>

          </div>
        </div>

        {/* SCORE + METRICS */}
        <div className="grid grid-cols-12 gap-3">

          {/* SCORES */}
          <div className="col-span-4 grid grid-cols-3 gap-3">

            <ScoreBreakdownCard
              title="ENV"
              score={environmentalScore}
            />

            <ScoreBreakdownCard
              title="SOC"
              score={socialScore}
            />

            <ScoreBreakdownCard
              title="GOV"
              score={governanceScore}
            />

          </div>

          {/* METRICS */}
          <div className="col-span-8 grid grid-cols-5 gap-3">

            <MetricCard
              label="Electricity"
              value={`${Math.round(
                data.totals.totalElectricity
              )} kWh`}
            />

            <MetricCard
              label="Diesel"
              value={`${Math.round(
                data.totals.totalDiesel
              )} L`}
            />

            <MetricCard
              label="Water"
              value={`${Math.round(
                data.totals.totalWater
              )} KL`}
            />

            <MetricCard
              label="Waste"
              value={`${Math.round(
                data.totals.totalWaste
              )} kg`}
            />

            <MetricCard
              label="CO₂"
              value={`${Math.round(
                totalEmissions
              )} kg`}
            />

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-4">

          {/* COVERAGE */}
          <div className="col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center">

                <h2 className="text-xl font-bold text-slate-900">
                  Coverage
                </h2>

                <InfoTooltip text="Shows how many months of ESG operational data are available across each reporting category." />

              </div>

              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-semibold">
                {confidence}%
              </div>

            </div>

            <div className="space-y-4">

              <CoverageBar
                label="Electricity"
                value={
                  data.coverage.electricityMonths
                }
              />

              <CoverageBar
                label="Water"
                value={data.coverage.waterMonths}
              />

              <CoverageBar
                label="Fuel"
                value={data.coverage.fuelMonths}
              />

              <CoverageBar
                label="Waste"
                value={data.coverage.wasteMonths}
              />

              <CoverageBar
                label="Transport"
                value={
                  data.coverage.transportMonths
                }
              />

              <CoverageBar
                label="Refrigerants"
                value={
                  data.coverage.refrigerantMonths
                }
              />

            </div>
          </div>

          {/* INSIGHTS */}
          <div className="col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden">

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              AI ESG Insights
            </h2>

            <div className="space-y-3">

              {insights.map((item, index) => (
                <InsightCard
                  key={index}
                  text={item}
                />
              ))}

            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5 mb-4">
              ESG Drivers
            </h2>

            <div className="space-y-3">

              {drivers.map((driver, index) => (
                <DriverCard
                  key={index}
                  title={driver.title}
                  impact={driver.impact}
                  type={driver.type}
                />
              ))}

            </div>

          </div>

          {/* EMISSIONS + ACTIONS */}
          <div className="col-span-4 space-y-4">

            {/* EMISSIONS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-center mb-4">

                <h2 className="text-xl font-bold text-slate-900">
                  Emissions
                </h2>

                <InfoTooltip text="Calculated using standard emission conversion factors for electricity and diesel consumption." />

              </div>

              <div className="space-y-3 text-sm">

                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="font-semibold text-slate-900">
                    Electricity
                  </p>

                  <p className="mt-1 text-slate-600">
                    {Math.round(
                      data.totals.totalElectricity
                    )}{" "}
                    × 0.82
                  </p>

                  <p className="mt-1 text-emerald-700 font-bold">
                    {Math.round(
                      data.totals
                        .totalElectricity * 0.82
                    )}{" "}
                    kgCO₂e
                  </p>

                </div>

                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="font-semibold text-slate-900">
                    Diesel
                  </p>

                  <p className="mt-1 text-slate-600">
                    {Math.round(
                      data.totals.totalDiesel
                    )}{" "}
                    × 2.68
                  </p>

                  <p className="mt-1 text-emerald-700 font-bold">
                    {Math.round(
                      data.totals.totalDiesel *
                        2.68
                    )}{" "}
                    kgCO₂e
                  </p>

                </div>

              </div>
            </div>

            {/* RECOMMENDATIONS */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900 mb-4">
                ESG Actions
              </h2>

              <div className="space-y-3">

                {recommendations.map(
                  (item, index) => (
                    <RecommendationCard
                      key={index}
                      title={item.title}
                      desc={item.desc}
                    />
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

/* ======================= */
/* TOOLTIP                 */
/* ======================= */

function InfoTooltip({
  text,
}: {
  text: string;
}) {
  return (
    <div className="relative group inline-block ml-2">

      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center cursor-pointer font-bold">
        i
      </div>

      <div className="absolute z-50 hidden group-hover:block w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl -top-2 left-6">
        {text}
      </div>

    </div>
  );
}

/* ======================= */
/* COMPONENTS              */
/* ======================= */

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-lg font-bold text-slate-900 mt-2">
        {value}
      </p>

    </div>
  );
}

function ScoreBreakdownCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex items-center">

          <h3 className="font-semibold text-slate-900 text-sm">
            {title}
          </h3>

          <InfoTooltip
            text={`This score is derived from ESG operational metrics related to ${title}.`}
          />

        </div>

        <span className="text-xl font-bold text-emerald-600">
          {score}
        </span>

      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mt-4">

        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-2 rounded-full"
          style={{
            width: `${score}%`,
          }}
        />

      </div>
    </div>
  );
}

function CoverageBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const percentage = (value / 12) * 100;

  return (
    <div>

      <div className="flex items-center justify-between mb-1">

        <p className="font-medium text-slate-700 text-sm">
          {label}
        </p>

        <p className="text-xs text-slate-500">
          {value}/12
        </p>

      </div>

      <div className="w-full bg-slate-200 rounded-full h-2">

        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-2 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

function InsightCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">

      <p className="text-slate-700 text-sm">
        {text}
      </p>

    </div>
  );
}

function DriverCard({
  title,
  impact,
  type,
}: {
  title: string;
  impact: string;
  type: DriverType;
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        type === "positive"
          ? "bg-emerald-50 border-emerald-200"
          : "bg-red-50 border-red-200"
      }`}
    >

      <div className="flex items-center justify-between">

        <p className="font-semibold text-slate-900 text-sm">
          {title}
        </p>

        <p
          className={`font-bold text-sm ${
            type === "positive"
              ? "text-emerald-700"
              : "text-red-600"
          }`}
        >
          {impact}
        </p>

      </div>

    </div>
  );
}

function RecommendationCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">

      <h3 className="font-semibold text-sm text-slate-900">
        {title}
      </h3>

      <p className="text-slate-600 mt-1 text-xs">
        {desc}
      </p>

    </div>
  );
}