import express from "express";
import { getUserProfile, userDelete, searchUser, updateProfile, getNotification, updateNotification } from "../controllers/userController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const userRouter = express.Router();


userRouter.get("/profile", userMiddleware, getUserProfile);
userRouter.delete("/delete", userMiddleware, userDelete);
userRouter.put("/update", userMiddleware, updateProfile);
userRouter.get("/search", searchUser);
userRouter.get("/getNotification", userMiddleware, getNotification);
userRouter.put("/updateNotification", userMiddleware, updateNotification);


export default userRouter;

