import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", authenticate, getMyNotifications);

router.patch("/:id/read", authenticate, markNotificationAsRead);

export default router;
