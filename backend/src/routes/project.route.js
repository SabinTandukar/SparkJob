import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

// create project
router.post("/", authenticate, requireRole("CANDIDATE"), createProject);
// get project
router.get("/", authenticate, requireRole("CANDIDATE"), getProject);
// update project
router.put("/:id", authenticate, requireRole("CANDIDATE"), updateProject);
// delete project
router.delete("/:id", authenticate, requireRole("CANDIDATE"), deleteProject);

export default router;
