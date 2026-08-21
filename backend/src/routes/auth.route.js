import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// register users
router.post("/register", register);

// login users
router.post("/login", login);

//authenticate users with jwt
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

export default router;
