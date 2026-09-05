import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  applyForJob,
  getMyApplications,
  getApplicationById,
} from "../controllers/application.controller.js";

const router = Router();

//apply for jobs
router.post("/:jobId", authenticate, requireRole("CANDIDATE"), applyForJob);

// get candidate job application
router.get(
  "/my-applications",
  authenticate,
  requireRole("CANDIDATE"),
  getMyApplications,
);

// get single application
router.get("/:id", authenticate, requireRole("CANDIDATE"), getApplicationById);

export default router;
