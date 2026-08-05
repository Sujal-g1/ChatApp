import User from "../models/User.js";

export const generateZingleeId = async (username) => {
  // Normalize username
  const base = username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);

  let zingleeId;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    const randomTag = Math.floor(1000 + Math.random() * 9000);

    zingleeId = `${base}#${randomTag}`;

    const existing = await User.findOne({
      zingleeId,
    });

    if (!existing) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique Zingleee ID");
  }

  return zingleeId;
};