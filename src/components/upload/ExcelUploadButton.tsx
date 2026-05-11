"use client";

import { useState } from "react";

import { UploadCloud } from "lucide-react";

import { uploadElectricityExcel } from "@/actions/excelUpload.actions";

export default function ExcelUploadButton() {
  const [loading, setLoading] =
    useState(false);

  async function handleUpload(
    formData: FormData
  ) {
    const file = formData.get(
      "file"
    ) as File;

    // Prevent empty submit
    if (!file || file.size === 0) {
      alert("Please select an Excel file");

      return;
    }

    setLoading(true);

    const result =
      await uploadElectricityExcel(
        formData
      );

    alert(
      result.success
        ? `Uploaded ${result.rowsUploaded} rows`
        : result.error
    );

    setLoading(false);
  }

  return (
    <form action={handleUpload}>
      <div className="space-y-3">
        <input
          type="file"
          name="file"
          accept=".xlsx,.xls"
          required
          className="block w-full text-sm"
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2"
        >
          <UploadCloud className="w-4 h-4 mr-2" />

          {loading
            ? "Uploading..."
            : "Upload Excel"}
        </button>
      </div>
    </form>
  );
}