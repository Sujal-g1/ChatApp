import "dotenv/config";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const resetPassword = async () => {
  try {
    await connectDB();

    const email = "sujal.gdg1@gmail.com";
    const newPassword = "test123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found.");
      process.exit(1);
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    console.log(
      `Password reset successfully for ${email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Password reset error:",
      error
    );

    process.exit(1);
  }
};

resetPassword();