import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job portal API is running" });
});

app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;
