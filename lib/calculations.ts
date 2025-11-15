import { SimulationInputs, SavingsResult } from '@/types';

export class EnergyCalculator {
  static calculateBaselineData() {
    return {
      totalConsumption: 920000, // kWh/tahun
      buildingArea: 7931, // m²
      currentPerformance: 116, // kWh/m²/tahun
      co2Emission: 600, // ton/tahun
      energyBreakdown: {
        hvac: 460000,
        lighting: 230000,
        plugLoads: 140000,
        serverRoom: 45000,
        others: 45000
      }
    };
  }

  static calculateSavings(inputs: SimulationInputs): SavingsResult {
    const baseline = this.calculateBaselineData();
    
    // Perhitungan penghematan berdasarkan business plan
    const lightingSavings = 12880; // kWh/tahun dari sensor
    const acSavingsFromVent = 46000; // kWh/tahun dari roof vent
    const solarProduction = inputs.solarCapacity * 1350; // kWh/tahun (asumsi 1350 full-load hours)
    
    // Additional savings from efficiency improvements
    const additionalLightingSavings = baseline.energyBreakdown.lighting * (inputs.lightingEfficiency / 100);
    const additionalACSavings = baseline.energyBreakdown.hvac * (inputs.acEfficiency / 100);
    
    const totalSavings = lightingSavings + acSavingsFromVent + solarProduction + 
                        additionalLightingSavings + additionalACSavings;
    
    const newConsumption = baseline.totalConsumption - totalSavings;
    const newPerformance = newConsumption / inputs.buildingArea;
    const co2Reduction = totalSavings * 0.000652; // ton CO₂ per kWh
    
    // ROI Calculation
    const annualSavingsCost = totalSavings * 1500; // Asumsi Rp 1.500/kWh
    const roi = inputs.investmentCost > 0 ? (annualSavingsCost / inputs.investmentCost) * 100 : 0;
    const paybackPeriod = inputs.investmentCost > 0 ? inputs.investmentCost / annualSavingsCost : 0;

    return {
      totalSavings,
      newConsumption,
      newPerformance,
      co2Reduction,
      roi,
      paybackPeriod
    };
  }

  static calculateSolarProduction(solarIrradiance: number, panelArea: number, efficiency: number = 0.18): number {
    const peakSunHours = (solarIrradiance / 1000) * 8;
    return panelArea * efficiency * peakSunHours;
  }

  static estimateACConsumption(temperature: number, buildingArea: number): number {
    // Estimasi konsumsi AC berdasarkan suhu
    const baseLoad = 50; // W/m²
    const tempFactor = Math.max(1, (temperature - 25) * 0.1); // 10% peningkatan per °C di atas 25°C
    return (baseLoad * tempFactor * buildingArea * 24) / 1000; // kWh/hari
  }
}