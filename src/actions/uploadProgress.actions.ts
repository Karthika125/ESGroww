"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/getUser";

const GOVERNANCE_FIELD_COUNT = 4;

export type GovernanceProgress = {
  answeredCount: number;
  totalCount: number;
  isComplete: boolean;
  lastUpdated: string | null;
};

export type UploadProgressPayload = {
  electricity: number;
  water: number;
  fuel: number;
  waste: number;
  refrigerants: number;
  transport: number;
  governance: GovernanceProgress;
};

function governanceProgressFromRow(
  row: {
    hasEsgPolicy: boolean;
    hasSustainabilityCommittee: boolean;
    hasAuditReports: boolean;
    hasComplianceDocs: boolean;
    createdAt: Date;
  } | null
): GovernanceProgress {
  if (!row) {
    return {
      answeredCount: 0,
      totalCount: GOVERNANCE_FIELD_COUNT,
      isComplete: false,
      lastUpdated: null,
    };
  }
  const flags = [
    row.hasEsgPolicy,
    row.hasSustainabilityCommittee,
    row.hasAuditReports,
    row.hasComplianceDocs,
  ];
  const answeredCount = flags.filter(Boolean).length;
  return {
    answeredCount,
    totalCount: GOVERNANCE_FIELD_COUNT,
    isComplete: answeredCount === GOVERNANCE_FIELD_COUNT,
    lastUpdated: row.createdAt.toISOString(),
  };
}

export async function getUploadProgress(): Promise<UploadProgressPayload | null> {
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
        governanceData: true,
      },
    });

  if (!hospital) {
    return null;
  }

  const governance = governanceProgressFromRow(hospital.governanceData);

  return {
    electricity: hospital.electricityData.length,
    water: hospital.waterData.length,
    fuel: hospital.fuelData.length,
    waste: hospital.wasteData.length,
    refrigerants: hospital.refrigerantData.length,
    transport: hospital.transportData.length,
    governance,
  };
}

export async function getRecentUploads(limit = 10) {
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

      take: Math.min(Math.max(limit, 1), 200),
    });

  return uploads;
}