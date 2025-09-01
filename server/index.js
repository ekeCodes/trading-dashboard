import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import symbolsRouter from "./routes/symbols.js";
import ordersRouter from "./routes/orders.js";
import { setupWebSocket } from "./webSocket.js";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/symbols", symbolsRouter);
app.use("/api/orders", ordersRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: `Something went wrong! ${err}` });
});

setupWebSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
