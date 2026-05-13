"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, FileSpreadsheet, MoreVertical } from "lucide-react";

import { getRecentUploads } from "@/actions/uploadProgress.actions";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type UploadRow = {
  id: string;
  fileUrl: string;
  category: string;
  month: string;
  year: number;
  createdAt: Date | string;
  status?: string;
};

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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
        <AlertCircle className="h-3 w-3" /> Error
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <Clock className="h-3 w-3" /> Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Uploaded
    </span>
  );
}

type Props = {
  limit?: number;
  refreshKey?: number;
  showViewAllLink?: boolean;
  showTitle?: boolean;
};

export default function RecentUploadsTable({
  limit = 10,
  refreshKey = 0,
  showViewAllLink = false,
  showTitle = true,
}: Props) {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuId, setMenuId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUploads() {
      setLoading(true);
      const data = await getRecentUploads(limit);
      if (!cancelled) {
        setRows((data as UploadRow[]) || []);
        setLoading(false);
      }
    }
    loadUploads();
    return () => {
      cancelled = true;
    };
  }, [limit, refreshKey]);

  const monthLabel = (month: number | string, year: number | string) => {
    const m = Number(month);
    const name = MONTH_NAMES[m - 1] ?? `M${month}`;
    return `${name} ${year}`;
  };

  return (
    <div className="space-y-4">
      {(showTitle || showViewAllLink) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {showTitle && <h2 className="text-lg font-semibold text-slate-900">Recent uploads</h2>}
          {!showTitle && <span />}
          {showViewAllLink && (
            <Link
              href="/upload/history"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all uploads →
            </Link>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3">File</th>
              <th className="hidden px-5 py-3 sm:table-cell">Category</th>
              <th className="hidden px-5 py-3 md:table-cell">Period</th>
              <th className="hidden px-5 py-3 lg:table-cell">Uploaded on</th>
              <th className="px-5 py-3">Status</th>
              <th className="w-12 px-3 py-3 text-right" aria-label="Actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 animate-pulse" /> Loading uploads…
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                    <span>No uploads yet. Start by uploading a category above.</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span className="max-w-[200px] truncate font-medium text-slate-800">
                        {getFileName(row.fileUrl)}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 capitalize sm:table-cell">{row.category}</td>
                  <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">
                    {monthLabel(row.month, row.year)}
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-500 lg:table-cell">
                    {new Date(row.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={row.status ?? "uploaded"} />
                  </td>
                  <td className="relative px-2 py-3.5 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-expanded={menuId === row.id}
                      aria-haspopup="true"
                      aria-label="Row actions"
                      onClick={() => setMenuId((id) => (id === row.id ? null : row.id))}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuId === row.id && (
                      <div className="absolute right-2 top-full z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">Upload record</p>
                        <dl className="mt-2 space-y-1.5 text-slate-600">
                          <div>
                            <dt className="text-slate-400">ID</dt>
                            <dd className="font-mono text-[11px] text-slate-700">{row.id}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">File</dt>
                            <dd className="break-all">{getFileName(row.fileUrl)}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">Category</dt>
                            <dd className="capitalize">{row.category}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">Period</dt>
                            <dd>{monthLabel(row.month, row.year)}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
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
