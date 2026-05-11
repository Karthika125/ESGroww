"use server";

import { prisma } from "@/lib/db";

export async function saveMonthlyData(data: any) {
  try {
    const result = await prisma.monthlyData.create({
      data: {
        organizationId: data.organizationId,

        month: data.month,
        year: Number(data.year),

        electricityKwh: Number(data.electricityKwh),
        renewableKwh: Number(data.renewableKwh),
        dgDieselLitres: Number(data.dgDieselLitres),

        waterKl: Number(data.waterKl),
        recycledWaterKl: Number(data.recycledWaterKl),

        totalWasteKg: Number(data.totalWasteKg),
        recycledWasteKg: Number(data.recycledWasteKg),
      },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to save monthly data",
    };
  }
}