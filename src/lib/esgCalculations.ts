/* ========================================= */
/* ESGROWW HOSPITAL ESG CALCULATION ENGINE   */
/* ========================================= */

/**
 * EMISSION FACTORS
 *
 * NOTE:
 * These can later be moved to DB/config.
 */

const EMISSION_FACTORS = {
  electricity: 0.82, // kg CO2e / kWh

  diesel: 2.68, // kg CO2e / litre

  ambulanceFuel: 2.68,

  refrigerants: {
    R410A: 2088,
    R32: 675,
    R134A: 1430,
  },
};

/* ========================================= */
/* SCOPE 2 EMISSIONS                         */
/* ========================================= */

export function calculateScope2Emissions(
  electricityKwh: number
) {
  return (
    electricityKwh *
    EMISSION_FACTORS.electricity
  );
}

/* ========================================= */
/* SCOPE 1 EMISSIONS                         */
/* ========================================= */

export function calculateDieselEmissions(
  dgDieselLitres: number
) {
  return (
    dgDieselLitres *
    EMISSION_FACTORS.diesel
  );
}

/* ========================================= */
/* TRANSPORT EMISSIONS                       */
/* ========================================= */

export function calculateTransportEmissions(
  ambulanceFuelLitres: number
) {
  return (
    ambulanceFuelLitres *
    EMISSION_FACTORS.ambulanceFuel
  );
}

/* ========================================= */
/* REFRIGERANT EMISSIONS                     */
/* ========================================= */

export function calculateRefrigerantEmissions(
  refrigerantType: string,
  leakKg: number
) {
  const factor =
    EMISSION_FACTORS.refrigerants[
      refrigerantType as keyof typeof EMISSION_FACTORS.refrigerants
    ] || 0;

  return factor * leakKg;
}

/* ========================================= */
/* RENEWABLE ENERGY PERCENTAGE               */
/* ========================================= */

export function calculateRenewablePercentage(
  renewableKwh: number,
  totalElectricityKwh: number
) {
  if (totalElectricityKwh === 0)
    return 0;

  return (
    (renewableKwh /
      totalElectricityKwh) *
    100
  );
}

/* ========================================= */
/* WATER RECYCLING PERCENTAGE                */
/* ========================================= */

export function calculateWaterRecyclingPercentage(
  recycledWaterKl: number,
  totalWaterKl: number
) {
  if (totalWaterKl === 0)
    return 0;

  return (
    (recycledWaterKl /
      totalWaterKl) *
    100
  );
}

/* ========================================= */
/* WASTE DIVERSION PERCENTAGE                */
/* ========================================= */

export function calculateWasteDiversionPercentage(
  recyclableWasteKg: number,
  totalWasteKg: number
) {
  if (totalWasteKg === 0)
    return 0;

  return (
    (recyclableWasteKg /
      totalWasteKg) *
    100
  );
}

/* ========================================= */
/* ENERGY INTENSITY PER BED                  */
/* ========================================= */

export function calculateEnergyPerBed(
  electricityKwh: number,
  numberOfBeds: number
) {
  if (numberOfBeds === 0)
    return 0;

  return (
    electricityKwh / numberOfBeds
  );
}

/* ========================================= */
/* WATER INTENSITY PER BED                   */
/* ========================================= */

export function calculateWaterPerBed(
  waterKl: number,
  numberOfBeds: number
) {
  if (numberOfBeds === 0)
    return 0;

  return waterKl / numberOfBeds;
}

/* ========================================= */
/* WASTE PER BED                             */
/* ========================================= */

export function calculateWastePerBed(
  wasteKg: number,
  numberOfBeds: number
) {
  if (numberOfBeds === 0)
    return 0;

  return wasteKg / numberOfBeds;
}

/* ========================================= */
/* ESG READINESS SCORE                       */
/* ========================================= */

export function calculateESGReadinessScore({
  renewablePercentage,
  waterRecyclingPercentage,
  wasteDiversionPercentage,
  hasEsgPolicy,
  hasAuditReports,
  coverageRatio = 1,
}: {
  renewablePercentage: number;

  waterRecyclingPercentage: number;

  wasteDiversionPercentage: number;

  hasEsgPolicy: boolean;

  hasAuditReports: boolean;

  coverageRatio?: number;
}) {
  let score = 0;

  /**
   * ENVIRONMENTAL
   */

  score += renewablePercentage * 0.25;

  score +=
    waterRecyclingPercentage * 0.2;

  score +=
    wasteDiversionPercentage * 0.2;

  /**
   * GOVERNANCE
   */

  if (hasEsgPolicy) score += 15;

  if (hasAuditReports) score += 20;

  /**
   * COVERAGE ADJUSTMENT
   */

  const normalizedCoverage =
    Math.min(Math.max(coverageRatio, 0), 1);

  score *= normalizedCoverage;

  /**
   * MAX CAP
   */

  return Math.min(
    Math.round(score),
    100
  );
}

/* ========================================= */
/* COMPLETENESS ENGINE                       */
/* ========================================= */

export function calculateCategoryCompleteness(
  monthsUploaded: number
): number {
  return Math.min((monthsUploaded / 12) * 100, 100);
}

export function calculateOverallCompleteness({
  electricityCompleteness,
  waterCompleteness,
  wasteCompleteness,
  governanceCompleteness,
}: {
  electricityCompleteness: number;
  waterCompleteness: number;
  wasteCompleteness: number;
  governanceCompleteness: number;
}): number {
  return (
    (electricityCompleteness +
      waterCompleteness +
      wasteCompleteness +
      governanceCompleteness) /
    4
  );
}

/* ========================================= */
/* CONFIDENCE ENGINE                         */
/* ========================================= */

export function calculateConfidenceScore(
  monthsUploaded: number
): number {
  if (monthsUploaded >= 12) return 1.0;
  if (monthsUploaded >= 9) return 0.95;
  if (monthsUploaded >= 6) return 0.85;
  if (monthsUploaded >= 3) return 0.7;
  return 0;
}

/* ========================================= */
/* ANNUALIZATION ENGINE                      */
/* ========================================= */

export function annualizeValue(
  uploadedTotal: number,
  monthsUploaded: number
): number {
  if (monthsUploaded === 0) return 0;
  return (uploadedTotal / monthsUploaded) * 12;
}

export function annualizeElectricity(
  totalElectricityKwh: number,
  monthsUploaded: number
): number {
  return annualizeValue(
    totalElectricityKwh,
    monthsUploaded
  );
}

export function annualizeWater(
  totalWaterKl: number,
  monthsUploaded: number
): number {
  return annualizeValue(totalWaterKl, monthsUploaded);
}

export function annualizeFuel(
  totalFuelLitres: number,
  monthsUploaded: number
): number {
  return annualizeValue(
    totalFuelLitres,
    monthsUploaded
  );
}

export function annualizeWaste(
  totalWasteKg: number,
  monthsUploaded: number
): number {
  return annualizeValue(
    totalWasteKg,
    monthsUploaded
  );
}