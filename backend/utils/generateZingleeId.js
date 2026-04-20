import User from "../models/User.js"

export const generateZingleeId = async (username) => {
  let isUnique = false
  let zingleeId
  let attempts = 0

  while (!isUnique && attempts < 5) {
    const randomTag = Math.floor(1000 + Math.random() * 9000) // 4-digit
    zingleeId = `${username}#${randomTag}`

    const existing = await User.findOne({ zingleeId })

    if (!existing) {
      isUnique = true
    }

    attempts++
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique Zingleee ID")
  }

  return zingleeId
}