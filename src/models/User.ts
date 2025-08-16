import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  phone: string;
  phoneOTP: string | null;
  phoneOTPExpiry: Date | null;
  phoneVerified: boolean;
  email: string;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;
  emailVerified: boolean;
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    phoneOTP: { type: String, default: null },
    phoneOTPExpiry: { type: Date, default: null },
    phoneVerified: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpiry: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export default model<IUser>("User", userSchema);
