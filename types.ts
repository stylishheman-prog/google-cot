export interface CotRecord {
  id: string; // Unique ID for UI management
  date: string;
  longs: number;
  shorts: number;
  change_long: number;
  change_short: number;
  pct_long: number;
  pct_short: number;
  net_positions: number;
  net_change: number;
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  flip: string;
}

export interface PairData {
  pair: string;
  data: CotRecord[];
}

export type AppData = PairData[];

export enum ViewMode {
  PUBLIC = 'PUBLIC',
  ADMIN = 'ADMIN',
}