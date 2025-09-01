import express from "express";
import fs from "fs";
import path from "path";
import request from "supertest";
import ordersRouter from "../routes/orders.js";

const app = express();
app.use(express.json());
app.use("/api/orders", ordersRouter);

const ordersFile = path.join(process.cwd(), "orders", "AAPL.json");

let originalOrders;

beforeAll(() => {
  originalOrders = JSON.parse(fs.readFileSync(ordersFile, "utf-8"));
});

afterAll(() => {
  fs.writeFileSync(ordersFile, JSON.stringify(originalOrders, null, 2));
});

describe("Orders API", () => {
  test("should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/orders").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("symbol, side, qty, price required");
  });

  test("should create a new order and write to file", async () => {
    const newOrder = {
      symbol: "AAPL",
      side: "BUY",
      price: 200.886,
      qty: 10,
    };

    const fileLengthBefore = JSON.parse(fs.readFileSync(ordersFile, "utf-8")).length;
    const res = await request(app).post("/api/orders").send(newOrder);
    expect(res.statusCode).toBe(201);
    expect(res.body.symbol).toBe("AAPL");

    const saved = JSON.parse(fs.readFileSync(ordersFile, "utf-8"));
    const savedOrder = saved[saved.length - 1];
    expect(saved.length).toBe(fileLengthBefore + 1);
    expect(savedOrder.symbol).toBe("AAPL");
    expect(savedOrder.id).toBe(fileLengthBefore + 1);
    expect(savedOrder.price).toBe(200.886);
  });

  test("should return orders for a symbol", async () => {
    const order = {
      symbol: "AAPL",
      side: "BUY",
      price: 200.119,
      qty: 10,
    };
    await request(app).post("/api/orders").send(order);

    const res = await request(app).get("/api/orders?symbol=AAPL");
    expect(res.statusCode).toBe(200);
    const latestOrder = res.body[res.body.length - 1];
    expect(latestOrder.symbol).toBe("AAPL");
    expect(latestOrder.price).toBe(200.119);
    expect(latestOrder.side).toBe("BUY");
    expect(latestOrder.id).toEqual(res.body.length);
    expect(latestOrder).toHaveProperty("timestamp");
  });
});
