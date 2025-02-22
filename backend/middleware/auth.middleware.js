import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-linkdein"];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded || !decoded.user_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(decoded.user_id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "No user found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protected route: ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
