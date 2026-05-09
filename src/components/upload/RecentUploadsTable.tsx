"use client";
import { CheckCircle2 } from "lucide-react";

export function RecentUploadsTable() {
  const rows = [
    { file: "Electricity_Jul2024.pdf", cat: "Electricity", month: "Jul 2024", date: "05 Aug 2024" },
    { file: "Water_Jul2024.pdf", cat: "Water", month: "Jul 2024", date: "05 Aug 2024" },
    { file: "DG_Invoice_Jul2024.pdf", cat: "Fuel", month: "Jul 2024", date: "05 Aug 2024" },
    { file: "Waste_Jul2024.xlsx", cat: "Waste", month: "Jul 2024", date: "05 Aug 2024" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Recent Uploads</h2>
      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">File Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Month</th>
              <th className="px-6 py-3 font-medium">Uploaded On</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
             {rows.map((row, i) => (
               <tr key={i} className="hover:bg-slate-50">
                 <td className="px-6 py-4 font-medium text-slate-900">{row.file}</td>
                 <td className="px-6 py-4">{row.cat}</td>
                 <td className="px-6 py-4">{row.month}</td>
                 <td className="px-6 py-4">{row.date}</td>
                 <td className="px-6 py-4 flex items-center text-emerald-600 gap-1.5 font-medium">
                   <CheckCircle2 className="w-4 h-4" /> Uploaded
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
