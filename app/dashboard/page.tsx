import EnergyDashboard from '@/components/EnergyDashboard';
import WeatherSimulation from '@/components/WeatherSimulation';
import SavingsCalculator from '@/components/SavingsCalculator';
import SolarProductionChart from '@/components/SolarProductionChart';
import EnergyConsumptionChart from '@/components/EnergyConsumptionChart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Simulasi Energi
          </h1>
          <p className="text-gray-600">
            PT. Chandra Asri - Gedung Kantor Pusat
          </p>
        </div>

        {/* Weather and Key Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1">
            <WeatherSimulation />
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">116</div>
              <div className="text-sm text-gray-600">Current Performance</div>
              <div className="text-xs text-gray-600">kWh/m²/tahun</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">85</div>
              <div className="text-sm text-gray-600">Target Performance</div>
              <div className="text-xs text-gray-600">kWh/m²/tahun</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">600</div>
              <div className="text-sm text-gray-600">CO₂ Emission</div>
              <div className="text-xs text-gray-600">ton/tahun</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EnergyConsumptionChart />
          <SolarProductionChart />
        </div>

        {/* Calculator */}
        <div className="mb-6">
          <SavingsCalculator />
        </div>

        {/* Energy Dashboard */}
        <EnergyDashboard />
      </div>
    </div>
  );
}