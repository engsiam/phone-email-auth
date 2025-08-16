import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  changePasswordService,
  forgotPasswordService,
  getUserProfileService,
  loginUserService,
  registerUserService,
  resetPasswordService,
  verifyEmailAddressService,
  verifyPhoneNumberService,
} from "../services/authService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, password } = req.body;
    const result = await registerUserService(fullName, phone, email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyPhoneNumber = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    const result = await verifyPhoneNumberService(phone, otp);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmailAddress = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await verifyEmailAddressService(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    const result = await loginUserService(phone, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const result = await forgotPasswordService(phone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const result = await resetPasswordService(phone, otp, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const result = await changePasswordService(
      userId,
      oldPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserProfileService(userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
