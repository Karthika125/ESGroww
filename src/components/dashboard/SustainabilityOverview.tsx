"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function SustainabilityOverview({ data }: { data: any }) {
  // Dynamically mapping the radar chart values from our esgCalculations.ts engine!
  const radarData = [
    { subject: 'Energy', A: (data.readiness.energyScore / 25) * 100, fullMark: 100 },
    { subject: 'Water', A: (data.readiness.waterScore / 15) * 100, fullMark: 100 },
    { subject: 'Waste', A: (data.readiness.wasteScore / 15) * 100, fullMark: 100 },
    { subject: 'Governance', A: (data.readiness.govScore / 25) * 100, fullMark: 100 },
    { subject: 'Emissions', A: (data.readiness.emissionScore / 20) * 100, fullMark: 100 },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full border-8 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%, 50% 0, 0 0)" }}></div>
          <div className="text-center">
            <span className="text-4xl font-bold">{Math.round(data.readiness.totalScore)}%</span>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sustainability Readiness Overview</h2>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-sm text-slate-400">Readiness Level</p>
              <p className="text-lg font-medium text-blue-400 mt-1">{data.readiness.level}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Overall Confidence</p>
              <p className="text-lg font-medium text-emerald-400 mt-1">Medium</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Estimated Total Emissions</p>
              <p className="text-lg font-medium mt-1">{data.emissions.total.toFixed(2)} <span className="text-sm">tCO₂e/year</span></p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Benchmark Position</p>
              <p className="text-lg font-medium text-emerald-400 mt-1 flex items-center gap-2">Above Average ↗</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Readiness" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
