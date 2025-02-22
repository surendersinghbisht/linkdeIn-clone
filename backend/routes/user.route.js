import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getSugggestedConnection, getPublicProfile, updateProfile } from "../controllers/user.controller.js";

 const router = express.Router();

 router.get("/suggestions", protectedRoute, getSugggestedConnection);
 router.get("/:userName", protectedRoute, getPublicProfile);
 router.put("/profile", protectedRoute, updateProfile);

 export default router;

