'use client';

import { useState, useEffect } from 'react';

interface ConsumptionData {
  category: string;
  current: number;
  target: number;
  color: string;
}

const consumptionData: ConsumptionData[] = [
  { category: 'AC (HVAC)', current: 460000, target: 320000, color: 'bg-red-500' },
  { category: 'Pencahayaan', current: 230000, target: 180000, color: 'bg-yellow-500' },
  { category: 'Plug Loads', current: 140000, target: 120000, color: 'bg-blue-500' },
  { category: 'Server Room', current: 45000, target: 40000, color: 'bg-green-500' },
  { category: 'Lainnya', current: 45000, target: 40000, color: 'bg-gray-500' },
];

export default function EnergyConsumptionChart() {
  const [data, setData] = useState<ConsumptionData[]>([]);

  useEffect(() => {
    // Simulasi loading data dari API
    const timer = setTimeout(() => {
      setData(consumptionData);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map(d => Math.max(d.current, d.target)));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-500">Konsumsi Energi per Kategori</h2>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.category} className="space-y-2 text-gray-500">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <div className="flex space-x-4">
                <span className="text-gray-600">
                  Sekarang: {(item.current / 1000).toFixed(0)} MWh
                </span>
                <span className="text-green-600">
                  Target: {(item.target / 1000).toFixed(0)} MWh
                </span>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {/* Current Consumption */}
              <div 
                className={`${item.color} rounded-l h-4`}
                style={{ width: `${(item.current / maxValue) * 100}%` }}
                title={`Current: ${item.current.toLocaleString()} kWh`}
              ></div>
              
              {/* Target Consumption */}
              <div 
                className="bg-green-300 rounded-r h-4"
                style={{ width: `${(item.target / maxValue) * 100}%` }}
                title={`Target: ${item.target.toLocaleString()} kWh`}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Penghematan: {((item.current - item.target) / 1000).toFixed(0)} MWh</span>
              <span>Reduksi: {(((item.current - item.target) / item.current) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-gray-500">Total Konsumsi</div>
            <div className="text-2xl font-bold text-gray-800">920 → 674 MWh</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-500">Penghematan Total</div>
            <div className="text-2xl font-bold text-green-600">246 MWh</div>
          </div>
        </div>
      </div>
    </div>
  );
}