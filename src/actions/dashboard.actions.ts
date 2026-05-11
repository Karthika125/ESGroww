"use server";

import { prisma } from "@/lib/db";

import {
  calculateScope2Emissions,
  calculateDieselEmissions,
  calculateTransportEmissions,
  calculateRefrigerantEmissions,

  calculateRenewablePercentage,
  calculateWaterRecyclingPercentage,
  calculateWasteDiversionPercentage,

  calculateEnergyPerBed,
  calculateWaterPerBed,
  calculateWastePerBed,

  calculateESGReadinessScore,
} from "@/lib/esgCalculations";

export async function fetchDashboardIntelligence() {
  const hospital =
    await prisma.hospital.findFirst({
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
    throw new Error(
      "No hospital found."
    );
  }

  /* =============================== */
  /* ELECTRICITY                     */
  /* =============================== */

  const electricityKwh =
    hospital.electricityData.reduce(
      (acc, row) =>
        acc + row.electricityKwh,
      0
    );

  const renewableKwh =
    hospital.electricityData.reduce(
      (acc, row) =>
        acc + row.renewableKwh,
      0
    );

  /* =============================== */
  /* WATER                           */
  /* =============================== */

  const waterKl =
    hospital.waterData.reduce(
      (acc, row) =>
        acc + row.waterKl,
      0
    );

  const recycledWaterKl =
    hospital.waterData.reduce(
      (acc, row) =>
        acc + row.recycledWaterKl,
      0
    );

  /* =============================== */
  /* FUEL                            */
  /* =============================== */

  const dgDieselLitres =
    hospital.fuelData.reduce(
      (acc, row) =>
        acc + row.dgDieselLitres,
      0
    );

  /* =============================== */
  /* WASTE                           */
  /* =============================== */

  const totalWasteKg =
    hospital.wasteData.reduce(
      (acc, row) =>
        acc +
        row.biomedicalWasteKg +
        row.recyclableWasteKg +
        row.landfillWasteKg,
      0
    );

  const recyclableWasteKg =
    hospital.wasteData.reduce(
      (acc, row) =>
        acc +
        row.recyclableWasteKg,
      0
    );

  /* =============================== */
  /* TRANSPORT                       */
  /* =============================== */

  const ambulanceFuelLitres =
    hospital.transportData.reduce(
      (acc, row) =>
        acc +
        row.ambulanceFuelLitres,
      0
    );

  /* =============================== */
  /* EMISSIONS                       */
  /* =============================== */

  const scope2Emissions =
    calculateScope2Emissions(
      electricityKwh
    );

  const dieselEmissions =
    calculateDieselEmissions(
      dgDieselLitres
    );

  const transportEmissions =
    calculateTransportEmissions(
      ambulanceFuelLitres
    );

  let refrigerantEmissions = 0;

  for (const row of hospital.refrigerantData) {
    refrigerantEmissions +=
      calculateRefrigerantEmissions(
        row.refrigerantType,
        row.refrigerantLeakKg
      );
  }

  const totalEmissions =
    scope2Emissions +
    dieselEmissions +
    transportEmissions +
    refrigerantEmissions;

  /* =============================== */
  /* PERCENTAGES                     */
  /* =============================== */

  const renewablePercentage =
    calculateRenewablePercentage(
      renewableKwh,
      electricityKwh
    );

  const waterRecyclingPercentage =
    calculateWaterRecyclingPercentage(
      recycledWaterKl,
      waterKl
    );

  const wasteDiversionPercentage =
    calculateWasteDiversionPercentage(
      recyclableWasteKg,
      totalWasteKg
    );

  /* =============================== */
  /* HOSPITAL KPIs                   */
  /* =============================== */

  const energyPerBed =
    calculateEnergyPerBed(
      electricityKwh,
      hospital.numberOfBeds
    );

  const waterPerBed =
    calculateWaterPerBed(
      waterKl,
      hospital.numberOfBeds
    );

  const wastePerBed =
    calculateWastePerBed(
      totalWasteKg,
      hospital.numberOfBeds
    );

  /* =============================== */
  /* ESG READINESS SCORE             */
  /* =============================== */

  const readinessScore =
    calculateESGReadinessScore({
      renewablePercentage,

      waterRecyclingPercentage,

      wasteDiversionPercentage,

      hasEsgPolicy:
        hospital.governanceData
          ?.hasEsgPolicy || false,

      hasAuditReports:
        hospital.governanceData
          ?.hasAuditReports || false,
    });

  /* =============================== */
  /* CERTIFICATIONS                  */
  /* =============================== */

  const certifications = [
    {
      name: "NABH",

      readiness:
        readinessScore > 75
          ? "Strong Readiness"
          : "Moderate Readiness",
    },

    {
      name: "ISO 14001",

      readiness:
        readinessScore > 65
          ? "Certification Possible"
          : "Needs Improvement",
    },

    {
      name: "IGBC Healthcare",

      readiness:
        readinessScore > 70
          ? "Strong Potential"
          : "Developing",
    },
  ];

  /* =============================== */
  /* FINAL RESPONSE                  */
  /* =============================== */

  return {
    hospitalName:
      hospital.hospitalName,

    industry:
      hospital.industry,

    emissions: {
      scope2Emissions:
        scope2Emissions.toFixed(2),

      dieselEmissions:
        dieselEmissions.toFixed(2),

      transportEmissions:
        transportEmissions.toFixed(2),

      refrigerantEmissions:
        refrigerantEmissions.toFixed(2),

      totalEmissions:
        totalEmissions.toFixed(2),
    },

    percentages: {
      renewablePercentage:
        renewablePercentage.toFixed(2),

      waterRecyclingPercentage:
        waterRecyclingPercentage.toFixed(2),

      wasteDiversionPercentage:
        wasteDiversionPercentage.toFixed(2),
    },

    kpis: {
      energyPerBed:
        energyPerBed.toFixed(2),

      waterPerBed:
        waterPerBed.toFixed(2),

      wastePerBed:
        wastePerBed.toFixed(2),
    },

    readinessScore,

    certifications,
  };
}