import express from "express"
import { checkAuth, login, signup, updateProfile, firebaseLogin } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

// auth routes
userRouter.post("/signup" , signup);
userRouter.post("/login" , login);
userRouter.post("/firebase-login", firebaseLogin);


//protected routes
userRouter.put("/update-profile" , protectRoute , updateProfile);
userRouter.get("/check" , protectRoute , checkAuth);


export default userRouter;