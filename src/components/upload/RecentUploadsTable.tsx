"use client";

import { useEffect, useState } from "react";

import { CheckCircle2 } from "lucide-react";

import { getRecentUploads } from "@/actions/uploadProgress.actions";

export default function RecentUploadsTable() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    async function loadUploads() {
      const data = await getRecentUploads();

      setRows(data || []);
    }

    loadUploads();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Recent Uploads
      </h2>

      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">
                File Name
              </th>

              <th className="px-6 py-3 font-medium">
                Category
              </th>

              <th className="px-6 py-3 font-medium">
                Month
              </th>

              <th className="px-6 py-3 font-medium">
                Uploaded On
              </th>

              <th className="px-6 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y text-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No uploads yet
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.fileUrl}
                  </td>

                  <td className="px-6 py-4">
                    {row.category}
                  </td>

                  <td className="px-6 py-4">
                    {row.month} {row.year}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      row.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 flex items-center text-emerald-600 gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Uploaded
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