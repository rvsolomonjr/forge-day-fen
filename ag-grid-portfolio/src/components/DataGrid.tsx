import React, { useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  CellClassParams,
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdParams,
  SelectionChangedEvent,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { DataGridProps, Ticker } from '../utils/types';
import { TickerCellRenderer } from './TickerCellRenderer';
import { PriceTrendCellRenderer } from './PriceTrendCellRenderer';

// AG Grid Styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const DataGrid: React.FC<DataGridProps> = ({ data = [], setSelectedRow }) => {
  // Default Col Def (Applies to All Columns)
  const defaultColDef = {
    filter: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  // Currency Value Formatter
  const currencyFormatter = (params: ValueFormatterParams): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(params.value);
  };

  // Profit And Loss Value Getter
  const calculateProfitAndLoss = (params: ValueGetterParams) => {
    const shares = params.data.shares;
    const averageValue = shares * params.data.averagePrice;
    const currentValue = shares * params.data.currentPrice;
    return currentValue - averageValue;
  };

  // Profit And Loss Cell Style
  const getProfitAndLossCellStyle = (params: CellClassParams) => {
    if (params.value < 0) {
      return { 
        color: '#dc3545', 
        fontWeight: 'bold',
        backgroundColor: '#fff5f5'
      };
    } else if (params.value > 0) {
      return { 
        color: '#28a745', 
        fontWeight: 'bold',
        backgroundColor: '#f0fff4'
      };
    }
    return { 
      color: '#333', 
      fontWeight: 'normal',
      backgroundColor: 'transparent'
    };
  };

  // Row Selection Options (Community version uses string)
  const rowSelection = 'single';

  // On First Data Rendered Event
  const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();
  };

  // Set Row ID Strategy
  const getRowId = (params: GetRowIdParams): string => {
    return params.data.ticker;
  };

  // Data To be Displayed In The Data Grid
  const rowData = useMemo<Ticker[]>(() => data, [data]);

  // Column Definitions
  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        field: 'ticker',
        headerName: 'Company',
        cellRenderer: TickerCellRenderer,
        flex: 2.5,
        minWidth: 220,
        pinned: 'left',
      },
      {
        field: 'shares',
        headerName: 'Shares',
        type: 'numericColumn',
        flex: 1,
        minWidth: 100,
        valueFormatter: (params) => params.value.toLocaleString(),
      },
      {
        field: 'averagePrice',
        headerName: 'Avg Price',
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
        flex: 1.2,
        minWidth: 120,
      },
      {
        field: 'currentPrice',
        headerName: 'Current Price',
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
        flex: 1.2,
        minWidth: 120,
      },
      {
        field: 'simplePriceHistory',
        headerName: '12-Month Trend',
        cellRenderer: PriceTrendCellRenderer,
        sortable: false,
        filter: false,
        flex: 2,
        minWidth: 200,
        headerTooltip: 'Shows 12-month price trend and percentage change',
      },
      {
        field: 'PnL',
        headerName: 'Profit & Loss',
        valueGetter: calculateProfitAndLoss,
        valueFormatter: currencyFormatter,
        cellStyle: getProfitAndLossCellStyle,
        type: 'numericColumn',
        flex: 1.3,
        minWidth: 130,
        headerTooltip: 'Total profit/loss based on average price vs current price',
      },
    ];
  }, []);

  // Selection Changed Event Handler
  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const currentlySelectedRowData = event.api.getSelectedNodes()[0]?.data;
    setSelectedRow(currentlySelectedRowData || null);
  }, [setSelectedRow]);

  return (
    <div className="ag-theme-quartz data-grid-container">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        onSelectionChanged={onSelectionChanged}
        onFirstDataRendered={onFirstDataRendered}
        getRowId={getRowId}
        animateRows={true}
        suppressRowClickSelection={false}
        rowHeight={60}
        headerHeight={45}
        suppressCellFocus={true}
        enableBrowserTooltips={true}
      />
    </div>
  );
};

export default DataGrid;