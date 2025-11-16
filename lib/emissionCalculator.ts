import { EmissionStats, EnergyComparison } from "@/types";

export class EmissionCalculator {
  // Constants for Indonesia energy mix
  private static readonly FOSSIL_FUEL_EMISSION = 0.82; // kg CO2 per kWh (diesel generator)
  private static readonly GRID_EMISSION = 0.65; // kg CO2 per kWh (Indonesia grid average)
  private static readonly SOLAR_EMISSION = 0.05; // kg CO2 per kWh (manufacturing & maintenance)
  
  private static readonly FOSSIL_FUEL_COST = 2500; // IDR per kWh (diesel)
  private static readonly GRID_COST = 1500; // IDR per kWh (PLN)
  private static readonly SOLAR_COST = 300; // IDR per kWh (maintenance)

  static calculateFossilFuelImpact(consumption: number) {
    return {
      consumption: consumption,
      cost: consumption * this.FOSSIL_FUEL_COST,
      co2Emission: consumption * this.FOSSIL_FUEL_EMISSION,
      efficiency: 35 // % typical diesel generator
    };
  }

  static calculateSolarImpact(production: number) {
    return {
      production: production,
      cost: production * this.SOLAR_COST,
      co2Emission: production * this.SOLAR_EMISSION,
      efficiency: 85 // % solar system efficiency
    };
  }

  static calculateGridMixImpact(consumption: number, solarProduction: number) {
    const gridConsumption = Math.max(0, consumption - solarProduction);
    const fossilPercentage = 85; // % fossil in Indonesia grid
    const renewablePercentage = 15; // % renewable in Indonesia grid

    return {
      consumption: gridConsumption,
      cost: gridConsumption * this.GRID_COST,
      co2Emission: gridConsumption * this.GRID_EMISSION,
      fossilPercentage,
      renewablePercentage
    };
  }

  static calculateEmissionStats(totalCO2: number, savedCO2: number): EmissionStats {
    return {
      totalCO2,
      savedCO2,
      equivalent: {
        trees: Math.round(savedCO2 / 21.77), // kg CO2 per tree per year
        cars: Math.round(savedCO2 / 4600), // kg CO2 per car per year
        distance: Math.round(savedCO2 / 0.12) // kg CO2 per km (average car)
      }
    };
  }

  static generateRealTimeComparison(
    baseConsumption: number, 
    solarProduction: number,
    timestamp: Date
  ): EnergyComparison {
    const fossil = this.calculateFossilFuelImpact(baseConsumption);
    const solar = this.calculateSolarImpact(solarProduction);
    const grid = this.calculateGridMixImpact(baseConsumption, solarProduction);

    return {
      timestamp,
      fossilFuel: fossil,
      solarEnergy: solar,
      gridMix: grid
    };
  }
}