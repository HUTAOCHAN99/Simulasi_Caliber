'use client';

import { useState, useEffect } from 'react';
import { EnergyComparison, EmissionStats } from '@/types';
import { EmissionCalculator } from '@/lib/emissionCalculator';

interface ComparisonData {
  time: string;
  fossil: number;
  solar: number;
  grid: number;
}

export default function EnergyComparisonChart() {
  const [comparisonData, setComparisonData] = useState<EnergyComparison | null>(null);
  const [emissionStats, setEmissionStats] = useState<EmissionStats | null>(null);
  const [historicalData, setHistoricalData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    generateRealTimeData();
    const interval = setInterval(generateRealTimeData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const generateRealTimeData = () => {
    // Simulate real-time data with variations
    const baseConsumption = 2000 + Math.random() * 500; // kWh
    const solarProduction = 800 + Math.random() * 400; // kWh
    const timestamp = new Date();

    const comparison = EmissionCalculator.generateRealTimeComparison(
      baseConsumption,
      solarProduction,
      timestamp
    );

    const stats = EmissionCalculator.calculateEmissionStats(
      comparison.fossilFuel.co2Emission,
      comparison.fossilFuel.co2Emission - comparison.gridMix.co2Emission
    );

    setComparisonData(comparison);
    setEmissionStats(stats);

    // Update historical data for chart
    setHistoricalData(prev => {
      const newData = [...prev, {
        time: timestamp.toLocaleTimeString('id-ID'),
        fossil: comparison.fossilFuel.consumption,
        solar: comparison.solarEnergy.production,
        grid: comparison.gridMix.consumption
      }];

      // Keep only last 12 data points
      return newData.slice(-12);
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData || !emissionStats) {
    return <div>Error loading data</div>;
  }

  const maxConsumption = Math.max(
    comparisonData.fossilFuel.consumption,
    comparisonData.solarEnergy.production,
    comparisonData.gridMix.consumption
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Real-time Energy Source Comparison
      </h2>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Fossil Fuel Card */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-700">Fossil Fuel (Diesel)</h3>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔥</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-red-600">Consumption:</span>
              <span className="font-bold">{comparisonData.fossilFuel.consumption.toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Cost:</span>
              <span className="font-bold">Rp {comparisonData.fossilFuel.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">CO₂:</span>
              <span className="font-bold">{comparisonData.fossilFuel.co2Emission.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Efficiency:</span>
              <span className="font-bold">{comparisonData.fossilFuel.efficiency}%</span>
            </div>
          </div>
        </div>

        {/* Solar Energy Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-700">Solar Energy</h3>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">☀️</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Production:</span>
              <span className="font-bold">{comparisonData.solarEnergy.production.toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Cost:</span>
              <span className="font-bold">Rp {comparisonData.solarEnergy.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">CO₂:</span>
              <span className="font-bold">{comparisonData.solarEnergy.co2Emission.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Efficiency:</span>
              <span className="font-bold">{comparisonData.solarEnergy.efficiency}%</span>
            </div>
          </div>
        </div>

        {/* Grid Mix Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-700">Grid Mix (Current)</h3>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-600">Consumption:</span>
              <span className="font-bold">{comparisonData.gridMix.consumption.toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Cost:</span>
              <span className="font-bold">Rp {comparisonData.gridMix.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">CO₂:</span>
              <span className="font-bold">{comparisonData.gridMix.co2Emission.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Fossil:</span>
              <span className="font-bold">{comparisonData.gridMix.fossilPercentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Renewable:</span>
              <span className="font-bold">{comparisonData.gridMix.renewablePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Comparison Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Real-time Energy Flow</h3>
        <div className="space-y-3">
          {historicalData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-xs text-gray-500">{data.time}</div>
              
              <div className="flex-1 space-y-1">
                {/* Fossil Fuel Bar */}
                <div className="flex items-center">
                  <div className="w-20 text-xs text-red-600">Fossil</div>
                  <div className="flex-1 bg-red-100 rounded h-4">
                    <div 
                      className="bg-red-500 rounded h-4"
                      style={{ width: `${(data.fossil / maxConsumption) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-xs text-right text-red-600">{data.fossil.toFixed(0)} kWh</div>
                </div>

                {/* Solar Bar */}
                <div className="flex items-center">
                  <div className="w-20 text-xs text-green-600">Solar</div>
                  <div className="flex-1 bg-green-100 rounded h-4">
                    <div 
                      className="bg-green-500 rounded h-4"
                      style={{ width: `${(data.solar / maxConsumption) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-xs text-right text-green-600">{data.solar.toFixed(0)} kWh</div>
                </div>

                {/* Grid Bar */}
                <div className="flex items-center">
                  <div className="w-20 text-xs text-blue-600">Grid</div>
                  <div className="flex-1 bg-blue-100 rounded h-4">
                    <div 
                      className="bg-blue-500 rounded h-4"
                      style={{ width: `${(data.grid / maxConsumption) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-xs text-right text-blue-600">{data.grid.toFixed(0)} kWh</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emission Impact */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Environmental Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {emissionStats.totalCO2.toFixed(0)} kg
            </div>
            <div className="text-sm text-gray-600">CO₂ Emission</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {emissionStats.savedCO2.toFixed(0)} kg
            </div>
            <div className="text-sm text-gray-600">CO₂ Saved</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {emissionStats.equivalent.trees}
            </div>
            <div className="text-sm text-gray-600">Equivalent Trees</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {emissionStats.equivalent.cars}
            </div>
            <div className="text-sm text-gray-600">Cars off Road</div>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">Cost Savings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fossil Fuel Cost:</span>
                <span className="font-bold text-red-600">
                  Rp {comparisonData.fossilFuel.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Grid Cost:</span>
                <span className="font-bold text-blue-600">
                  Rp {comparisonData.gridMix.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total Savings:</span>
                <span className="font-bold text-green-600">
                  Rp {(comparisonData.fossilFuel.cost - comparisonData.gridMix.cost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-700">Emission Reduction</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fossil Fuel Emission:</span>
                <span className="font-bold text-red-600">
                  {comparisonData.fossilFuel.co2Emission.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Emission:</span>
                <span className="font-bold text-blue-600">
                  {comparisonData.gridMix.co2Emission.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Reduction:</span>
                <span className="font-bold text-green-600">
                  {((comparisonData.fossilFuel.co2Emission - comparisonData.gridMix.co2Emission) / comparisonData.fossilFuel.co2Emission * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Data updated: {comparisonData.timestamp.toLocaleTimeString('id-ID')}
      </div>
    </div>
  );
}