import express from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriendship, getFriendList } from "../controllers/friendController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const friendRouter = express.Router();

friendRouter.post("/sendRequest/:reciverId", userMiddleware, sendFriendRequest);
friendRouter.patch("/acceptRequest/:friend_id", userMiddleware, acceptFriendRequest);
friendRouter.patch("/rejectRequest/:friend_id", userMiddleware, rejectFriendRequest);
friendRouter.delete("/deleteFriendship/:friend_id", userMiddleware, deleteFriendship);
friendRouter.get("/getFriendList", userMiddleware, getFriendList);

export default friendRouter;
