"use server";

import * as XLSX from "xlsx";

import { prisma } from "@/lib/db";

import { revalidatePath } from "next/cache";

const HOSPITAL_ID =
  "cmp2cdhyz0001evczibh2ke4b";

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
}: {
  month: string;
  year: number;
  category: string;
}) {
  const normalizedMonth = normalizeMonth(month);

  /* ========================= */
  /* VALID MONTH CHECK         */
  /* ========================= */

  if (!VALID_MONTHS.includes(normalizedMonth)) {
    return `Invalid month "${month}". Allowed values are Jan-Dec only.`;
  }

  /* ========================= */
  /* DUPLICATE CHECK           */
  /* ========================= */

  const existingUpload =
    await prisma.upload.findFirst({
      where: {
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

          month: rowMonth,

          year: rowYear,

          electricityKwh: parseNumericField(row.electricityKwh),

          renewableKwh: parseNumericField(row.renewableKwh),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

          month: rowMonth,

          year: rowYear,

          waterKl: parseNumericField(row.waterKl),

          recycledWaterKl: parseNumericField(row.recycledWaterKl),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

          month: rowMonth,

          year: rowYear,

          dgDieselLitres: parseNumericField(row.dgDieselLitres),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

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
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

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
        hospitalId: HOSPITAL_ID,

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
          hospitalId: HOSPITAL_ID,

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
        hospitalId: HOSPITAL_ID,

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
    };
  } catch (error) {
    console.error("Transport upload error:", error);

    return {
      success: false,
      error: getUploadError("Transport", error),
    };
  }
}