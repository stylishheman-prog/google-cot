import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface PairSelectorProps {
  pairs: string[];
  selectedPair: string;
  onSelectPair: (pair: string) => void;
}

export const PairSelector: React.FC<PairSelectorProps> = ({ pairs, selectedPair, onSelectPair }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPairs = useMemo(() => {
    return pairs.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  }, [pairs, search]);

  const handleSelect = (pair: string) => {
    onSelectPair(pair);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm z-20">
      <div 
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-700">{selectedPair}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-md">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                placeholder="Search pairs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredPairs.length > 0 ? (
              filteredPairs.map(pair => (
                <li
                  key={pair}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-blue-50 ${pair === selectedPair ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600'}`}
                  onClick={() => handleSelect(pair)}
                >
                  {pair}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-slate-400 text-center">No pairs found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
