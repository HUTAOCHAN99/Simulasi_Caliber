import { WeatherData } from '@/types';

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
}