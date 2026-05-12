"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/getUser";

export async function getUploadProgress() {
  const user = await getCurrentUser();

  if (!user || typeof user === "string" || !("hospitalId" in user)) {
    return null;
  }

  const hospitalId = String(user.hospitalId);

  const hospital =
    await prisma.hospital.findUnique({
      where: {
        id: hospitalId,
      },
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
export async function getRecentUploads() {
  const user = await getCurrentUser();

  if (!user || typeof user === "string" || !("hospitalId" in user)) {
    return null;
  }

  const hospitalId = String(user.hospitalId);

  const uploads =
    await prisma.upload.findMany({
      where: {
        hospitalId,
      },
      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });

  return uploads;
}