import React, { useState, useMemo } from 'react';
import { AppData, CotRecord } from '../types';
import { PairSelector } from '../components/PairSelector';
import { CotTable } from '../components/CotTable';
import { EditModal } from '../components/EditModal';
import { exportData } from '../services/dataService';
import { Plus, Download, LogOut, Shield, Settings } from 'lucide-react';

interface AdminViewProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

export const AdminView: React.FC<AdminViewProps> = ({ data, setData }) => {
  const [selectedPairName, setSelectedPairName] = useState<string>(data[0]?.pair || 'EURUSD');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CotRecord | undefined>(undefined);
  const [newPairName, setNewPairName] = useState('');
  const [showAddPair, setShowAddPair] = useState(false);

  const selectedData = useMemo(() => {
    return data.find(p => p.pair === selectedPairName)?.data || [];
  }, [data, selectedPairName]);

  const allPairs = useMemo(() => data.map(p => p.pair), [data]);

  // --- Actions ---

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEditRecord = (record: CotRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    setData(prev => prev.map(pairData => {
      if (pairData.pair === selectedPairName) {
        return {
          ...pairData,
          data: pairData.data.filter(r => r.id !== id)
        };
      }
      return pairData;
    }));
  };

  const handleSaveRecord = (record: CotRecord) => {
    setData(prev => prev.map(pairData => {
      if (pairData.pair === selectedPairName) {
        const exists = pairData.data.some(r => r.id === record.id);
        let newData;
        
        if (exists) {
          newData = pairData.data.map(r => r.id === record.id ? record : r);
        } else {
          // Generate ID if missing (add new)
          const newRecord = { ...record, id: record.id || Date.now().toString() };
          newData = [newRecord, ...pairData.data]; // Add to top
        }
        
        // Sort by date descending
        newData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return { ...pairData, data: newData };
      }
      return pairData;
    }));
    setIsModalOpen(false);
  };

  const handleAddPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPairName) return;
    if (data.some(p => p.pair === newPairName)) {
      alert('Pair already exists');
      return;
    }
    setData(prev => [...prev, { pair: newPairName.toUpperCase(), data: [] }]);
    setSelectedPairName(newPairName.toUpperCase());
    setNewPairName('');
    setShowAddPair(false);
  };

  const handleExport = () => {
    exportData(data);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold tracking-wider">ADMIN CONSOLE</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Save JSON
            </button>
            <a href="/" className="text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Active Pair</label>
              <div className="flex gap-3">
                <PairSelector 
                  pairs={allPairs} 
                  selectedPair={selectedPairName} 
                  onSelectPair={setSelectedPairName} 
                />
                <button 
                  onClick={() => setShowAddPair(!showAddPair)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-lg transition-colors"
                  title="Add New Pair"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {showAddPair && (
                <form onSubmit={handleAddPair} className="mt-4 flex gap-2 items-center animate-fade-in">
                  <input 
                    type="text" 
                    value={newPairName}
                    onChange={(e) => setNewPairName(e.target.value)}
                    placeholder="e.g. AUDJPY" 
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium">Add</button>
                </form>
              )}
            </div>

            <div className="flex-none">
               <button 
                onClick={handleAddRecord}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow-md shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add New Row
              </button>
            </div>

          </div>
        </div>

        {/* Data Table */}
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Data for {selectedPairName}
        </h2>
        
        <CotTable 
          data={selectedData} 
          isAdmin={true} 
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />

      </main>

      <EditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        initialData={editingRecord}
        pairName={selectedPairName}
      />
    </div>
  );
};
