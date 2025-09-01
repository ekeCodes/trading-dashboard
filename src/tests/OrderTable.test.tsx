import { renderWithContext } from "./testUtils";
import OrdersTable from "../components/OrdersTable";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, test, expect, vi, type Mock } from "vitest";
import * as api from "../api";

vi.mock("../api", () => ({
  fetchOrders: vi.fn(),
}));

const mockOrders = [
  { id: 1, symbol: "AAPL", side: "BUY", qty: 50, price: 179.25, timestamp: 1722544901 },
  { id: 2, symbol: "AAPL", side: "SELL", qty: 100, price: 183.1, timestamp: 1722544912 },
  { id: 3, symbol: "AAPL", side: "BUY", qty: 30, price: 175.0, timestamp: 1722544922 },
  { id: 4, symbol: "AAPL", side: "SELL", qty: 25, price: 181.8, timestamp: 1722544933 },
  { id: 5, symbol: "AAPL", side: "BUY", qty: 75, price: 180.5, timestamp: 1722544945 },
];

describe("OrdersTable", () => {
  test("renders orders correctly as per response", async () => {
    (api.fetchOrders as Mock).mockResolvedValue(mockOrders);
    renderWithContext(<OrdersTable />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(await screen.findByText("179.25")).toBeInTheDocument();
    expect(screen.getByText("Timestamp")).toBeInTheDocument();
    expect(screen.getByText("Live Mode:")).toBeInTheDocument();
    expect(screen.getByText(`Rows: ${mockOrders.length}`)).toBeInTheDocument();
  });

  test("renders empty state when no orders", async () => {
    (api.fetchOrders as Mock).mockResolvedValue([]);
    renderWithContext(<OrdersTable />);
    expect(await screen.getByText(/No Rows To Show/i)).toBeInTheDocument();
  });
});
