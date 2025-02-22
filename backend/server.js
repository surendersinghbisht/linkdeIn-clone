import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import { connectDB } from "./lib/db.js";
import notificationsRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

dotenv.config();
const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "5mb"})) 
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/users", postRoutes)
app.use("/api/v1/users", notificationsRoutes)
app.use("/api/v1/users", connectionRoutes)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});