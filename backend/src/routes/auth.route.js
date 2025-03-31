import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// http://localhost:5000/api/auth/signup
router.post("/signup", signup);

// http://localhost:5000/api/auth/login
router.post("/login", login);

// http://localhost:5000/api/auth/logout
router.post("/logout", logout);

export default router;
