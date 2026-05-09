"use server";

import { calculateEmissions, calculateReadinessScores } from "@/lib/esgCalculations";
import { prisma } from "@/lib/db";

export async function fetchDashboardIntelligence(
  orgId: string = "mock-id"
) {
  /**
   * FETCH ORGANIZATION
   */
  const org = await prisma.organization.findFirst();

  if (!org) {
    throw new Error(
      "No organization found. Please add one in Prisma Studio."
    );
  }

  /**
   * TEMP MOCK DATA
   * Since monthlyData/governanceData relations
   * are not created yet in Prisma schema,
   * we simulate operational sustainability data.
   */

  const monthlyData = [
    {
      electricityKwh: 88000,
      renewableKwh: 0,
      dgDieselLitres: 1200,
      waterKl: 2400,
      recycledWaterKl: 600,
      totalWasteKg: 12000,
      recycledWasteKg: 7000,
    },
  ];

  const governanceData = {
    hasEsgPolicy: true,
    hasSustainabilityComm: true,
    hasAuditReports: true,
    hasComplianceDocs: true,
  };

  /**
   * MONTH CALCULATIONS
   */
  const monthsUploaded = monthlyData?.length || 1;
  const extrapolationFactor = 12 / monthsUploaded;

  /**
   * ENERGY
   */
  const electricityKwh =
    monthlyData.reduce(
      (acc, m) => acc + (m.electricityKwh || 0),
      0
    ) * extrapolationFactor;

  const renewableKwh =
    monthlyData.reduce(
      (acc, m) => acc + (m.renewableKwh || 0),
      0
    ) * extrapolationFactor;

  const dgDieselLitres =
    monthlyData.reduce(
      (acc, m) => acc + (m.dgDieselLitres || 0),
      0
    ) * extrapolationFactor;

  /**
   * WATER
   */
  const waterKl =
    monthlyData.reduce(
      (acc, m) => acc + (m.waterKl || 0),
      0
    ) * extrapolationFactor;

  const recycledWaterKl =
    monthlyData.reduce(
      (acc, m) => acc + (m.recycledWaterKl || 0),
      0
    ) * extrapolationFactor;

  /**
   * WASTE
   */
  const totalWasteKg =
    monthlyData.reduce(
      (acc, m) => acc + (m.totalWasteKg || 0),
      0
    ) * extrapolationFactor;

  const recycledWasteKg =
    monthlyData.reduce(
      (acc, m) => acc + (m.recycledWasteKg || 0),
      0
    ) * extrapolationFactor;

  /**
   * EMISSIONS
   */
  const emissions = calculateEmissions(
    electricityKwh,
    dgDieselLitres
  );

  /**
   * ESG READINESS
   */
  const readiness = calculateReadinessScores({
    energyKwh: electricityKwh,
    renewableKwh,
    waterKl,
    recycledWaterKl,
    totalWasteKg,
    recycledWasteKg,
    govPolicy: governanceData.hasEsgPolicy,
    govComm: governanceData.hasSustainabilityComm,
    govAudit: governanceData.hasAuditReports,
    govDocs: governanceData.hasComplianceDocs,
  });

  /**
   * KPI CALCULATIONS
   */
  const builtUpArea = 10000;

  const energyIntensity =
    builtUpArea > 0
      ? electricityKwh / builtUpArea
      : 0;

  const waterIntensity =
    builtUpArea > 0
      ? waterKl / builtUpArea
      : 0;

  /**
   * CERTIFICATION MAPPING
   */
  let recommendedCertifications = [
    {
      name: "ISO 14001",
      score: readiness.totalScore + 4,
      status:
        readiness.totalScore > 75
          ? "Strong Readiness"
          : "Moderate Readiness",
      color:
        readiness.totalScore > 75
          ? "text-emerald-600"
          : "text-amber-600",
      time: "6-12 months",
    },
  ];

  if (org.industry === "Healthcare") {
    recommendedCertifications.unshift(
      {
        name: "NABH",
        score: readiness.totalScore + 10,
        status:
          readiness.totalScore > 70
            ? "Strong Readiness"
            : "Certification Possible",
        color: "text-emerald-600",
        time: "3-6 months",
      },
      {
        name: "IGBC Healthcare",
        score: readiness.totalScore + 2,
        status: "Certification Possible",
        color: "text-amber-600",
        time: "6-12 months",
      }
    );
  }

  /**
   * FINAL RESPONSE
   */
  return {
    organization: org.companyName,
    industry: org.industry,

    emissions,

    readiness,

    kpis: {
      energyIntensity:
        energyIntensity.toFixed(2),

      waterIntensity:
        waterIntensity.toFixed(2),

      renewablePercentage:
        (
          (renewableKwh / electricityKwh) *
          100
        ).toFixed(2),

      recyclingRate:
        (
          (recycledWasteKg / totalWasteKg) *
          100
        ).toFixed(2),
    },

    certifications:
      recommendedCertifications,
  };
}