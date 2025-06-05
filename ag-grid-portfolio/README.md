# AG Grid Financial Portfolio Dashboard

A modern financial portfolio dashboard built with React, TypeScript, Vite, and AG Grid Enterprise.

## Features

- **Interactive Data Grid**: Display portfolio holdings with advanced filtering, sorting, and selection
- **Custom Cell Renderers**: Beautiful ticker symbols with company logos and sparkline charts
- **Financial Calculations**: Real-time profit/loss calculations with color-coded indicators
- **Price Charts**: Interactive price history visualization for selected stocks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **AG Grid Enterprise** for advanced data grid features
- **AG Charts Enterprise** for financial charting
- **CSS3** with modern design patterns

## Installation

1. Clone or create the project directory:
```bash
mkdir ag-grid-portfolio
cd ag-grid-portfolio
```

2. Copy all the files from the project structure above into their respective locations.

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ag-grid-portfolio/
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── index.html                # HTML entry point
├── src/
│   ├── main.tsx             # React app entry point
│   ├── App.tsx              # Main application component
│   ├── components/          # React components
│   │   ├── DataGrid.tsx     # AG Grid component
│   │   ├── FinancialChart.tsx # Price chart component
│   │   └── TickerCellRenderer.tsx # Custom cell renderer
│   ├── utils/               # Utilities and types
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── mockData.ts      # Mock data generator
│   ├── styles/              # CSS stylesheets
│   │   ├── index.css        # Global styles
│   │   └── TickerCellRenderer.css # Component styles
│   └── vite-env.d.ts        # Vite type definitions
└── README.md                # This file
```

## Usage

1. **View Portfolio**: The main grid displays all your stock holdings with real-time data
2. **Filter & Sort**: Use column headers to filter and sort your data
3. **Select Stocks**: Click any row to view detailed price charts
4. **Analyze Performance**: View profit/loss indicators and portfolio summary
5. **Responsive Design**: Use on any device - the interface adapts automatically

## Key Components

### DataGrid Component
- Displays portfolio holdings in an interactive table
- Features custom ticker cell renderer with company info
- Includes sparkline charts for 30-day price trends
- Calculates and displays profit/loss with color coding
- Supports filtering, sorting, and row selection

### FinancialChart Component
- Shows detailed price history for selected stocks
- Interactive SVG-based chart with hover effects
- Displays key statistics (current, high, low prices)
- Updates dynamically when different stocks are selected

### TickerCellRenderer Component
- Custom cell renderer for stock ticker symbols
- Displays company logos and full company names
- Clean, professional styling with hover effects

## Customization

### Adding New Stocks
Edit `src/utils/mockData.ts` to add more stocks to the `stockList` array:

```typescript
const stockList = [
  { ticker: 'AAPL', tickerName: 'Apple Inc.' },
  { ticker: 'YOUR_STOCK', tickerName: 'Your Company Name' },
  // Add more stocks here
];
```

### Styling
- Global styles: `src/styles/index.css`
- Component styles: `src/styles/TickerCellRenderer.css`
- AG Grid themes: Import different themes in `DataGrid.tsx`

### Data Sources
Replace the mock data generator in `src/utils/mockData.ts` with real API calls to financial data providers.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## License

This project is for educational and demonstration purposes.

## AG Grid License

This project uses AG Grid Enterprise features. For production use, you'll need an AG Grid Enterprise license. Visit [ag-grid.com](https://ag-grid.com) for more information.
```

## Quick Setup Script (Optional)

Create this as `setup.sh` to automate the setup process:

```bash
#!/bin/bash

# Create project directory
mkdir -p ag-grid-portfolio
cd ag-grid-portfolio

# Create directory structure
mkdir -p src/components src/utils src/styles

# Initialize package.json (you'll need to copy the package.json content manually)
echo "Project structure created!"
echo "Now copy all the files from the project structure above."
echo "Then run: npm install && npm run dev"
```

## Final Notes

1. **AG Grid License**: This uses AG Grid Enterprise features. You'll need a license for production use.

2. **Real Data**: Replace the mock data generator with real financial API integration.

3. **Error Handling**: Add proper error handling for production use.

4. **Testing**: Add unit tests using Jest/Vitest and React Testing Library.

5. **Performance**: For large datasets, consider implementing server-side filtering and pagination.

After setting up all these files and running `npm install` followed by `npm run dev`, you'll have a fully functional financial portfolio dashboard with AG Grid!