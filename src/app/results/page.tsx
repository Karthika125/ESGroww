import ScoreCard from "@/components/results/ScoreCard";
async function getAssessment() {
const res = await fetch(
"http://localhost:3000/api/assessment",
{
cache: "no-store",
}
);
return res.json();
}
export default async function ResultsPage() {
const response =
await getAssessment();
const data = response.data;
return (
<div className="min-h-screen bg-slate-50 p-6">
<div className="max-w-7xl mx-auto space-y-5">
<div>
<h1 className="text-3xl font-bold text-slate-900">
ESG Intelligence Dashboard
</h1>
<p className="text-sm text-slate-500 mt-1">
Executive sustainability overview
</p>
</div>
<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
<ScoreCard
title="ESG Score"
value={data.overallScore}
/>
<ScoreCard
title="Readiness"
value={data.readinessStage}
/>
<ScoreCard
title="Completeness"
value={`${Math.round(
data.completeness
)}%`}
/>
<ScoreCard
title="Confidence"
value={`${Math.round(
data.confidence * 100
)}%`}
/>
<ScoreCard
title="Emissions"
value={`${Math.round(
data.totalEmissions
)} kgCO₂e`}
/>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div className="bg-white rounded-xl border border-slate-200 p-4">
<h2 className="font-semibold text-slate-900 mb-4">
Annualized Values
</h2>
<div className="space-y-2 text-sm">
<p>
Electricity: {Math.round(data.annualizedValues.electricity)} kWh
</p>
<p>
Water: {Math.round(data.annualizedValues.water)} KL
</p>
<p>
Fuel: {Math.round(data.annualizedValues.fuel)} L
</p>
<p>
Waste: {Math.round(data.annualizedValues.waste)} kg
</p>
</div>
</div>
<div className="bg-white rounded-xl border border-slate-200 p-4">
<h2 className="font-semibold text-slate-900 mb-4">
Certification Readiness
</h2>
<div className="space-y-2 text-sm">
{Object.entries(
data.certificationReadiness
).map(([key, value]) => (
<div
key={key}
className="flex items-center justify-between"
>
<span>{key}</span>
<span>
{value
? "Ready"
: "Not Ready"}
</span>
</div>
))}
</div>
</div>
</div>
</div>
</div>
);
  }