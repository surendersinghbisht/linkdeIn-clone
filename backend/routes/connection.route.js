import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { 
    sendConnectionRequest, 
    rejectConnectionRequest,
    acceptConnectionRequest,
     getConnectionRequests, 
     getUserConnections,
     removeConnection,
     getConnectionStatus
     } from "../controllers/connection.controller";

const router = express.Router();

router.post("/request/:userId", protectedRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectedRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectedRoute, rejectConnectionRequest);
// Get all connection requests for the current user
router.get("/requests", protectedRoute, getConnectionRequests);
// Get all connections for a user
router.get("/", protectedRoute, getUserConnections); 
router.delete("/:userId", protectedRoute, removeConnection);
router.get("/status/:userId", protectedRoute, getConnectionStatus);

export default router;