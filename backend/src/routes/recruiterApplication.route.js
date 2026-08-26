import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  getRecruiterApplications,
  getRecruiterApplicationById,
  updateApplicationStatus,
} from "../controllers/recruiterApplication.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("RECRUITER"),
  getRecruiterApplications,
);

// get recruiter application by id
router.get(
  "/:id",
  authenticate,
  requireRole("RECRUITER"),
  getRecruiterApplicationById,
);

// update application status
router.patch(
  "/:id/status",
  authenticate,
  requireRole("RECRUITER"),
  updateApplicationStatus,
);

export default router;
