import { Router } from "express";
import { createJob, getJobs } from "../controllers/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
// get all open jobs
router.get("/", getJobs);
// create a job - recruiter only
router.post("/", authenticate, requireRole("RECRUITER"), createJob);

export default router;
