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
calculateCertificationReadiness,
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
const user =
await getCurrentUser();
if (!user) {
throw new Error(
"Unauthorized"
);
}
const hospitalId =
user.hospitalId;
const hospital =
await prisma.hospital.findUnique({
where: {
id: hospitalId,
},
});
if (!hospital) {
throw new Error(
"Hospital not found"
);
}
const electricityData =
await prisma.electricityData.findMany({
where: {
hospitalId,
},
});
const waterData =
await prisma.waterData.findMany({
where: {
hospitalId,
},
});
const fuelData =
await prisma.fuelData.findMany({
where: {
hospitalId,
},
});
const wasteData =
await prisma.wasteData.findMany({
where: {
hospitalId,
},
});
const transportData =
await prisma.transportData.findMany({
where: {
hospitalId,
},
});
const refrigerantData =
await prisma.refrigerantData.findMany({
where: {
hospitalId,
},
});
const governanceData =
await prisma.governanceData.findUnique({
where: {
hospitalId,
},
});
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
const electricityMonths =
electricityData.length;
const waterMonths =
waterData.length;
const fuelMonths =
fuelData.length;
const wasteMonths =
wasteData.length;
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
const confidenceScore =
calculateConfidenceScore(
electricityMonths
);
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

// Calculate per-bed metrics
const energyPerBed = calculateEnergyPerBed(
annualizedElectricity,
hospital.numberOfBeds
);
const waterPerBed = calculateWaterPerBed(
annualizedWater,
hospital.numberOfBeds
);
const wastePerBed = calculateWastePerBed(
annualizedWaste,
hospital.numberOfBeds
);

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
const benchmarkScores =
calculateBenchmarkScores({
industry: hospital.industry,
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
energyPerBed,
waterPerBed,
wastePerBed,
});
const certificationReadiness =
calculateCertificationReadiness({
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
governanceScore:
governanceCompleteness,
completeness: overallCompleteness,
confidence: confidenceScore,
benchmarkScores,
});
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
const readinessStage =
determineReadinessStage({
completeness:
overallCompleteness,
confidence:
confidenceScore,
certificationReady:
Object.values(
certificationReadiness
).some(Boolean),
});

// Calculate category scores based on metrics
const categoryScores = calculateCategoryScores({
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
governanceScore: governanceCompleteness,
benchmarkScores,
electricityCompleteness,
waterCompleteness,
wasteCompleteness,
});

// Calculate regulatory readiness
const regulatoryReadiness = calculateRegulatoryReadiness({
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
governanceScore: governanceCompleteness,
completeness: overallCompleteness,
confidence: confidenceScore,
benchmarkScores,
});

// Identify strengths and gaps
const { strengths, gaps } = identifyStrengthsAndGaps({
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
governanceScore: governanceCompleteness,
completeness: overallCompleteness,
benchmarkScores,
electricityCompleteness,
waterCompleteness,
wasteCompleteness,
});

// Generate priority action roadmap
const roadmap = generatePriorityRoadmap({
renewablePercentage,
waterRecyclingPercentage,
wasteDiversionPercentage,
governanceScore: governanceCompleteness,
completeness: overallCompleteness,
benchmarkScores,
});
await prisma.assessmentHistory.create({
data: {
hospitalId,
completenessPct:
overallCompleteness,
confidenceScore,
annualizedValues: {
electricity:
annualizedElectricity,
water: annualizedWater,
fuel: annualizedFuel,
waste: annualizedWaste,
},
benchmarkScores,
certificationReadiness,
gapAnalysis,
readinessStage,
},
});
return {
overallScore,
readinessStage,
completeness:
overallCompleteness,
confidence: confidenceScore,
totalEmissions,
benchmarkScores,
certificationReadiness,
gapAnalysis,
annualizedValues: {
electricity:
annualizedElectricity,
water: annualizedWater,
fuel: annualizedFuel,
waste: annualizedWaste,
},
categoryScores,
regulatoryReadiness,
strengths,
gaps,
roadmap,
emissions: {
scope1: dieselEmissions + transportEmissions + refrigerantEmissions,
scope2: scope2Emissions,
scope3: 0,
},
orgName: hospital.hospitalName,
sector: hospital.industry,
};
}
