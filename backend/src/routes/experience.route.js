import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createExperience,
  getExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/exprience.controller.js";

const router = Router();

// create experience
router.post("/", authenticate, requireRole("CANDIDATE"), createExperience);

// get experience
router.get("/", authenticate, requireRole("CANDIDATE"), getExperience);

// update experience
router.put("/:id", authenticate, requireRole("CANDIDATE"), updateExperience);

// delete experience
router.delete("/:id", authenticate, requireRole("CANDIDATE"), deleteExperience);

export default router;
