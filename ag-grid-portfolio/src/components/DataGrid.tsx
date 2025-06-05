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
      return { color: '#dc3545', fontWeight: 'bold' };
    } else if (params.value > 0) {
      return { color: '#28a745', fontWeight: 'bold' };
    }
    return { color: '#333', fontWeight: 'normal' };
  };

  // Row Selection Options
  // Row Selection Option
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
        headerName: 'Ticker',
        cellRenderer: TickerCellRenderer,
        flex: 2,
        minWidth: 200,
      },
      {
        field: 'shares',
        headerName: 'Shares',
        type: 'numericColumn',
      },
      {
        field: 'averagePrice',
        headerName: 'Avg Price',
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
      },
      {
        field: 'currentPrice',
        headerName: 'Current Price',
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
      },
      {
        field: 'simplePriceHistory',
        headerName: 'Trend (30d)',
        cellRenderer: 'agSparklineCellRenderer',
        cellRendererParams: {
          sparklineOptions: {
            type: 'line',
            line: {
              stroke: '#007acc',
              strokeWidth: 2,
            },
            padding: {
              top: 5,
              bottom: 5,
            },
            axis: {
              type: 'number',
              stroke: 'transparent',
            },
          },
        },
        sortable: false,
        filter: false,
        flex: 1.5,
      },
      {
        field: 'PnL',
        headerName: 'Profit & Loss',
        valueGetter: calculateProfitAndLoss,
        valueFormatter: currencyFormatter,
        cellStyle: getProfitAndLossCellStyle,
        type: 'numericColumn',
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
        enableRangeSelection={true}
      />
    </div>
  );
};

export default DataGrid;