// import jwt  from "jsonwebtoken";

// // fn to generate token for user
// export const generateToken = (userId)=>{
//       const token = jwt.sign({userId} ,process.env.JWT_SECRET);
//       return token;
// }

import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },   // ✅ FIXED
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};