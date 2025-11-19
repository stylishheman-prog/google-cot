import { AppData, PairData } from '../types';

// Initial sample data to populate the app if data.json isn't found or is empty
const INITIAL_DATA: AppData = [
  {
    pair: "EURUSD",
    data: [
      {
        id: "1",
        date: "2025-01-14",
        longs: 210450,
        shorts: 115300,
        change_long: 5400,
        change_short: -2100,
        pct_long: 64.6,
        pct_short: 35.4,
        net_positions: 95150,
        net_change: 7500,
        bias: "Bullish",
        flip: "0%"
      },
      {
        id: "2",
        date: "2025-01-07",
        longs: 205050,
        shorts: 117400,
        change_long: -1200,
        change_short: 4500,
        pct_long: 63.6,
        pct_short: 36.4,
        net_positions: 87650,
        net_change: -5700,
        bias: "Bullish",
        flip: "0%"
      }
    ]
  },
  {
    pair: "GBPUSD",
    data: [
      {
        id: "3",
        date: "2025-01-14",
        longs: 85400,
        shorts: 45200,
        change_long: 1200,
        change_short: 800,
        pct_long: 65.4,
        pct_short: 34.6,
        net_positions: 40200,
        net_change: 400,
        bias: "Bullish",
        flip: "0%"
      }
    ]
  },
  { pair: "USDJPY", data: [] },
  { pair: "USDCHF", data: [] },
  { pair: "AUDUSD", data: [] },
  { pair: "NZDUSD", data: [] },
  { pair: "USDCAD", data: [] },
  { pair: "GBPJPY", data: [] },
  { pair: "EURJPY", data: [] },
  { pair: "EURGBP", data: [] },
];

// Simulate fetching data (in a real scenario, this would fetch /data.json)
export const loadData = async (): Promise<AppData> => {
  try {
    // Attempt to fetch from the public directory
    const response = await fetch('./data.json');
    if (response.ok) {
      const json = await response.json();
      // Ensure IDs exist (if manually edited JSON didn't have them)
      return json.map((p: PairData) => ({
        ...p,
        data: p.data.map((r, idx) => ({ ...r, id: r.id || `${p.pair}-${r.date}-${idx}` }))
      }));
    }
    throw new Error("File not found");
  } catch (error) {
    console.warn("Could not load external data.json, using built-in default data.", error);
    return INITIAL_DATA;
  }
};

export const exportData = (data: AppData) => {
  // Clean up internal IDs before export if desired, but keeping them is fine for consistency
  const cleanData = data.map(pair => ({
    ...pair,
    data: pair.data.map(({ id, ...rest }) => rest) // Remove ID for the JSON file
  }));
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};