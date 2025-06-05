import React, { useMemo } from 'react';
import { FinancialChartProps } from '../utils/types';

const FinancialChart: React.FC<FinancialChartProps> = ({ selectedRow }) => {
  const chartData = useMemo(() => {
    if (!selectedRow) return null;
    
    const data = selectedRow.detailedPriceHistory.slice(-30);
    const maxPrice = Math.max(...data.map(d => d.high));
    const minPrice = Math.min(...data.map(d => d.low));
    
    return {
      data,
      maxPrice,
      minPrice,
      priceRange: maxPrice - minPrice,
    };
  }, [selectedRow]);

  if (!selectedRow || !chartData) {
    return (
      <div className="chart-placeholder">
        <p>Select a ticker to see the detailed price history</p>
      </div>
    );
  }

  const { data, maxPrice, minPrice, priceRange } = chartData;

  return (
    <div className="financial-chart">
      <h3>{selectedRow.ticker} - Price History (Last 30 Days)</h3>
      <div className="chart-container">
        <svg width="100%" height="300" className="price-chart">
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#007acc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#007acc" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="40"
              y1={`${y * 0.8 + 10}%`}
              x2="95%"
              y2={`${y * 0.8 + 10}%`}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}
          
          {/* Price line */}
          <polyline
            fill="none"
            stroke="#007acc"
            strokeWidth="3"
            points={data.map((point, index) => {
              const x = 40 + (index / (data.length - 1)) * 55;
              const y = ((maxPrice - point.close) / priceRange) * 80 + 10;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Area fill */}
          <polygon
            fill="url(#priceGradient)"
            points={`40,90 ${data.map((point, index) => {
              const x = 40 + (index / (data.length - 1)) * 55;
              const y = ((maxPrice - point.close) / priceRange) * 80 + 10;
              return `${x},${y}`;
            }).join(' ')} 95,90`}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = 40 + (index / (data.length - 1)) * 55;
            const y = ((maxPrice - point.close) / priceRange) * 80 + 10;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#007acc"
                className="data-point"
              >
                <title>{`${point.date}: $${point.close.toFixed(2)}`}</title>
              </circle>
            );
          })}
          
          {/* Y-axis labels */}
          <text x="5" y="20" fontSize="12" fill="#666">
            ${maxPrice.toFixed(2)}
          </text>
          <text x="5" y="95" fontSize="12" fill="#666">
            ${minPrice.toFixed(2)}
          </text>
          
          {/* X-axis labels */}
          <text x="40" y="110" fontSize="12" fill="#666" textAnchor="middle">
            {data[0]?.date}
          </text>
          <text x="95%" y="110" fontSize="12" fill="#666" textAnchor="end">
            {data[data.length - 1]?.date}
          </text>
        </svg>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Current:</span>
          <span className="stat-value">${selectedRow.currentPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">High:</span>
          <span className="stat-value">${maxPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Low:</span>
          <span className="stat-value">${minPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;