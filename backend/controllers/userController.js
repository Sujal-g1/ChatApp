import { generateToken } from "../config/utils.js";
import { createUserKeys, getUserPrivateKey } from "../utils/keyManager.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebaseAdmin.js";
import { generateZingleeId } from "../utils/generateZingleeId.js";
import crypto from "crypto";


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
// export const firebaseLogin = async (req, res) => {
//   try {
//     const { token,  fullName, username, bio, } = req.body;

//     // Verify Firebase token
//     const decoded = await admin.auth().verifyIdToken(token);

//     // Email verification is required
//     if (!decoded.email_verified) {
//     return res.status(403).json({
//       success: false,
//       message: "Please verify your email before continuing.",
//     });
//   }

//     const { email, name, picture, uid } = decoded;
//     const cleanEmail = email.toLowerCase().trim();

//      // Check if Zingleee user already exists
//     let user = await User.findOne({ email:cleanEmail, });

//     let privateKey = null;

//     if (!user) {

//   let finalUsername;

//   // -----------------------------------------
//   // Email/Password Firebase signup
//   // -----------------------------------------
//   if (username) {

//     finalUsername = username
//       .toLowerCase()
//       .trim();

//     const existingUsername = await User.findOne({
//       username: finalUsername,
//     });

//     if (existingUsername) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already taken",
//       });
//     }

//   }

//   // -----------------------------------------
//   // Google signup
//   // -----------------------------------------
//   else {

//     const baseUsername =
//       cleanEmail
//         .split("@")[0]
//         .toLowerCase();

//     finalUsername = baseUsername;

//     let counter = 1;

//     while (
//       await User.findOne({
//         username: finalUsername,
//       })
//     ) {
//       finalUsername =
//         `${baseUsername}${counter}`;

//       counter++;
//     }
//   }

//   // -----------------------------------------
//   // Generate Zingleee ID
//   // -----------------------------------------

//   const zingleeId =
//     await generateZingleeId(finalUsername);


//   // -----------------------------------------
//   // Generate E2EE key pair
//   // -----------------------------------------

//   const keys = createUserKeys();

//   privateKey = keys.privateKey;


//   // -----------------------------------------
//   // Your existing User schema requires a
//   // password for users without googleId.
//   //
//   // Firebase handles the REAL password.
//   // This random password is never used
//   // for authentication.
//   // -----------------------------------------

//   const randomPassword =
//     crypto.randomBytes(32).toString("hex");

//   const hashedPassword =
//     await bcrypt.hash(randomPassword, 10);


//   // -----------------------------------------
//   // Create Zingleee user
//   // -----------------------------------------

//   user = await User.create({

//     email: cleanEmail,

//     fullName: fullName || name || "User",
//     profilePic: picture ||  "",
//     googleId: username ? "" : uid,
//     bio: bio || "",
//     username: finalUsername,
//     zingleeId,
//     password: hashedPassword,
//     isVerified: true,
//     publicKey: keys.publicKey,
//     encryptedPrivateKey: keys.encryptedPrivateKey,
//     encryptionIV: keys.encryptionIV,
//     encryptionAuthTag: keys.encryptionAuthTag,
//     keyVersion: keys.keyVersion,
//   });
// }

//     const jwtToken = generateToken(user._id);

// //     let decryptedPrivateKey = privateKey;

// //     if (!decryptedPrivateKey) {
// //     decryptedPrivateKey = decryptPrivateKey({
// //         encryptedPrivateKey: user.encryptedPrivateKey,
// //         encryptionIV: user.encryptionIV,
// //         encryptionAuthTag: user.encryptionAuthTag,
// //     });
// // }

// if (!privateKey) {
//     privateKey = getUserPrivateKey(user);
// }

//     res.json({
//       success: true,
//       userData: sanitizeUser(user),
//       token: jwtToken,
//       privateKey,
//       message: "Google login success",
//     });
//   } catch (error) {
//     console.log(error.message);

//     res.json({
//       success: false,
//       message: "Firebase login failed",
//     });
//   }
// };

