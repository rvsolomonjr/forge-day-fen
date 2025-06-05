export interface PriceHistoryPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Ticker {
  ticker: string;
  tickerName: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  simplePriceHistory: number[];
  detailedPriceHistory: PriceHistoryPoint[];
}

export interface DataGridProps {
  data: Ticker[];
  setSelectedRow: (row: Ticker | null) => void;
}

export interface FinancialChartProps {
  selectedRow: Ticker | null;
}