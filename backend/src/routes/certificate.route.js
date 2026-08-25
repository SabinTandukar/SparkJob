import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createCertification,
  getCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificate.controller.js";

const router = Router();

// create experience
router.post("/", authenticate, requireRole("CANDIDATE"), createCertification);

// get certificate
router.get("/", authenticate, requireRole("CANDIDATE"), getCertification);

// update certificate
router.put("/:id", authenticate, requireRole("CANDIDATE"), updateCertification);

// delete certificate
router.delete(
  "/:id",
  authenticate,
  requireRole("CANDIDATE"),
  deleteCertification,
);

export default router;
