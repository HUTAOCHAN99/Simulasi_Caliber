'use client';

import { useState, useEffect } from 'react';
import { WeatherData, SunlightAnalysis } from '@/types';
import { EnergyCalculator, WeatherService } from '@/lib/calculations';

export default function WeatherSimulation() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sunlightAnalysis, setSunlightAnalysis] = useState<SunlightAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('jakarta');
  const [timeStatus, setTimeStatus] = useState<{ period: string; greeting: string } | null>(null);

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes

    // Set time status
    setTimeStatus(WeatherService.getCurrentTimeStatus());

    return () => clearInterval(interval);
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();
      setWeather(data);
      
      // Analisis sinar matahari
      const analysis = WeatherService.analyzeSunlightPotential(data);
      setSunlightAnalysis(analysis);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSunlightIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSunlightIcon = (intensity: string, hasSunlight: boolean) => {
    if (!hasSunlight) return '🌙';
    
    switch (intensity) {
      case 'high': return '☀️';
      case 'medium': return '⛅';
      case 'low': return '🌤️';
      default: return '☁️';
    }
  };

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: string } = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Thunderstorm: '⛈️',
      Drizzle: '🌦️',
      Snow: '❄️',
      Mist: '🌫️',
    };
    return icons[condition] || '🌈';
  };

  const calculateSolarPotential = () => {
    if (!weather) return { daily: 0, monthly: 0, yearly: 0 };
    
    const panelArea = 500; // m²
    const dailyProduction = EnergyCalculator.calculateSolarProduction(
      weather.solarIrradiance,
      panelArea
    );
    
    return {
      daily: Math.round(dailyProduction),
      monthly: Math.round(dailyProduction * 30),
      yearly: Math.round(dailyProduction * 365)
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">Gagal memuat data cuaca</div>
      </div>
    );
  }

  const solarPotential = calculateSolarPotential();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-500">Simulasi Berbasis Cuaca</h2>
        <select 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="text-sm border rounded px-2 py-1 text-gray-500"
        >
          <option value="jakarta">Jakarta</option>
          <option value="surabaya">Surabaya</option>
          <option value="bandung">Bandung</option>
          <option value="medan">Medan</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {/* Time Greeting */}
        {timeStatus && (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">Selamat {timeStatus.greeting}!</p>
                <p className="text-sm text-gray-600">
                  {timeStatus.period === 'night' 
                    ? 'Waktu optimal untuk battery storage' 
                    : 'Monitor produksi solar secara real-time'}
                </p>
              </div>
              <span className="text-2xl">
                {timeStatus.period === 'morning' ? '🌅' : 
                 timeStatus.period === 'afternoon' ? '🏙️' : 
                 timeStatus.period === 'evening' ? '🌇' : '🌃'}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-500">Lokasi:</span>
          <span className="font-semibold text-gray-500">{weather.location}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-500">Kondisi:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getWeatherIcon(weather.weatherCondition)}</span>
            <span className="font-semibold capitalize text-gray-500">{weather.weatherCondition.toLowerCase()}</span>
          </div>
        </div>

        {/* Sunlight Analysis Section */}
        {sunlightAnalysis && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-500">Analisis Sinar Matahari</h3>
              <span className="text-2xl">
                {getSunlightIcon(sunlightAnalysis.sunlightIntensity, sunlightAnalysis.hasSunlight)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSunlightIntensityColor(sunlightAnalysis.sunlightIntensity)}`}>
                  {sunlightAnalysis.hasSunlight ? 'Sinar Matahari Tersedia' : 'Tidak Ada Sinar Matahari'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Intensitas:</span>
                <span className="font-semibold capitalize text-gray-500">
                  {sunlightAnalysis.sunlightIntensity}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estimasi Jam Cerah:</span>
                <span className="font-semibold text-gray-500">
                  {sunlightAnalysis.estimatedSunHours} jam/hari
                </span>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Rekomendasi:</h4>
              <ul className="text-xs space-y-1">
                {sunlightAnalysis.recommendedActions.map((action, index) => (
                  <li key={index} className="text-gray-600">• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Optimal Production Hours */}
        {sunlightAnalysis && sunlightAnalysis.hasSunlight && (
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Jam Optimal Produksi Solar:</h4>
            <div className="flex flex-wrap gap-1">
              {sunlightAnalysis.optimalProductionHours.map(hour => (
                <div 
                  key={hour}
                  className={`px-2 py-1 rounded text-xs ${
                    new Date().getHours() === hour 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solar Production Prediction */}
        {weather && sunlightAnalysis && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Prediksi Produksi Solar (500m² panel):</h4>
            {(() => {
              const prediction = WeatherService.predictSolarProduction(weather, 500);
              return (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Produksi Hari Ini:</span>
                    <span className="font-semibold text-gray-500">{prediction.predictedProduction} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efisiensi:</span>
                    <span className="font-semibold text-gray-500">{prediction.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tingkat Keyakinan:</span>
                    <span className="font-semibold text-gray-500">{prediction.confidence}%</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Weather Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{weather.temperature}°C</div>
            <div className="text-sm text-gray-600">Suhu</div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{weather.humidity}%</div>
            <div className="text-sm text-gray-600">Kelembaban</div>
          </div>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-yellow-600">
              {weather.solarIrradiance} W/m²
            </div>
            <div className="text-sm text-gray-600">Irradiasi Matahari</div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className='text-gray-500'>Estimasi Produksi Surya (500m² panel):</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className='text-gray-500'>Harian:</span>
              <span className="font-semibold text-gray-500">{solarPotential.daily} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className='text-gray-500'>Bulanan:</span>
              <span className="font-semibold text-gray-500">{solarPotential.monthly} kWh</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span className='text-gray-500'>Tahunan:</span>
              <span className="font-semibold text-gray-500">{solarPotential.yearly} kWh</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Terakhir update: {new Date(weather.timestamp).toLocaleTimeString('id-ID')}
        </div>
      </div>
    </div>
  );
}