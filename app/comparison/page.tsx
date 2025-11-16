import EnergyComparisonChart from '@/components/EnergyComparisonChart';
import Link from 'next/link';

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-block mb-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Energy Source Comparison
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time comparison between fossil fuel energy and solar energy 
            with environmental impact analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <EnergyComparisonChart />
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Emission Factors</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Fossil Fuel (Diesel): 0.82 kg CO₂/kWh</li>
                <li>• Indonesia Grid Mix: 0.65 kg CO₂/kWh</li>
                <li>• Solar Energy: 0.05 kg CO₂/kWh</li>
                <li>• Cost: Diesel Rp 2.500/kWh, Grid Rp 1.500/kWh, Solar Rp 300/kWh</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Environmental Equivalents</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 1 tree absorbs ~21.77 kg CO₂ per year</li>
                <li>• 1 car emits ~4,600 kg CO₂ per year</li>
                <li>• 1 km driving emits ~0.12 kg CO₂</li>
                <li>• Based on Indonesia energy mix: 85% fossil, 15% renewable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}