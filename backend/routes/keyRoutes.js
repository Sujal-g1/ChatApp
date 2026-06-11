import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { savePublicKey, getPublicKey } from "../controllers/keyController.js";

const keyRouter = express.Router();

keyRouter.post( "/public-key", protectRoute, savePublicKey );

keyRouter.get( "/:id", protectRoute, getPublicKey );

// keyRouter.get( "/public-key/:id", protectRoute, getUserPublicKey );

export default keyRouter;