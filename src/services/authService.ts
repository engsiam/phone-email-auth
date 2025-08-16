import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateOTP } from "../utils/generateOTP";
import { generateToken, verifyToken } from "../utils/jwt";
import { isStrongPassword } from "../utils/passwordValidator";
import { sendEmail, sendSms } from "../utils/senders";

// REGISTER USER
export const registerUserService = async (
  fullName: string,
  phone: string,
  email: string,
  password: string
) => {
  if (!fullName || !phone || !email || !password) {
    throw new Error("Missing fields");
  }
  if (!isStrongPassword(password)) throw new Error("Weak password");

  const phoneTaken = await User.findOne({ phone, phoneVerified: true });
  if (phoneTaken) throw new Error("Phone already verified by another user");

  const emailTaken = await User.findOne({ email, emailVerified: true });
  if (emailTaken) throw new Error("Email already verified by another user");

  const passwordHash = await bcrypt.hash(password, 10);

  // generate OTP
  const { code: otpCode, expiry: otpExpiry } = generateOTP();

  // email verification token
  const emailToken = generateToken({ email }, "24h");
  const emailExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    fullName,
    phone,
    phoneOTP: otpCode, // store string
    phoneOTPExpiry: otpExpiry, // store Date
    email,
    emailVerificationToken: emailToken,
    emailVerificationExpiry: emailExpiry,
    passwordHash,
  });

  sendSms(phone, `Your OTP code is ${otpCode}`);
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  sendEmail(
    email,
    `Verify your email: ${baseUrl}/api/verify-email/${emailToken}`
  );

  return { message: "User registered. Verify phone & email." };
};

// VERIFY PHONE NUMBER
export const verifyPhoneNumberService = async (
  phone: string,
  otp: string,
  regenerate?: boolean
) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("User not found");

  // If regenerate flag is true, generate new OTP
  if (regenerate) {
    const { code, expiry } = generateOTP();
    user.phoneOTP = code;
    user.phoneOTPExpiry = expiry;
    await user.save();
    sendSms(phone, `Your new OTP is ${code}. It expires in 5 minutes.`);
    return { message: "New OTP sent" };
  }

  if (
    user.phoneOTP !== otp ||
    !user.phoneOTPExpiry ||
    user.phoneOTPExpiry.getTime() < Date.now()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  user.phoneVerified = true;
  user.phoneOTP = null;
  user.phoneOTPExpiry = null;
  await user.save();

  return { message: "Phone verified" };
};

// VERIFY EMAIL
export const verifyEmailAddressService = async (token: string) => {
  const decoded = verifyToken<{ email: string }>(token);
  const user = await User.findOne({ email: decoded.email });
  if (!user) throw new Error("User not found");

  if (
    !user.emailVerificationExpiry ||
    user.emailVerificationExpiry.getTime() < Date.now()
  ) {
    throw new Error("Verification link expired");
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpiry = null;
  await user.save();

  return { message: "Email verified" };
};

// LOGIN
export const loginUserService = async (phone: string, password: string) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("User not found");

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error("Wrong password");
  if (!user.phoneVerified) throw new Error("Phone not verified");

  const token = generateToken({ id: user._id }, "7d");
  return { token };
};

// FORGOT PASSWORD
export const forgotPasswordService = async (phone: string) => {
  const user = await User.findOne({ phone, phoneVerified: true });
  if (!user) throw new Error("Phone not found or not verified");

  const { code, expiry } = generateOTP();
  user.phoneOTP = code;
  user.phoneOTPExpiry = expiry;
  await user.save();

  sendSms(phone, `Reset password OTP: ${code}`);
  return { message: "OTP sent" };
};

// RESET PASSWORD
export const resetPasswordService = async (
  phone: string,
  otp: string,
  newPassword: string
) => {
  if (!isStrongPassword(newPassword)) throw new Error("Weak password");

  const user = await User.findOne({ phone });
  if (
    !user ||
    user.phoneOTP !== otp ||
    !user.phoneOTPExpiry ||
    user.phoneOTPExpiry.getTime() < Date.now()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.phoneOTP = null;
  user.phoneOTPExpiry = null;
  await user.save();
  return { message: "Password reset successfully" };
};

// CHANGE PASSWORD
export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new Error("Wrong old password");
  if (!isStrongPassword(newPassword)) throw new Error("Weak password");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password changed" };
};

// GET PROFILE
export const getUserProfileService = async (userId: string) => {
  const user = await User.findById(userId).select("-passwordHash -__v");
  if (!user) throw new Error("User not found");
  return user;
};
