import express from "express";
import {
    getUserNotifications,
    deleteNotification,
} from "../controllers/notificationController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const notificationRouter = express.Router();


notificationRouter.get("/list", userMiddleware, getUserNotifications);
notificationRouter.delete("/delete/:notification_id", userMiddleware, deleteNotification);


export default notificationRouter;
