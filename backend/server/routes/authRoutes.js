import express from "express";
import { userLogin, userRegister, forgotPassword, verifyOTP, resetPassword, userLogout } from "../controllers/authController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const authRouter = express.Router();


authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/verifyotp", userMiddleware, verifyOTP);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/logout", userMiddleware, userLogout);



export default authRouter;
