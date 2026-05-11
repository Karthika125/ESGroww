"use server";

import { prisma } from "@/lib/db";

export async function getUploadProgress() {
  const hospital =
    await prisma.hospital.findFirst({
      include: {
        electricityData: true,
        waterData: true,
        fuelData: true,
        wasteData: true,
        refrigerantData: true,
        transportData: true,
      },
    });

  if (!hospital) {
    return null;
  }

  return {
    electricity:
      hospital.electricityData.length,

    water:
      hospital.waterData.length,

    fuel:
      hospital.fuelData.length,

    waste:
      hospital.wasteData.length,

    refrigerants:
      hospital.refrigerantData.length,

    transport:
      hospital.transportData.length,
  };
}