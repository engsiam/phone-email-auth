import { Router } from "express";
import {
  registerUser,
  verifyPhoneNumber,
  verifyEmailAddress,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-phone", verifyPhoneNumber);
router.get("/verify-email/:token", verifyEmailAddress);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.get("/profile", authMiddleware, getUserProfile);


export default router;
