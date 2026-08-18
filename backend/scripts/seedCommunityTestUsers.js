import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const TEST_PASSWORD = "test123";

const testUsers = [
  {
    email: "communityowner@test.local",
    username: "communityowner",
    zingleeId: "communityowner#1001",
    fullName: "Community Owner",
  },
  {
    email: "communityadmin@test.local",
    username: "communityadmin",
    zingleeId: "communityadmin#1002",
    fullName: "Community Admin",
  },
  {
    email: "communitymod@test.local",
    username: "communitymod",
    zingleeId: "communitymod#1003",
    fullName: "Community Moderator",
  },
  {
    email: "communitymember1@test.local",
    username: "communitymember1",
    zingleeId: "communitymember1#1004",
    fullName: "Community Member One",
  },
  {
    email: "communitymember2@test.local",
    username: "communitymember2",
    zingleeId: "communitymember2#1005",
    fullName: "Community Member Two",
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(
      TEST_PASSWORD,
      10
    );

    for (const userData of testUsers) {
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username },
          { zingleeId: userData.zingleeId },
        ],
      });

      if (existingUser) {
        console.log(
          `Already exists: ${userData.username}`
        );
        continue;
      }

      await User.create({
        ...userData,

        password: hashedPassword,

        isVerified: true,

        profilePic: "",
        bio: "",

        googleId: "",

        status: "offline",

        allowFriendRequests: true,

        friends: [],
        blockedUsers: [],

        publicKey: "",
        encryptedPrivateKey: "",
        encryptionIV: "",
        encryptionAuthTag: "",
        keyVersion: 1,
      });

      console.log(
        `Created: ${userData.username}`
      );
    }

    console.log("\nCommunity test users ready.");
    console.log("Password: test123");

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed error:",
      error
    );

    process.exit(1);
  }
};

seedUsers();