import React from 'react';
import { CotRecord } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface CotTableProps {
  data: CotRecord[];
  isAdmin?: boolean;
  onEdit?: (record: CotRecord) => void;
  onDelete?: (id: string) => void;
}

export const CotTable: React.FC<CotTableProps> = ({ data, isAdmin = false, onEdit, onDelete }) => {
  
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatPct = (num: number) => `${num.toFixed(1)}%`;
  
  const getDiffClass = (val: number) => {
    if (val > 0) return 'text-emerald-600 font-medium';
    if (val < 0) return 'text-rose-600 font-medium';
    return 'text-slate-500';
  };

  const getBiasBadge = (bias: string) => {
    switch (bias) {
      case 'Bullish': return 'bg-emerald-100 text-emerald-700';
      case 'Bearish': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">DATE</th>
              <th className="px-4 py-3 text-right">LONGS</th>
              <th className="px-4 py-3 text-right">SHORTS</th>
              <th className="px-4 py-3 text-right">CHG LONG</th>
              <th className="px-4 py-3 text-right">CHG SHORT</th>
              <th className="px-4 py-3 text-right">% LONG</th>
              <th className="px-4 py-3 text-right">% SHORT</th>
              <th className="px-4 py-3 text-right">NET POS</th>
              <th className="px-4 py-3 text-right">NET CHG</th>
              <th className="px-4 py-3 text-center">BIAS</th>
              <th className="px-4 py-3 text-center">FLIP</th>
              {isAdmin && <th className="px-4 py-3 text-center">ACTIONS</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 12 : 11} className="px-4 py-8 text-center text-slate-400">
                  No data available for this pair.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.date}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatNumber(row.longs)}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatNumber(row.shorts)}</td>
                  <td className={`px-4 py-3 text-right ${getDiffClass(row.change_long)}`}>
                    {row.change_long > 0 ? '+' : ''}{formatNumber(row.change_long)}
                  </td>
                  <td className={`px-4 py-3 text-right ${getDiffClass(row.change_short)}`}>
                    {row.change_short > 0 ? '+' : ''}{formatNumber(row.change_short)}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-600">{formatPct(row.pct_long)}</td>
                  <td className="px-4 py-3 text-right text-orange-600">{formatPct(row.pct_short)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{formatNumber(row.net_positions)}</td>
                  <td className={`px-4 py-3 text-right ${getDiffClass(row.net_change)}`}>
                    {row.net_change > 0 ? '+' : ''}{formatNumber(row.net_change)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getBiasBadge(row.bias)}`}>
                      {row.bias}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{row.flip}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEdit?.(row)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete?.(row.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
