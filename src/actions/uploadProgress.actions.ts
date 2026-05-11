"use server";

import { prisma } from "@/lib/db";

export async function getUploadProgress() {
  const org = await prisma.organization.findFirst({
    include: {
      monthlyData: true,
    },
  });

  if (!org) {
    return null;
  }

  const electricityMonths =
    org.monthlyData.filter(
      (m) => m.electricityKwh > 0
    ).length;

  const waterMonths =
    org.monthlyData.filter(
      (m) => m.waterKl > 0
    ).length;

  const fuelMonths =
    org.monthlyData.filter(
      (m) => m.dgDieselLitres > 0
    ).length;

  const wasteMonths =
    org.monthlyData.filter(
      (m) => m.totalWasteKg > 0
    ).length;

  return {
    electricityMonths,
    waterMonths,
    fuelMonths,
    wasteMonths,
  };
}