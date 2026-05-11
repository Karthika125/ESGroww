"use client";

import { useState } from "react";

import { UploadCloud } from "lucide-react";

import {
    uploadElectricityExcel,
    uploadWaterExcel,
    uploadFuelExcel,
    uploadWasteExcel,
    uploadRefrigerantsExcel,
    uploadTransportExcel,
} from "@/actions/excelUpload.actions";

interface Props {
    category:
    | "electricity"
    | "water"
    | "fuel"
    | "waste"
    | "refrigerants"
    | "transport";
}

export default function ExcelUploadButton({
    category,
}: Props) {
    const [loading, setLoading] =
        useState(false);

    async function handleUpload(
        formData: FormData
    ) {
        const file = formData.get(
            "file"
        ) as File;

        if (!file || file.size === 0) {
            alert("Please select an Excel file");

            return;
        }

        setLoading(true);

        let result;

        switch (category) {
            case "electricity":
                result =
                    await uploadElectricityExcel(
                        formData
                    );
                break;

            case "water":
                result =
                    await uploadWaterExcel(
                        formData
                    );
                break;

            case "fuel":
                result =
                    await uploadFuelExcel(
                        formData
                    );
                break;

            case "waste":
                result =
                    await uploadWasteExcel(
                        formData
                    );
                break;
            case "refrigerants":
                result =
                    await uploadRefrigerantsExcel(
                        formData
                    );
                break;

            case "transport":
                result =
                    await uploadTransportExcel(
                        formData
                    );
                break;

            default:
                result = {
                    success: false,
                    error: "Invalid category",
                };
        }

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