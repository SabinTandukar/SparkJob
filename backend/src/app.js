import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";
import candidateRoutes from "./routes/candidate.route.js";
import educationRoutes from "./routes/education.route.js";
import experienceRoutes from "./routes/experience.route.js";
import projectRoutes from "./routes/project.route.js";
import certificationRoutes from "./routes/certificate.route.js";
import applicationRoutes from "./routes/application.route.js";
import recruiterApplicationRoutes from "./routes/recruiterApplication.route.js";
import recruiterJobRoutes from "./routes/recruiterJob.route.js";
import notificationRoutes from "./routes/notification.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

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
// education route
app.use("/api/candidates/education", educationRoutes);
// experience route
app.use("/api/candidates/experience", experienceRoutes);
// project route
app.use("/api/candidates/project", projectRoutes);
// certificate route
app.use("/api/candidates/certification", certificationRoutes);
// applicaton route
app.use("/api/applications", applicationRoutes);
// recruiter application route
app.use("/api/recruiter/applications", recruiterApplicationRoutes);
// get recruiter jobs
app.use("/api/recruiter", recruiterJobRoutes);
// notification routes
app.use("/api/notifications", notificationRoutes);

export default app;
