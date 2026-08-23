import { Router } from "express";
import {
  createJob,
  deleteJob,
  getJobs,
  getSingleJob,
  updateJob,
} from "../controllers/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
// create a job - recruiter only
router.post("/", authenticate, requireRole("RECRUITER"), createJob);

// get all open jobs
router.get("/", getJobs);
// get single job
router.get("/:id", getSingleJob);
// update job
router.patch("/:id", authenticate, requireRole("RECRUITER"), updateJob);
// delete job
router.delete("/:id", authenticate, requireRole("RECRUITER"), deleteJob);

export default router;
