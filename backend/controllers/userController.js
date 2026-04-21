import { generateToken } from "../config/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebaseAdmin.js";
import { generateZingleeId } from "../utils/generateZingleeId.js";

// sign up
export const signup = async (req, res) => {
  const { fullName, email, password, bio, username } = req.body;

  try {
    if (!fullName || !email || !password || !bio || !username) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // normalize
    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // check email
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    // check username
    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.json({
        success: false,
        message: "Username already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const zingleeId = await generateZingleeId(cleanUsername);

    const newUser = await User.create({
      fullName,
      email: cleanEmail,
      password: hashedPassword,
      bio,
      username: cleanUsername,
      zingleeId,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// login
export const login = async(req, res)=>{
    
    try{
        const { email , password} = req.body; 
     

    const userData = await User.findOne({ email });

if (!userData) {
  return res.json({
    success: false,
    message: "User not found",
  });
}
    const isPasswordCorrect = await bcrypt.compare(password,userData.password)

    if(!isPasswordCorrect){
        return res.json({success:false , message:"Invalid credentials"})
    }

    const token = generateToken(userData._id)
     res.json({success:true , userData, token ,
     message : "Login Successfully"} )
    }
     
    catch(error){
        console.log(error.message) 
        res.json({success:false , message : error.message} )
    }
}

// firebase login
export const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, picture, uid } = decoded;

    let user = await User.findOne({ email });

    // create user if not exists
   if (!user) {
  const baseUsername = email.split("@")[0].toLowerCase();

  let username = baseUsername;
  let counter = 1;

  // ensure unique username
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  const zingleeId = await generateZingleeId(username);

  user = await User.create({
    email,
    fullName: name || "User",
    profilePic: picture || "",
    googleId: uid,
    bio: "",
    username,
    zingleeId
  });
}

    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      userData: user,
      token: jwtToken,
      message: "Google login success",
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Firebase login failed" });
  }
};


// search
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase().trim();
    const currentUserId = req.user._id;

    if (!query) {
      return res.json({
        success: false,
        message: "Search query is required",
      });
    }

    let users;

    // 🔹 Case 1: Search by Zingleee ID
    if (query.includes("#")) {
      users = await User.find({
        zingleeId: query,
        _id: { $ne: currentUserId }
      }).select("-password -email -__v")
    } else {
      // 🔹 Case 2: Username partial search
      users = await User.find({
        username: { $regex: query, $options: "i" },
        _id: { $ne: currentUserId }
      })
      .select("-password")
      .limit(10); // prevent overload
    }

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};




// check auth
export const checkAuth = ( req , res)=>{
    res.json({success:true , user:req.user});
}

// to update user profile details
// export const updateProfile = async(req , res)=>{
//     try{
//         const  { profilePic , bio , fullName} = req.body; 
//         const userId = req.user._id;
//         let updatedUser;

//         if(!profilePic){
//         updatedUser =  await User.findByIdAndUpdate(userId , {bio, fullName} , {new:true })
//         }
//         else{
//             const upload = await cloudinary.uploader.upload(profilePic);

//             updatedUser = await User.findByIdAndUpdate(userId , {profilePic : upload.secure_url , bio , fullName} , {new:true})
//         }

//         res.json({success:true , user:updatedUser})
//     } 
//     catch(error){
//         console.log(error.message)
//         res.json({success:false , message:error.message})
//     }
// }

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName, username } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (bio !== undefined) updateData.bio = bio;
    if (fullName !== undefined) updateData.fullName = fullName;

    // 🔥 HANDLE USERNAME
    if (username !== undefined) {
      const cleanUsername = username.toLowerCase().trim();

      const existing = await User.findOne({ username: cleanUsername });

      if (existing && existing._id.toString() !== userId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      updateData.username = cleanUsername;
    }

    // 🔥 HANDLE IMAGE
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};