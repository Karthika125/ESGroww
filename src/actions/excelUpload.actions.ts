"use server";

import * as XLSX from "xlsx";

import { prisma } from "@/lib/db";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/getUser";

  const VALID_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseNumber(value: unknown, fallback = 0) {
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseYear(value: unknown) {
  const parsed = parseNumber(value, NaN);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}

function normalizeMonth(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const normalized = raw.toLowerCase();
  const monthMap: Record<string, string> = {
    jan: "Jan",
    january: "Jan",
    feb: "Feb",
    february: "Feb",
    mar: "Mar",
    march: "Mar",
    apr: "Apr",
    april: "Apr",
    may: "May",
    jun: "Jun",
    june: "Jun",
    jul: "Jul",
    july: "Jul",
    aug: "Aug",
    august: "Aug",
    sep: "Sep",
    sept: "Sep",
    september: "Sep",
    oct: "Oct",
    october: "Oct",
    nov: "Nov",
    november: "Nov",
    dec: "Dec",
    december: "Dec",
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  return monthMap[normalized] ?? raw;
}

function parseNumericField(
  value: unknown,
  fallback = 0
) {
  const raw =
    String(value ?? "").trim();

  if (!raw) {
    return fallback;
  }

  const numeric = Number(
    raw.replace(/,/g, "")
  );

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return numeric;
}

function validateNumericFields(
  rows: any[],
  fields: string[],
  category: string
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (const field of fields) {
      const rawValue = row[field];

      if (
        rawValue === undefined ||
        rawValue === null ||
        String(rawValue).trim() === ""
      ) {
        continue;
      }

      const numeric = Number(
        String(rawValue)
          .replace(/,/g, "")
          .trim()
      );

      if (!Number.isFinite(numeric)) {
        return `Invalid numeric value "${rawValue}" found in column "${field}" at row ${
          i + 1
        } in ${category} upload.`;
      }
    }
  }

  return null;
}

function getUploadError(category: string, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error);
  return `Upload failed (${category}): ${message}`;
}

/* ========================= */
/* NEGATIVE VALUE CHECK      */
/* ========================= */

function validateNegativeValues(
  rows: any[],
  fields: string[],
  category: string
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (const field of fields) {
      const rawValue = row[field];

      if (
        rawValue === undefined ||
        rawValue === null ||
        String(rawValue).trim() === ""
      ) {
        continue;
      }

      const numeric = Number(
        String(rawValue)
          .replace(/,/g, "")
          .trim()
      );

      if (numeric < 0) {
        return `Negative value "${numeric}" found in column "${field}" at row ${
          i + 1
        } in ${category} upload. Only positive values are allowed.`;
      }
    }
  }

  return null;
}

/* ========================= */
/* ABNORMAL SPIKE DETECTION  */
/* ========================= */

function detectAbnormalSpikes(
  rows: any[],
  fields: string[],
  category: string
): string[] {
  const warnings: string[] = [];

  for (const field of fields) {
    const values: number[] = [];

    for (let i = 0; i < rows.length; i++) {
      const rawValue = rows[i][field];

      if (
        rawValue === undefined ||
        rawValue === null ||
        String(rawValue).trim() === ""
      ) {
        values.push(0);
        continue;
      }

      const numeric = Number(
        String(rawValue)
          .replace(/,/g, "")
          .trim()
      );

      values.push(Number.isFinite(numeric) ? numeric : 0);
    }

    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1];
      const curr = values[i];

      if (prev === 0 && curr === 0) continue;

      if (prev === 0) {
        if (curr > 0) {
          warnings.push(
            `⚠️ Spike detected: ${field} jumped from 0 to ${curr} in row ${i + 1} (${category}). Please verify.`
          );
        }
      } else {
        const percentChange = Math.abs((curr - prev) / prev) * 100;

        if (percentChange > 100) {
          warnings.push(
            `⚠️ Spike detected: ${field} increased by ${percentChange.toFixed(1)}% from row ${i} to row ${
              i + 1
            } (${category}). Verify data accuracy.`
          );
        }

        if (percentChange > 70 && curr < prev) {
          warnings.push(
            `⚠️ Drop detected: ${field} decreased by ${percentChange.toFixed(1)}% from row ${i} to row ${
              i + 1
            } (${category}). Verify data accuracy.`
          );
        }
      }
    }
  }

  return warnings;
}

