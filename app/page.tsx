import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Energy Efficiency Simulator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Optimalkan konsumsi energi dan capai target sustainability 
            dengan simulasi berbasis data real-time untuk PT. Chandra Asri
          </p>
          <Link 
            href="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Mulai Simulasi
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-500">Real-time Monitoring</h3>
            <p className="text-gray-600">Pantau konsumsi energi dan produksi solar secara real-time</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🌤️
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-500">Simulasi Berbasis Cuaca</h3>
            <p className="text-gray-600">Analisis berdasarkan data cuaca aktual Indonesia</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              💰
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-500">Kalkulator ROI</h3>
            <p className="text-gray-600">Hitung penghematan dan periode pengembalian investasi</p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-500">Target Bisnis PT. Chandra Asri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">116 → 85</div>
              <div className="text-sm text-gray-600">kWh/m²/tahun</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">600 → 350</div>
              <div className="text-sm text-gray-600">Ton CO₂/tahun</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">245,500</div>
              <div className="text-sm text-gray-600">kWh Penghematan</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">LED + Renewable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}