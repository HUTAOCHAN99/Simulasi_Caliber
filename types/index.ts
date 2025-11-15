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