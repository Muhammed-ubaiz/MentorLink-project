import jwt from "jsonwebtoken";

export const generateToken = (userId, userType) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId, userType }, process.env.JWT_SECRET, {
    expiresIn: "1d", 
  });
}; // ✅ properly closed

export const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
