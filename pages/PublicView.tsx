import React, { useState, useMemo } from 'react';
import { AppData } from '../types';
import { PairSelector } from '../components/PairSelector';
import { CotTable } from '../components/CotTable';
import { BarChart3, Globe } from 'lucide-react';

interface PublicViewProps {
  data: AppData;
}

export const PublicView: React.FC<PublicViewProps> = ({ data }) => {
  // Default to EURUSD if available, otherwise first pair
  const [selectedPairName, setSelectedPairName] = useState<string>(data[0]?.pair || 'EURUSD');

  const selectedData = useMemo(() => {
    return data.find(p => p.pair === selectedPairName)?.data || [];
  }, [data, selectedPairName]);

  const allPairs = useMemo(() => data.map(p => p.pair), [data]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">COT<span className="text-blue-600">Analytics</span></h1>
          </div>
          <div className="hidden md:flex items-center text-slate-500 text-sm gap-2">
             <Globe className="w-4 h-4" />
             <span>Forex Market Data</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Non-Commercial Positions</h2>
             <p className="text-slate-500">Weekly commitment of traders data for {selectedPairName}</p>
          </div>
          <PairSelector 
            pairs={allPairs} 
            selectedPair={selectedPairName} 
            onSelectPair={setSelectedPairName} 
          />
        </div>

        <CotTable data={selectedData} />

        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} COT Analytics. Data provided for informational purposes only.</p>
        </footer>
      </main>
    </div>
  );
};
