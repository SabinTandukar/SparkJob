import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  getCandidateProfile,
  updateCandidateProfile,
} from "../controllers/candidate.controller.js";

const router = Router();

// get candidate profile
router.get(
  "/profile",
  authenticate,
  requireRole("CANDIDATE"),
  getCandidateProfile,
);

// Update candidate profile
router.put(
  "/profile",
  authenticate,
  requireRole("CANDIDATE"),
  updateCandidateProfile,
);

export default router;
