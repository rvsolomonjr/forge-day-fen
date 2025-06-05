import { Ticker, PriceHistoryPoint } from './types';

const stockList = [
  { ticker: 'AAPL', tickerName: 'Apple Inc.' },
  { ticker: 'GOOGL', tickerName: 'Alphabet Inc.' },
  { ticker: 'MSFT', tickerName: 'Microsoft Corp.' },
  { ticker: 'AMZN', tickerName: 'Amazon.com Inc.' },
  { ticker: 'TSLA', tickerName: 'Tesla Inc.' },
  { ticker: 'META', tickerName: 'Meta Platforms Inc.' },
  { ticker: 'NVDA', tickerName: 'NVIDIA Corp.' },
  { ticker: 'NFLX', tickerName: 'Netflix Inc.' },
  { ticker: 'ADBE', tickerName: 'Adobe Inc.' },
  { ticker: 'CRM', tickerName: 'Salesforce Inc.' },
];

export const generateMockData = (): Ticker[] => {
  return stockList.map((stock) => {
    const basePrice = Math.random() * 200 + 50;
    const currentPrice = basePrice + (Math.random() - 0.5) * 20;
    const shares = Math.floor(Math.random() * 100) + 10;
    
    // Generate simple price history (last 30 days)
    const simplePriceHistory = Array.from({ length: 30 }, (_, i) => {
      return basePrice + Math.sin(i * 0.2) * 10 + (Math.random() - 0.5) * 5;
    });

    // Generate detailed price history for chart
    const detailedPriceHistory: PriceHistoryPoint[] = Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (90 - i));
      const open = basePrice + (Math.random() - 0.5) * 10;
      const high = open + Math.random() * 5;
      const low = open - Math.random() * 5;
      const close = low + Math.random() * (high - low);
      
      return {
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
      };
    });

    return {
      ...stock,
      shares,
      averagePrice: Number(basePrice.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(2)),
      simplePriceHistory,
      detailedPriceHistory,
    };
  });
};