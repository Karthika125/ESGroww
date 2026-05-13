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
  /** Tighter layout for bento / dashboard cards */
  dense?: boolean;
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

export default function ExcelUploadButton({ category, onUploadSuccess, dense }: Props) {
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

  if (dense) {
    return (
      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
          <label
            htmlFor={inputId}
            className="group flex min-w-0 flex-1 cursor-pointer items-center"
          >
            <div className="min-w-0 flex-1 rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50/50">
              <span className="block truncate text-[10px] text-slate-500">
                {fileName || ".xlsx / .xls"}
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
          <button
            type="submit"
            disabled={status === "loading" || !fileName}
            className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-md bg-emerald-600 px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:min-w-[7.5rem]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span className="hidden sm:inline">…</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-3.5" />
                Upload
              </>
            )}
          </button>
        </div>
        {status === "success" && (
          <div className="flex items-start gap-1 rounded border border-emerald-100 bg-emerald-50 px-1.5 py-1 text-[10px] text-emerald-800">
            <CheckCircle2 className="mt-0.5 size-3 shrink-0" />
            <span className="leading-snug">{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-start gap-1 rounded border border-rose-100 bg-rose-50 px-1.5 py-1 text-[10px] text-rose-800">
            <AlertCircle className="mt-0.5 size-3 shrink-0" />
            <span className="leading-snug">{message}</span>
          </div>
        )}
      </form>
    );
  }

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