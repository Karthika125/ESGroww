export function calculateEmissions(energyKwh: number, dgDieselLiters: number) {
  // Scope 1: Diesel / Fuel / Refrigerants.
  // Standard factor: ~ 2.6 kg CO2e per Litre of Diesel
  const scope1 = dgDieselLiters * 0.0026; 

  // Scope 2: Purchased Electricity
  // Grid factor: 0.72 tCO2e/MWh -> 0.00072 tCO2e/kWh
  const scope2 = energyKwh * 0.00072;

  // Scope 3: Estimated (Transport, Waste, etc)
  const scope3 = (scope1 + scope2) * 0.15; // Rough estimate of 15% for missing fields

  const total = scope1 + scope2 + scope3;

  return { scope1, scope2, scope3, total };
}

export function calculateReadinessScores(
  data: {
    energyKwh: number;
    renewableKwh: number;
    waterKl: number;
    recycledWaterKl: number;
    totalWasteKg: number;
    recycledWasteKg: number;
    govPolicy: boolean;
    govComm: boolean;
    govAudit: boolean;
    govDocs: boolean;
  }
) {
  // Energy Score Formulation (out of 25)
  // Max score if 100% renewable + complete tracking.
  const renewablePct = data.energyKwh > 0 ? (data.renewableKwh / data.energyKwh) * 100 : 0;
  let energyBase = 15; // baseline for tracking
  if (renewablePct > 20) energyBase += 10;
  else if (renewablePct > 5) energyBase += 5;
  const energyScore = Math.min(25, energyBase);

  // Water (out of 15)
  const waterRecyclePct = data.waterKl > 0 ? (data.recycledWaterKl / data.waterKl) * 100 : 0;
  let waterBase = 8;
  if (waterRecyclePct > 50) waterBase += 7;
  else if (waterRecyclePct > 20) waterBase += 4;
  const waterScore = Math.min(15, waterBase);

  // Waste (out of 15)
  const wasteRecyclePct = data.totalWasteKg > 0 ? (data.recycledWasteKg / data.totalWasteKg) * 100 : 0;
  let wasteBase = 8;
  if (wasteRecyclePct > 60) wasteBase += 7;
  else if (wasteRecyclePct > 30) wasteBase += 4;
  const wasteScore = Math.min(15, wasteBase);

  // Emissions (out of 20 - requires monitoring maturity)
  let emissionScore = 15; // baseline assumption for active use
  
  // Governance (out of 25)
  let govScore = 0;
  if (data.govPolicy) govScore += 7;
  if (data.govComm) govScore += 6;
  if (data.govAudit) govScore += 6;
  if (data.govDocs) govScore += 6;

  const totalScore = energyScore + waterScore + wasteScore + emissionScore + govScore;

  let level = "Foundational";
  if (totalScore >= 86) level = "Industry Leading";
  else if (totalScore >= 71) level = "Advanced";
  else if (totalScore >= 51) level = "Structured";
  else if (totalScore >= 31) level = "Developing";

  return {
    energyScore,
    waterScore,
    wasteScore,
    emissionScore,
    govScore,
    totalScore,
    level,
    percentages: {
      renewable: renewablePct,
      waterRecycle: waterRecyclePct,
      wasteRecycle: wasteRecyclePct
    }
  };
}
