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
    const yearEndPrice = basePrice + (Math.random() - 0.3) * 40; // Slight bias towards growth
    const shares = Math.floor(Math.random() * 100) + 10;
    
    // Generate detailed price history for a full year (365 days, but we'll sample weekly = ~52 points)
    const detailedPriceHistory: PriceHistoryPoint[] = Array.from({ length: 52 }, (_, weekIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (52 - weekIndex) * 7); // Go back in weekly increments
      
      // Create realistic price progression over the year
      const progress = weekIndex / 51; // 0 to 1 over the year
      
      // Add some seasonality and trends
      const seasonalFactor = 1 + 0.1 * Math.sin(progress * 2 * Math.PI); // 10% seasonal variation
      const trendFactor = progress * (yearEndPrice - basePrice) / basePrice; // Linear trend over year
      const randomFactor = (Math.random() - 0.5) * 0.1; // 10% random variation
      
      const baseForWeek = basePrice * (1 + trendFactor) * seasonalFactor * (1 + randomFactor);
      
      // Generate OHLC for the week
      const open = baseForWeek + (Math.random() - 0.5) * basePrice * 0.02;
      const volatility = basePrice * 0.03; // 3% daily volatility
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      
      return {
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 2000000) + 500000,
      };
    });

    // Generate simple price history for trend visualization (last 12 months, monthly data)
    const simplePriceHistory = Array.from({ length: 12 }, (_, monthIndex) => {
      const progress = monthIndex / 11;
      const seasonalFactor = 1 + 0.08 * Math.sin(progress * 2 * Math.PI);
      const trendFactor = progress * (yearEndPrice - basePrice) / basePrice;
      const randomFactor = (Math.random() - 0.5) * 0.08;
      
      return basePrice * (1 + trendFactor) * seasonalFactor * (1 + randomFactor);
    });

    return {
      ...stock,
      shares,
      averagePrice: Number(basePrice.toFixed(2)),
      currentPrice: Number(detailedPriceHistory[detailedPriceHistory.length - 1].close.toFixed(2)),
      simplePriceHistory,
      detailedPriceHistory,
    };
  });
};