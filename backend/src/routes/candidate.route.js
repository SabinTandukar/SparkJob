import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  getCandidateProfile,
  updateCandidateProfile,
  getCandidateStats,
  getProfileCompleteness,
} from "../controllers/candidate.controller.js";

const router = Router();

// get candidate profile
router.get(
  "/profile",
  authenticate,
  requireRole("CANDIDATE"),
  getCandidateProfile,
);

// get candidate stats
router.get(
  "/statistics",
  authenticate,
  requireRole("CANDIDATE"),
  getCandidateStats,
);

// Update candidate profile
router.put(
  "/profile/:id",
  authenticate,
  requireRole("CANDIDATE"),
  updateCandidateProfile,
);

router.get(
  "/profile/completeness",
  authenticate,
  requireRole("CANDIDATE"),
  getProfileCompleteness,
);

export default router;
