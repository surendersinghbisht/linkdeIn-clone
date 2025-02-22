import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getNotifications, readNotifications, deleteNotifications } from "../controllers/notification.controller.js";

const router = express.Router()

router.get("/", protectedRoute, getNotifications);
router.put("/:id/read", protectedRoute, readNotifications);
router.get("/:id", protectedRoute, deleteNotifications);

export default router