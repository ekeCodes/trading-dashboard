import express from "express";
import fs from "fs";
import path from "path";
import request from "supertest";
import dotenv from "dotenv";
import symbolsRouter from "../routes/symbols.js";
import { broadcast } from "../webSocket.js";

const app = express();
app.use(express.json());
app.use("/api/symbols", symbolsRouter);
dotenv.config();

jest.mock("../websocket.js", () => ({
  broadcast: jest.fn(),
}));

const symbolsFile = path.join(process.cwd(), "symbols", "symbols.json");

let originalSymbols;
beforeEach(() => {
  jest.clearAllMocks();
});
beforeAll(() => {
  originalSymbols = JSON.parse(fs.readFileSync(symbolsFile, "utf-8"));
});

afterAll(() => {
  fs.writeFileSync(symbolsFile, JSON.stringify(originalSymbols, null, 2));
});

describe("Symbols API", () => {
  test("should return all symbols", async () => {
    const res = await request(app).get("/api/symbols");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("symbol");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("market");
    expect(res.body[0]).toHaveProperty("closePrice");
  });

  test("should return 400 if missing fields when adding symbol", async () => {
    const newSymbol = {
      symbol: "TEST",
      closePrice: 100,
      market: "NASDAQ",
    };

    const res = await request(app).post("/api/symbols/add-symbol").set("x-admin-key", process.env.ADMIN_KEY).send(newSymbol);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  test("should add a new symbol", async () => {
    const newSymbol = {
      symbol: "TEST123",
      closePrice: 100,
      name: "Test Corp 123",
      market: "NASDAQ",
    };

    const res = await request(app).post("/api/symbols/add-symbol").set("x-admin-key", process.env.ADMIN_KEY).send(newSymbol);
    expect(broadcast).toHaveBeenCalledWith({
      type: "symbolsUpdated",
      newSymbol: expect.objectContaining(res.body),
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.symbol).toBe("TEST123");
  });

  test("should return 403 if unauthorized", async () => {
    const newSymbol = {
      symbol: "TEST123",
      closePrice: 100,
      name: "Test Corp 123",
      market: "NASDAQ",
    };

    const res = await request(app).post("/api/symbols/add-symbol").set("x-admin-key", "dummy-key").send(newSymbol);
    expect(res.statusCode).toBe(403);
  });
});