function validateRows(
  rows: any[],
  requiredFields: string[],
  category: string
) {
  /* ========================= */
  /* EMPTY FILE CHECK          */
  /* ========================= */

  if (!rows.length) {
    return `Your ${category} file is empty or the column headers are incorrect.`;
  }

  /* ========================= */
  /* MIN/MAX MONTH VALIDATION  */
  /* ========================= */

  if (rows.length < 6) {
    return `${category} upload must contain at least 6 months of data.`;
  }

  if (rows.length > 12) {
    return `${category} upload cannot contain more than 12 months of data.`;
  }

  /* ========================= */
  /* REQUIRED COLUMN CHECK     */
  /* ========================= */

  const missingFields = requiredFields.filter(
    (field) =>
      rows.every(
        (row) =>
          row[field] === undefined ||
          row[field] === null ||
          String(row[field]).trim() === ""
      )
  );

  if (missingFields.length) {
    return `Missing required columns in ${category} upload: ${missingFields.join(
      ", "
    )}.`;
  }

  /* ========================= */
  /* MONTH VALIDATION          */
  /* ========================= */

  const uploadedMonths = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const normalizedMonth =
      normalizeMonth(row.Month);

    const year =
      parseYear(row.Year);

    /* INVALID MONTH */

    if (
      !VALID_MONTHS.includes(
        normalizedMonth
      )
    ) {
      return `Invalid month "${row.Month}" found in row ${
        i + 1
      }. Allowed values are Jan-Dec only.`;
    }

    /* INVALID YEAR */

    if (Number.isNaN(year)) {
      return `Invalid year "${row.Year}" found in row ${
        i + 1
      }.`;
    }

    /* DUPLICATE MONTH INSIDE EXCEL */

    const monthKey = `${normalizedMonth}-${year}`;

    if (uploadedMonths.has(monthKey)) {
      return `Duplicate month "${normalizedMonth} ${year}" found inside uploaded ${category} file.`;
    }

    uploadedMonths.add(monthKey);
  }

  return null;
}
async function validateMonthEntry({
  month,
  year,
  category,
  hospitalId,
}: {
  month: string;
  year: number;
  category: string;
  hospitalId: string;
}) {
  const normalizedMonth = normalizeMonth(month);

  if (!VALID_MONTHS.includes(normalizedMonth)) {
    return `Invalid month "${month}". Allowed values are Jan-Dec only.`;
  }

  const existingUpload =
    await prisma.upload.findFirst({
      where: {
        hospitalId,

        category,

        month: normalizedMonth,

        year,
      },
    });

  if (existingUpload) {
    return `${category} data for ${month} ${year} already exists.`;
  }

  return null;
}
/* ============================= */
/* ELECTRICITY UPLOAD            */
/* ============================= */

export async function uploadElectricityExcel(
  formData: FormData
) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Electricity"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["electricityKwh", "renewableKwh"],
      "Electricity"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["electricityKwh", "renewableKwh"],
      "Electricity"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["electricityKwh", "renewableKwh"],
      "Electricity"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Electricity upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Electricity",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.electricityData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          electricityKwh: parseNumericField(row.electricityKwh),

          renewableKwh: parseNumericField(row.renewableKwh),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Electricity",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Electricity upload error:", error);

    return {
      success: false,
      error: getUploadError("Electricity", error),
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
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Water"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["waterKl", "recycledWaterKl"],
      "Water"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["waterKl", "recycledWaterKl"],
      "Water"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["waterKl", "recycledWaterKl"],
      "Water"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Water upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Water",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.waterData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          waterKl: parseNumericField(row.waterKl),

          recycledWaterKl: parseNumericField(row.recycledWaterKl),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Water",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Water upload error:", error);

    return {
      success: false,
      error: getUploadError("Water", error),
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
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Fuel"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["dgDieselLitres"],
      "Fuel"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["dgDieselLitres"],
      "Fuel"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["dgDieselLitres"],
      "Fuel"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Fuel upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Fuel",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.fuelData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          dgDieselLitres: parseNumericField(row.dgDieselLitres),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Fuel",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Fuel upload error:", error);

    return {
      success: false,
      error: getUploadError("Fuel", error),
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
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Waste"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["biomedicalWasteKg", "recyclableWasteKg", "landfillWasteKg"],
      "Waste"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["biomedicalWasteKg", "recyclableWasteKg", "landfillWasteKg"],
      "Waste"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["biomedicalWasteKg", "recyclableWasteKg", "landfillWasteKg"],
      "Waste"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Waste upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Waste",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.wasteData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          biomedicalWasteKg: parseNumericField(row.biomedicalWasteKg),

          recyclableWasteKg: parseNumericField(row.recyclableWasteKg),

          landfillWasteKg: parseNumericField(row.landfillWasteKg),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Waste",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Waste upload error:", error);

    return {
      success: false,
      error: getUploadError("Waste", error),
    };
  }
}

