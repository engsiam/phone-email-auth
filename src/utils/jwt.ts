import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function generateToken(payload: object, expiresIn: string) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
