import React, { useState, useEffect } from 'react';
import { CotRecord } from '../types';
import { X } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: CotRecord) => void;
  initialData?: CotRecord;
  pairName: string;
}

const defaultRecord: Omit<CotRecord, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  longs: 0,
  shorts: 0,
  change_long: 0,
  change_short: 0,
  pct_long: 0,
  pct_short: 0,
  net_positions: 0,
  net_change: 0,
  bias: 'Neutral',
  flip: ''
};

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialData, pairName }) => {
  const [formData, setFormData] = useState<CotRecord>({ ...defaultRecord, id: '' });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({ ...defaultRecord, id: Date.now().toString() });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numFields = ['longs', 'shorts', 'change_long', 'change_short', 'pct_long', 'pct_short', 'net_positions', 'net_change'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  // Helper to auto-calculate derived fields if the user wants a shortcut
  const autoCalculate = () => {
    const total = formData.longs + formData.shorts;
    const pct_long = total > 0 ? (formData.longs / total) * 100 : 0;
    const pct_short = total > 0 ? (formData.shorts / total) * 100 : 0;
    const net = formData.longs - formData.shorts;
    
    setFormData(prev => ({
      ...prev,
      pct_long: parseFloat(pct_long.toFixed(1)),
      pct_short: parseFloat(pct_short.toFixed(1)),
      net_positions: net,
      bias: net > 0 ? 'Bullish' : net < 0 ? 'Bearish' : 'Neutral'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Record' : 'Add New Record'} <span className="text-blue-600 ml-2">{pairName}</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin">
          <form id="editForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Primary Data */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Longs</label>
              <input type="number" name="longs" value={formData.longs} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Shorts</label>
              <input type="number" name="shorts" value={formData.shorts} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

             <div className="col-span-1 md:col-span-2 flex justify-end">
                 <button type="button" onClick={autoCalculate} className="text-xs text-blue-600 hover:underline">Auto-calc Net & % from Longs/Shorts</button>
             </div>

            {/* Changes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Change Long</label>
              <input type="number" name="change_long" value={formData.change_long} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Change Short</label>
              <input type="number" name="change_short" value={formData.change_short} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Percentages */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">% Long</label>
              <input type="number" step="0.1" name="pct_long" value={formData.pct_long} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">% Short</label>
              <input type="number" step="0.1" name="pct_short" value={formData.pct_short} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Net */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Net Positions</label>
              <input type="number" name="net_positions" value={formData.net_positions} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Net Change</label>
              <input type="number" name="net_change" value={formData.net_change} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bias</label>
              <select name="bias" value={formData.bias} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Bullish">Bullish</option>
                <option value="Bearish">Bearish</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Flip %</label>
              <input 
                type="text" 
                name="flip" 
                value={formData.flip} 
                onChange={handleChange} 
                placeholder="e.g. 10% or No"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded transition-colors">Cancel</button>
          <button type="submit" form="editForm" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm transition-colors font-medium">Save Changes</button>
        </div>
      </div>
    </div>
  );
};