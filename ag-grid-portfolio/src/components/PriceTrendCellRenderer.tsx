import React, { type FunctionComponent } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';

export const PriceTrendCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
}) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <div style={{ padding: '8px', color: '#999' }}>No data</div>;
  }

  const prices = value as number[];
  const width = 150;
  const height = 40;
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Determine trend color and calculate yearly change
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const yearlyChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isUpward = yearlyChange > 0;
  const strokeColor = isUpward ? '#28a745' : '#dc3545';
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create SVG path points
  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * (width - 20) + 10;
    const y = priceRange > 0 
      ? height - 6 - ((price - minPrice) / priceRange) * (height - 16)
      : height / 2;
    return `${x},${y}`;
  }).join(' ');

  // Create area fill points
  const areaPoints = `10,${height - 6} ${points} ${width - 10},${height - 6}`;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      height: '100%', 
      gap: '10px',
      padding: '4px 8px'
    }}>
      <svg 
        width={width} 
        height={height} 
        style={{ 
          border: '1px solid #e8e8e8', 
          borderRadius: '8px', 
          backgroundColor: '#fafbfc',
          flexShrink: 0
        }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="50%" stopColor={strokeColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Subtle grid lines */}
        <line x1="10" y1={height * 0.25} x2={width - 10} y2={height * 0.25} stroke="#f2f2f2" strokeWidth="0.5" />
        <line x1="10" y1={height * 0.5} x2={width - 10} y2={height * 0.5} stroke="#f2f2f2" strokeWidth="0.5" />
        <line x1="10" y1={height * 0.75} x2={width - 10} y2={height * 0.75} stroke="#f2f2f2" strokeWidth="0.5" />
        
        {/* Vertical reference lines */}
        <line x1={width * 0.25} y1="6" x2={width * 0.25} y2={height - 6} stroke="#f8f8f8" strokeWidth="0.5" />
        <line x1={width * 0.5} y1="6" x2={width * 0.5} y2={height - 6} stroke="#f8f8f8" strokeWidth="0.5" />
        <line x1={width * 0.75} y1="6" x2={width * 0.75} y2={height - 6} stroke="#f8f8f8" strokeWidth="0.5" />
        
        {/* Area fill */}
        <polygon
          fill={`url(#${gradientId})`}
          points={areaPoints}
        />
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points (show quarterly points for yearly data) */}
        {prices.filter((_, index) => index % Math.max(1, Math.floor(prices.length / 4)) === 0 || index === prices.length - 1).map((price, filteredIndex) => {
          const originalIndex = filteredIndex === prices.filter((_, i) => i % Math.max(1, Math.floor(prices.length / 4)) === 0 || i === prices.length - 1).length - 1 
            ? prices.length - 1 
            : filteredIndex * Math.max(1, Math.floor(prices.length / 4));
          const x = (originalIndex / (prices.length - 1)) * (width - 20) + 10;
          const y = priceRange > 0 
            ? height - 6 - ((price - minPrice) / priceRange) * (height - 16)
            : height / 2;
          
          return (
            <circle
              key={originalIndex}
              cx={x}
              cy={y}
              r="2.5"
              fill={strokeColor}
              stroke="white"
              strokeWidth="1"
              opacity="0.9"
            />
          );
        })}
        
        {/* Start and end indicators */}
        <circle
          cx="10"
          cy={priceRange > 0 ? height - 6 - ((firstPrice - minPrice) / priceRange) * (height - 16) : height / 2}
          r="3"
          fill="#666"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle
          cx={width - 10}
          cy={priceRange > 0 ? height - 6 - ((lastPrice - minPrice) / priceRange) * (height - 16) : height / 2}
          r="3"
          fill={strokeColor}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        minWidth: '50px'
      }}>
        <div style={{ 
          fontSize: '18px', 
          color: strokeColor,
          fontWeight: 'bold',
          lineHeight: '1'
        }}>
          {isUpward ? '↗' : '↘'}
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: strokeColor,
          fontWeight: '700',
          lineHeight: '1',
          marginTop: '2px'
        }}>
          {yearlyChange >= 0 ? '+' : ''}{yearlyChange.toFixed(1)}%
        </div>
        <div style={{ 
          fontSize: '9px', 
          color: '#888',
          fontWeight: '500',
          lineHeight: '1',
          marginTop: '1px',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          12M
        </div>
      </div>
    </div>
  );
};