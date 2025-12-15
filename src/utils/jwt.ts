import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const expiresIn: jwt.SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";
  return jwt.sign(payload, secret as jwt.Secret, { expiresIn });
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return jwt.verify(token, secret) as JWTPayload;
};
