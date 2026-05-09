"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CertificationReadiness({ certifications }: { certifications: any[] }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2 border-b mb-3">
        <CardTitle className="text-lg flex justify-between items-center text-slate-900">
          Certification Readiness
          <span className="text-sm text-emerald-600 font-normal cursor-pointer hover:underline">View Details &gt;</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certifications.map((cert, i) => (
            <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
              <div className="font-medium text-slate-900 w-32">{cert.name}</div>
              <div className="font-bold w-12">{cert.score}%</div>
              <div className={`w-36 ${cert.color}`}>{cert.status}</div>
              <div className="text-slate-500 w-24 text-right">{cert.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
