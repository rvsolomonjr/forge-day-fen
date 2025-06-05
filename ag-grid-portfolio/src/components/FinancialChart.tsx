import React, { useMemo, useState } from 'react';
import { FinancialChartProps } from '../utils/types';

const FinancialChart: React.FC<FinancialChartProps> = ({ selectedRow }) => {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('1Y');
  
  const chartData = useMemo(() => {
    if (!selectedRow) return null;
    
    // Determine how much data to show based on selected time range
    let dataPoints: number;
    let label: string;
    
    switch (timeRange) {
      case '3M':
        dataPoints = 13; // ~3 months of weekly data
        label = 'Last 3 Months';
        break;
      case '6M':
        dataPoints = 26; // ~6 months of weekly data  
        label = 'Last 6 Months';
        break;
      case '1Y':
      default:
        dataPoints = 52; // Full year of weekly data
        label = 'Last 12 Months';
        break;
    }
    
    const data = selectedRow.detailedPriceHistory.slice(-dataPoints);
    const maxPrice = Math.max(...data.map(d => d.high));
    const minPrice = Math.min(...data.map(d => d.low));
    
    return {
      data,
      maxPrice,
      minPrice,
      priceRange: maxPrice - minPrice,
      label,
    };
  }, [selectedRow, timeRange]);

  if (!selectedRow || !chartData) {
    return (
      <div className="chart-placeholder">
        <p>Select a ticker to see the detailed price history</p>
      </div>
    );
  }

  const { data, maxPrice, minPrice, priceRange, label } = chartData;

  // Calculate year-to-date performance
  const yearStartPrice = selectedRow.detailedPriceHistory[0]?.close || selectedRow.averagePrice;
  const currentPrice = selectedRow.currentPrice;
  const ytdReturn = ((currentPrice - yearStartPrice) / yearStartPrice) * 100;

  return (
    <div className="financial-chart">
      <div className="chart-header">
        <h3>{selectedRow.ticker} - Price History ({label})</h3>
        <div className="time-range-selector">
          {(['3M', '6M', '1Y'] as const).map((range) => (
            <button
              key={range}
              className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-container">
        <svg width="100%" height="400" className="price-chart" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#007acc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#007acc" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Background */}
          <rect width="100%" height="100%" fill="#fafafa" />
          
          {/* Chart area background */}
          <rect x="60" y="20" width="720" height="320" fill="white" stroke="#e0e0e0" strokeWidth="1" />
          
          {/* Horizontal grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, index) => (
            <line
              key={index}
              x1="60"
              y1={20 + ratio * 320}
              x2="780"
              y2={20 + ratio * 320}
              stroke="#f0f0f0"
              strokeWidth="1"
              strokeDasharray={index === 0 || index === 5 ? "none" : "2,2"}
            />
          ))}
          
          {/* Vertical grid lines */}
          {data.length > 12 && [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1={60 + ratio * 720}
              y1="20"
              x2={60 + ratio * 720}
              y2="340"
              stroke="#f5f5f5"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}
          
          {/* Price area fill */}
          <polygon
            fill="url(#priceGradient)"
            points={`60,340 ${data.map((point, index) => {
              const x = 60 + (index / (data.length - 1)) * 720;
              const y = 20 + ((maxPrice - point.close) / priceRange) * 320;
              return `${x},${y}`;
            }).join(' ')} 780,340`}
          />
          
          {/* Price line */}
          <polyline
            fill="none"
            stroke="#007acc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = 60 + (index / (data.length - 1)) * 720;
              const y = 20 + ((maxPrice - point.close) / priceRange) * 320;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points (show fewer for performance) */}
          {data.filter((_, index) => index % Math.max(1, Math.floor(data.length / 15)) === 0 || index === data.length - 1).map((point, filteredIndex) => {
            const originalIndex = filteredIndex === data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 15)) === 0 || i === data.length - 1).length - 1 
              ? data.length - 1 
              : filteredIndex * Math.max(1, Math.floor(data.length / 15));
            const x = 60 + (originalIndex / (data.length - 1)) * 720;
            const y = 20 + ((maxPrice - point.close) / priceRange) * 320;
            
            return (
              <circle
                key={originalIndex}
                cx={x}
                cy={y}
                r="4"
                fill="#007acc"
                stroke="white"
                strokeWidth="2"
                className="data-point"
              >
                <title>{`${point.date}: $${point.close.toFixed(2)}`}</title>
              </circle>
            );
          })}
          
          {/* Y-axis labels */}
          <text x="50" y="30" fontSize="12" fill="#666" textAnchor="end">
            ${maxPrice.toFixed(2)}
          </text>
          <text x="50" y="185" fontSize="12" fill="#666" textAnchor="end">
            ${((maxPrice + minPrice) / 2).toFixed(2)}
          </text>
          <text x="50" y="340" fontSize="12" fill="#666" textAnchor="end">
            ${minPrice.toFixed(2)}
          </text>
          
          {/* X-axis labels */}
          <text x="60" y="365" fontSize="12" fill="#666" textAnchor="start">
            {new Date(data[0]?.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </text>
          
          {timeRange === '1Y' && (
            <>
              <text x="240" y="365" fontSize="12" fill="#666" textAnchor="middle">
                {new Date(data[Math.floor(data.length * 0.25)]?.date).toLocaleDateString('en-US', { month: 'short' })}
              </text>
              <text x="420" y="365" fontSize="12" fill="#666" textAnchor="middle">
                {new Date(data[Math.floor(data.length * 0.5)]?.date).toLocaleDateString('en-US', { month: 'short' })}
              </text>
              <text x="600" y="365" fontSize="12" fill="#666" textAnchor="middle">
                {new Date(data[Math.floor(data.length * 0.75)]?.date).toLocaleDateString('en-US', { month: 'short' })}
              </text>
            </>
          )}
          
          <text x="780" y="365" fontSize="12" fill="#666" textAnchor="end">
            {new Date(data[data.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </text>
          
          {/* Chart title */}
          <text x="420" y="15" fontSize="14" fill="#333" textAnchor="middle" fontWeight="600">
            {selectedRow.tickerName}
          </text>
        </svg>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Current Price:</span>
          <span className="stat-value">${selectedRow.currentPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Period High:</span>
          <span className="stat-value">${maxPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Period Low:</span>
          <span className="stat-value">${minPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">YTD Return:</span>
          <span className={`stat-value ${ytdReturn >= 0 ? 'positive' : 'negative'}`}>
            {ytdReturn >= 0 ? '+' : ''}{ytdReturn.toFixed(2)}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Shares:</span>
          <span className="stat-value">{selectedRow.shares.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Market Value:</span>
          <span className="stat-value">
            ${(selectedRow.shares * selectedRow.currentPrice).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;