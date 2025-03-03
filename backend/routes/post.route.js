import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createPost, getFeedPosts, deletePost, getPostbyId, createComment, likePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/",protectedRoute, getFeedPosts);
router.post("/create", protectedRoute, createPost);
router.delete("/delete/:id", protectedRoute, deletePost);
router.get("/:id", protectedRoute, getPostbyId);
router.post("/:id/comment", protectedRoute, createComment);
router.post("/:id/like", protectedRoute, likePost);


 export default router;

