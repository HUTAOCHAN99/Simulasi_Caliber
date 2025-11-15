'use client';

import { useState, useEffect } from 'react';
import { EnergyCalculator } from '@/lib/calculations';

interface DashboardMetrics {
  currentConsumption: number;
  solarProduction: number;
  energyPerformance: number;
  co2Emission: number;
  costSavings: number;
}

export default function EnergyDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      updateDashboardMetrics();
    }, 5000);

    updateDashboardMetrics();

    return () => clearInterval(interval);
  }, []);

  const updateDashboardMetrics = () => {
    const baseline = EnergyCalculator.calculateBaselineData();
    
    // Simulate real-time variations
    const variation = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
    
    const currentMetrics: DashboardMetrics = {
      currentConsumption: Math.round(baseline.totalConsumption / 365 * variation), // Daily
      solarProduction: Math.round(186620 / 365 * (0.8 + Math.random() * 0.4)), // Daily with variation
      energyPerformance: baseline.currentPerformance,
      co2Emission: baseline.co2Emission,
      costSavings: Math.round(245500 * 1500 / 365) // Daily savings in IDR
    };

    setMetrics(currentMetrics);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">Dashboard Konsumsi Energi Real-time</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Konsumsi Hari Ini</p>
              <p className="text-2xl font-bold text-blue-700">
                {metrics?.currentConsumption.toLocaleString()} kWh
              </p>
            </div>
            <div className="text-blue-500 text-2xl">⚡</div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Produksi Solar</p>
              <p className="text-2xl font-bold text-green-700">
                {metrics?.solarProduction.toLocaleString()} kWh
              </p>
            </div>
            <div className="text-green-500 text-2xl">☀️</div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Performa Energi</p>
              <p className="text-2xl font-bold text-purple-700">
                {metrics?.energyPerformance} kWh/m²
              </p>
            </div>
            <div className="text-purple-500 text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Penghematan Hari Ini</p>
              <p className="text-2xl font-bold text-orange-700">
                Rp {metrics?.costSavings.toLocaleString()}
              </p>
            </div>
            <div className="text-orange-500 text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* Energy Breakdown */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-gray-700">Breakdown Konsumsi Energi</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          {[
            { label: 'AC (HVAC)', value: '50%', color: 'bg-red-500' },
            { label: 'Pencahayaan', value: '25%', color: 'bg-yellow-500' },
            { label: 'Plug Loads', value: '15%', color: 'bg-blue-500' },
            { label: 'Server Room', value: '5%', color: 'bg-green-500' },
            { label: 'Lainnya', value: '5%', color: 'bg-gray-500' },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 rounded p-3">
              <div className={`h-2 ${item.color} rounded mb-2`}></div>
              <div className="font-semibold">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}