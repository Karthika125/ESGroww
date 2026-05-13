"use client";

import { getReportForMonths, getValidationStatus, truncateText, clampPercentage } from "@/lib/metricsUtils";

interface CategoryCardProps {
  title: string;
  score: number | null | undefined;
  monthsUploaded: number | undefined | null;
  confidence: number;
  confidenceMonths: number | undefined;
  message?: string;
}

export default function CategoryCard({
  title,
  score,
  monthsUploaded,
  confidence,
  confidenceMonths,
  message,
}: CategoryCardProps) {
  const validation = getValidationStatus(monthsUploaded);
  const report = getReportForMonths(monthsUploaded);
  
  // Clamp and sanitize values to prevent overflow
  const safeScore = clampPercentage(score);
  const safeConfidence = clampPercentage(confidence * 100);
  const completenessWidth = validation.completeness.replace("%", "");
  const clampedWidth = Math.min(100, Math.max(0, parseFloat(completenessWidth)));

  return (
    <article className={`border rounded p-2 shadow-sm overflow-hidden ${validation.color}`}>
      <div className="flex items-center justify-between mb-1 min-w-0">
        <h3 className="text-sm font-semibold truncate">{truncateText(title, 15)}</h3>
        <div className={`text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${validation.badgeColor}`}>
          {truncateText(validation.status, 12)}
        </div>
      </div>

      <div className="space-y-1 text-xs overflow-hidden">
        {/* Data Completeness */}
        <div>
          <div className="flex items-center justify-between mb-0.5 min-w-0">
            <span className="truncate">Completeness</span>
            <span className="font-semibold flex-shrink-0 ml-1">{validation.completeness}</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div style={{ width: `${clampedWidth}%` }} className="h-1 bg-emerald-500" />
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between pt-0.5 min-w-0">
          <span className="font-semibold truncate">Score</span>
          <span className="text-slate-600 flex-shrink-0 ml-1">{safeScore}%</span>
        </div>

        {/* Confidence Info */}
        <div className="text-slate-600 truncate">
          Conf: {Math.round(safeConfidence)}% · Mo: {confidenceMonths ?? "-"}
        </div>

        {/* Validation Meaning */}
        <div className="leading-tight pt-1 border-t border-current border-opacity-20 text-slate-700 line-clamp-2">
          {truncateText(validation.meaning, 60)}
        </div>

        {/* Report Message */}
        <div className="font-medium text-current opacity-75 text-slate-700 line-clamp-2">
          {truncateText(report.message, 60)}
        </div>

        {/* Custom Message */}
        {message && (
          <div className="text-current opacity-75 text-slate-700 line-clamp-1">
            {truncateText(message, 50)}
          </div>
        )}
      </div>
    </article>
  );
}
