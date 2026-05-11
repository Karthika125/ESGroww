"use server";

import * as XLSX from "xlsx";

import { prisma } from "@/lib/db";

import { revalidatePath } from "next/cache";

const HOSPITAL_ID =
  "cmp0sbyk20000nvk8i9o68s5o";

/* ============================= */
/* ELECTRICITY UPLOAD            */
/* ============================= */

export async function uploadElectricityExcel(
  formData: FormData
) {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    for (const row of rows) {
      await prisma.electricityData.create({
        data: {
          hospitalId: HOSPITAL_ID,

          month: String(row.Month),

          year: Number(row.Year),

          electricityKwh: Number(
            row.electricityKwh || 0
          ),

          renewableKwh: Number(
            row.renewableKwh || 0
          ),
        },
      });
    }

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error:
        "Electricity upload failed",
    };
  }
}

/* ============================= */
/* WATER UPLOAD                  */
/* ============================= */

export async function uploadWaterExcel(
  formData: FormData
) {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    for (const row of rows) {
      await prisma.waterData.create({
        data: {
          hospitalId: HOSPITAL_ID,

          month: String(row.Month),

          year: Number(row.Year),

          waterKl: Number(
            row.waterKl || 0
          ),

          recycledWaterKl: Number(
            row.recycledWaterKl || 0
          ),
        },
      });
    }

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Water upload failed",
    };
  }
}

/* ============================= */
/* FUEL UPLOAD                   */
/* ============================= */

export async function uploadFuelExcel(
  formData: FormData
) {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    for (const row of rows) {
      await prisma.fuelData.create({
        data: {
          hospitalId: HOSPITAL_ID,

          month: String(row.Month),

          year: Number(row.Year),

          dgDieselLitres: Number(
            row.dgDieselLitres || 0
          ),
        },
      });
    }

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Fuel upload failed",
    };
  }
}

/* ============================= */
/* WASTE UPLOAD                  */
/* ============================= */

export async function uploadWasteExcel(
  formData: FormData
) {
  try {
    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    for (const row of rows) {
      await prisma.wasteData.create({
        data: {
          hospitalId: HOSPITAL_ID,

          month: String(row.Month),

          year: Number(row.Year),

          biomedicalWasteKg: Number(
            row.biomedicalWasteKg || 0
          ),

          recyclableWasteKg: Number(
            row.recyclableWasteKg || 0
          ),

          landfillWasteKg: Number(
            row.landfillWasteKg || 0
          ),
        },
      });
    }

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Waste upload failed",
    };
  }
}