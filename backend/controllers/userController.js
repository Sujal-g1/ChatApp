import { generateToken } from "../config/utils.js";
import { createUserKeys, getUserPrivateKey } from "../utils/keyManager.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebaseAdmin.js";
import { generateZingleeId } from "../utils/generateZingleeId.js";


// Sign up
export const signup = async (req, res) => {
  const { fullName, email, password, bio, username } = req.body;

  try {
    if (!fullName || !email || !password || !bio || !username) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Normalize input
    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check email
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check username
    const existingUsername = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsername) {
      return res.json({
        success: false,
        message: "Username already taken",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Zingleee ID
    const zingleeId = await generateZingleeId(cleanUsername);

    // Generate E2EE key pair
    const keys = createUserKeys();

    // Create user
    const newUser = await User.create({
      fullName,
      email: cleanEmail,
      password: hashedPassword,
      bio,
      username: cleanUsername,
      zingleeId,
      publicKey: keys.publicKey,

     encryptedPrivateKey:
        keys.encryptedPrivateKey,

      encryptionIV:
        keys.encryptionIV,

      encryptionAuthTag:
        keys.encryptionAuthTag,

      keyVersion:
        keys.keyVersion,
    }); 

    // Generate JWT
    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: sanitizeUser(newUser),
      token,
      privateKey: keys.privateKey, 
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    const userData = await User.findOne({
      email: cleanEmail,
    });

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        userData.password
      );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // NEW
    const privateKey = getUserPrivateKey(userData);

    const token = generateToken(userData._id);

//     const privateKey = decryptPrivateKey({
//     encryptedPrivateKey: userData.encryptedPrivateKey,
//     encryptionIV: userData.encryptionIV,
//     encryptionAuthTag: userData.encryptionAuthTag,
// });

    res.json({
      success: true,
      userData: sanitizeUser(userData),
      token,
      privateKey,
      message: "Login Successful",
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};


// Firebase / Google Login
export const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decoded;

    let user = await User.findOne({ email });

    let privateKey = null;

    // Create user if not exists
    if (!user) {
      const baseUsername = email.split("@")[0].toLowerCase();

      let username = baseUsername;
      let counter = 1;

      // Ensure unique username
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const zingleeId = await generateZingleeId(username);

      // Generate E2EE key pair
    const keys = createUserKeys();

    privateKey = keys.privateKey;

      user = await User.create({
        email,
        fullName: name || "User",
        profilePic: picture || "",
        googleId: uid,
        bio: "",
        username,
        zingleeId,
        publicKey: keys.publicKey,
        encryptedPrivateKey: keys.encryptedPrivateKey,
        encryptionIV: keys.encryptionIV,
        encryptionAuthTag: keys.encryptionAuthTag,
        keyVersion: keys.keyVersion,
      });
    }

    const jwtToken = generateToken(user._id);

//     let decryptedPrivateKey = privateKey;

//     if (!decryptedPrivateKey) {
//     decryptedPrivateKey = decryptPrivateKey({
//         encryptedPrivateKey: user.encryptedPrivateKey,
//         encryptionIV: user.encryptionIV,
//         encryptionAuthTag: user.encryptionAuthTag,
//     });
// }

if (!privateKey) {
    privateKey = getUserPrivateKey(user);
}

    res.json({
      success: true,
      userData: sanitizeUser(user),
      token: jwtToken,
      privateKey,
      message: "Google login success",
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: "Firebase login failed",
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName, username } = req.body;
    const userId = req.user._id;

    const updateData = {};

    // Update bio
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // Update full name
    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }

    // Update username
    if (username !== undefined) {
      const cleanUsername = username.toLowerCase().trim();

      const existing = await User.findOne({
        username: cleanUsername,
      });

      if (
        existing &&
        existing._id.toString() !== userId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      updateData.username = cleanUsername;
    }

    // Update profile picture
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);

      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Search users
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

    // Search by Zingleee ID
    if (query.includes("#")) {
      users = await User.find({
        zingleeId: query,
        _id: { $ne: currentUserId },
      }).select("-password -email -__v");
    } else {
      // Search by username
      users = await User.find({
        username: { $regex: query, $options: "i" },
        _id: { $ne: currentUserId },
      })
        .select("-password")
        .limit(10);
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Check Auth
export const checkAuth = (req, res) => {
    // const privateKey = decryptPrivateKey({
    //     encryptedPrivateKey: req.user.encryptedPrivateKey,
    //     encryptionIV: req.user.encryptionIV,
    //     encryptionAuthTag: req.user.encryptionAuthTag,
    // });

    const privateKey = getUserPrivateKey(req.user);

    res.json({
        success: true,
        user: sanitizeUser(req.user),
        privateKey,
    });
};


//getPublicKey
export const getPublicKey = async (req, res) => {
  try {

    const user = await User.findById(req.params.userId).select("publicKey");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

     // Public key missing
    if (!user.publicKey) {
      return res.status(400).json({
        success: false,
        message: "User has no public key"
      });
    }

    res.json({
      success: true,
      publicKey: user.publicKey
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

