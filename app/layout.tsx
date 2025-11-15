import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Energy Efficiency Simulator - PT. Chandra Asri',
  description: 'Simulasi efisiensi energi dan monitoring untuk PT. Chandra Asri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <nav className="bg-green-600 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">PT. Chandra Asri - Energy Simulator</h1>
            <p className="text-green-100">Optimizing Energy Efficiency</p>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 PT. Chandra Asri. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}