/* ============================= */
/* REFRIGERANTS UPLOAD           */
/* ============================= */

export async function uploadRefrigerantsExcel(
  formData: FormData
) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Refrigerants"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["refrigerantLeakKg"],
      "Refrigerants"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["refrigerantLeakKg"],
      "Refrigerants"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["refrigerantLeakKg"],
      "Refrigerants"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Refrigerants upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Refrigerants",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.refrigerantData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          refrigerantType: String(
            row.refrigerantType || ""
          ),

          refrigerantLeakKg: parseNumericField(
            row.refrigerantLeakKg
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Refrigerants",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Refrigerants upload error:", error);

    return {
      success: false,
      error: getUploadError("Refrigerants", error),
    };
  }
}

/* ============================= */
/* TRANSPORT UPLOAD              */
/* ============================= */

export async function uploadTransportExcel(
  formData: FormData
) {
  try {
    const user = await getCurrentUser();

    if (!user || typeof user === "string" || !("hospitalId" in user)) {
      return {
        success: false,
        error: "Unauthorized user.",
      };
    }

    const hospitalId = String(user.hospitalId);

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

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    const validationError = validateRows(
      rows,
      ["Month", "Year"],
      "Transport"
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const numericError = validateNumericFields(
      rows,
      ["ambulanceFuelLitres", "staffCommuteKm"],
      "Transport"
    );
    if (numericError) {
      return {
        success: false,
        error: numericError,
      };
    }

    const negativeError = validateNegativeValues(
      rows,
      ["ambulanceFuelLitres", "staffCommuteKm"],
      "Transport"
    );
    if (negativeError) {
      return {
        success: false,
        error: negativeError,
      };
    }

    const spikeWarnings = detectAbnormalSpikes(
      rows,
      ["ambulanceFuelLitres", "staffCommuteKm"],
      "Transport"
    );

    const monthValue = normalizeMonth(rows[0].Month);
    const yearValue = parseYear(rows[0].Year);

    if (!monthValue || Number.isNaN(yearValue)) {
      return {
        success: false,
        error: "Invalid Month or Year in Transport upload. Month must be Jan-Dec and Year must be a number.",
      };
    }

    const duplicateError =
      await validateMonthEntry({
        month: monthValue,
        year: yearValue,
        category: "Transport",
        hospitalId,
      });

    if (duplicateError) {
      return {
        success: false,
        error: duplicateError,
      };
    }

    for (const row of rows) {
      const rowMonth = normalizeMonth(row.Month);
      const rowYear = parseYear(row.Year);

      await prisma.transportData.create({
        data: {
          hospitalId: hospitalId,

          month: rowMonth,

          year: rowYear,

          ambulanceFuelLitres: parseNumericField(
            row.ambulanceFuelLitres
          ),

          staffCommuteKm: parseNumericField(
            row.staffCommuteKm
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: hospitalId,

        category: "Transport",

        fileUrl: file.name,

        month: monthValue,

        year: yearValue,
      },
    });

    revalidatePath("/upload");

    return {
      success: true,
      rowsUploaded: rows.length,
      warnings: spikeWarnings.length > 0 ? spikeWarnings : undefined,
    };
  } catch (error) {
    console.error("Transport upload error:", error);

    return {
      success: false,
      error: getUploadError("Transport", error),
    };
  }
}

