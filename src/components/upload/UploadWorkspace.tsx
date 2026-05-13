"use client";

import { useCallback, useState } from "react";

import ProceedButton from "@/components/upload/ProceedButton";
import RecentUploadsTable from "@/components/upload/RecentUploadsTable";
import UploadCategoryGrid from "@/components/upload/UploadCategoryGrid";
import UploadOverviewPanel from "@/components/upload/UploadOverviewPanel";

export default function UploadWorkspace() {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <>
      <UploadCategoryGrid onDataChanged={bump} />

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
        <UploadOverviewPanel refreshKey={refreshKey} />
        <RecentUploadsTable refreshKey={refreshKey} limit={10} showViewAllLink={true} />
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Electricity, Water, and Waste must each have at least 6 months of data to proceed.
        </p>
        <ProceedButton refreshKey={refreshKey} />
      </div>
    </>
  );
}
