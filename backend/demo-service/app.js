import http from "http";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

const VERSION = process.env.APP_VERSION || "1.0.0";
const FAULT = process.env.FAULT === "on";
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/orders-api";

const mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });

let logs = null;

async function log(message, level) {
  const line = { time: new Date(), version: VERSION, level, message };
  console.log(JSON.stringify(line));
  if (logs) await logs.insertOne(line);
}

async function loadPrices() {
  if (FAULT) {
    await fetch("http://pricing-service:5000/prices");
  }
  return { lelev: 30, errog: 50 };
}

mongoClient.connect()
  .then(() => {
    logs = mongoClient.db().collection("logs");
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.warn("MongoDB not available:", err.message);
  });

app.get("/health", async (req, res) => {
  await log("health check :)", "info");
  res.json({ status: "ok", version: VERSION, db: logs ? "connected" : "disconnected" });
});

app.get("/version", (req, res) => {
  res.json({ service: "orders-api", version: VERSION });
});

app.get("/logs", async (req, res) => {
  if (!logs) return res.status(503).json({ error: "DB not connected" });
  const newestFirst = { time: -1 };
  const lines = await logs
    .find({}, { projection: { _id: 0 } })
    .sort(newestFirst)
    .limit(20)
    .toArray();
  res.json(lines);
});

app.get("/api/orders", async (req, res) => {
  let prices;

  try {
    prices = await loadPrices();
  } catch (error) {
    await log(
      "error",
      `GET /api/orders 500 - cannot reach pricing service ${error.cause} ${error.code} ${error.message}`,
    );

    return res.status(500).json({ error: "Internal server error" });
  }
  await log("info", "GET /api/orders 200");
  res.json({ orders: [{ id: 1, item: "lelev", price: prices.lelev }] });
});

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`orders-api ${VERSION} listening on ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  server.close(async () => {
    await mongoClient.close();
    console.log("Server closed gracefully");
    process.exit(0);
  });
});