// Firebase / Google / Email Login
export const firebaseLogin = async (req, res) => {
  try {
    const {
      token,
      provider,
      fullName,
      username,
      bio,
    } = req.body;

    // --------------------------------------------------
    // 1. Verify Firebase ID token
    // --------------------------------------------------

    const decoded =
      await admin.auth().verifyIdToken(token);

    const {
      email,
      name,
      picture,
      uid,
    } = decoded;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Firebase account has no email address.",
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();


    // --------------------------------------------------
    // 2. Email verification
    // --------------------------------------------------

    if (!decoded.email_verified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before continuing.",
      });
    }


    // --------------------------------------------------
    // 3. Check if Zingleee user already exists
    // --------------------------------------------------

    let user =
      await User.findOne({
        email: cleanEmail,
      });

    let privateKey = null;


    // --------------------------------------------------
    // 4. Existing Zingleee user
    // --------------------------------------------------

    if (user) {

      const jwtToken =
        generateToken(user._id);

      privateKey =
        getUserPrivateKey(user);

      return res.json({
        success: true,
        userData: sanitizeUser(user),
        token: jwtToken,
        privateKey,
        message:
          provider === "google"
            ? "Google login successful"
            : "Login successful",
      });
    }


    // --------------------------------------------------
    // 5. New Zingleee user
    // --------------------------------------------------

    let finalUsername;


    // ==================================================
    // EMAIL / PASSWORD USER
    // ==================================================

    if (provider === "email") {

      if (
        !username ||
        !username.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Username is required.",
        });
      }

      finalUsername =
        username
          .toLowerCase()
          .trim();


      // Check username availability
      const existingUsername =
        await User.findOne({
          username: finalUsername,
        });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message:
            "Username already taken",
        });
      }
    }


    // ==================================================
    // GOOGLE USER
    // ==================================================

    else {

      const baseUsername =
        cleanEmail
          .split("@")[0]
          .toLowerCase();

      finalUsername =
        baseUsername;

      let counter = 1;

      // Ensure unique username
      while (
        await User.findOne({
          username: finalUsername,
        })
      ) {
        finalUsername =
          `${baseUsername}${counter}`;

        counter++;
      }
    }


    // --------------------------------------------------
    // 6. Generate Zingleee ID
    // --------------------------------------------------

    const zingleeId =
      await generateZingleeId(
        finalUsername
      );


    // --------------------------------------------------
    // 7. Generate E2EE keys
    // --------------------------------------------------

    const keys =
      createUserKeys();

    privateKey =
      keys.privateKey;


    // --------------------------------------------------
    // 8. Firebase users don't use
    //    Zingleee's normal password login
    // --------------------------------------------------

    const randomPassword =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        10
      );


    // --------------------------------------------------
    // 9. Create Zingleee user
    // --------------------------------------------------

    user =
      await User.create({

        email: cleanEmail,

        fullName:
          provider === "email"
            ? fullName || "User"
            : name || "User",

        profilePic:
          provider === "google"
            ? picture || ""
            : "",

        googleId:
          provider === "google"
            ? uid
            : "",

        bio:
          provider === "email"
            ? bio || ""
            : "",

        username:
          finalUsername,

        zingleeId,

        password:
          hashedPassword,

        isVerified:
          true,

        publicKey:
          keys.publicKey,

        encryptedPrivateKey:
          keys.encryptedPrivateKey,

        encryptionIV:
          keys.encryptionIV,

        encryptionAuthTag:
          keys.encryptionAuthTag,

        keyVersion:
          keys.keyVersion,
      });


    // --------------------------------------------------
    // 10. Generate Zingleee JWT
    // --------------------------------------------------

    const jwtToken =
      generateToken(user._id);


    // --------------------------------------------------
    // 11. Return everything to frontend
    // --------------------------------------------------

    return res.json({
      success: true,
      userData: sanitizeUser(user),
      token: jwtToken,
      privateKey,
      message:
        provider === "google"
          ? "Google login successful"
          : "Account created successfully",
    });

  } catch (error) {

    console.log(
      "Firebase login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Firebase authentication failed.",
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

