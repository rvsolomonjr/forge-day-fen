import React, { useState, useMemo } from 'react';
import DataGrid from './components/DataGrid';
import FinancialChart from './components/FinancialChart';
import { Ticker } from './utils/types';
import { generateMockData } from './utils/mockData';

const App: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<Ticker | null>(null);
  const mockData = useMemo(() => generateMockData(), []);

  const totalPortfolioValue = useMemo(() => {
    return mockData.reduce((sum, stock) => {
      return sum + (stock.shares * stock.currentPrice);
    }, 0);
  }, [mockData]);

  const totalPnL = useMemo(() => {
    return mockData.reduce((sum, stock) => {
      const averageValue = stock.shares * stock.averagePrice;
      const currentValue = stock.shares * stock.currentPrice;
      return sum + (currentValue - averageValue);
    }, 0);
  }, [mockData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Financial Portfolio Dashboard</h1>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Portfolio Value</h3>
            <p className="portfolio-value">{formatCurrency(totalPortfolioValue)}</p>
          </div>
          <div className="summary-card">
            <h3>Total P&L</h3>
            <p className={`pnl-value ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(totalPnL)}
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="grid-section">
          <h2>Portfolio Holdings</h2>
          <DataGrid data={mockData} setSelectedRow={setSelectedRow} />
        </section>

        <section className="chart-section">
          <h2>Price Performance</h2>
          <FinancialChart selectedRow={selectedRow} />
        </section>
      </main>

      <footer className="app-footer">
        <h3>How to Use This Dashboard</h3>
        <ul>
          <li>Click on any row in the grid to see the detailed yearly price chart</li>
          <li>Use the time range selector (3M, 6M, 1Y) to adjust the chart view period</li>
          <li>Use column filters and sorting to analyze your portfolio holdings</li>
          <li>The trend column shows 12-month performance with percentage change</li>
          <li>Green/red colors indicate profit/loss and upward/downward trends</li>
          <li>Hover over chart points to see specific date and price information</li>
        </ul>
      </footer>
    </div>
  );
};

export default App;