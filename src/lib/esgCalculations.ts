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

// --------------------------------------------------------------------------
// ADDITIONAL ENGINE FUNCTIONS
// --------------------------------------------------------------------------

/**
 * Calculate benchmark scores based on industry standards.
 * Returns a JSON object where keys are metric names and values are benchmark values.
 */
export function calculateBenchmarkScores(params: {
  industry: string;
  renewablePercentage: number;
  waterRecyclingPercentage: number;
  wasteDiversionPercentage: number;
  energyPerBed: number;
  waterPerBed: number;
  wastePerBed: number;
}): Record<string, number> {
  // Healthcare industry benchmarks (annual values)
  const benchmarks = {
    renewablePercentage: 30, // 30% renewable energy target
    waterRecyclingPercentage: 25, // 25% water recycling target
    wasteDiversionPercentage: 40, // 40% waste diversion target
    energyPerBed: 15000, // 15,000 kWh per bed per year
    waterPerBed: 800, // 800 KL per bed per year
    wastePerBed: 1200, // 1,200 kg per bed per year
  };

  const { renewablePercentage, waterRecyclingPercentage, wasteDiversionPercentage, energyPerBed, waterPerBed, wastePerBed } = params;

  // Calculate performance ratios (current / benchmark)
  const renewableRatio = renewablePercentage / benchmarks.renewablePercentage;
  const waterRatio = waterRecyclingPercentage / benchmarks.waterRecyclingPercentage;
  const wasteRatio = wasteDiversionPercentage / benchmarks.wasteDiversionPercentage;
  const energyRatio = benchmarks.energyPerBed / energyPerBed; // Lower is better for intensity
  const waterIntensityRatio = benchmarks.waterPerBed / waterPerBed;
  const wasteIntensityRatio = benchmarks.wastePerBed / wastePerBed;

  return {
    renewableScore: Math.min(renewableRatio * 100, 100),
    waterScore: Math.min(waterRatio * 100, 100),
    wasteScore: Math.min(wasteRatio * 100, 100),
    energyIntensityScore: Math.min(energyRatio * 100, 100),
    waterIntensityScore: Math.min(waterIntensityRatio * 100, 100),
    wasteIntensityScore: Math.min(wasteIntensityRatio * 100, 100),
  };
}

/**
 * Determine certification readiness based on calculated metrics.
 * Returns a JSON indicating which certifications the hospital is ready for.
 */
export function calculateCertificationReadiness(params: {
  renewablePercentage: number;
  waterRecyclingPercentage: number;
  wasteDiversionPercentage: number;
  governanceScore: number;
  completeness: number;
  confidence: number;
  benchmarkScores: Record<string, number>;
}): Record<string, boolean> {
  const { renewablePercentage, waterRecyclingPercentage, wasteDiversionPercentage, governanceScore, completeness, confidence, benchmarkScores } = params;

  // ISO 14001: Environmental Management Systems
  const iso14001 = renewablePercentage >= 50 && waterRecyclingPercentage >= 40 && wasteDiversionPercentage >= 30 && governanceScore >= 70;

  // ISO 50001: Energy Management Systems
  const iso50001 = renewablePercentage >= 60 && benchmarkScores.energyIntensityScore >= 80 && governanceScore >= 75;

  // NABH: National Accreditation Board for Hospitals & Healthcare Providers
  const nabh = completeness >= 80 && confidence >= 0.8 && governanceScore >= 80;

  // IGBC Healthcare: Indian Green Building Council
  const igbc = renewablePercentage >= 40 && waterRecyclingPercentage >= 30 && wasteDiversionPercentage >= 35 && benchmarkScores.energyIntensityScore >= 70;

  // LEED: Leadership in Energy and Environmental Design
  const leed = renewablePercentage >= 35 && waterRecyclingPercentage >= 25 && wasteDiversionPercentage >= 30;

  // WELL: WELL Building Standard
  const well = waterRecyclingPercentage >= 20 && wasteDiversionPercentage >= 25 && benchmarkScores.energyIntensityScore >= 60;

  // BRSR: Business Responsibility and Sustainability Reporting
  const brsr = completeness >= 75 && governanceScore >= 70 && renewablePercentage >= 25;

  // GRI: Global Reporting Initiative
  const gri = completeness >= 70 && confidence >= 0.7;

  // CDP: Carbon Disclosure Project
  const cdp = renewablePercentage >= 30 && benchmarkScores.energyIntensityScore >= 70;

  return {
    ISO14001: iso14001,
    ISO50001: iso50001,
    NABH: nabh,
    IGBC: igbc,
    LEED: leed,
    WELL: well,
    BRSR: brsr,
    GRI: gri,
    CDP: cdp,
  };
}

/**
 * Perform a gap analysis between current scores and benchmarks.
 * Returns a JSON with gap values and recommendations for each metric.
 */
export function calculateGapAnalysis(current: Record<string, number>, benchmark: Record<string, number>): {
  gaps: Record<string, number>;
  recommendations: Record<string, string>;
  priorityActions: string[];
} {
  const gaps: Record<string, number> = {};
  const recommendations: Record<string, string> = {};
  const priorityActions: string[] = [];

  for (const key in benchmark) {
    const cur = current[key] ?? 0;
    const bench = benchmark[key];
    gaps[key] = Math.max(bench - cur, 0);

    // Generate recommendations based on gaps
    if (gaps[key] > 50) {
      recommendations[key] = `Critical gap: ${gaps[key].toFixed(1)} points below benchmark. Immediate action required.`;
      priorityActions.push(`Address ${key.replace(/Score$/, '').toLowerCase()} gap urgently`);
    } else if (gaps[key] > 20) {
      recommendations[key] = `Moderate gap: ${gaps[key].toFixed(1)} points below benchmark. Plan improvements.`;
    } else if (gaps[key] > 0) {
      recommendations[key] = `Minor gap: ${gaps[key].toFixed(1)} points below benchmark. Monitor and optimize.`;
    } else {
      recommendations[key] = `Above benchmark: ${Math.abs(gaps[key]).toFixed(1)} points above target. Excellent performance.`;
    }
  }

  return { gaps, recommendations, priorityActions };
}

/**
 * Determine overall readiness stage based on completeness and confidence.
 */
export function determineReadinessStage(params: {
  completeness: number;
  confidence: number;
  certificationReady: boolean;
}): string {
  const { completeness, confidence, certificationReady } = params;
  if (completeness >= 90 && confidence >= 0.9 && certificationReady) return "Ready for Certification";
  if (completeness >= 75 && confidence >= 0.75) return "Advanced";
  if (completeness >= 50) return "Intermediate";
  return "Basic";
}

// End of additional engine functions
