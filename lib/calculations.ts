import { SimulationInputs, SavingsResult, WeatherData } from '@/types';
import { WeatherService } from './weatherService';

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

  static calculateOptimalSolarProduction(weatherData: WeatherData, panelArea: number): {
    optimal: number;
    current: number;
    potential: number;
  } {
    const sunlightAnalysis = WeatherService.analyzeSunlightPotential(weatherData);
    
    // Produksi optimal jika kondisi ideal
    const optimalIrradiance = 800; // W/m² dalam kondisi ideal
    const optimalProduction = this.calculateSolarProduction(optimalIrradiance, panelArea);
    
    // Produksi aktual berdasarkan kondisi cuaca
    const currentProduction = this.calculateSolarProduction(weatherData.solarIrradiance, panelArea);
    
    // Potensi produksi yang terbuang
    const potentialLoss = optimalProduction - currentProduction;

    return {
      optimal: Math.round(optimalProduction),
      current: Math.round(currentProduction),
      potential: Math.round(potentialLoss)
    };
  }

  // Method untuk rekomendasi berdasarkan analisis waktu dan cuaca
  static getTimeBasedRecommendations(weatherData: WeatherData): {
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
  } {
    const sunlightAnalysis = WeatherService.analyzeSunlightPotential(weatherData);
    const timeAnalysis = WeatherService.getTimeBasedAnalysis();
    
    const recommendations: string[] = [];
    let priority: 'high' | 'medium' | 'low' = 'medium';

    if (sunlightAnalysis.hasSunlight) {
      if (sunlightAnalysis.sunlightIntensity === 'high') {
        recommendations.push(
          'Maximalkan penggunaan solar power',
          'Charge battery storage ke kapasitas penuh',
          'Kurangi ketergantungan grid power',
          'Lakukan aktivitas high-energy consumption'
        );
        priority = 'high';
      } else if (sunlightAnalysis.sunlightIntensity === 'medium') {
        recommendations.push(
          'Gunakan kombinasi solar dan grid power',
          'Monitor fluktuasi produksi solar',
          'Siapkan backup power untuk kebutuhan kritis',
          'Optimalkan penggunaan perangkat efisiensi tinggi'
        );
        priority = 'medium';
      } else if (sunlightAnalysis.sunlightIntensity === 'low') {
        recommendations.push(
          'Utamakan penggunaan grid power',
          'Batasi penggunaan perangkat high-power',
          'Monitor prediksi cuaca untuk persiapan',
          'Siapkan generator backup jika diperlukan'
        );
        priority = 'medium';
      }
    } else {
      recommendations.push(
        'Switch ke grid power atau battery storage',
        'Jadwalkan maintenance untuk sistem solar',
        'Persiapkan untuk kondisi cuaca besok',
        'Batasi penggunaan energi non-esensial'
      );
      priority = 'low';
    }

    // Tambah rekomendasi berdasarkan waktu
    if (timeAnalysis.currentHour >= 16 && timeAnalysis.currentHour <= 18) {
      recommendations.push('Sistem sedang transisi ke mode malam - persiapkan battery usage');
    }

    // Tambah rekomendasi berdasarkan suhu
    if (weatherData.temperature > 35) {
      recommendations.push('Suhu tinggi - optimalkan sistem pendingin dan monitor beban AC');
    }

    return { priority, recommendations };
  }

  // Method untuk menghitung penghematan berdasarkan kondisi cuaca
  static calculateWeatherBasedSavings(weatherData: WeatherData, currentConsumption: number): {
    adjustedConsumption: number;
    savingsPotential: number;
    recommendations: string[];
  } {
    const baseline = this.calculateBaselineData();
    const timeAnalysis = WeatherService.getTimeBasedAnalysis();
    
    let adjustedConsumption = currentConsumption;
    let savingsPotential = 0;
    const recommendations: string[] = [];

    // Adjust consumption berdasarkan suhu
    if (weatherData.temperature > 30) {
      // Peningkatan konsumsi AC karena suhu tinggi
      const acIncrease = baseline.energyBreakdown.hvac * 0.15; // 15% increase
      adjustedConsumption += acIncrease;
      savingsPotential -= acIncrease;
      recommendations.push('Suhu tinggi - pertimbangkan optimisasi sistem HVAC');
    } else if (weatherData.temperature < 22) {
      // Pengurangan konsumsi AC karena suhu sejuk
      const acDecrease = baseline.energyBreakdown.hvac * 0.10; // 10% decrease
      adjustedConsumption -= acDecrease;
      savingsPotential += acDecrease;
      recommendations.push('Suhu optimal - kurangi penggunaan AC');
    }

    // Adjust berdasarkan kondisi cuaca untuk lighting
    if (weatherData.weatherCondition === 'Clear' && timeAnalysis.isDaytime) {
      const lightingSavings = baseline.energyBreakdown.lighting * 0.20; // 20% savings from natural light
      adjustedConsumption -= lightingSavings;
      savingsPotential += lightingSavings;
      recommendations.push('Cerah - manfaatkan pencahayaan alami');
    }

    // Adjust berdasarkan kelembaban
    if (weatherData.humidity > 80) {
      recommendations.push('Kelembaban tinggi - monitor sistem dehumidification');
    }

    return {
      adjustedConsumption: Math.round(adjustedConsumption),
      savingsPotential: Math.round(savingsPotential),
      recommendations
    };
  }

  // Method untuk prediksi konsumsi energi harian
  static predictDailyConsumption(weatherData: WeatherData, buildingArea: number): {
    predictedConsumption: number;
    breakdown: {
      hvac: number;
      lighting: number;
      equipment: number;
      solarProduction: number;
    };
    netConsumption: number;
  } {
    const baseline = this.calculateBaselineData();
    const dailyBaseline = baseline.totalConsumption / 365;
    
    // Prediksi konsumsi HVAC berdasarkan suhu
    const hvacConsumption = this.estimateACConsumption(weatherData.temperature, buildingArea);
    
    // Prediksi konsumsi lighting berdasarkan kondisi cuaca dan waktu
    const timeAnalysis = WeatherService.getTimeBasedAnalysis();
    let lightingConsumption = (baseline.energyBreakdown.lighting / 365) * 0.7; // Base 70%
    
    if (weatherData.weatherCondition === 'Clear' && timeAnalysis.isDaytime) {
      lightingConsumption *= 0.5; // 50% reduction in clear daytime
    }

    // Konsumsi equipment (relatif konstan)
    const equipmentConsumption = (baseline.energyBreakdown.plugLoads + 
                                 baseline.energyBreakdown.serverRoom + 
                                 baseline.energyBreakdown.others) / 365;

    // Prediksi produksi solar
    const solarPrediction = WeatherService.predictSolarProduction(weatherData, 500);
    const solarProduction = solarPrediction.predictedProduction;

    const totalConsumption = hvacConsumption + lightingConsumption + equipmentConsumption;
    const netConsumption = Math.max(0, totalConsumption - solarProduction);

    return {
      predictedConsumption: Math.round(totalConsumption),
      breakdown: {
        hvac: Math.round(hvacConsumption),
        lighting: Math.round(lightingConsumption),
        equipment: Math.round(equipmentConsumption),
        solarProduction: Math.round(solarProduction)
      },
      netConsumption: Math.round(netConsumption)
    };
  }
}

export { WeatherService };
