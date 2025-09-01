# Trading Dashboard

A modern, responsive full-stack trading dashboard built with React (Vite + TypeScript) frontend and Node.js (Express + WebSockets) backend.
The system simulates live market ticks, allows users to place trade orders, view them in an interactive table (ag-Grid), and visualize prices on a real-time Chart.js chart.
Deployed frontend on gh-pages and hosted backend service on [Render.com](https://render.com/).
Deployed URL: (https://ekecodes.github.io/trading-dashboard/)

## Features

- Live Market Ticks – Simulated prices stream in real time over WebSockets, updating charts instantly.
- Symbol Subscriptions – Users can subscribe/unsubscribe to specific symbols (e.g., AAPL, TSLA, BTC-USD).
- Order Management – Place BUY/SELL orders with validation on both frontend and backend.
- Order Table – Interactive ag-Grid table with sorting, filtering, and manual refresh and toggle to auto-refresh.
- Streaming Chart – Real-time Chart.js line chart to see live price changes.
- Persistence – Each symbol’s orders are saved in a dedicated JSON file (orders/<symbol>.json).
- Admin Controls – Simple admin API to inject new symbols.

## Technologies Used

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js]
- [NodeJs]
- [Express]
- [Websocket]

## Getting Started

### Prerequisites

- Node.js (v22.12.0 or later)
- npm (v10.9.0 or later)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ekeCodes/trading-dashboard.git
   ```

2. Start Fronend:
3. Navigate to the project directory:

   ```sh
   cd trading-dashboard
   ```

4. Install dependencies:

   ```sh
   npm install
   ```

5. Start the development server:

   ```sh
   npm run dev
   ```

   It starts the frontend on 'http://localhost:5173/trading-dashboard/'

6. Start backend server:
7. Open a new terminal and Navigate to `server` directory.
8. Install dependencies:

   ```sh
   npm install
   ```

9. Start the development server:

   ```sh
   npm start
   ```

   It starts the server on PORT 4000

10. Open 'http://localhost:5173/trading-dashboard/' in browser to access the Trading Dashboard Website.

## Usage

The trading dashboard displays market summaries for major indices, an interactive chart, and a watchlist. Users can:

- View real-time market data (mock data used in this demo)
- Interact with the chart to view specific data points
- Customize the watchlist (functionality to be implemented)
