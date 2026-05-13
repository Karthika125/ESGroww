"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GenericBarChartProps {
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  valueFormatter?: (value: any) => string;
}

export default function GenericBarChart({
  data,
  dataKeys,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  margin = { top: 5, right: 5, left: -20, bottom: 5 },
  valueFormatter = (value) => `${value}%`,
}: GenericBarChartProps) {
  // Clamp all numeric values to prevent chart overflow
  const safeData = data.map((item) => ({
    ...item,
    [xAxisKey]: (item[xAxisKey] as string).substring(0, 12),
    ...dataKeys.reduce(
      (acc, { key }) => ({
        ...acc,
        [key]: Math.min(100, Math.max(0, item[key] || 0)),
      }),
      {}
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsBarChart data={safeData} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} interval={0} />
        <YAxis
          stroke="#64748b"
          tick={{ fontSize: 11 }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            fontSize: "12px",
          }}
          formatter={valueFormatter}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {dataKeys.map(({ key, label, color }) => (
          <Bar key={key} dataKey={key} fill={color} name={label} radius={[2, 2, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
