'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/types';
import { EnergyCalculator } from '@/lib/calculations';

export default function WeatherSimulation() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('jakarta');

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
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
          <option value="jakarta text-gray-500">Jakarta</option>
          <option value="surabaya text-gray-500">Surabaya</option>
          <option value="bandung text-gray-500">Bandung</option>
          <option value="medan text-gray-500">Medan</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-500">Lokasi:</span>
          <span className="font-semibold text-gray-500">{weather.location}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-500">Kondisi:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl ">{getWeatherIcon(weather.weatherCondition)}</span>
            <span className="font-semibold capitalize text-gray-500">{weather.weatherCondition.toLowerCase()}</span>
          </div>
        </div>

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