"use server";

import { prisma } from "@/lib/db";

const HOSPITAL_ID =
  "cmp2d6lbg0001gjjez1d6axq9a";

export async function getSummaryData() {
  let hospital =
    await prisma.hospital.findUnique({
      where: {
        id: HOSPITAL_ID,
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
    const fallbackHospital =
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

    if (!fallbackHospital) {
      throw new Error(
        `Hospital not found for id ${HOSPITAL_ID}. No hospitals exist in the database.`
      );
    }

    console.warn(
      `Hospital id ${HOSPITAL_ID} not found. Falling back to hospital id ${fallbackHospital.id}.`
    );

    hospital = fallbackHospital;
  }

  /* ========================== */
  /* MONTH COVERAGE             */
  /* ========================== */

  const electricityMonths =
    hospital.electricityData.length;

  const waterMonths =
    hospital.waterData.length;

  const fuelMonths =
    hospital.fuelData.length;

  const wasteMonths =
    hospital.wasteData.length;

  const refrigerantMonths =
    hospital.refrigerantData.length;

  const transportMonths =
    hospital.transportData.length;

  /* ========================== */
  /* TOTALS                     */
  /* ========================== */

  const totalElectricity =
    hospital.electricityData.reduce(
      (acc, row) =>
        acc + row.electricityKwh,
      0
    );

  const renewableElectricity =
    hospital.electricityData.reduce(
      (acc, row) =>
        acc + row.renewableKwh,
      0
    );

  const totalWater =
    hospital.waterData.reduce(
      (acc, row) =>
        acc + row.waterKl,
      0
    );

  const recycledWater =
    hospital.waterData.reduce(
      (acc, row) =>
        acc + row.recycledWaterKl,
      0
    );

  const totalDiesel =
    hospital.fuelData.reduce(
      (acc, row) =>
        acc + row.dgDieselLitres,
      0
    );

  const totalWaste =
    hospital.wasteData.reduce(
      (acc, row) =>
        acc +
        row.biomedicalWasteKg +
        row.recyclableWasteKg +
        row.landfillWasteKg,
      0
    );

  const recyclableWaste =
    hospital.wasteData.reduce(
      (acc, row) =>
        acc +
        row.recyclableWasteKg,
      0
    );

  /* ========================== */
  /* PERCENTAGES                */
  /* ========================== */

  const renewablePercentage =
    totalElectricity > 0
      ? (
          (renewableElectricity /
            totalElectricity) *
          100
        ).toFixed(2)
      : "0";

  const waterRecyclePercentage =
    totalWater > 0
      ? (
          (recycledWater /
            totalWater) *
          100
        ).toFixed(2)
      : "0";

  const wasteRecyclePercentage =
    totalWaste > 0
      ? (
          (recyclableWaste /
            totalWaste) *
          100
        ).toFixed(2)
      : "0";

  /* ========================== */
  /* DATA QUALITY CHECKS        */
  /* ========================== */

  const checks = [
    {
      label:
        "Electricity data sufficient",

      status:
        electricityMonths >= 6,
    },

    {
      label:
        "Water data sufficient",

      status:
        waterMonths >= 6,
    },

    {
      label:
        "Waste tracking available",

      status:
        wasteMonths > 0,
    },

    {
      label:
        "Fuel monitoring available",

      status:
        fuelMonths > 0,
    },

    {
      label:
        "Transport tracking available",

      status:
        transportMonths > 0,
    },
  ];

  /* ========================== */
  /* FINAL RESPONSE             */
  /* ========================== */

  return {
    hospital: {
      name:
        hospital.hospitalName,

      industry:
        hospital.industry,

      beds:
        hospital.numberOfBeds,

      builtUpArea:
        hospital.builtUpArea,
    },

    coverage: {
      electricityMonths,
      waterMonths,
      fuelMonths,
      wasteMonths,
      refrigerantMonths,
      transportMonths,
    },

    totals: {
      totalElectricity,
      renewableElectricity,

      totalWater,
      recycledWater,

      totalDiesel,

      totalWaste,
      recyclableWaste,
    },

    percentages: {
      renewablePercentage,

      waterRecyclePercentage,

      wasteRecyclePercentage,
    },

    checks,
  };
}