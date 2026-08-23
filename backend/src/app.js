import express from "express";
import authRoutes from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job portal API is running" });
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
