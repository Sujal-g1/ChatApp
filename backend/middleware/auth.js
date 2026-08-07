import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // console.log("HEADERS:", req.headers);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Incoming token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {

    console.log("Auth middleware error:", error.message);

if (error.name === "TokenExpiredError") {
  console.log("Token expired at:", error.expiredAt);
}

    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};