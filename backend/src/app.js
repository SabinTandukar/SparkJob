import express from "express";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job portal API is running" });
});

export default app;
