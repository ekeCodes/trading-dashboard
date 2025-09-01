# Trading Dashboard

A modern, responsive full-stack trading dashboard built with React (Vite + TypeScript) frontend and Node.js (Express + WebSockets) backend.
The system simulates live market ticks, allows users to place trade orders, view them in an interactive table (ag-Grid), and visualize prices on a real-time Chart.js chart.

Deployed frontend on gh-pages and hosted backend service on [Render.com](https://render.com/). Used github-workflow to integrate deployment pipeline to ensure seamless deployment after every push to branch.

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
- [Chart.js](https://www.chartjs.org/)
- [NodeJs](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [Websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

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

The website displays a real-time trading dashboard powered by simulated market data and allows users to:

- Subscribe to live tick data per symbol and view live prices visualized using a chart.
- Submit trade orders with validation rules and see them reflected in Order Table
- View and manage orders in a tabular view with functionality to Sort and Filter table data.
- Persist order data in one file per symbol
- Refresh the order table manually or keep the `Live Mode` toggle `ON` to reflect the latest data
- Allows Admin to inject new Tradeable Symbols in the list via an admin-only api endpoint.

## API Usage Examples

1. Get Tradeable Symbols

```http
GET /api/symbols
```

- Response:

```json
[
  { "symbol": "AAPL", "name": "Apple Inc.", "market": "NASDAQ", "closePrice": 180.12 },
  { "symbol": "TSLA", "name": "Tesla Inc.", "market": "NASDAQ", "closePrice": 243.22 }
]
```

2. Subscribe to Market Ticks (WebSocket)

- Client ->

```sh
{ "action": "subscribe", "symbol": "AAPL" }
```

- Server ->

```json
{ "symbol": "AAPL", "price": 182.31, "volume": 75, "timestamp": 1722544852 }
```

3. Place an Order

```http
POST /api/orders
Content-Type: application/json
```

- Request ->

```json
{
  "symbol": "AAPL",
  "side": "BUY",
  "qty": 100,
  "price": 182.5
}
```

- Response ->

```json
{
  "id": 101,
  "symbol": "AAPL",
  "side": "BUY",
  "qty": 100,
  "price": 182.5,
  "timestamp": 1722544961
}
```

4. Get Orders for a Symbol

```http
GET /api/orders?symbol=AAPL
```

- Response ->

```json
[
  { "id": 1, "symbol": "AAPL", "side": "BUY", "qty": 50, "price": 179.25, "timestamp": 1722544901 },
  { "id": 2, "symbol": "AAPL", "side": "SELL", "qty": 100, "price": 183.1, "timestamp": 1722544912 }
]
```

5. Admin API – Add New Symbol

```http
POST /api/admin/add-symbol
x-admin-key: supersecret
Content-Type: application/json
```

- Request ->

```json
{
  "symbol": "EKETest",
  "closePrice": 610,
  "name": "Eke Test Symbol",
  "market": "INDIA"
}
```

- Response ->

```json
{
  "symbol": "EKETEST",
  "closePrice": 610,
  "name": "Eke Test Symbol",
  "market": "INDIA"
}
```
