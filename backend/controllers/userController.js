import { generateToken } from "../config/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebaseAdmin.js";

// sign up
export const signup = async(req, res)=>{
    const { fullName ,email , password, bio} = req.body;
    try{
     if (!fullName || !email || !password || !bio){
        return res.json({
            success:false,
            message:"Missing Details"
        })
     }

     const user = await User.findOne({email});
     if(user){
        return res.json({
            success:false,
            message:"Account Already exist"
        })
     }

     const salt = await bcrypt.genSalt(10); 
     const hashedPassword = await bcrypt.hash(password , salt);

     const newUser = await User.create({
        fullName ,email , password:hashedPassword , bio
     });

     const token = generateToken(newUser._id)
     res.json({success:true , userData: newUser , token ,
     message : "Account created successfully"} )
    }
    catch(error){
        console.log(error.message) 
         res.json({success:false , message : error.message} )
    }
}


// login
export const login = async(req, res)=>{
    
    try{
        const { email , password} = req.body; 
     

    const userData = await User.findOne({email});
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
      user = await User.create({
        email,
        fullName: name || "User",
        profilePic: picture || "",
        googleId: uid,
        bio: "",
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



// check auth
export const checkAuth = ( req , res)=>{
    res.json({success:true , user:req.user});
}

// to update user profile details
export const updateProfile = async(req , res)=>{
    try{
        const  { profilePic , bio , fullName} = req.body; 
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
        updatedUser =  await User.findByIdAndUpdate(userId , {bio, fullName} , {new:true })
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId , {profilePic : upload.secure_url , bio , fullName} , {new:true})
        }

        res.json({success:true , user:updatedUser})
    } 
    catch(error){
        console.log(error.message)
        res.json({success:false , message:error.message})
    }
}