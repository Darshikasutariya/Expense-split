import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const userMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        //  find user in db
        console.log("User..", decoded);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found in database"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token",
            error: error.message
        })
    }
}


export default userMiddleware;

