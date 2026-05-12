"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertCircle, FileSpreadsheet } from "lucide-react";
import { getRecentUploads } from "@/actions/uploadProgress.actions";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getFileName(fileUrl: string): string {
  try {
    const parts = fileUrl.split(/[/\\]/);
    return parts[parts.length - 1] || fileUrl;
  } catch {
    return fileUrl;
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
        <AlertCircle className="w-3 h-3" /> Error
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
        <Clock className="w-3 h-3" /> Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
      <CheckCircle2 className="w-3 h-3" /> Uploaded
    </span>
  );
}

export default function RecentUploadsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUploads() {
      const data = await getRecentUploads();
      setRows(data || []);
      setLoading(false);
    }
    loadUploads();
  }, []);

  const monthLabel = (month: number | string, year: number | string) => {
    const m = Number(month);
    const name = MONTH_NAMES[m - 1] ?? `M${month}`;
    return `${name} ${year}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Recent Uploads</h2>

      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 font-medium">File</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Period</th>
              <th className="px-5 py-3 font-medium">Uploaded On</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-pulse" /> Loading uploads…
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                    <span>No uploads yet. Start by uploading a category above.</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium text-slate-800 truncate max-w-[180px]">
                        {getFileName(row.fileUrl)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize">{row.category}</td>
                  <td className="px-5 py-3.5 text-slate-600">{monthLabel(row.month, row.year)}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(row.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={row.status ?? "uploaded"} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}