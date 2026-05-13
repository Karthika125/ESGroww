"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

import {
  calculateScope2Emissions,
  calculateDieselEmissions,
  calculateTransportEmissions,
  calculateRefrigerantEmissions,
  calculateRenewablePercentage,
  calculateWaterRecyclingPercentage,
  calculateWasteDiversionPercentage,
  calculateESGReadinessScore,
  calculateCategoryCompleteness,
  calculateOverallCompleteness,
  calculateConfidenceScore,
  annualizeElectricity,
  annualizeWater,
  annualizeFuel,
  annualizeWaste,
  calculateBenchmarkScores,
  calculateGapAnalysis,
  determineReadinessStage,
  calculateEnergyPerBed,
  calculateWaterPerBed,
  calculateWastePerBed,
  calculateCategoryScores,
  calculateRegulatoryReadiness,
  identifyStrengthsAndGaps,
  generatePriorityRoadmap,
} from "@/lib/esgCalculations";

export async function computeAndSaveAssessment() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const hospitalId = user.hospitalId;

  const hospital = await prisma.hospital.findUnique({
    where: {
      id: hospitalId,
    },
  });

  if (!hospital) {
    throw new Error("Hospital not found");
  }

  // ─────────────────────────────────────────────
  // FETCH DATA
  // ─────────────────────────────────────────────

  const electricityData =
    await prisma.electricityData.findMany({
      where: { hospitalId },
    });

  const waterData =
    await prisma.waterData.findMany({
      where: { hospitalId },
    });

  const fuelData =
    await prisma.fuelData.findMany({
      where: { hospitalId },
    });

  const wasteData =
    await prisma.wasteData.findMany({
      where: { hospitalId },
    });

  const transportData =
    await prisma.transportData.findMany({
      where: { hospitalId },
    });

  const refrigerantData =
    await prisma.refrigerantData.findMany({
      where: { hospitalId },
    });

  const governanceData =
    await prisma.governanceData.findUnique({
      where: { hospitalId },
    });

  // ─────────────────────────────────────────────
  // TOTALS
  // ─────────────────────────────────────────────

  const totalElectricity =
    electricityData.reduce(
      (sum, row) =>
        sum + row.electricityKwh,
      0
    );

  const totalRenewable =
    electricityData.reduce(
      (sum, row) =>
        sum + row.renewableKwh,
      0
    );

  const totalWater =
    waterData.reduce(
      (sum, row) =>
        sum + row.waterKl,
      0
    );

  const totalRecycledWater =
    waterData.reduce(
      (sum, row) =>
        sum + row.recycledWaterKl,
      0
    );

  const totalFuel =
    fuelData.reduce(
      (sum, row) =>
        sum + row.dgDieselLitres,
      0
    );

  const totalWaste =
    wasteData.reduce(
      (sum, row) =>
        sum +
        row.biomedicalWasteKg +
        row.recyclableWasteKg +
        row.landfillWasteKg,
      0
    );

  const recyclableWaste =
    wasteData.reduce(
      (sum, row) =>
        sum + row.recyclableWasteKg,
      0
    );

  // ─────────────────────────────────────────────
  // MONTH COUNTS
  // ─────────────────────────────────────────────

  const electricityMonths =
    electricityData.length;

  const waterMonths =
    waterData.length;

  const fuelMonths =
    fuelData.length;

  const wasteMonths =
    wasteData.length;

  // ─────────────────────────────────────────────
  // COMPLETENESS
  // ─────────────────────────────────────────────

  const electricityCompleteness =
    calculateCategoryCompleteness(
      electricityMonths
    );

  const waterCompleteness =
    calculateCategoryCompleteness(
      waterMonths
    );

  const wasteCompleteness =
    calculateCategoryCompleteness(
      wasteMonths
    );

  const governanceCompleteness =
    governanceData ? 100 : 0;

  const overallCompleteness =
    calculateOverallCompleteness({
      electricityCompleteness,
      waterCompleteness,
      wasteCompleteness,
      governanceCompleteness,
    });

  // ─────────────────────────────────────────────
  // CONFIDENCE ENGINE
  // ─────────────────────────────────────────────

  const electricityConfidence =
    calculateConfidenceScore(
      electricityMonths
    );

  const waterConfidence =
    calculateConfidenceScore(
      waterMonths
    );

  const fuelConfidence =
    calculateConfidenceScore(
      fuelMonths
    );

  const wasteConfidence =
    calculateConfidenceScore(
      wasteMonths
    );

  const confidenceScore =
    (
      electricityConfidence +
      waterConfidence +
      fuelConfidence +
      wasteConfidence
    ) / 4;

  // ─────────────────────────────────────────────
  // ANNUALIZATION
  // ─────────────────────────────────────────────

  const annualizedElectricity =
    annualizeElectricity(
      totalElectricity,
      electricityMonths
    );

  const annualizedWater =
    annualizeWater(
      totalWater,
      waterMonths
    );

  const annualizedFuel =
    annualizeFuel(
      totalFuel,
      fuelMonths
    );

  const annualizedWaste =
    annualizeWaste(
      totalWaste,
      wasteMonths
    );

  // ─────────────────────────────────────────────
  // EMISSIONS
  // ─────────────────────────────────────────────

  const scope2Emissions =
    calculateScope2Emissions(
      annualizedElectricity
    );

  const dieselEmissions =
    calculateDieselEmissions(
      annualizedFuel
    );

  const transportEmissions =
    transportData.reduce(
      (sum, row) =>
        sum +
        calculateTransportEmissions(
          row.ambulanceFuelLitres
        ),
      0
    );

  const refrigerantEmissions =
    refrigerantData.reduce(
      (sum, row) =>
        sum +
        calculateRefrigerantEmissions(
          row.refrigerantType,
          row.refrigerantLeakKg
        ),
      0
    );

  const totalEmissions =
    scope2Emissions +
    dieselEmissions +
    transportEmissions +
    refrigerantEmissions;

  // ─────────────────────────────────────────────
  // ESG METRICS
  // ─────────────────────────────────────────────

  const renewablePercentage =
    calculateRenewablePercentage(
      totalRenewable,
      totalElectricity
    );

  const waterRecyclingPercentage =
    calculateWaterRecyclingPercentage(
      totalRecycledWater,
      totalWater
    );

  const wasteDiversionPercentage =
    calculateWasteDiversionPercentage(
      recyclableWaste,
      totalWaste
    );

  // ─────────────────────────────────────────────
  // PER BED METRICS
  // ─────────────────────────────────────────────

  const energyPerBed =
    calculateEnergyPerBed(
      annualizedElectricity,
      hospital.numberOfBeds
    );

  const waterPerBed =
    calculateWaterPerBed(
      annualizedWater,
      hospital.numberOfBeds
    );

  const wastePerBed =
    calculateWastePerBed(
      annualizedWaste,
      hospital.numberOfBeds
    );

  // ─────────────────────────────────────────────
  // OVERALL ESG SCORE
  // ─────────────────────────────────────────────

  const overallScore =
    calculateESGReadinessScore({
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      hasEsgPolicy:
        governanceData?.hasEsgPolicy ||
        false,
      hasAuditReports:
        governanceData?.hasAuditReports ||
        false,
      coverageRatio:
        confidenceScore,
    });

  // ─────────────────────────────────────────────
  // BENCHMARKS
  // ─────────────────────────────────────────────

  const benchmarkScores =
    calculateBenchmarkScores({
      industry:
        hospital.industry,
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      energyPerBed,
      waterPerBed,
      wastePerBed,
    });

  // ─────────────────────────────────────────────
  // CATEGORY SCORES
  // ─────────────────────────────────────────────

  const categoryScores =
    calculateCategoryScores({
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      governanceScore:
        governanceCompleteness,
      benchmarkScores,
      electricityCompleteness,
      waterCompleteness,
      wasteCompleteness,
    });

  // ─────────────────────────────────────────────
  // GAP ANALYSIS
  // ─────────────────────────────────────────────

  const gapAnalysis =
    calculateGapAnalysis(
      {
        renewableScore:
          renewablePercentage,

        waterScore:
          waterRecyclingPercentage,

        wasteScore:
          wasteDiversionPercentage,
      },
      benchmarkScores
    );

  // ─────────────────────────────────────────────
  // READINESS STAGE
  // ─────────────────────────────────────────────

  const readinessStage =
    determineReadinessStage({
      completeness:
        overallCompleteness,
      confidence:
        confidenceScore,
      certificationReady:
        overallScore >= 70,
    });

  // ─────────────────────────────────────────────
  // REGULATORY READINESS
  // ─────────────────────────────────────────────

  const regulatoryReadiness =
    calculateRegulatoryReadiness({
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      governanceScore:
        governanceCompleteness,
      completeness:
        overallCompleteness,
      confidence:
        confidenceScore,
      benchmarkScores,
    });

  // ─────────────────────────────────────────────
  // STRENGTHS & GAPS
  // ─────────────────────────────────────────────

  const {
    strengths,
    gaps,
  } =
    identifyStrengthsAndGaps({
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      governanceScore:
        governanceCompleteness,
      completeness:
        overallCompleteness,
      benchmarkScores,
      electricityCompleteness,
      waterCompleteness,
      wasteCompleteness,
    });

  // ─────────────────────────────────────────────
  // ROADMAP
  // ─────────────────────────────────────────────

  const roadmap =
    generatePriorityRoadmap({
      renewablePercentage,
      waterRecyclingPercentage,
      wasteDiversionPercentage,
      governanceScore:
        governanceCompleteness,
      completeness:
        overallCompleteness,
      benchmarkScores,
    });

  // ─────────────────────────────────────────────
  // CATEGORY CONFIDENCE
  // ─────────────────────────────────────────────

  const categoryConfidence = [
    {
      category: "Energy",
      months:
        electricityMonths,
      confidence:
        electricityConfidence,
    },

    {
      category: "Water",
      months:
        waterMonths,
      confidence:
        waterConfidence,
    },

    {
      category: "Fuel",
      months:
        fuelMonths,
      confidence:
        fuelConfidence,
    },

    {
      category: "Waste",
      months:
        wasteMonths,
      confidence:
        wasteConfidence,
    },
  ];

  // ─────────────────────────────────────────────
  // REAL CERTIFICATION ENGINE
  // ─────────────────────────────────────────────

  const certificationReadinessArray =
    [
      {
        name: "ISO14001",

        score: Math.round(
          (
            waterRecyclingPercentage *
              0.25 +
            wasteDiversionPercentage *
              0.25 +
            renewablePercentage *
              0.2 +
            governanceCompleteness *
              0.3
          )
        ),

        status:
          governanceCompleteness >=
            70 &&
          waterRecyclingPercentage >=
            30
            ? "Strong Readiness"
            : governanceCompleteness >=
              50
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "ISO50001",

        score: Math.round(
          (
            renewablePercentage *
              0.45 +
            (benchmarkScores.energyIntensityScore ||
              0) *
              0.35 +
            governanceCompleteness *
              0.2
          )
        ),

        status:
          renewablePercentage >=
          50
            ? "Certification Possible"
            : renewablePercentage >=
              25
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "NABH",

        score: Math.round(
          (
            overallCompleteness *
              0.4 +
            confidenceScore *
              100 *
              0.2 +
            governanceCompleteness *
              0.4
          )
        ),

        status:
          overallCompleteness >=
          80
            ? "Strong Readiness"
            : overallCompleteness >=
              60
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "IGBC",

        score: Math.round(
          (
            renewablePercentage *
              0.3 +
            waterRecyclingPercentage *
              0.2 +
            wasteDiversionPercentage *
              0.2 +
            (benchmarkScores.energyIntensityScore ||
              0) *
              0.3
          )
        ),

        status:
          renewablePercentage >=
          40
            ? "Certification Possible"
            : renewablePercentage >=
              20
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "LEED",

        score: Math.round(
          (
            renewablePercentage *
              0.35 +
            waterRecyclingPercentage *
              0.25 +
            wasteDiversionPercentage *
              0.2 +
            (benchmarkScores.energyIntensityScore ||
              0) *
              0.2
          )
        ),

        status:
          renewablePercentage >=
          35
            ? "Certification Possible"
            : renewablePercentage >=
              15
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "WELL",

        score: Math.round(
          (
            waterRecyclingPercentage *
              0.4 +
            governanceCompleteness *
              0.3 +
            (benchmarkScores.energyIntensityScore ||
              0) *
              0.3
          )
        ),

        status:
          waterRecyclingPercentage >=
          25
            ? "Certification Possible"
            : waterRecyclingPercentage >=
              10
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "BRSR",

        score: Math.round(
          (
            overallCompleteness *
              0.4 +
            governanceCompleteness *
              0.3 +
            renewablePercentage *
              0.3
          )
        ),

        status:
          overallCompleteness >=
          75
            ? "Strong Readiness"
            : overallCompleteness >=
              50
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "GRI",

        score: Math.round(
          (
            overallCompleteness *
              0.5 +
            confidenceScore *
              100 *
              0.5
          )
        ),

        status:
          overallCompleteness >=
          70
            ? "Certification Possible"
            : overallCompleteness >=
              40
            ? "Foundational"
            : "Not Ready",
      },

      {
        name: "CDP",

        score: Math.round(
          (
            renewablePercentage *
              0.5 +
            (benchmarkScores.energyIntensityScore ||
              0) *
              0.5
          )
        ),

        status:
          renewablePercentage >=
          30
            ? "Certification Possible"
            : renewablePercentage >=
              15
            ? "Foundational"
            : "Not Ready",
      },
    ];

  // ─────────────────────────────────────────────
  // SAVE HISTORY
  // ─────────────────────────────────────────────

  await prisma.assessmentHistory.create({
    data: {
      hospitalId,

      completenessPct:
        overallCompleteness,

      confidenceScore,

      annualizedValues: {
        electricity:
          annualizedElectricity,

        water:
          annualizedWater,

        fuel:
          annualizedFuel,

        waste:
          annualizedWaste,
      },

      benchmarkScores,

      certificationReadiness:
        certificationReadinessArray,

      gapAnalysis,

      readinessStage,
    },
  });

  // ─────────────────────────────────────────────
  // FINAL RESPONSE
  // ─────────────────────────────────────────────

  return {
    overallScore,

    readinessStage,

    completeness:
      overallCompleteness,

    confidence:
      confidenceScore,

    totalEmissions,

    orgName:
      hospital.hospitalName,

    sector:
      hospital.industry,

    benchmarkScores,

    annualizedValues: {
      electricity:
        electricityMonths >= 3
          ? annualizedElectricity
          : null,

      water:
        waterMonths >= 3
          ? annualizedWater
          : null,

      fuel:
        fuelMonths >= 3
          ? annualizedFuel
          : null,

      waste:
        wasteMonths >= 3
          ? annualizedWaste
          : null,

      monthsUploaded: {
        electricity:
          electricityMonths,

        water: waterMonths,

        fuel: fuelMonths,

        waste: wasteMonths,
      },
    },

    categoryScores: {
      energy:
        electricityMonths >= 3
          ? categoryScores.energy
          : 0,

      water:
        waterMonths >= 3
          ? categoryScores.water
          : 0,

      waste:
        wasteMonths >= 3
          ? categoryScores.waste
          : 0,

      governance:
        categoryScores.governance,
    },

    categoryConfidence,

    certificationReadiness:
      certificationReadinessArray,

    gapAnalysis,

    strengths,

    gaps,

    regulatoryReadiness,

    roadmap,

    emissions: {
      scope1:
        dieselEmissions +
        transportEmissions +
        refrigerantEmissions,

      scope2:
        scope2Emissions,

      scope3: 0,
    },

    metadata: {
      minimumRequiredMonths: 3,

      dataAvailability: {
        electricity:
          electricityMonths > 0,

        water:
          waterMonths > 0,

        fuel:
          fuelMonths > 0,

        waste:
          wasteMonths > 0,
      },

      insufficientData: {
        electricity:
          electricityMonths > 0 &&
          electricityMonths < 3,

        water:
          waterMonths > 0 &&
          waterMonths < 3,

        fuel:
          fuelMonths > 0 &&
          fuelMonths < 3,

        waste:
          wasteMonths > 0 &&
          wasteMonths < 3,
      },

      messages: {
        electricity:
          electricityMonths < 3
            ? `Minimum 3 months required. Only ${electricityMonths} month(s) uploaded.`
            : null,

        water:
          waterMonths < 3
            ? `Minimum 3 months required. Only ${waterMonths} month(s) uploaded.`
            : null,

        fuel:
          fuelMonths < 3
            ? `Minimum 3 months required. Only ${fuelMonths} month(s) uploaded.`
            : null,

        waste:
          wasteMonths < 3
            ? `Minimum 3 months required. Only ${wasteMonths} month(s) uploaded.`
            : null,
      },
    },

    // Add percentage metrics needed for KPI calculations
    percentages: {
      renewableEnergy:
        renewablePercentage,
      waterRecycling:
        waterRecyclingPercentage,
      wasteRecycling:
        wasteDiversionPercentage,
    },

    // Add per-bed and per-sqft metrics
    perBedMetrics: {
      energyPerBed,
      waterPerBed,
      wastePerBed,
    },

    // Hospital info needed for KPI cards
    orgBeds:
      hospital.numberOfBeds,

    orgName:
      hospital.hospitalName,

    // Total values for reference
    totals: {
      electricity:
        totalElectricity,
      renewable:
        totalRenewable,
      water:
        totalWater,
      recycledWater:
        totalRecycledWater,
      fuel:
        totalFuel,
      waste:
        totalWaste,
      recyclableWaste,
    },
  };
}