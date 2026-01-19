import express from "express";
import {
    getGroupBalances,
    getFriendBalance,
    getUserGroupBalance,
    simplifyBalances
} from "../controllers/balanceController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const balanceRouter = express.Router();


balanceRouter.get("/group/:group_id", userMiddleware, getGroupBalances);
balanceRouter.get("/friend/:friend_id", userMiddleware, getFriendBalance);
balanceRouter.get("/group/user/:group_id", userMiddleware, getUserGroupBalance);
balanceRouter.get("/simplify/:friend_id", userMiddleware, simplifyBalances);


export default balanceRouter;
