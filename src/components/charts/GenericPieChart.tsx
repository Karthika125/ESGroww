"use client";

import React from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface GenericPieChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface GenericPieChartProps {
  data: GenericPieChartDataItem[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  valueFormatter?: (value: number) => string;
}

export default function GenericPieChart({
  data,
  innerRadius = 40,
  outerRadius = 60,
  paddingAngle = 2,
  valueFormatter = (value) => `${value}%`,
}: GenericPieChartProps) {
  // Clamp all values to prevent overflow
  const safeData = data
    .map((item) => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value || 0)),
    }))
    .filter((item) => item.value > 0);

  // If all values are zero, show placeholder
  const chartData = safeData.length > 0 ? safeData : [{ name: "No Data", value: 100, fill: "#e2e8f0" }];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => valueFormatter(value as number)} />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
