"use server";

import * as XLSX from "xlsx";

import { prisma } from "@/lib/db";

import { revalidatePath } from "next/cache";

const HOSPITAL_ID =
  "cmp2cdhyz0001evczibh2ke4b";

function parseNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
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
  if (!rows.length) {
    return `Your ${category} file is empty or the headers do not match the expected column names.`;
  }

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
    return `Missing expected columns for ${category}: ${missingFields.join(", ")}.`;
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

    for (const row of rows) {
      await prisma.electricityData.create({
        data: {
          hospitalId: HOSPITAL_ID,

          month: String(row.Month),

          year: parseNumber(row.Year),

          electricityKwh: Number(
            row.electricityKwh || 0
          ),

          renewableKwh: Number(
            row.renewableKwh || 0
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: HOSPITAL_ID,

        category: "Electricity",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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

    for (const row of rows) {
      await prisma.waterData.create({
        data: {
          hospitalId: "cmp2cdhyz0001evczibh2ke4b",

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

    await prisma.upload.create({
      data: {
        hospitalId: "cmp2cdhyz0001evczibh2ke4b",

        category: "Water",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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

    for (const row of rows) {
      await prisma.fuelData.create({
        data: {
          hospitalId: "cmp2cdhyz0001evczibh2ke4b",

          month: String(row.Month),

          year: Number(row.Year),

          dgDieselLitres: Number(
            row.dgDieselLitres || 0
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: "cmp2cdhyz0001evczibh2ke4b",

        category: "Fuel",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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

    for (const row of rows) {
      await prisma.wasteData.create({
        data: {
          hospitalId: "cmp2cdhyz0001evczibh2ke4b",

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

    await prisma.upload.create({
      data: {
        hospitalId: "cmp2cdhyz0001evczibh2ke4b",

        category: "Waste",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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

    for (const row of rows) {
      await prisma.refrigerantData.create({
        data: {
          hospitalId: "cmp2cdhyz0001evczibh2ke4b",

          month: String(row.Month),

          year: Number(row.Year),

          refrigerantType: String(
            row.refrigerantType || ""
          ),

          refrigerantLeakKg: Number(
            row.refrigerantLeakKg || 0
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: "cmp2cdhyz0001evczibh2ke4b",

        category: "Refrigerants",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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

    for (const row of rows) {
      await prisma.transportData.create({
        data: {
          hospitalId: "cmp2cdhyz0001evczibh2ke4b",

          month: String(row.Month),

          year: Number(row.Year),

          ambulanceFuelLitres: Number(
            row.ambulanceFuelLitres || 0
          ),

          staffCommuteKm: Number(
            row.staffCommuteKm || 0
          ),
        },
      });
    }

    await prisma.upload.create({
      data: {
        hospitalId: "cmp2cdhyz0001evczibh2ke4b",

        category: "Transport",

        fileUrl: file.name,

        month: String(
          rows[0]?.Month || ""
        ),

        year: Number(
          rows[0]?.Year || 2026
        ),
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