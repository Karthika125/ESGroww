"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  uploadElectricityExcel,
  uploadWaterExcel,
  uploadFuelExcel,
  uploadWasteExcel,
  uploadRefrigerantsExcel,
  uploadTransportExcel,
} from "@/actions/excelUpload.actions";

interface Props {
  category: "electricity" | "water" | "fuel" | "waste" | "refrigerants" | "transport";
  onUploadSuccess?: () => void;
}

type UploadStatus = "idle" | "loading" | "success" | "error";

const ACTION_MAP = {
  electricity: uploadElectricityExcel,
  water: uploadWaterExcel,
  fuel: uploadFuelExcel,
  waste: uploadWasteExcel,
  refrigerants: uploadRefrigerantsExcel,
  transport: uploadTransportExcel,
};

export default function ExcelUploadButton({ category, onUploadSuccess }: Props) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? "");
    setStatus("idle");
    setMessage("");
  }

  async function handleUpload(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      setStatus("error");
      setMessage("Please select an Excel file first.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const action = ACTION_MAP[category];
      const result = await action(formData);

      if (result.success) {
        setStatus("success");
        const message = `${result.rowsUploaded} month${result.rowsUploaded !== 1 ? "s" : ""} uploaded successfully${result.warnings && result.warnings.length > 0 ? " with warnings" : ""}`;
        setMessage(message);
        if (result.warnings && result.warnings.length > 0) {
          console.warn("Upload warnings:", result.warnings);
        }
        await onUploadSuccess?.();
      } else {
        setStatus("error");
        setMessage(result.error ?? "Upload failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unexpected error. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleUpload(formData);
  }

  const inputId = `excel-upload-${category}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <label
        htmlFor={inputId}
        className="group flex w-full cursor-pointer items-center gap-2"
      >
        <div className="min-w-0 flex-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50/40">
          <span className="block truncate text-xs text-slate-400">
            {fileName || "Choose .xlsx or .xls file"}
          </span>
        </div>
        <input
          id={inputId}
          type="file"
          name="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === "loading" || !fileName}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-all duration-200"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Upload Excel
          </>
        )}
      </button>

      {/* Status feedback */}
      {status === "success" && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {message}
        </div>
      )}
    </form>
  );
}