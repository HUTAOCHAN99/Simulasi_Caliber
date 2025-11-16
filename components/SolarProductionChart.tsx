'use client';

import { useState, useEffect } from 'react';

interface SolarData {
  month: string;
  production: number;
  potential: number;
}

export default function SolarProductionChart() {
  const [data, setData] = useState<SolarData[]>([]);

  useEffect(() => {
    // Simulate solar production data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const simulatedData = months.map((month, index) => {
      const baseProduction = 15000; // kWh/month
      const seasonalVariation = Math.sin((index / 12) * 2 * Math.PI) * 0.3; // Seasonal variation
      const randomVariation = (Math.random() - 0.5) * 0.2; // Random variation
      
      return {
        month,
        production: Math.round(baseProduction * (1 + seasonalVariation + randomVariation)),
        potential: Math.round(baseProduction * (1 + seasonalVariation + 0.4)) // 40% higher potential
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(simulatedData);
  }, []);

  const maxValue = Math.max(...data.map(d => Math.max(d.production, d.potential)));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-500">Produksi Energi Surya</h2>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.month} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-gray-600">{item.month}</div>
            
            <div className="flex-1">
              {/* Potential Bar */}
              <div className="relative">
                <div 
                  className="bg-blue-200 rounded h-6 mb-1"
                  style={{ width: `${(item.potential / maxValue) * 100}%` }}
                ></div>
                
                {/* Actual Production Bar */}
                <div 
                  className="bg-green-500 rounded h-6 absolute top-0 left-0"
                  style={{ width: `${(item.production / maxValue) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Actual: {item.production.toLocaleString()} kWh</span>
                <span>Potential: {item.potential.toLocaleString()} kWh</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className='text-gray-500'>Produksi Aktual</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span className='text-gray-500'>Potensi Maksimal</span>
        </div>
      </div>
    </div>
  );
}