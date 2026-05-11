"use server";

import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";

export async function uploadElectricityExcel(
  formData: FormData
) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const rows: any[] =
      XLSX.utils.sheet_to_json(worksheet);

    /**
     * EXPECTED EXCEL FORMAT:
     *
     * Month | Year | electricityKwh
     */

    for (const row of rows) {
      await prisma.monthlyData.create({
        data: {
          organizationId:
            "cmoyejxqn0000nvzcpobm30i4",

          month: String(row.Month),

          year: Number(row.Year),

          electricityKwh: Number(
            row.electricityKwh || 0
          ),

          renewableKwh: 0,

          dgDieselLitres: 0,

          waterKl: 0,

          recycledWaterKl: 0,

          totalWasteKg: 0,

          recycledWasteKg: 0,
        },
      });
    }

    return {
      success: true,
      rowsUploaded: rows.length,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Excel upload failed",
    };
  }
}