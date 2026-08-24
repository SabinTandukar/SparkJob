import express from "express";
import authRoutes from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";
import candidateRoutes from "./routes/candidate.route.js";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job portal API is running" });
});

app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);
// job routes
app.use("/api/jobs", jobRoutes);
// candidate route
app.use("/api/candidates", candidateRoutes);

export default app;
