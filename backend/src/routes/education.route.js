import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller.js";

const router = Router();

// All education roles requires authentication and candidate role

// create education
router.post("/", authenticate, requireRole("CANDIDATE"), createEducation);

// get education
router.get("/", authenticate, requireRole("CANDIDATE"), getEducation);

// update education
router.put("/:id", authenticate, requireRole("CANDIDATE", updateEducation));

// delete education
router.delete("/:id", authenticate, requireRole("CANDIDATE"), deleteEducation);

export default router;
