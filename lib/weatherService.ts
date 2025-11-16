import { WeatherData, SunlightAnalysis, TimeBasedAnalysis } from '@/types';

export class WeatherService {
  private static readonly OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  static async getWeatherData(location: string = 'jakarta'): Promise<WeatherData> {
    try {
      // Gunakan OpenWeatherMap dengan API key
      if (this.OPENWEATHER_API_KEY) {
        return await this.fetchFromOpenWeather(location);
      }
      
      // Fallback ke data simulasi
      return this.getFallbackWeatherData(location);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getFallbackWeatherData(location);
    }
  }

  private static async fetchFromOpenWeather(location: string): Promise<WeatherData> {
    const locationMap: { [key: string]: { lat: number; lon: number; name: string } } = {
      jakarta: { lat: -6.2088, lon: 106.8456, name: 'Jakarta' },
      surabaya: { lat: -7.2575, lon: 112.7521, name: 'Surabaya' },
      bandung: { lat: -6.9175, lon: 107.6191, name: 'Bandung' },
      medan: { lat: 3.5952, lon: 98.6722, name: 'Medan' }
    };

    const coords = locationMap[location] || locationMap.jakarta;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.OPENWEATHER_API_KEY}&units=metric&lang=id`
    );

    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Estimate solar irradiance based on weather condition
    const solarIrradiance = this.estimateSolarIrradiance(data.weather[0].main);

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      solarIrradiance,
      weatherCondition: data.weather[0].main,
      location: data.name,
      timestamp: new Date(data.dt * 1000)
    };
  }

  private static estimateSolarIrradiance(weatherCondition: string): number {
    const irradianceMap: { [key: string]: number } = {
      Clear: 800,
      Clouds: 400,
      Rain: 150,
      Thunderstorm: 100,
      Drizzle: 300,
      Snow: 200,
      Mist: 250,
      Fog: 200,
      Haze: 300
    };

    return irradianceMap[weatherCondition] || 500;
  }

  // Method public untuk fallback data
  static getFallbackWeatherData(location: string): WeatherData {
    const locationNames: { [key: string]: string } = {
      jakarta: 'Jakarta',
      surabaya: 'Surabaya',
      bandung: 'Bandung',
      medan: 'Medan'
    };

    // Simulate realistic weather data for Indonesia
    const baseTemp = location === 'jakarta' ? 32 : 
                    location === 'surabaya' ? 34 : 
                    location === 'bandung' ? 28 : 30;

    const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature: baseTemp + Math.floor(Math.random() * 4) - 2,
      humidity: 60 + Math.floor(Math.random() * 30),
      solarIrradiance: this.estimateSolarIrradiance(randomCondition),
      weatherCondition: randomCondition,
      location: locationNames[location] || 'Jakarta',
      timestamp: new Date()
    };
  }

  static analyzeSunlightPotential(weatherData: WeatherData): SunlightAnalysis {
    const currentHour = new Date().getHours();
    const timeAnalysis = this.getTimeBasedAnalysis();
    
    let hasSunlight = false;
    let sunlightIntensity: 'high' | 'medium' | 'low' | 'none' = 'none';
    const recommendedActions: string[] = [];
    let estimatedSunHours = 0;

    // Analisis berdasarkan waktu
    if (timeAnalysis.isDaytime) {
      // Analisis berdasarkan kondisi cuaca
      switch (weatherData.weatherCondition) {
        case 'Clear':
          hasSunlight = true;
          sunlightIntensity = this.getSunIntensityByHour(currentHour);
          estimatedSunHours = 8;
          recommendedActions.push(
            'Kondisi optimal untuk produksi solar',
            'Tingkatkan kapasitas panel surya',
            'Lakukan pembersihan panel untuk efisiensi maksimal'
          );
          break;

        case 'Clouds':
          hasSunlight = true;
          sunlightIntensity = 'medium';
          estimatedSunHours = 4;
          recommendedActions.push(
            'Produksi solar masih memungkinkan',
            'Monitor performa panel secara real-time',
            'Siapkan backup power untuk fluktuasi'
          );
          break;

        case 'Rain':
        case 'Drizzle':
          hasSunlight = false;
          sunlightIntensity = 'low';
          estimatedSunHours = 1;
          recommendedActions.push(
            'Produksi solar sangat terbatas',
            'Aktifkan sumber energi alternatif',
            'Monitor tingkat hujan untuk prediksi'
          );
          break;

        case 'Thunderstorm':
          hasSunlight = false;
          sunlightIntensity = 'none';
          estimatedSunHours = 0;
          recommendedActions.push(
            'Non-aktifkan sistem solar sementara',
            'Gunakan grid power sepenuhnya',
            'Waspada petir dan kondisi ekstrem'
          );
          break;

        default:
          hasSunlight = true;
          sunlightIntensity = 'low';
          estimatedSunHours = 2;
          recommendedActions.push('Monitor kondisi cuaca secara berkala');
      }
    } else {
      // Malam hari
      hasSunlight = false;
      sunlightIntensity = 'none';
      estimatedSunHours = 0;
      recommendedActions.push(
        'Tidak ada produksi solar - gunakan battery storage',
        'Siapkan sistem untuk sunrise besok',
        'Monitor suhu panel untuk maintenance'
      );
    }

    // Tentukan jam optimal produksi (9 AM - 3 PM)
    const optimalProductionHours = [9, 10, 11, 12, 13, 14, 15];

    return {
      hasSunlight,
      sunlightIntensity,
      recommendedActions,
      estimatedSunHours,
      optimalProductionHours
    };
  }

  static getTimeBasedAnalysis(): TimeBasedAnalysis {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Untuk Indonesia, asumsi sunrise jam 6 dan sunset jam 18
    const sunrise = 6;
    const sunset = 18;
    const isDaytime = currentHour >= sunrise && currentHour < sunset;
    const daylightHours = sunset - sunrise;

    return {
      isDaytime,
      currentHour,
      sunrise,
      sunset,
      daylightHours
    };
  }

  private static getSunIntensityByHour(hour: number): 'high' | 'medium' | 'low' {
    if (hour >= 10 && hour <= 14) {
      return 'high'; // Puncak sinar matahari
    } else if ((hour >= 8 && hour < 10) || (hour > 14 && hour <= 16)) {
      return 'medium'; // Pagi/sore
    } else {
      return 'low'; // Pagi sangat awal/sore menjelang malam
    }
  }

  // Method untuk prediksi produksi solar berdasarkan analisis waktu dan cuaca
  static predictSolarProduction(weatherData: WeatherData, panelCapacity: number): {
    predictedProduction: number;
    efficiency: number;
    confidence: number;
  } {
    const sunlightAnalysis = this.analyzeSunlightPotential(weatherData);
    const timeAnalysis = this.getTimeBasedAnalysis();

    let baseEfficiency = 0;
    let confidence = 0.7; // Default confidence

    // Efisiensi berdasarkan intensitas sinar matahari
    switch (sunlightAnalysis.sunlightIntensity) {
      case 'high':
        baseEfficiency = 0.85;
        confidence = 0.9;
        break;
      case 'medium':
        baseEfficiency = 0.60;
        confidence = 0.8;
        break;
      case 'low':
        baseEfficiency = 0.25;
        confidence = 0.6;
        break;
      case 'none':
        baseEfficiency = 0;
        confidence = 0.95;
        break;
    }

    // Adjust berdasarkan waktu dalam hari
    const hourEfficiency = this.getHourEfficiency(timeAnalysis.currentHour);
    const adjustedEfficiency = baseEfficiency * hourEfficiency;

    // Prediksi produksi harian (kWh)
    const peakSunHours = sunlightAnalysis.estimatedSunHours;
    const predictedProduction = panelCapacity * peakSunHours * adjustedEfficiency;

    return {
      predictedProduction: Math.round(predictedProduction),
      efficiency: Math.round(adjustedEfficiency * 100),
      confidence: Math.round(confidence * 100)
    };
  }

  private static getHourEfficiency(hour: number): number {
    // Kurva efisiensi berdasarkan jam dalam hari
    const efficiencyCurve: { [key: number]: number } = {
      6: 0.3,  7: 0.5,  8: 0.7,  9: 0.9,
      10: 1.0, 11: 1.0, 12: 1.0, 13: 1.0,
      14: 0.9, 15: 0.7, 16: 0.5, 17: 0.3
    };

    return efficiencyCurve[hour] || 0;
  }

  // Method untuk mendapatkan status waktu saat ini
  static getCurrentTimeStatus(): {
    period: 'morning' | 'afternoon' | 'evening' | 'night';
    greeting: string;
  } {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return { period: 'morning', greeting: 'Pagi' };
    } else if (currentHour >= 12 && currentHour < 18) {
      return { period: 'afternoon', greeting: 'Siang' };
    } else if (currentHour >= 18 && currentHour < 22) {
      return { period: 'evening', greeting: 'Sore' };
    } else {
      return { period: 'night', greeting: 'Malam' };
    }
  }
}