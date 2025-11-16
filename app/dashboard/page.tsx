import EnergyDashboard from '@/components/EnergyDashboard';
import EnergyConsumptionChart from '@/components/EnergyConsumptionChart';
import SavingsCalculator from '@/components/SavingsCalculator';
import SolarProductionChart from '@/components/SolarProductionChart';
import WeatherSimulation from '@/components/WeatherSimulation';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
              ← Back to Home
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Energy Efficiency Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time monitoring and simulation for PT. Chandra Asri energy optimization
          </p>
        </div>

        {/* Real-time Dashboard */}
        <div className="mb-8">
          <EnergyDashboard />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Energy Consumption Chart */}
            <div>
              <EnergyConsumptionChart />
            </div>

            {/* Solar Production Chart */}
            <div>
              <SolarProductionChart />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Weather Simulation */}
            <div>
              <WeatherSimulation />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Target Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Energy Performance</span>
                    <span className="text-sm font-medium text-gray-700">116 → 85 kWh/m²</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Current: 116</span>
                    <span className="text-xs text-gray-500">Target: 85</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">CO₂ Reduction</span>
                    <span className="text-sm font-medium text-gray-700">600 → 350 ton</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Current: 600</span>
                    <span className="text-xs text-gray-500">Target: 350</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Energy Savings</span>
                    <span className="text-sm font-medium text-gray-700">245,500 kWh</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Progress: 75%</span>
                    <span className="text-xs text-gray-500">Target: 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Environmental Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">246</div>
                  <div className="text-sm opacity-90">MWh Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">150</div>
                  <div className="text-sm opacity-90">Ton CO₂ Reduced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">369M</div>
                  <div className="text-sm opacity-90">IDR Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm opacity-90">Renewable Usage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Calculator - Full Width */}
        <div className="mb-8">
          <SavingsCalculator />
        </div>

        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📈
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Performance Analytics</h3>
            <p className="text-gray-600 text-sm">
              Detailed analysis of energy consumption patterns and optimization opportunities
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔄
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Automated Reports</h3>
            <p className="text-gray-600 text-sm">
              Generate comprehensive reports for management and sustainability compliance
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🎯
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Smart Alerts</h3>
            <p className="text-gray-600 text-sm">
              Real-time notifications for abnormal consumption and maintenance needs
            </p>
          </div>
        </div>

        {/* Comparison Page Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/comparison" 
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>View Energy Source Comparison</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="text-gray-600 mt-2 text-sm">
            Compare fossil fuel vs solar energy environmental impact in real-time
          </p>
        </div>

        {/* Footer Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            PT. Chandra Asri Sustainability Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">31%</div>
              <div className="text-sm text-gray-600">Energy Reduction</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">42%</div>
              <div className="text-sm text-gray-600">CO₂ Reduction</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">LED Implementation</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">186.6</div>
              <div className="text-sm text-gray-600">kWp Solar Capacity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}