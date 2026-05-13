"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GenericLineChartProps {
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    key: string;
    label: string;
    color: string;
    strokeWidth?: number;
  }>;
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  valueFormatter?: (value: any) => string;
  domain?: [number, number];
}

export default function GenericLineChart({
  data,
  dataKeys,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  margin = { top: 5, right: 5, left: -20, bottom: 5 },
  valueFormatter = (value) => `${value}%`,
  domain,
}: GenericLineChartProps) {
  // Clamp all numeric values
  const safeData = data.map((item) => ({
    ...item,
    [xAxisKey]: (item[xAxisKey] as string).substring(0, 10),
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
      <RechartsLineChart data={safeData} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} interval={0} />
        <YAxis
          stroke="#64748b"
          tick={{ fontSize: 11 }}
          domain={domain || [0, 100]}
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
        {dataKeys.map(({ key, label, color, strokeWidth = 1.5 }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            name={label}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
            strokeWidth={strokeWidth}
            isAnimationActive={true}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
