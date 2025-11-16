export interface WeatherData {
  temperature: number;
  humidity: number;
  solarIrradiance: number;
  weatherCondition: string;
  location: string;
  timestamp: Date;
}

export interface WeatherAPIResponse {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  sys: {
    country: string;
  };
  dt: number;
}

export interface EnergyData {
  timestamp: Date;
  consumption: number;
  production: number;
  buildingArea: number;
  performance: number;
}

export interface SimulationInputs {
  currentConsumption: number;
  buildingArea: number;
  solarCapacity: number;
  investmentCost: number;
  lightingEfficiency: number;
  acEfficiency: number;
}

export interface SavingsResult {
  totalSavings: number;
  newConsumption: number;
  newPerformance: number;
  co2Reduction: number;
  roi: number;
  paybackPeriod: number;
}

export interface SunlightAnalysis {
  hasSunlight: boolean;
  sunlightIntensity: 'high' | 'medium' | 'low' | 'none';
  recommendedActions: string[];
  estimatedSunHours: number;
  optimalProductionHours: number[];
}

export interface TimeBasedAnalysis {
  isDaytime: boolean;
  currentHour: number;
  sunrise: number;
  sunset: number;
  daylightHours: number;
}

export interface EnergyComparison {
  timestamp: Date;
  fossilFuel: {
    consumption: number; // kWh
    cost: number; // IDR
    co2Emission: number; // kg CO2
    efficiency: number; // %
  };
  solarEnergy: {
    production: number; // kWh
    cost: number; // IDR
    co2Emission: number; // kg CO2
    efficiency: number; // %
  };
  gridMix: {
    consumption: number; // kWh
    cost: number; // IDR
    co2Emission: number; // kg CO2
    fossilPercentage: number; // %
    renewablePercentage: number; // %
  };
}

export interface EmissionStats {
  totalCO2: number;
  savedCO2: number;
  equivalent: {
    trees: number; // equivalent trees planted
    cars: number; // equivalent cars off the road
    distance: number; // equivalent km not driven
  };
}