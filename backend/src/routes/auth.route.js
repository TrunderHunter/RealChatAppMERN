import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// http://localhost:5002/api/auth/signup
router.post("/signup", signup);

// http://localhost:5002/api/auth/login
router.post("/login", login);

// http://localhost:5002/api/auth/logout
router.post("/logout", logout);

// http://localhost:5002/api/auth/update-profile
router.put("/update-profile", protectRoute, updateProfile);

// http://localhost:5002/api/auth/check-auth
router.get("/check-auth", protectRoute, checkAuth);

export default router;
