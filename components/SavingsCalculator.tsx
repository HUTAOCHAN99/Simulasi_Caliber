'use client';

import { useState, useEffect, useCallback } from 'react';
import { SimulationInputs, SavingsResult } from '@/types';
import { EnergyCalculator } from '@/lib/calculations';

export default function SavingsCalculator() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    currentConsumption: 920000,
    buildingArea: 7931,
    solarCapacity: 186.62,
    investmentCost: 2500000000,
    lightingEfficiency: 15,
    acEfficiency: 10
  });

  const [savings, setSavings] = useState<SavingsResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateSavings = useCallback(() => {
    const result = EnergyCalculator.calculateSavings(inputs);
    setSavings(result);
  }, [inputs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateSavings();
  }, [calculateSavings]);

  const handleInputChange = (field: keyof SimulationInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPerformanceColor = (performance: number) => {
    if (performance <= 85) return 'text-green-600';
    if (performance <= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!savings) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-500">Kalkulator Penghematan Energi</h2>
      
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kapasitas Panel Surya (kWp)
          </label>
          <input
            type="number"
            value={inputs.solarCapacity}
            onChange={(e) => handleInputChange('solarCapacity', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Efisiensi Pencahayaan (%)
          </label>
          <input
            type="number"
            value={inputs.lightingEfficiency}
            onChange={(e) => handleInputChange('lightingEfficiency', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
            min="0"
            max="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ">
            Efisiensi AC (%)
          </label>
          <input
            type="number"
            value={inputs.acEfficiency}
            onChange={(e) => handleInputChange('acEfficiency', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
            min="0"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biaya Investasi (Rp)
          </label>
          <input
            type="number"
            value={inputs.investmentCost}
            onChange={(e) => handleInputChange('investmentCost', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Luas Bangunan (m²)
          </label>
          <input
            type="number"
            value={inputs.buildingArea}
            onChange={(e) => handleInputChange('buildingArea', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konsumsi Saat Ini (kWh/tahun)
          </label>
          <input
            type="number"
            value={inputs.currentConsumption}
            onChange={(e) => handleInputChange('currentConsumption', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-500"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-lg text-gray-700">Hasil Simulasi:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {savings.totalSavings.toLocaleString()} kWh
            </div>
            <div className="text-sm text-gray-600">Total Penghematan</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className={`text-2xl font-bold ${getPerformanceColor(savings.newPerformance)}`}>
              {savings.newPerformance.toFixed(1)} kWh/m²
            </div>
            <div className="text-sm text-gray-600">Performa Energi Baru</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {savings.co2Reduction.toFixed(1)} ton
            </div>
            <div className="text-sm text-gray-600">Pengurangan CO₂</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {savings.paybackPeriod.toFixed(1)} tahun
            </div>
            <div className="text-sm text-gray-600">Payback Period</div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-700">Return on Investment (ROI)</h4>
              <p className="text-sm text-gray-600">Tahunan</p>
            </div>
            <div className={`text-2xl font-bold ${
              savings.roi >= 20 ? 'text-green-600' : 
              savings.roi >= 10 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {savings.roi.toFixed(1)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                savings.roi >= 20 ? 'bg-green-500' : 
                savings.roi >= 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(savings.roi, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-green-600 hover:text-green-700 font-medium text-sm"
        >
          {showDetails ? 'Sembunyikan' : 'Tampilkan'} Detail Perhitungan →
        </button>

        {showDetails && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-700">Detail Perhitungan Penghematan:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Penghematan Pencahayaan (Sensor):</span>
                <span>12,880 kWh/tahun</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Penghematan AC (Roof Vent):</span>
                <span>46,000 kWh/tahun</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Produksi Panel Surya:</span>
                <span>{(inputs.solarCapacity * 1350).toLocaleString()} kWh/tahun</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Penghematan Efisiensi Pencahayaan:</span>
                <span>{(230000 * inputs.lightingEfficiency / 100).toLocaleString()} kWh/tahun</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Penghematan Efisiensi AC:</span>
                <span>{(460000 * inputs.acEfficiency / 100).toLocaleString()} kWh/tahun</span>
              </div>
              <div className="border-t pt-2 font-semibold flex justify-between text-gray-700">
                <span>Total Penghematan:</span>
                <span>{savings.totalSavings.toLocaleString()} kWh/tahun</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}