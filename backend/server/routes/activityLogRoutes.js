import express from "express";
import {
    getAllActivityLogs,
    getActivityLogById,
    getUserActivityLogs
} from "../controllers/activityLogController.js";
import userMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const activityLogRouter = express.Router();

activityLogRouter.get('/', userMiddleware, adminMiddleware, getAllActivityLogs);
activityLogRouter.get('/user/:user_id', userMiddleware, getUserActivityLogs);
activityLogRouter.get('/:user_id', userMiddleware, getActivityLogById);


export default activityLogRouter;

