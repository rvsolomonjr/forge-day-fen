import React, { type FunctionComponent } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import '../styles/TickerCellRenderer.css';

export const TickerCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  data,
}) => {
  if (!data) return null;

  return (
    <div className="tickerContainer">
      <div className="ticker-icon">
        {data.ticker.substring(0, 2)}
      </div>
      <div className="ticker-info">
        <div className="ticker-symbol">{data.ticker}</div>
        <div className="ticker-name">{data.tickerName}</div>
      </div>
    </div>
  );
};