import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  getMyJobs,
  getRecruiterStatus,
} from "../controllers/recruiter.controller.js";

const router = Router();

// get single job
router.get("/jobs", authenticate, requireRole("RECRUITER"), getMyJobs);

// get recruiter status
router.get(
  "/statistics",
  authenticate,
  requireRole("RECRUITER"),
  getRecruiterStatus,
);

export default router;
