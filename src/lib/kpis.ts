// VoltEra KPI Calculation Utilities

export interface EnergyData {
  ts: string;
  solar_kwh: number;
  grid_kwh: number;
  it_load_kwh: number;
  overhead_kwh: number;
}

export interface EmissionFactors {
  solar_kg_per_kwh: number;
  grid_kg_per_kwh: number;
}

/**
 * Calculate PUE (Power Usage Effectiveness)
 * PUE = Total Facility Power / IT Equipment Power
 */
export function calculatePUE(energyData: EnergyData): number {
  const totalPower = energyData.solar_kwh + energyData.grid_kwh;
  const itPower = energyData.it_load_kwh;
  
  if (itPower === 0) return 0;
  return totalPower / itPower;
}

/**
 * Calculate CO2 avoided per hour (kg)
 * Formula: solar_kwh * (grid_kg_per_kwh - solar_kg_per_kwh)
 */
export function calculateCO2Avoided(
  solarKwh: number, 
  emissionFactors: EmissionFactors
): number {
  return solarKwh * (emissionFactors.grid_kg_per_kwh - emissionFactors.solar_kg_per_kwh);
}

/**
 * Calculate total CO2 avoided for a period
 */
export function calculateTotalCO2Avoided(
  energyData: EnergyData[], 
  emissionFactors: EmissionFactors
): number {
  return energyData.reduce((total, data) => {
    return total + calculateCO2Avoided(data.solar_kwh, emissionFactors);
  }, 0);
}

/**
 * Calculate carbon credits estimate (tons CO2e)
 * 1 credit = 1 tCO2e
 */
export function calculateCarbonCredits(co2AvoidedKg: number): number {
  return co2AvoidedKg / 1000; // Convert kg to tons
}

/**
 * Calculate daily energy summary
 */
export function calculateDailySummary(energyData: EnergyData[]) {
  const totals = energyData.reduce((acc, data) => ({
    solar: acc.solar + data.solar_kwh,
    grid: acc.grid + data.grid_kwh,
    it_load: acc.it_load + data.it_load_kwh,
    overhead: acc.overhead + data.overhead_kwh
  }), { solar: 0, grid: 0, it_load: 0, overhead: 0 });

  const avgPUE = energyData.length > 0 ? 
    energyData.reduce((sum, data) => sum + calculatePUE(data), 0) / energyData.length : 0;

  return {
    ...totals,
    total_consumption: totals.it_load + totals.overhead,
    net_consumption: totals.solar + totals.grid,
    avg_pue: Math.round(avgPUE * 100) / 100
  };
}

/**
 * Calculate efficiency metrics
 */
export function calculateEfficiencyMetrics(energyData: EnergyData[]) {
  const summary = calculateDailySummary(energyData);
  
  const solarPercentage = summary.net_consumption > 0 ? 
    (summary.solar / summary.net_consumption) * 100 : 0;
  
  const gridPercentage = summary.net_consumption > 0 ? 
    (summary.grid / summary.net_consumption) * 100 : 0;

  return {
    solar_percentage: Math.round(solarPercentage * 10) / 10,
    grid_percentage: Math.round(gridPercentage * 10) / 10,
    efficiency_score: Math.max(0, Math.min(100, solarPercentage + (100 - summary.avg_pue * 50)))
  };
}

/**
 * Get current energy status
 */
export function getCurrentEnergyStatus(latestData: EnergyData) {
  const isOffPeak = new Date(latestData.ts).getHours() < 6 || new Date(latestData.ts).getHours() > 22;
  const isSolarActive = latestData.solar_kwh > 0;
  
  return {
    status: isSolarActive ? 'solar' : isOffPeak ? 'off-peak' : 'peak',
    pue: calculatePUE(latestData),
    is_efficient: calculatePUE(latestData) <= 1.3
  };
}

/**
 * Format numbers for display
 */
export function formatKwh(kwh: number): string {
  if (kwh < 1) return `${(kwh * 1000).toFixed(0)}Wh`;
  return `${kwh.toFixed(1)}kWh`;
}

export function formatCO2(kg: number): string {
  if (kg < 1) return `${(kg * 1000).toFixed(0)}g`;
  return `${kg.toFixed(1)}kg`;
}

export function formatPUE(pue: number): string {
  return pue.toFixed(2);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}